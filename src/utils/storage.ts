import { DEFAULT_ALLOCATIONS, DEFAULT_FUNDS } from "../data/defaultBudgetModes";
import { DEFAULT_THEME, normalizeTheme } from "../data/themes";
import { AppData } from "../types";
import { validateBudgetBackupFile } from "./backupValidation";

const STORAGE_KEY = "budget-command-center-data";

export const createDefaultData = (): AppData => ({
  incomeSources: [],
  expenses: [],
  subscriptions: [],
  funds: DEFAULT_FUNDS.map((fund) => ({ ...fund, history: [] })),
  settings: {
    budgetMode: "Balanced",
    customAllocation: DEFAULT_ALLOCATIONS.Custom,
    hasChosenBudgetMode: false,
    theme: DEFAULT_THEME,
    currencySymbol: "$",
    budgetMonthStartDay: 1,
    hasReviewedFundAllocation: false,
  },
  monthlySnapshots: [],
});

export const loadData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultData();
    const parsed = JSON.parse(raw) as Partial<AppData>;
    const defaults = createDefaultData();
    const hasMeaningfulData = Boolean(parsed.incomeSources?.length || parsed.expenses?.length || parsed.subscriptions?.length || parsed.monthlySnapshots?.length);
    return {
      ...defaults,
      ...parsed,
      settings: {
        ...defaults.settings,
        ...parsed.settings,
        hasChosenBudgetMode: parsed.settings?.hasChosenBudgetMode ?? hasMeaningfulData,
        theme: normalizeTheme(parsed.settings?.theme),
        hasReviewedFundAllocation: parsed.settings?.hasReviewedFundAllocation ?? false,
      },
      funds: [
        ...defaults.funds.map((defaultFund) => {
        const savedFund = parsed.funds?.find((fund) => fund.name === defaultFund.name);
        return { ...defaultFund, ...savedFund, history: savedFund?.history || [] };
        }),
        ...(parsed.funds || []).filter((fund) => !defaults.funds.some((defaultFund) => defaultFund.name === fund.name)),
      ],
    };
  } catch {
    return createDefaultData();
  }
};

export const hasLocalData = () => Boolean(localStorage.getItem(STORAGE_KEY));

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = (data: AppData) =>
  new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

export const importData = async (file: File): Promise<AppData> => {
  return validateBudgetBackupFile(file);
};

export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  return createDefaultData();
};
