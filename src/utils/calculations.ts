import { DEFAULT_ALLOCATIONS } from "../data/defaultBudgetModes";
import {
  AppData,
  BudgetModeName,
  CustomAllocation,
  Expense,
  FundName,
  IncomeSource,
  MonthlySnapshot,
  Subscription,
} from "../types";
import { monthKey, uid } from "./formatters";

const isCountedThisMonth = (itemMonth?: string, recurring = true, selectedMonth = monthKey()) =>
  recurring || !itemMonth || itemMonth === selectedMonth;

export const incomeToMonthly = (source: IncomeSource, selectedMonth = monthKey()) => {
  if (!isCountedThisMonth(source.month, source.recurring, selectedMonth)) return 0;
  const amount = Number(source.amount) || 0;
  switch (source.frequency) {
    case "weekly":
      return amount * 4.33;
    case "biweekly":
      return (amount * 26) / 12;
    case "semi-monthly":
      return amount * 2;
    case "yearly":
      return amount / 12;
    case "one-time":
    case "monthly":
    default:
      return amount;
  }
};

export const calculateMonthlyIncome = (sources: IncomeSource[], selectedMonth = monthKey()) =>
  sources.reduce((total, source) => total + incomeToMonthly(source, selectedMonth), 0);

export const calculateMonthlyExpenseTotal = (expenses: Expense[], type?: "fixed" | "variable", selectedMonth = monthKey()) =>
  expenses
    .filter((expense) => (!type || expense.type === type) && isCountedThisMonth(expense.month, expense.recurring, selectedMonth))
    .reduce((total, expense) => total + (Number(expense.amount) || 0), 0);

export const subscriptionToMonthly = (subscription: Subscription, selectedMonth = monthKey()) => {
  if (!subscription.active || !isCountedThisMonth(subscription.month, subscription.billingCycle !== "one-time", selectedMonth)) return 0;
  const cost = Number(subscription.cost) || 0;
  switch (subscription.billingCycle) {
    case "weekly":
      return cost * 4.33;
    case "yearly":
      return cost / 12;
    case "one-time":
    case "monthly":
    default:
      return cost;
  }
};

export const calculateMonthlySubscriptionTotal = (subscriptions: Subscription[], selectedMonth = monthKey()) =>
  subscriptions.reduce((total, subscription) => total + subscriptionToMonthly(subscription, selectedMonth), 0);

export const calculateAvailableToAllocate = (
  monthlyIncome: number,
  totalFixedExpenses: number,
  totalVariableExpenses: number,
  totalSubscriptionsMonthly: number,
) => monthlyIncome - totalFixedExpenses - totalVariableExpenses - totalSubscriptionsMonthly;

export const getActiveAllocation = (mode: BudgetModeName, customAllocation: CustomAllocation) =>
  mode === "Custom" ? customAllocation : DEFAULT_ALLOCATIONS[mode];

export const calculateFundAllocations = (
  availableToAllocate: number,
  mode: BudgetModeName,
  customAllocation: CustomAllocation,
) => {
  const allocation = getActiveAllocation(mode, customAllocation);
  return Object.entries(allocation).reduce(
    (result, [fundName, percentage]) => ({
      ...result,
      [fundName]: availableToAllocate > 0 ? (availableToAllocate * percentage) / 100 : 0,
    }),
    {} as Record<FundName, number>,
  );
};

export const calculateBudgetHealthScore = (
  income: number,
  expenses: number,
  subscriptions: number,
  availableToAllocate: number,
  savingsInvestingAllocation: number,
) => {
  if (income <= 0) return 0;
  let score = 100;
  const expenseRatio = expenses / income;
  const subscriptionRatio = subscriptions / income;

  if (expenses > income) score -= 40;
  else if (expenseRatio >= 0.8) score -= 25;
  else if (expenseRatio >= 0.6) score -= 15;

  if (subscriptionRatio > 0.1) score -= 15;
  else if (subscriptionRatio >= 0.05) score -= 7;

  if (availableToAllocate < 0) score -= 30;
  else if (availableToAllocate < income * 0.1) score -= 10;

  if (savingsInvestingAllocation < income * 0.1) score -= 10;

  return Math.min(100, Math.max(0, Math.round(score)));
};

export const getBudgetHealthLabel = (score: number) => {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Okay";
  if (score >= 40) return "Risky";
  return "Needs Attention";
};

export const groupExpensesByCategory = (expenses: Expense[]) =>
  Object.values(
    expenses.reduce<Record<string, { name: string; value: number }>>((groups, expense) => {
      groups[expense.category] = groups[expense.category] || { name: expense.category, value: 0 };
      groups[expense.category].value += Number(expense.amount) || 0;
      return groups;
    }, {}),
  );

export const groupSubscriptionsByCategory = (subscriptions: Subscription[]) =>
  Object.values(
    subscriptions
      .filter((subscription) => subscription.active)
      .reduce<Record<string, { name: string; value: number }>>((groups, subscription) => {
        groups[subscription.category] = groups[subscription.category] || { name: subscription.category, value: 0 };
        groups[subscription.category].value += subscriptionToMonthly(subscription);
        return groups;
      }, {}),
  );

export const generateMonthlySnapshot = (data: AppData): MonthlySnapshot => {
  const income = calculateMonthlyIncome(data.incomeSources);
  const fixed = calculateMonthlyExpenseTotal(data.expenses, "fixed");
  const variable = calculateMonthlyExpenseTotal(data.expenses, "variable");
  const subscriptions = calculateMonthlySubscriptionTotal(data.subscriptions);
  const availableToAllocate = calculateAvailableToAllocate(income, fixed, variable, subscriptions);
  const fundBalances = data.funds.reduce(
    (balances, fund) => ({ ...balances, [fund.name]: fund.balance }),
    {} as Record<FundName, number>,
  );

  return {
    id: uid(),
    month: monthKey(),
    income,
    expenses: fixed + variable,
    subscriptions,
    availableToAllocate,
    fundBalances,
    createdAt: new Date().toISOString(),
  };
};
