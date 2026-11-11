import type { Article } from "@/types";

/**
 * Seed and fallback copy of the two published articles. The live site reads
 * articles from Supabase (Admin → Blog); the content sync does not touch
 * them, so a change here must also be pasted into the admin editor.
 * Slugs are the original ones, kept so existing links and RSS entries work.
 */
export const articles: Article[] = [
  {
    slug: "multi-tenant-data-isolation-in-saas",
    title: "One database, many companies: making tenant scoping the default",
    excerpt:
      "On a multi-tenant SaaS, the bug that worries me most isn't a crash. It's one company seeing another's data. Here's how I make the safe query the one you get without thinking.",
    content: `
<p>On a multi-tenant SaaS, the bug that worries me most isn't a crash. A crash is loud: someone reports it, you fix it. The quiet bug is one company seeing another company's orders, invoices or drivers. Nobody notices until a customer does.</p>
<p>On the dispatch platform I work on, every logistics company shares one Laravel application and one PostgreSQL database. We chose that over a database per company because it's far less to operate: one schema to migrate, one connection pool, one backup. The cost is that isolation becomes the application's job. If a query forgets to filter by company, the database won't stop it.</p>
<p>So the goal is simple to say: the safe query should be the one you get without thinking about it.</p>
<h2>Make the scope the default, not a habit</h2>
<p>The first version of tenant scoping in most codebases is a habit. Every query gets a <code>where('company_id', ...)</code>, and every reviewer checks for it. That works until the one query nobody looked at closely, usually a report or an export written in a hurry.</p>
<p>Instead, the filter goes on the model. A trait adds a global scope, so every query on that model is filtered by the current company unless someone explicitly asks otherwise:</p>
<pre><code class="language-php">trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope('company', function (Builder $query) {
            $companyId = app(CurrentCompany::class)-&gt;id();

            if ($companyId === null) {
                // No company in context means no rows, not every row.
                $query-&gt;whereRaw('1 = 0');

                return;
            }

            $query-&gt;where($query-&gt;qualifyColumn('company_id'), $companyId);
        });

        static::creating(function (Model $model) {
            $model-&gt;company_id ??= app(CurrentCompany::class)-&gt;id();
        });
    }
}</code></pre>
<p>Two details matter more than the trait itself.</p>
<p>First, when there's no company in context, the scope returns nothing. It's tempting to skip the filter when the company is missing, and that's exactly the case that leaks: a queued job or an artisan command that runs without a request, quietly reading every tenant's rows.</p>
<p>The fix for jobs isn't to skip the scope. A job carries the company ID it was dispatched for and sets the context before it runs, so it sees exactly one company.</p>
<p>Second, new records get the company set automatically. If creating a record depends on someone remembering to set <code>company_id</code>, eventually someone won't.</p>
<h2>The escape hatch should look like an escape hatch</h2>
<p>Some code genuinely needs to see across companies: platform admin screens, billing runs, migrations. That code uses <code>withoutGlobalScope('company')</code>, and that call is easy to search for. When I review a pull request, any new use of it gets a second look and a comment explaining why. It's the one line where the default is being switched off, so it's the one line that has to justify itself.</p>
<h2>Test the leak, not just the feature</h2>
<p>Feature tests usually create one company and check that things work for it. They'd pass even if the scope were missing, because there's nothing else to leak.</p>
<p>So the tests that matter create two companies and check that one can't see the other:</p>
<pre><code class="language-php">it('does not return another company\\'s orders', function () {
    [$mine, $theirs] = Company::factory()-&gt;count(2)-&gt;create();
    Order::factory()-&gt;for($theirs)-&gt;create();

    actingAsCompany($mine);

    expect(Order::count())-&gt;toBe(0);
});</code></pre>
<p>Written once per tenant-owned model, and once for every report or export endpoint, tests like this fail the moment someone adds a model without the trait or writes a raw query that skips it. That's the point: they guard the property you care about, not the code you happened to write.</p>
<h2>What this approach costs</h2>
<p>I want to be honest about the trade-off. With one database, a missed scope has a bigger blast radius than with physical separation. If a company had its own database, a forgotten filter would just return that company's own data. Here it returns everyone's.</p>
<p>That's why the scope has to be the default and not an option. The design only works if forgetting is hard: the trait does the filtering, the creating hook does the stamping, the tests check for leaks, and the escape hatch is loud enough to notice in review.</p>
<p>If you're running a Laravel SaaS on one database and your tenant filtering lives in individual queries, the first step is usually small: put the filter on the model, make "no tenant" mean "no rows", and write one test with two companies in it. You'll find out quickly whether anything was relying on the gap.</p>
`.trim(),
    date: "2026-11-11T00:00:00.000Z",
    readingTime: 3,
    tags: ["Laravel","Multi-tenancy","PostgreSQL"],
    published: true,
  },
  {
    slug: "designing-idempotent-webhooks-for-payments",
    title: "Payment webhooks arrive twice. Plan for it.",
    excerpt:
      "Payment providers retry webhooks, jobs die halfway through, and timeouts happen. If your handler assumes it runs exactly once, it will eventually charge, credit or ship something twice.",
    content: `
<p>One of the first things I learned working on a platform that moves real money: a payment webhook is not an event that happens once. It's a message that arrives at least once.</p>
<p>Providers retry when your endpoint is slow, when it returns an error, and sometimes when it didn't but the response got lost on the way back. Your own queue retries jobs that time out. A deploy can kill a worker halfway through. Put those together and the same "payment succeeded" notification can reach your code two or three times, sometimes at the same moment.</p>
<p>If the handler assumes it runs once, the duplicate does real damage: a customer credited twice, a settlement posted twice, an order shipped twice. The fix isn't to stop duplicates arriving. You can't. It's to make processing the same message twice do nothing the second time.</p>
<h2>Record the event before you act on it</h2>
<p>Every provider gives each webhook event an ID. That ID is your idempotency key. The first thing the handler does is try to claim it, and a unique index in the database decides who wins:</p>
<pre><code class="language-php">Schema::create('webhook_events', function (Blueprint $table) {
    $table-&gt;id();
    $table-&gt;string('provider');
    $table-&gt;string('event_id');
    $table-&gt;string('type');
    $table-&gt;json('payload');
    $table-&gt;timestamp('processed_at')-&gt;nullable();
    $table-&gt;timestamps();

    $table-&gt;unique(['provider', 'event_id']);
});</code></pre>
<pre><code class="language-php">public function handle(Request $request): Response
{
    $this-&gt;verifySignature($request); // reject anything unsigned first

    $event = WebhookEvent::createOrFirst(
        ['provider' =&gt; 'gateway', 'event_id' =&gt; $request-&gt;input('id')],
        ['type' =&gt; $request-&gt;input('type'), 'payload' =&gt; $request-&gt;all()],
    );

    if ($event-&gt;processed_at === null) {
        ProcessPaymentEvent::dispatch($event-&gt;id);
    }

    return response()-&gt;noContent(); // a duplicate is a success, not an error
}</code></pre>
<p>I use <code>createOrFirst</code> rather than <code>firstOrCreate</code>: it tries the insert first and falls back to reading the row when the unique index rejects it, so two copies arriving at the same moment both get the same event instead of one of them crashing.</p>
<p>Notice what happens with a duplicate: it's acknowledged with a 204 and nothing else. Returning an error for a duplicate just makes the provider retry it again.</p>
<p>The controller also does as little as possible. It verifies the signature, stores the event and hands the work to a queue. A slow endpoint is one of the main reasons providers retry in the first place.</p>
<h2>Make the work itself safe to repeat</h2>
<p>Claiming the event isn't enough on its own, because the job can still run twice: two workers can pick up the same event, or a job can die after posting money but before marking the event processed.</p>
<p>So the job locks the event row, checks it again inside a transaction, and does the posting and the marking together:</p>
<pre><code class="language-php">public function handle(): void
{
    DB::transaction(function () {
        $event = WebhookEvent::lockForUpdate()-&gt;findOrFail($this-&gt;eventId);

        if ($event-&gt;processed_at !== null) {
            return; // someone else already did it
        }

        $this-&gt;ledger-&gt;postPayment($event-&gt;payload);

        $event-&gt;update(['processed_at' =&gt; now()]);
    });
}</code></pre>
<p>If the job dies halfway through, the transaction rolls back and the event is still unprocessed, so the retry does the whole thing cleanly. If two workers race, the second one waits on the lock and then finds the event already processed.</p>
<h2>Let the ledger say no as well</h2>
<p>The last line of defence is the ledger. On the platform I work on, money movements are posted to a double-entry ledger. If entries are only ever appended, never edited, it's worth giving each ledger transaction a reference to what caused it, and a unique constraint on that reference together with the kind of posting. Then a payment can still be refunded later, but even if some future code path skipped the checks above, the database would refuse a second payment posting for the same event.</p>
<p>Belt and braces? A little. But this is the code path where a bug costs real money, and the extra constraint is one line.</p>
<h2>Test the duplicate on purpose</h2>
<p>The test I care about most here is boring: send the same webhook twice and check the money moved once.</p>
<pre><code class="language-php">it('posts a payment once even if the webhook arrives twice', function () {
    $payload = gatewayPaymentSucceeded(amount: 5000);

    $this-&gt;postSignedWebhook($payload)-&gt;assertNoContent();
    $this-&gt;postSignedWebhook($payload)-&gt;assertNoContent();

    // One ledger transaction (holding its debit and credit) per payment.
    expect(LedgerTransaction::where('reference', $payload['id'])-&gt;count())-&gt;toBe(1);
});</code></pre>
<p>If you're integrating a payment gateway, build this from day one. Adding idempotency after money has already been double-posted means cleaning up real transactions by hand, and that is a much worse afternoon than writing a unique index.</p>
`.trim(),
    date: "2026-11-11T00:00:00.000Z",
    readingTime: 3,
    tags: ["Laravel","Payments","Webhooks"],
    published: true,
  },
];
