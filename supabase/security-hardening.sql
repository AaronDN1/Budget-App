-- BudgetCommand launch-prep RLS hardening.
-- Run this in the Supabase SQL Editor after reviewing it for your project.
-- This migration is non-destructive: it does not wipe user data.

alter table public.profiles enable row level security;
alter table public.income_sources enable row level security;
alter table public.expenses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.funds enable row level security;
alter table public.fund_contributions enable row level security;
alter table public.monthly_snapshots enable row level security;

alter table public.profiles force row level security;
alter table public.income_sources force row level security;
alter table public.expenses force row level security;
alter table public.subscriptions force row level security;
alter table public.funds force row level security;
alter table public.fund_contributions force row level security;
alter table public.monthly_snapshots force row level security;

alter table public.profiles
  add column if not exists fund_allocation_reviewed boolean default false;

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists income_sources_user_id_idx on public.income_sources(user_id);
create index if not exists expenses_user_id_idx on public.expenses(user_id);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists funds_user_id_idx on public.funds(user_id);
create index if not exists fund_contributions_user_id_idx on public.fund_contributions(user_id);
create index if not exists fund_contributions_fund_id_idx on public.fund_contributions(fund_id);
create index if not exists monthly_snapshots_user_id_idx on public.monthly_snapshots(user_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'funds_id_user_id_unique'
      and conrelid = 'public.funds'::regclass
  ) then
    alter table public.funds add constraint funds_id_user_id_unique unique (id, user_id);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'fund_contributions_fund_user_fk'
      and conrelid = 'public.fund_contributions'::regclass
  ) then
    alter table public.fund_contributions
      add constraint fund_contributions_fund_user_fk
      foreign key (fund_id, user_id)
      references public.funds(id, user_id)
      on delete cascade;
  end if;
end $$;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array['income_sources', 'expenses', 'subscriptions', 'funds', 'monthly_snapshots']
  loop
    execute format('drop policy if exists "%s_select_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_insert_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_update_own" on public.%I', table_name, table_name);
    execute format('drop policy if exists "%s_delete_own" on public.%I', table_name, table_name);

    execute format('create policy "%s_select_own" on public.%I for select using (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s_insert_own" on public.%I for insert with check (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s_update_own" on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', table_name, table_name);
    execute format('create policy "%s_delete_own" on public.%I for delete using (auth.uid() = user_id)', table_name, table_name);
  end loop;
end $$;

drop policy if exists "fund_contributions_select_own" on public.fund_contributions;
drop policy if exists "fund_contributions_insert_own" on public.fund_contributions;
drop policy if exists "fund_contributions_update_own" on public.fund_contributions;
drop policy if exists "fund_contributions_delete_own" on public.fund_contributions;

create policy "fund_contributions_select_own"
  on public.fund_contributions for select
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.funds
      where funds.id = fund_contributions.fund_id
        and funds.user_id = auth.uid()
    )
  );

create policy "fund_contributions_insert_own"
  on public.fund_contributions for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.funds
      where funds.id = fund_contributions.fund_id
        and funds.user_id = auth.uid()
    )
  );

create policy "fund_contributions_update_own"
  on public.fund_contributions for update
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.funds
      where funds.id = fund_contributions.fund_id
        and funds.user_id = auth.uid()
    )
  )
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.funds
      where funds.id = fund_contributions.fund_id
        and funds.user_id = auth.uid()
    )
  );

create policy "fund_contributions_delete_own"
  on public.fund_contributions for delete
  using (
    auth.uid() = user_id
    and exists (
      select 1 from public.funds
      where funds.id = fund_contributions.fund_id
        and funds.user_id = auth.uid()
    )
  );
