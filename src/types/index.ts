export type PayFrequency = "weekly" | "biweekly" | "semi-monthly" | "monthly" | "yearly" | "one-time";
export type ExpenseType = "fixed" | "variable";
export type SubscriptionCycle = "weekly" | "monthly" | "yearly" | "one-time";
export type BudgetModeName = "Balanced" | "Aggressive Wealth" | "Safety" | "Lifestyle" | "Custom";
export type FundName = "Travel" | "Savings" | "Real Estate" | "Retirement" | "Stocks" | "Fun Fund";

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: PayFrequency;
  recurring: boolean;
  month?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: ExpenseType;
  dueDate: string;
  recurring: boolean;
  notes: string;
  month?: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: SubscriptionCycle;
  billingDate: string;
  category: string;
  essential: boolean;
  active: boolean;
  notes: string;
  month?: string;
}

export interface FundContribution {
  id: string;
  fundName: FundName;
  amount: number;
  type: "contribution" | "withdrawal" | "balance-edit";
  date: string;
  note: string;
}

export interface Fund {
  name: FundName;
  description: string;
  balance: number;
  goalAmount?: number;
  totalContributed: number;
  history: FundContribution[];
}

export type CustomAllocation = Record<FundName, number>;

export interface BudgetMode {
  name: BudgetModeName;
  allocations: CustomAllocation;
}

export interface MonthlySnapshot {
  id: string;
  month: string;
  income: number;
  expenses: number;
  subscriptions: number;
  availableToAllocate: number;
  fundBalances: Record<FundName, number>;
  createdAt: string;
}

export interface AppSettings {
  budgetMode: BudgetModeName;
  customAllocation: CustomAllocation;
  theme: "light" | "dark";
  currencySymbol: string;
  budgetMonthStartDay: number;
}

export interface AppData {
  incomeSources: IncomeSource[];
  expenses: Expense[];
  subscriptions: Subscription[];
  funds: Fund[];
  settings: AppSettings;
  monthlySnapshots: MonthlySnapshot[];
}
