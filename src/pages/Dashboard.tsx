import { AlertTriangle, Banknote, CreditCard, Landmark, PiggyBank, Save, TrendingUp, Wallet } from "lucide-react";
import BudgetHealthScore from "../components/BudgetHealthScore";
import OnboardingChecklist from "../components/OnboardingChecklist";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import MonthCloseoutCard from "../components/MonthCloseoutCard";
import { AppData, CoreFundName, MonthlySnapshot } from "../types";
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
    allocations: Record<CoreFundName, number>;
    allocationPercentages: Record<CoreFundName, number>;
  };
  onNavigate?: (page: "income" | "expenses" | "subscriptions" | "funds" | "settings" | "paycheckPlanner") => void;
  onSaveSnapshot: (snapshot: MonthlySnapshot) => Promise<void>;
}

export default function Dashboard({ data, metrics, onNavigate, onSaveSnapshot }: DashboardProps) {
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
        <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Dashboard</p>
        <h2 className="mt-1 text-2xl font-black sm:text-3xl">Personal finance command center</h2>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:hidden">
        <QuickAction icon={Banknote} label="Add Income" onClick={() => onNavigate?.("income")} primary />
        <QuickAction icon={CreditCard} label="Add Expense" onClick={() => onNavigate?.("expenses")} primary />
        <QuickAction icon={Landmark} label="Add Subscription" onClick={() => onNavigate?.("subscriptions")} />
        <QuickAction icon={Save} label="Plan Paycheck" onClick={() => onNavigate?.("paycheckPlanner")} />
      </section>

      <OnboardingChecklist data={data} onNavigate={onNavigate} />

      {warnings.length > 0 && (
        <div className="rounded-lg border border-[color:var(--danger)] bg-[color:var(--bg-soft)] p-4 text-sm font-semibold text-[color:var(--danger)]">
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

      <MonthCloseoutCard data={data} metrics={metrics} onSaveSnapshot={onSaveSnapshot} />

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Fund Allocation Summary</h3>
            <p className="text-sm text-[color:var(--muted)]">{getBudgetHealthLabel(metrics.healthScore)} budget health under {budgetMode} mode.</p>
          </div>
          <span className="rounded-full bg-[color:var(--bg-soft)] px-3 py-1 text-sm font-bold">{budgetMode}</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(metrics.allocations) as CoreFundName[]).map((fundName) => (
            <div key={fundName} className="rounded-lg border border-[color:var(--border)] p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold">{fundName}</p>
                <p className="text-sm font-semibold text-[color:var(--muted)]">{metrics.allocationPercentages[fundName]}%</p>
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

function QuickAction({ icon: Icon, label, onClick, primary = false }: { icon: typeof Banknote; label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button className={primary ? "btn-primary" : "btn-secondary"} type="button" onClick={onClick}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}
