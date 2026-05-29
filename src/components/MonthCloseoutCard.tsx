import { Save } from "lucide-react";
import { AppData, FundName, MonthlySnapshot } from "../types";
import { generateMonthlySnapshot } from "../utils/calculations";
import { formatCurrency, monthKey } from "../utils/formatters";

interface MonthCloseoutCardProps {
  data: AppData;
  metrics: {
    income: number;
    expenses: number;
    subscriptions: number;
    available: number;
  };
  onSaveSnapshot: (snapshot: MonthlySnapshot) => Promise<void>;
}

const fundOrder: FundName[] = ["Savings", "Real Estate", "Retirement", "Stocks", "Travel", "Fun Fund"];

export default function MonthCloseoutCard({ data, metrics, onSaveSnapshot }: MonthCloseoutCardProps) {
  const { currencySymbol } = data.settings;
  const currentMonth = monthKey();
  const hasSnapshotThisMonth = data.monthlySnapshots.some((snapshot) => snapshot.month === currentMonth);
  const totalFundBalance = data.funds.reduce((total, fund) => total + fund.balance, 0);

  const saveSnapshot = async () => {
    if (hasSnapshotThisMonth && !window.confirm("A snapshot for this month already exists. Save another one?")) return;
    await onSaveSnapshot(generateMonthlySnapshot(data));
  };

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Month Closeout</p>
          <h3 className="mt-1 text-lg font-bold">Save where your budget stands right now</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Creates a historical record for reports and progress charts.</p>
        </div>
        <button className="btn-primary" type="button" onClick={saveSnapshot}>
          <Save className="h-4 w-4" /> Save This Month&apos;s Progress
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Summary label="Monthly income" value={formatCurrency(metrics.income, currencySymbol)} />
        <Summary label="Total expenses" value={formatCurrency(metrics.expenses, currencySymbol)} />
        <Summary label="Subscriptions" value={formatCurrency(metrics.subscriptions, currencySymbol)} />
        <Summary label="Available to Allocate" value={formatCurrency(metrics.available, currencySymbol)} />
        <Summary label="Fund balances" value={formatCurrency(totalFundBalance, currencySymbol)} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
        {fundOrder.map((fundName) => {
          const fund = data.funds.find((item) => item.name === fundName);
          return (
            <div key={fundName} className="rounded-lg bg-[color:var(--bg-soft)] px-3 py-2">
              <p className="text-xs font-semibold text-[color:var(--muted)]">{fundName}</p>
              <p className="font-bold">{formatCurrency(fund?.balance || 0, currencySymbol)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-soft)] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
