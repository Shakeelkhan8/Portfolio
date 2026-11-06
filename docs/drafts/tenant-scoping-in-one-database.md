---
title: "One database, many companies: making tenant scoping the default"
excerpt: "On a multi-tenant SaaS, the bug that worries me most isn't a crash. It's one company seeing another's data. Here's how I make the safe query the one you get without thinking."
tags: [Laravel, Multi-tenancy, PostgreSQL]
status: draft
---

<!--
DRAFT for Shakeel to edit and publish (Admin → Blog). Not published anywhere.
Project facts come from the Dispatch Management SaaS case study: one
PostgreSQL database with tenant-scoped queries, a model trait plus a global
query scope, and the trade-off that a missed scope has a bigger blast radius
than separate databases. The code is a simplified illustration, not a copy of
the client's code. Check it reads like you before publishing.
-->

On a multi-tenant SaaS, the bug that worries me most isn't a crash. A crash is loud: someone reports it, you fix it. The quiet bug is one company seeing another company's orders, invoices or drivers. Nobody notices until a customer does.

On the dispatch platform I work on, every logistics company shares one Laravel application and one PostgreSQL database. We chose that over a database per company because it's far less to operate: one schema to migrate, one connection pool, one backup. The cost is that isolation becomes the application's job. If a query forgets to filter by company, the database won't stop it.

So the goal is simple to say: the safe query should be the one you get without thinking about it.

## Make the scope the default, not a habit

The first version of tenant scoping in most codebases is a habit. Every query gets a `where('company_id', ...)`, and every reviewer checks for it. That works until the one query nobody looked at closely, usually a report or an export written in a hurry.

Instead, the filter goes on the model. A trait adds a global scope, so every query on that model is filtered by the current company unless someone explicitly asks otherwise:

```php
trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope('company', function (Builder $query) {
            $companyId = app(CurrentCompany::class)->id();

            // No company in context means no rows, not every row.
            $query->where($query->qualifyColumn('company_id'), $companyId ?? 0);
        });

        static::creating(function (Model $model) {
            $model->company_id ??= app(CurrentCompany::class)->id();
        });
    }
}
```

Two details matter more than the trait itself.

First, when there's no company in context, the scope returns nothing. It's tempting to skip the filter when the company is missing, and that's exactly the case that leaks: a queued job or an artisan command that runs without a request, quietly reading every tenant's rows.

Second, new records get the company set automatically. If creating a record depends on someone remembering to set `company_id`, eventually someone won't.

## The escape hatch should look like an escape hatch

Some code genuinely needs to see across companies: platform admin screens, billing runs, migrations. That code uses `withoutGlobalScope('company')`, and that call is easy to search for. When I review a pull request, any new use of it gets a second look and a comment explaining why. It's the one line where the default is being switched off, so it's the one line that has to justify itself.

## Test the leak, not just the feature

Feature tests usually create one company and check that things work for it. They'd pass even if the scope were missing, because there's nothing else to leak.

So the tests that matter create two companies and check that one can't see the other:

```php
it('does not return another company\'s orders', function () {
    [$mine, $theirs] = Company::factory()->count(2)->create();
    Order::factory()->for($theirs)->create();

    actingAsCompany($mine);

    expect(Order::count())->toBe(0);
});
```

A test like this fails the moment someone adds a model without the trait, or writes a raw query that skips it. That's the point: it guards the property you care about, not the code you happened to write.

## What this approach costs

I want to be honest about the trade-off. With one database, a missed scope has a bigger blast radius than with physical separation. If a company had its own database, a forgotten filter would just return that company's own data. Here it returns everyone's.

That's why the scope has to be the default and not an option. The design only works if forgetting is hard: the trait does the filtering, the creating hook does the stamping, the tests check for leaks, and the escape hatch is loud enough to notice in review.

If you're running a Laravel SaaS on one database and your tenant filtering lives in individual queries, the first step is usually small: put the filter on the model, make "no tenant" mean "no rows", and write one test with two companies in it. You'll find out quickly whether anything was relying on the gap.
