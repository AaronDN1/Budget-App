create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  currency text default '$',
  budget_month_start_day integer default 1,
  selected_budget_mode text,
  theme text default 'light',
  custom_allocations jsonb,
  local_migration_completed boolean default false,
  fund_allocation_reviewed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.income_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric not null default 0,
  frequency text not null,
  recurring boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  amount numeric not null default 0,
  category text not null,
  type text not null,
  due_date text,
  recurring boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  cost numeric not null default 0,
  billing_cycle text not null,
  billing_date text,
  category text,
  essential boolean default false,
  active boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.funds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  current_balance numeric default 0,
  goal_amount numeric,
  allocation_percentage numeric default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.fund_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  fund_id uuid references public.funds(id) on delete cascade not null,
  amount numeric not null,
  type text not null,
  note text,
  created_at timestamptz default now()
);

create table if not exists public.monthly_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month text not null,
  income numeric default 0,
  expenses numeric default 0,
  subscriptions numeric default 0,
  available_to_allocate numeric default 0,
  fund_allocations jsonb,
  created_at timestamptz default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists income_sources_user_id_idx on public.income_sources(user_id);
create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists funds_user_id_idx on public.funds(user_id);
create index if not exists fund_contributions_user_id_idx on public.fund_contributions(user_id);
create index if not exists monthly_snapshots_user_id_idx on public.monthly_snapshots(user_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_income_sources_updated_at on public.income_sources;
create trigger set_income_sources_updated_at before update on public.income_sources for each row execute function public.set_updated_at();
drop trigger if exists set_expenses_updated_at on public.expenses;
create trigger set_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();
drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
drop trigger if exists set_funds_updated_at on public.funds;
create trigger set_funds_updated_at before update on public.funds for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.income_sources enable row level security;
alter table public.expenses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.funds enable row level security;
alter table public.fund_contributions enable row level security;
alter table public.monthly_snapshots enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = user_id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = user_id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = user_id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['income_sources', 'expenses', 'subscriptions', 'funds', 'fund_contributions', 'monthly_snapshots']
  loop
    execute format('drop policy if exists "%s_select_own" on public.%I', table_name, table_name);
    execute format('create policy "%s_select_own" on public.%I for select using (auth.uid() = user_id)', table_name, table_name);
    execute format('drop policy if exists "%s_insert_own" on public.%I', table_name, table_name);
    execute format('create policy "%s_insert_own" on public.%I for insert with check (auth.uid() = user_id)', table_name, table_name);
    execute format('drop policy if exists "%s_update_own" on public.%I', table_name, table_name);
    execute format('create policy "%s_update_own" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name, table_name);
    execute format('drop policy if exists "%s_delete_own" on public.%I', table_name, table_name);
    execute format('create policy "%s_delete_own" on public.%I for delete using (auth.uid() = user_id)', table_name, table_name);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (user_id, custom_allocations)
  values (
    new.id,
    '{"Savings":25,"Real Estate":25,"Retirement":20,"Stocks":15,"Travel":10,"Fun Fund":5}'::jsonb
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
