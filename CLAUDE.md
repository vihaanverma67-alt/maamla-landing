# cv-engine-api

## What this project is

A single-user, human-in-the-loop **opportunity engine** running on **Cloudflare Workers + D1**. It:

1. Discovers internships, conferences, NGOs, and certificates from public sources.
2. Ranks each opportunity against the user's profile (fit scoring).
3. Drafts tailored CVs, outreach emails, and LinkedIn posts.
4. Queues every outbound action for **manual approval** — nothing is sent automatically.

## Platform

- **Runtime**: Cloudflare Workers
- **Database**: D1 (binding name: `cv_engine_db`, database name: `cv-engine-db`)
- **Storage**: R2 or similar for CV files (referenced by key from `cv_variants`)

## Hard rules (never violate)

- Only public listings and official APIs as data sources — no scraping behind auth walls.
- Never bypass CAPTCHAs or platform bot-detection.
- Every outbound action (email send, LinkedIn post, etc.) must pass through the `actions` approval queue and is **never triggered automatically**.

## Schema overview

Five tables in `schema.sql`:

| Table | Purpose |
|---|---|
| `profile` | Single-row user profile (skills, interests, experience, target locations) |
| `opportunities` | Discovered opportunities with fit scores and dedup hashes |
| `cv_variants` | CV file references keyed per opportunity |
| `drafts` | Drafted emails and LinkedIn posts awaiting review |
| `actions` | Approval queue — every action starts `pending` and only moves forward on explicit approval |

## Workflow

```
discover → score → draft → enqueue (pending) → human approves → send/post
```

No step after `enqueue` happens without explicit user action.
