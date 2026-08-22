# Database and Supabase setup

## Design

The production schema has exactly three application tables:

- `companies` — the public Bengaluru company directory, including its PostGIS `geography(Point, 4326)` location.
- `company_submissions` — public suggestions awaiting moderator review. Approval does not create a company automatically.
- `promotions` — the manual-approval Boosted Pin product. The initial migration enforces its current terms: ₹2,500 (`250000` paise) for 7 days.

Supabase Auth supplies identity for the one administrator. There is no custom user, employer, candidate, job, application, or payment table.

`updated_at` is maintained by a database trigger on all mutable application tables. The `companies.slug` unique constraint creates the required unique index without a redundant second index.

## Create the Supabase project

1. Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard/projects), choosing the intended production region and a strong database password.
2. In **Project Settings → API**, copy the Project URL and the server-side secret key. Keep the secret key private.
3. In **Connect**, copy a direct PostgreSQL connection string for running migrations. Use the direct connection for DDL; use the pooled connection only later if the backend needs it for ordinary application traffic.
4. Do not enable public sign-up. Create the single administrator in **Authentication → Users** only when the admin authentication implementation is added.

## Run the source-controlled migration

`database/migrations/001_initial_schema.sql` is the source of truth. It creates the `extensions` schema and enables PostGIS there. Do not create application tables manually in the Table Editor.

Until a Supabase CLI project is linked, run the migration in **SQL Editor** as one script:

1. Open **SQL Editor → New query**.
2. Paste the full contents of `database/migrations/001_initial_schema.sql`.
3. Run it once against the new project.
4. Confirm the three tables, two buckets, RLS policies, and the `companies_location_idx` GiST index in the dashboard.

If Supabase rejects `create extension ... postgis`, enable **Database → Extensions → postgis** and choose the `extensions` schema, then rerun the migration. This is a platform permission limitation, not a schema change.

## Storage configuration

The migration creates two buckets:

| Bucket | Visibility | Purpose |
| --- | --- | --- |
| `company-logos` | public | company logo images |
| `payment-proofs` | private | UPI payment-proof screenshots |

Both accept JPEG, PNG, and WebP files up to 5 MiB. The application stores an object path or URL in database text fields; it never stores image bytes in PostgreSQL.

Only the server-side backend using the Supabase secret key may write either bucket. `payment-proofs` has no browser read policy. The Go backend must generate short-lived signed URLs for the administrator to view a proof; never store signed URLs permanently.

## RLS policy summary

| Resource | Public capability | Deliberately blocked |
| --- | --- | --- |
| `companies` | Select active rows only | writes and inactive rows |
| `company_submissions` | Insert a pending submission with public fields | select, update, delete, approval, and admin notes |
| `promotions` | Select only currently active promotions for active companies | writes, pending/expired rows, and admin notes |
| `company-logos` storage | Read | browser writes/deletes |
| `payment-proofs` storage | None | all browser reads/writes |

There are no public update or delete policies. A future Go backend uses its server-side Supabase secret key for administrative operations; that key bypasses RLS and must never be given to the frontend.

## Environment values

Create `backend/.env` locally from `backend/.env.example`:

```dotenv
DATABASE_URL=postgresql://postgres.<project-ref>:<database-password>@<direct-host>:5432/postgres?sslmode=require
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=<Supabase server-side secret key>
PORT=8080
ENVIRONMENT=development
```

`DATABASE_URL` and `SUPABASE_SECRET_KEY` are backend-only secrets. Do not put them in `frontend/.env`, commit them, or expose them in browser code. The frontend needs only `VITE_API_BASE_URL` when the Go API is implemented.
