import { BudgetMode, CoreFundName, CustomAllocation, Fund } from "../types";

export const CORE_FUND_NAMES: CoreFundName[] = ["Savings", "Real Estate", "Retirement", "Stocks", "Travel", "Fun Fund"];

export const isCoreFund = (name: string): name is CoreFundName => CORE_FUND_NAMES.includes(name as CoreFundName);

export const DEFAULT_ALLOCATIONS: Record<BudgetMode["name"], CustomAllocation> = {
  Balanced: {
    Savings: 25,
    "Real Estate": 25,
    Retirement: 20,
    Stocks: 15,
    Travel: 10,
    "Fun Fund": 5,
  },
  "Aggressive Wealth": {
    Savings: 15,
    "Real Estate": 35,
    Retirement: 25,
    Stocks: 15,
    Travel: 5,
    "Fun Fund": 5,
  },
  Safety: {
    Savings: 50,
    "Real Estate": 15,
    Retirement: 15,
    Stocks: 10,
    Travel: 5,
    "Fun Fund": 5,
  },
  Lifestyle: {
    Savings: 15,
    "Real Estate": 20,
    Retirement: 15,
    Stocks: 10,
    Travel: 20,
    "Fun Fund": 20,
  },
  Custom: {
    Savings: 25,
    "Real Estate": 25,
    Retirement: 20,
    Stocks: 15,
    Travel: 10,
    "Fun Fund": 5,
  },
};

export const BUDGET_MODES: BudgetMode[] = Object.entries(DEFAULT_ALLOCATIONS).map(([name, allocations]) => ({
  name: name as BudgetMode["name"],
  allocations,
}));

export const DEFAULT_FUNDS: Fund[] = [
  {
    name: "Travel",
    description: "Vacations, flights, hotels, weekend trips, road trips, and travel-related spending.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
  {
    name: "Savings",
    description: "Emergency savings, short-term cash reserves, and general financial safety.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
  {
    name: "Real Estate",
    description: "Property purchases, down payments, closing costs, repairs, investing, or house hacking.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
  {
    name: "Retirement",
    description: "Long-term retirement investing such as IRAs, 401(k)s, and similar accounts.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
  {
    name: "Stocks",
    description: "Taxable brokerage investing, individual stocks, ETFs, index funds, and other investments.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
  {
    name: "Fun Fund",
    description: "Extra guilt-free lifestyle money for shopping, dates, events, clothes, and random purchases.",
    balance: 0,
    totalContributed: 0,
    history: [],
  },
];
