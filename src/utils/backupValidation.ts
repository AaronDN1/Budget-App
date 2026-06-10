import { DEFAULT_ALLOCATIONS, DEFAULT_FUNDS } from "../data/defaultBudgetModes";
import { DEFAULT_THEME, normalizeTheme } from "../data/themes";
import { AppData, ExpenseType, FundContribution, SubscriptionCycle, PayFrequency } from "../types";
import { uid } from "./formatters";

export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;

const frequencies: PayFrequency[] = ["weekly", "biweekly", "semi-monthly", "monthly", "yearly", "one-time"];
const expenseTypes: ExpenseType[] = ["fixed", "variable"];
const subscriptionCycles: SubscriptionCycle[] = ["weekly", "monthly", "yearly", "one-time"];
const contributionTypes: FundContribution["type"][] = ["contribution", "withdrawal", "balance-edit"];

const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

const array = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const string = (value: unknown, fallback = "") => (typeof value === "string" ? value.slice(0, 500) : fallback);
const finite = (value: unknown, fallback = 0) => {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
};
const boolean = (value: unknown, fallback = false) => (typeof value === "boolean" ? value : fallback);
const enumValue = <T extends string>(value: unknown, allowed: T[], fallback: T) =>
  allowed.includes(value as T) ? (value as T) : fallback;
const numericRecord = (value: unknown) =>
  Object.fromEntries(Object.entries(object(value)).map(([key, next]) => [key, finite(next)]));

export const validateBudgetBackupText = (text: string): AppData => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Invalid backup file.");
  }

  const root = object(parsed);
  const settings = object(root.settings);
  if (!Object.keys(settings).length || !Array.isArray(root.funds)) {
    throw new Error("Invalid backup file.");
  }

  const defaults = {
    funds: DEFAULT_FUNDS.map((fund) => ({ ...fund, history: [] })),
    settings: {
      budgetMode: "Balanced" as const,
      customAllocation: DEFAULT_ALLOCATIONS.Custom,
      hasChosenBudgetMode: false,
      hasReviewedFundAllocation: false,
      theme: DEFAULT_THEME,
      currencySymbol: "$",
      budgetMonthStartDay: 1,
    },
  };

  const data: AppData = {
    incomeSources: array(root.incomeSources).map((item) => {
      const row = object(item);
      return {
        id: string(row.id, uid()),
        name: string(row.name),
        amount: finite(row.amount),
        frequency: enumValue(row.frequency, frequencies, "monthly"),
        recurring: boolean(row.recurring, true),
        month: string(row.month) || undefined,
      };
    }),
    expenses: array(root.expenses).map((item) => {
      const row = object(item);
      return {
        id: string(row.id, uid()),
        name: string(row.name),
        amount: finite(row.amount),
        category: string(row.category, "Miscellaneous"),
        type: enumValue(row.type, expenseTypes, "variable"),
        dueDate: string(row.dueDate),
        recurring: boolean(row.recurring, true),
        notes: string(row.notes),
        month: string(row.month) || undefined,
      };
    }),
    subscriptions: array(root.subscriptions).map((item) => {
      const row = object(item);
      return {
        id: string(row.id, uid()),
        name: string(row.name),
        cost: finite(row.cost),
        billingCycle: enumValue(row.billingCycle, subscriptionCycles, "monthly"),
        billingDate: string(row.billingDate),
        category: string(row.category, "Miscellaneous"),
        essential: boolean(row.essential),
        active: boolean(row.active, true),
        notes: string(row.notes),
        month: string(row.month) || undefined,
      };
    }),
    funds: array(root.funds).map((item) => {
      const row = object(item);
      const name = string(row.name, "Fund");
      const history = array(row.history).map((entry) => {
        const contribution = object(entry);
        return {
          id: string(contribution.id, uid()),
          fundName: name,
          amount: finite(contribution.amount),
          type: enumValue(contribution.type, contributionTypes, "contribution"),
          date: string(contribution.date, new Date().toISOString()),
          note: string(contribution.note),
        };
      });
      return {
        name,
        description: string(row.description),
        balance: finite(row.balance),
        goalAmount: row.goalAmount === undefined || row.goalAmount === null ? undefined : Math.max(0, finite(row.goalAmount)),
        totalContributed: finite(row.totalContributed),
        history,
      };
    }),
    settings: {
      budgetMode: enumValue(settings.budgetMode, ["Balanced", "Aggressive Wealth", "Safety", "Lifestyle", "Custom"], defaults.settings.budgetMode),
      customAllocation: {
        Savings: finite(object(settings.customAllocation).Savings, DEFAULT_ALLOCATIONS.Custom.Savings),
        "Real Estate": finite(object(settings.customAllocation)["Real Estate"], DEFAULT_ALLOCATIONS.Custom["Real Estate"]),
        Retirement: finite(object(settings.customAllocation).Retirement, DEFAULT_ALLOCATIONS.Custom.Retirement),
        Stocks: finite(object(settings.customAllocation).Stocks, DEFAULT_ALLOCATIONS.Custom.Stocks),
        Travel: finite(object(settings.customAllocation).Travel, DEFAULT_ALLOCATIONS.Custom.Travel),
        "Fun Fund": finite(object(settings.customAllocation)["Fun Fund"], DEFAULT_ALLOCATIONS.Custom["Fun Fund"]),
      },
      hasChosenBudgetMode: boolean(settings.hasChosenBudgetMode, false),
      hasReviewedFundAllocation: boolean(settings.hasReviewedFundAllocation, false),
      theme: normalizeTheme(string(settings.theme, DEFAULT_THEME)),
      currencySymbol: string(settings.currencySymbol, "$").slice(0, 4) || "$",
      budgetMonthStartDay: Math.min(31, Math.max(1, finite(settings.budgetMonthStartDay, 1))),
    },
    monthlySnapshots: array(root.monthlySnapshots).map((item) => {
      const row = object(item);
      return {
        id: string(row.id, uid()),
        month: string(row.month),
        income: finite(row.income),
        expenses: finite(row.expenses),
        subscriptions: finite(row.subscriptions),
        availableToAllocate: finite(row.availableToAllocate),
        fundBalances: numericRecord(row.fundBalances),
        createdAt: string(row.createdAt, new Date().toISOString()),
      };
    }),
  };

  if (!data.funds.length) data.funds = defaults.funds;
  data.settings.hasChosenBudgetMode =
    data.settings.hasChosenBudgetMode ||
    Boolean(data.incomeSources.length || data.expenses.length || data.subscriptions.length || data.monthlySnapshots.length);

  return data;
};

export const validateBudgetBackupFile = async (file: File) => {
  if (file.size > MAX_BACKUP_BYTES) {
    throw new Error("Backup file is too large.");
  }
  return validateBudgetBackupText(await file.text());
};
