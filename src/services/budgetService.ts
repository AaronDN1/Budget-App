import { DEFAULT_FUNDS } from "../data/defaultBudgetModes";
import { DEFAULT_THEME, normalizeTheme } from "../data/themes";
import {
  AppData,
  AppSettings,
  Expense,
  Fund,
  FundContribution,
  FundName,
  IncomeSource,
  MonthlySnapshot,
  Subscription,
} from "../types";
import { supabase } from "../lib/supabase";

type DbProfile = {
  user_id: string;
  currency: string | null;
  budget_month_start_day: number | null;
  selected_budget_mode: AppSettings["budgetMode"] | null;
  theme: string | null;
  custom_allocations: AppSettings["customAllocation"] | null;
  local_migration_completed: boolean | null;
};

const throwIfError = (error: { message: string } | null, fallback: string) => {
  if (error) throw new Error(error.message || fallback);
};

const toNumber = (value: unknown) => Number(value ?? 0);

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
  if (error && "code" in error && error.code === "PGRST116") {
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({
        user_id: userId,
        custom_allocations: {
          Savings: 25,
          "Real Estate": 25,
          Retirement: 20,
          Stocks: 15,
          Travel: 10,
          "Fun Fund": 5,
        },
      })
      .select()
      .single();
    throwIfError(createError, "Could not create profile.");
    return created as DbProfile;
  }
  throwIfError(error, "Could not load profile.");
  return data as DbProfile;
};

export const updateProfile = async (userId: string, updates: Partial<DbProfile>) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  throwIfError(error, "Could not update profile.");
  return data as DbProfile;
};

export const markLocalMigrationComplete = (userId: string) =>
  updateProfile(userId, { local_migration_completed: true });

export const getIncomeSources = async (userId: string): Promise<IncomeSource[]> => {
  const { data, error } = await supabase.from("income_sources").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  throwIfError(error, "Could not load income sources.");
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    amount: toNumber(item.amount),
    frequency: item.frequency,
    recurring: Boolean(item.recurring),
  }));
};

export const createIncomeSource = async (userId: string, income: Omit<IncomeSource, "id">) => {
  const { data, error } = await supabase.from("income_sources").insert({ user_id: userId, ...income }).select().single();
  throwIfError(error, "Could not create income source.");
  return data;
};

export const updateIncomeSource = async (id: string, updates: Partial<IncomeSource>) => {
  const { data, error } = await supabase.from("income_sources").update(updates).eq("id", id).select().single();
  throwIfError(error, "Could not update income source.");
  return data;
};

export const deleteIncomeSource = async (id: string) => {
  const { error } = await supabase.from("income_sources").delete().eq("id", id);
  throwIfError(error, "Could not delete income source.");
};

export const getExpenses = async (userId: string): Promise<Expense[]> => {
  const { data, error } = await supabase.from("expenses").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  throwIfError(error, "Could not load expenses.");
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    amount: toNumber(item.amount),
    category: item.category,
    type: item.type,
    dueDate: item.due_date || "",
    recurring: Boolean(item.recurring),
    notes: item.notes || "",
  }));
};

export const createExpense = async (userId: string, expense: Omit<Expense, "id">) => {
  const { data, error } = await supabase
    .from("expenses")
    .insert({
      user_id: userId,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      type: expense.type,
      due_date: expense.dueDate,
      recurring: expense.recurring,
      notes: expense.notes,
    })
    .select()
    .single();
  throwIfError(error, "Could not create expense.");
  return data;
};

export const updateExpense = async (id: string, updates: Partial<Expense>) => {
  const { data, error } = await supabase
    .from("expenses")
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.amount !== undefined && { amount: updates.amount }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.type !== undefined && { type: updates.type }),
      ...(updates.dueDate !== undefined && { due_date: updates.dueDate }),
      ...(updates.recurring !== undefined && { recurring: updates.recurring }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    })
    .eq("id", id)
    .select()
    .single();
  throwIfError(error, "Could not update expense.");
  return data;
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  throwIfError(error, "Could not delete expense.");
};

export const getSubscriptions = async (userId: string): Promise<Subscription[]> => {
  const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  throwIfError(error, "Could not load subscriptions.");
  return (data || []).map((item) => ({
    id: item.id,
    name: item.name,
    cost: toNumber(item.cost),
    billingCycle: item.billing_cycle,
    billingDate: item.billing_date || "",
    category: item.category || "Miscellaneous",
    essential: Boolean(item.essential),
    active: Boolean(item.active),
    notes: item.notes || "",
  }));
};

export const createSubscription = async (userId: string, subscription: Omit<Subscription, "id">) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      name: subscription.name,
      cost: subscription.cost,
      billing_cycle: subscription.billingCycle,
      billing_date: subscription.billingDate,
      category: subscription.category,
      essential: subscription.essential,
      active: subscription.active,
      notes: subscription.notes,
    })
    .select()
    .single();
  throwIfError(error, "Could not create subscription.");
  return data;
};

