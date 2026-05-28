import { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout";
import { PageKey } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Funds from "./pages/Funds";
import Income from "./pages/Income";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import { AppData } from "./types";
import {
  calculateAvailableToAllocate,
  calculateBudgetHealthScore,
  calculateFundAllocations,
  calculateMonthlyExpenseTotal,
  calculateMonthlyIncome,
  calculateMonthlySubscriptionTotal,
  getActiveAllocation,
} from "./utils/calculations";
import { loadData, saveData } from "./utils/storage";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("dashboard");
  const [data, setDataState] = useState<AppData>(() => loadData());

  const setData = (updater: (data: AppData) => AppData) => {
    setDataState((current) => updater(current));
  };

  const replaceData = (next: AppData) => setDataState(next);

  useEffect(() => {
    saveData(data);
    document.documentElement.classList.toggle("dark", data.settings.theme === "dark");
  }, [data]);

  const metrics = useMemo(() => {
    const income = calculateMonthlyIncome(data.incomeSources);
    const fixed = calculateMonthlyExpenseTotal(data.expenses, "fixed");
    const variable = calculateMonthlyExpenseTotal(data.expenses, "variable");
    const subscriptions = calculateMonthlySubscriptionTotal(data.subscriptions);
    const expenses = fixed + variable;
    const available = calculateAvailableToAllocate(income, fixed, variable, subscriptions);
    const allocationPercentages = getActiveAllocation(data.settings.budgetMode, data.settings.customAllocation);
    const allocations = calculateFundAllocations(available, data.settings.budgetMode, data.settings.customAllocation);
    const savingsInvestingAllocation =
      allocations.Savings + allocations.Retirement + allocations.Stocks + allocations["Real Estate"];
    const healthScore = calculateBudgetHealthScore(income, expenses + subscriptions, subscriptions, available, savingsInvestingAllocation);
    return { income, fixed, variable, subscriptions, expenses, available, healthScore, allocations, allocationPercentages };
  }, [data]);

  const page = {
    dashboard: <Dashboard data={data} metrics={metrics} />,
    income: <Income data={data} setData={setData} />,
    expenses: <Expenses data={data} setData={setData} />,
    subscriptions: <Subscriptions data={data} setData={setData} />,
    funds: <Funds data={data} setData={setData} allocations={metrics.allocations} allocationPercentages={metrics.allocationPercentages} />,
    reports: <Reports data={data} metrics={metrics} />,
    settings: <Settings data={data} setData={setData} replaceData={replaceData} />,
  }[activePage];

  return <Layout activePage={activePage} setActivePage={setActivePage}>{page}</Layout>;
}
