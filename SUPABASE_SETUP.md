# Supabase Setup (Free, Safe)

This wires login/registration + records (votes, downloads, saved portfolios)
to your free Supabase project. The website still works fully if you skip this
file — you just won't have a backend.

No credit card. Anyone can sign up free. Your users never pay either.

---

## 1. Create the project

1. Go to https://supabase.com and sign in (GitHub login is fine).
2. Click **New Project**:
   - Name: `ashuvalz` (anything is fine)
   - Database password: pick a strong one and **save it somewhere safe**
   - Region: closest to you
   - Plan: **Free**
3. Wait ~1 minute for it to spin up.

## 2. Run the database schema

1. In the project, open **SQL Editor** (left sidebar).
2. Click **New query**.
3. Open `supabase/schema.sql` from this repo, copy the whole file, paste it
   into the editor, and click **Run**.
4. You should see "Success. No rows returned." That created all tables and
   security rules.

## 3. Copy your public keys

1. In Supabase, go to **Settings → API** (left sidebar, gear icon).
2. Copy these two values:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - **`anon` `public`** key (a long `eyJ...` string)
3. Open `js/supabase-config.js` in this repo and paste them in:

```js
window.SUPABASE_CONFIG = {
  url: 'https://abcdxyz.supabase.co',
  anonKey: 'eyJhbGciOi...'
};
```

> **Safety reminder:** the `anon` `public` key is meant for browsers and is
> safe to commit. **Never** paste the `service_role` secret key anywhere in
> this repo — that one bypasses security and can be abused.

## 4. (Recommended) Disable email confirmation while testing

So you don't need to verify an inbox to test:

1. **Authentication → Providers → Email**
2. Turn **off** "Confirm email" while testing.
3. Click **Save**.

You can re-enable it later for stricter signup.

## 5. (Recommended) Lock down to free-tier only

So the project can never accidentally cost money:

1. **Settings → Billing**
2. Confirm you're on the **Free** plan.
3. Do not add a credit card.

If usage ever exceeds free limits, Supabase pauses the project — it does
**not** auto-charge you.

## 6. Reload the website

Refresh `pages/builder.html`. You should see:

- A **Login** button in the navbar (next to Support)
- After signing up + logging in, the button shows your name
- New **Save** / **Load** buttons under "Download Portfolio" become usable
- Voting in the download popup records your vote globally
- Each download is logged

## 7. Where the records live

In Supabase → **Table Editor**:

- `profiles` — one row per user
- `portfolios` — saved loadouts (one per user)
- `feedback_votes` — one row per voter (up or down)
- `download_events` — one row per download

You can query / export these any time from the dashboard.

## Troubleshooting

- **"Backend not connected yet"** → keys missing in `js/supabase-config.js`.
- **Login works but Save fails** → re-run `supabase/schema.sql` to make sure
  RLS policies are installed.
- **Voting popup still shows local 0/0** → confirm `get_feedback_totals` was
  created (it's at the bottom of `schema.sql`).
- **Forgot password flow** → use the Supabase dashboard for password resets
  during testing; a UI for it can be added later.
