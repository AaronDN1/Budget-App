import { AlertTriangle, Banknote, CreditCard, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import BudgetHealthScore from "../components/BudgetHealthScore";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import { AppData, FundName } from "../types";
import { getBudgetHealthLabel } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

interface DashboardProps {
  data: AppData;
  metrics: {
    income: number;
    fixed: number;
    variable: number;
    subscriptions: number;
    expenses: number;
    available: number;
    healthScore: number;
    allocations: Record<FundName, number>;
    allocationPercentages: Record<FundName, number>;
  };
  onNavigate?: (page: "income" | "expenses" | "subscriptions" | "funds") => void;
}

export default function Dashboard({ data, metrics, onNavigate }: DashboardProps) {
  const { currencySymbol, budgetMode } = data.settings;
  const savingsRate = metrics.income > 0 ? (metrics.available / metrics.income) * 100 : 0;
  const warnings: string[] = [
    metrics.expenses + metrics.subscriptions > metrics.income ? "Expenses exceed income." : "",
    metrics.subscriptions > metrics.income * 0.1 ? "Subscriptions are more than 10% of income." : "",
    metrics.available < 0 ? "Available to allocate is negative." : "",
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Dashboard</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white sm:text-3xl">Personal finance command center</h2>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:hidden">
        <button className="btn-primary" type="button" onClick={() => onNavigate?.("income")}>Add Income</button>
        <button className="btn-primary" type="button" onClick={() => onNavigate?.("expenses")}>Add Expense</button>
        <button className="btn-secondary" type="button" onClick={() => onNavigate?.("subscriptions")}>Add Subscription</button>
        <button className="btn-secondary" type="button" onClick={() => onNavigate?.("funds")}>Fund Contribution</button>
      </section>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <div>{warnings.map((warning) => <p key={warning}>{warning}</p>)}</div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Monthly Income" value={formatCurrency(metrics.income, currencySymbol)} detail="Estimated from all income sources" icon={Banknote} tone="green" />
        <StatCard title="Total Expenses" value={formatCurrency(metrics.expenses, currencySymbol)} detail={`Fixed ${formatCurrency(metrics.fixed, currencySymbol)} | Variable ${formatCurrency(metrics.variable, currencySymbol)}`} icon={CreditCard} tone="red" />
        <StatCard title="Subscriptions" value={formatCurrency(metrics.subscriptions, currencySymbol)} detail={`${data.subscriptions.filter((s) => s.active).length} active subscriptions`} icon={Wallet} tone="blue" />
        <StatCard title="Available to Allocate" value={formatCurrency(metrics.available, currencySymbol)} detail={budgetMode} icon={PiggyBank} tone={metrics.available >= 0 ? "green" : "red"} />
        <StatCard title="Savings Rate" value={`${Math.max(0, savingsRate).toFixed(1)}%`} detail="Available income after expenses and subscriptions" icon={TrendingUp} tone="green" />
        <BudgetHealthScore score={metrics.healthScore} />
      </div>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Fund Allocation Summary</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{getBudgetHealthLabel(metrics.healthScore)} budget health under {budgetMode} mode.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold dark:bg-slate-800">{budgetMode}</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(metrics.allocations) as FundName[]).map((fundName) => (
            <div key={fundName} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <p className="font-bold">{fundName}</p>
                <p className="text-sm font-semibold text-slate-500">{metrics.allocationPercentages[fundName]}%</p>
              </div>
              <p className="mt-2 text-xl font-black">{formatCurrency(metrics.allocations[fundName], currencySymbol)}</p>
              <div className="mt-3"><ProgressBar value={metrics.allocationPercentages[fundName]} tone="blue" /></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
