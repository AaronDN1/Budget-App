# Budget OS

A Vite + React + TypeScript personal budgeting app with Supabase Auth, Supabase Postgres cloud sync, Tailwind CSS, and Recharts.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Supabase values:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Run locally:

```bash
npm run dev
```

## Supabase Setup

1. Create a project at [Supabase](https://supabase.com).
2. Open Project Settings, then API.
3. Copy the Project URL into `VITE_SUPABASE_URL`.
4. Copy the public anon key into `VITE_SUPABASE_ANON_KEY`.
5. Open the Supabase SQL Editor.
6. Paste and run `supabase/schema.sql`.

The schema creates profiles, income sources, expenses, subscriptions, funds, fund contributions, monthly snapshots, indexes, updated-at triggers, auth profile creation, and Row Level Security policies.

## Deployment On Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add these environment variables in Vercel Project Settings:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

4. Use the default Vite build command:

```bash
npm run build
```

5. Deploy.

## Notes

- Do not put a Supabase service role key in the frontend.
- User data access is enforced by Supabase Auth and Row Level Security.
- Existing localStorage data can be imported into a cloud account after sign-in.