export const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
  const { data, error } = await supabase
    .from("subscriptions")
    .update({
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.cost !== undefined && { cost: updates.cost }),
      ...(updates.billingCycle !== undefined && { billing_cycle: updates.billingCycle }),
      ...(updates.billingDate !== undefined && { billing_date: updates.billingDate }),
      ...(updates.category !== undefined && { category: updates.category }),
      ...(updates.essential !== undefined && { essential: updates.essential }),
      ...(updates.active !== undefined && { active: updates.active }),
      ...(updates.notes !== undefined && { notes: updates.notes }),
    })
    .eq("id", id)
    .select()
    .single();
  throwIfError(error, "Could not update subscription.");
  return data;
};

export const deleteSubscription = async (id: string) => {
  const { error } = await supabase.from("subscriptions").delete().eq("id", id);
  throwIfError(error, "Could not delete subscription.");
};

export const getFundContributions = async (userId: string): Promise<(FundContribution & { fundId: string })[]> => {
  const { data, error } = await supabase.from("fund_contributions").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  throwIfError(error, "Could not load fund contributions.");
  return (data || []).map((item) => ({
    id: item.id,
    fundId: item.fund_id,
    fundName: "Savings",
    amount: toNumber(item.amount),
    type: item.type,
    date: item.created_at,
    note: item.note || "",
  }));
};

export const getFunds = async (userId: string): Promise<Fund[]> => {
  const [{ data: funds, error: fundsError }, contributions] = await Promise.all([
    supabase.from("funds").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    getFundContributions(userId),
  ]);
  throwIfError(fundsError, "Could not load funds.");
  return (funds || []).map((item) => {
    const history = contributions
      .filter((entry) => entry.fundId === item.id)
      .map(({ fundId: _fundId, ...entry }) => ({ ...entry, fundName: item.name as FundName }));
    return {
      name: item.name as FundName,
      description: item.description || "",
      balance: toNumber(item.current_balance),
      goalAmount: item.goal_amount === null ? undefined : toNumber(item.goal_amount),
      totalContributed: history.filter((entry) => entry.type === "contribution").reduce((sum, entry) => sum + entry.amount, 0),
      history,
    };
  });
};

export const createDefaultFundsIfNeeded = async (userId: string) => {
  const { count, error } = await supabase.from("funds").select("*", { count: "exact", head: true }).eq("user_id", userId);
  throwIfError(error, "Could not check funds.");
  if ((count || 0) > 0) return;
  const rows = DEFAULT_FUNDS.map((fund) => ({
    user_id: userId,
    name: fund.name,
    description: fund.description,
    current_balance: fund.balance,
    allocation_percentage: 0,
  }));
  const { error: insertError } = await supabase.from("funds").insert(rows);
  throwIfError(insertError, "Could not create default funds.");
};

export const updateFund = async (id: string, updates: Partial<{ current_balance: number; goal_amount: number | null; allocation_percentage: number }>) => {
  const { data, error } = await supabase.from("funds").update(updates).eq("id", id).select().single();
  throwIfError(error, "Could not update fund.");
  return data;
};

export const createFundContribution = async (userId: string, fundId: string, contribution: Omit<FundContribution, "id" | "fundName" | "date">) => {
  const { data, error } = await supabase
    .from("fund_contributions")
    .insert({ user_id: userId, fund_id: fundId, amount: contribution.amount, type: contribution.type, note: contribution.note })
    .select()
    .single();
  throwIfError(error, "Could not create fund contribution.");
  return data;
};

export const deleteFundContribution = async (id: string) => {
  const { error } = await supabase.from("fund_contributions").delete().eq("id", id);
  throwIfError(error, "Could not delete fund contribution.");
};

export const getMonthlySnapshots = async (userId: string): Promise<MonthlySnapshot[]> => {
  const { data, error } = await supabase.from("monthly_snapshots").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  throwIfError(error, "Could not load monthly snapshots.");
  return (data || []).map((item) => ({
    id: item.id,
    month: item.month,
    income: toNumber(item.income),
    expenses: toNumber(item.expenses),
    subscriptions: toNumber(item.subscriptions),
    availableToAllocate: toNumber(item.available_to_allocate),
    fundBalances: (item.fund_allocations || {}) as Record<FundName, number>,
    createdAt: item.created_at,
  }));
};

export const saveMonthlySnapshot = async (userId: string, snapshot: MonthlySnapshot) => {
  const { data, error } = await supabase
    .from("monthly_snapshots")
    .insert({
      user_id: userId,
      month: snapshot.month,
      income: snapshot.income,
      expenses: snapshot.expenses,
      subscriptions: snapshot.subscriptions,
      available_to_allocate: snapshot.availableToAllocate,
      fund_allocations: snapshot.fundBalances,
    })
    .select()
    .single();
  throwIfError(error, "Could not save monthly snapshot.");
  return data;
};

