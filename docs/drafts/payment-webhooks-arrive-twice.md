---
title: "Payment webhooks arrive twice. Plan for it."
excerpt: "Payment providers retry webhooks, jobs die halfway through, and timeouts happen. If your handler assumes it runs exactly once, it will eventually charge, credit or ship something twice."
tags: [Laravel, Payments, Webhooks]
status: draft
---

<!--
DRAFT for Shakeel to edit and publish (Admin → Blog). Not published anywhere.
Project facts come from the Dispatch Management SaaS case study: a
double-entry ledger handling real money, money postings that must be safe to
receive twice, and the lesson that financial webhooks need idempotent
handling from day one because payment providers will retry. The code is a
simplified illustration, not the client's code. Check it reads like you
before publishing.
-->

One of the first things I learned working on a platform that moves real money: a payment webhook is not an event that happens once. It's a message that arrives at least once.

Providers retry when your endpoint is slow, when it returns an error, and sometimes when it didn't but the response got lost on the way back. Your own queue retries jobs that time out. A deploy can kill a worker halfway through. Put those together and the same "payment succeeded" notification can reach your code two or three times, sometimes at the same moment.

If the handler assumes it runs once, the duplicate does real damage: a customer credited twice, a settlement posted twice, an order shipped twice. The fix isn't to stop duplicates arriving. You can't. It's to make processing the same message twice do nothing the second time.

## Record the event before you act on it

Every provider gives each webhook event an ID. That ID is your idempotency key. The first thing the handler does is try to claim it, and a unique index in the database decides who wins:

```php
Schema::create('webhook_events', function (Blueprint $table) {
    $table->id();
    $table->string('provider');
    $table->string('event_id');
    $table->string('type');
    $table->json('payload');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();

    $table->unique(['provider', 'event_id']);
});
```

```php
public function handle(Request $request): Response
{
    $this->verifySignature($request); // reject anything unsigned first

    $event = WebhookEvent::firstOrCreate(
        ['provider' => 'gateway', 'event_id' => $request->input('id')],
        ['type' => $request->input('type'), 'payload' => $request->all()],
    );

    if ($event->processed_at === null) {
        ProcessPaymentEvent::dispatch($event->id);
    }

    return response()->noContent(); // a duplicate is a success, not an error
}
```

Notice what happens with a duplicate: it's acknowledged with a 200 and nothing else. Returning an error for a duplicate just makes the provider retry it again.

The controller also does as little as possible. It verifies the signature, stores the event and hands the work to a queue. A slow endpoint is one of the main reasons providers retry in the first place.

## Make the work itself safe to repeat

Claiming the event isn't enough on its own, because the job can still run twice: two workers can pick up the same event, or a job can die after posting money but before marking the event processed.

So the job locks the event row, checks it again inside a transaction, and does the posting and the marking together:

```php
public function handle(): void
{
    DB::transaction(function () {
        $event = WebhookEvent::lockForUpdate()->findOrFail($this->eventId);

        if ($event->processed_at !== null) {
            return; // someone else already did it
        }

        $this->ledger->postPayment($event->payload);

        $event->update(['processed_at' => now()]);
    });
}
```

If the job dies halfway through, the transaction rolls back and the event is still unprocessed, so the retry does the whole thing cleanly. If two workers race, the second one waits on the lock and then finds the event already processed.

## Let the ledger say no as well

The last line of defence is the ledger. On the platform I work on, money movements are posted to a double-entry ledger. If entries are only ever appended, never edited, it's worth giving each ledger transaction a reference to what caused it and a unique constraint on that reference. Then even if some future code path skipped the checks above, the database would refuse a second posting for the same payment.

Belt and braces? A little. But this is the code path where a bug costs real money, and the extra constraint is one line.

## Test the duplicate on purpose

The test I care about most here is boring: send the same webhook twice and check the money moved once.

```php
it('posts a payment once even if the webhook arrives twice', function () {
    $payload = gatewayPaymentSucceeded(amount: 5000);

    $this->postSignedWebhook($payload)->assertNoContent();
    $this->postSignedWebhook($payload)->assertNoContent();

    // One ledger transaction (holding its debit and credit) per payment.
    expect(LedgerTransaction::where('reference', $payload['id'])->count())->toBe(1);
});
```

If you're integrating a payment gateway, build this from day one. Adding idempotency after money has already been double-posted means cleaning up real transactions by hand, and that is a much worse afternoon than writing a unique index.