export const loadCloudBudgetData = async (userId: string, fallback: AppData): Promise<AppData> => {
  await createDefaultFundsIfNeeded(userId);
  const [profile, incomeSources, expenses, subscriptions, funds, monthlySnapshots] = await Promise.all([
    getProfile(userId),
    getIncomeSources(userId),
    getExpenses(userId),
    getSubscriptions(userId),
    getFunds(userId),
    getMonthlySnapshots(userId),
  ]);
  return {
    incomeSources,
    expenses,
    subscriptions,
    funds: funds.length ? funds : fallback.funds,
    monthlySnapshots,
    settings: {
      budgetMode: profile.selected_budget_mode || fallback.settings.budgetMode,
      customAllocation: profile.custom_allocations || fallback.settings.customAllocation,
      theme: normalizeTheme(profile.theme || fallback.settings.theme),
      currencySymbol: profile.currency || fallback.settings.currencySymbol,
      budgetMonthStartDay: profile.budget_month_start_day || fallback.settings.budgetMonthStartDay,
    },
  };
};

export const replaceCloudBudgetData = async (userId: string, data: AppData) => {
  await updateProfile(userId, {
    currency: data.settings.currencySymbol,
    budget_month_start_day: data.settings.budgetMonthStartDay,
    selected_budget_mode: data.settings.budgetMode,
    theme: data.settings.theme,
    custom_allocations: data.settings.customAllocation,
  });

  await Promise.all([
    supabase.from("fund_contributions").delete().eq("user_id", userId),
    supabase.from("monthly_snapshots").delete().eq("user_id", userId),
    supabase.from("income_sources").delete().eq("user_id", userId),
    supabase.from("expenses").delete().eq("user_id", userId),
    supabase.from("subscriptions").delete().eq("user_id", userId),
    supabase.from("funds").delete().eq("user_id", userId),
  ]);

  const fundRows = data.funds.map((fund) => ({
    user_id: userId,
    name: fund.name,
    description: fund.description,
    current_balance: fund.balance,
    goal_amount: fund.goalAmount ?? null,
  }));
  const { data: insertedFunds, error: fundsError } = await supabase.from("funds").insert(fundRows).select();
  throwIfError(fundsError, "Could not save funds.");
  const fundIdByName = new Map((insertedFunds || []).map((fund) => [fund.name, fund.id]));

  const contributionRows = data.funds.flatMap((fund) =>
    fund.history.map((entry) => ({
      user_id: userId,
      fund_id: fundIdByName.get(fund.name),
      amount: entry.amount,
      type: entry.type,
      note: entry.note,
    })),
  ).filter((entry) => entry.fund_id);

  const requests = [
    data.incomeSources.length
      ? supabase.from("income_sources").insert(data.incomeSources.map((income) => ({
          user_id: userId,
          name: income.name,
          amount: income.amount,
          frequency: income.frequency,
          recurring: income.recurring,
        })))
      : Promise.resolve({ error: null }),
    data.expenses.length
      ? supabase.from("expenses").insert(data.expenses.map((expense) => ({
          user_id: userId,
          name: expense.name,
          amount: expense.amount,
          category: expense.category,
          type: expense.type,
          due_date: expense.dueDate,
          recurring: expense.recurring,
          notes: expense.notes,
        })))
      : Promise.resolve({ error: null }),
    data.subscriptions.length
      ? supabase.from("subscriptions").insert(data.subscriptions.map((subscription) => ({
          user_id: userId,
          name: subscription.name,
          cost: subscription.cost,
          billing_cycle: subscription.billingCycle,
          billing_date: subscription.billingDate,
          category: subscription.category,
          essential: subscription.essential,
          active: subscription.active,
          notes: subscription.notes,
        })))
      : Promise.resolve({ error: null }),
    contributionRows.length ? supabase.from("fund_contributions").insert(contributionRows) : Promise.resolve({ error: null }),
    data.monthlySnapshots.length
      ? supabase.from("monthly_snapshots").insert(data.monthlySnapshots.map((snapshot) => ({
          user_id: userId,
          month: snapshot.month,
          income: snapshot.income,
          expenses: snapshot.expenses,
          subscriptions: snapshot.subscriptions,
          available_to_allocate: snapshot.availableToAllocate,
          fund_allocations: snapshot.fundBalances,
        })))
      : Promise.resolve({ error: null }),
  ];

  const results = await Promise.all(requests);
  const failed = results.find((result) => result.error);
  throwIfError(failed?.error || null, "Could not save cloud budget data.");
};

export const resetCloudBudgetData = async (userId: string) => {
  await replaceCloudBudgetData(userId, {
    incomeSources: [],
    expenses: [],
    subscriptions: [],
    funds: DEFAULT_FUNDS.map((fund) => ({ ...fund, history: [] })),
    settings: {
      budgetMode: "Balanced",
      customAllocation: {
        Savings: 25,
        "Real Estate": 25,
        Retirement: 20,
        Stocks: 15,
        Travel: 10,
        "Fun Fund": 5,
      },
      theme: DEFAULT_THEME,
      currencySymbol: "$",
      budgetMonthStartDay: 1,
    },
    monthlySnapshots: [],
  });
  await markLocalMigrationComplete(userId);
};
