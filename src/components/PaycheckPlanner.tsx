import { Save, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { CORE_FUND_NAMES, isCoreFund } from "../data/defaultBudgetModes";
import { CoreFundName, Fund } from "../types";
import { calculatePaycheckPlan } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

interface PaycheckPlannerProps {
  allocationPercentages: Record<CoreFundName, number>;
  budgetMode: string;
  currencySymbol: string;
  funds: Fund[];
}

export default function PaycheckPlanner({ allocationPercentages, budgetMode, currencySymbol, funds }: PaycheckPlannerProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const numericAmount = Number(amount) || 0;
  const plan = useMemo(() => calculatePaycheckPlan(numericAmount, allocationPercentages), [allocationPercentages, numericAmount]);
  const hasPlan = numericAmount > 0;
  const customFunds = funds.filter((fund) => !isCoreFund(fund.name));
  const planTotal = CORE_FUND_NAMES.reduce((total, fundName) => total + plan[fundName], 0);

  const copyPlan = async () => {
    const title = note.trim() || "Paycheck plan";
    const lines = [
      `${title} (${budgetMode})`,
      ...CORE_FUND_NAMES.map((fundName) => `${fundName}: ${formatCurrency(plan[fundName], currencySymbol)}`),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Paycheck Planner</p>
          <h3 className="mt-1 text-lg font-bold">Split a paycheck by your current budget mode</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Uses {budgetMode} allocation percentages for core funds. This planner does not move money automatically.</p>
        </div>
        <div className="rounded-lg bg-[color:var(--accent-soft)] p-2.5 text-[color:var(--primary)]">
          <WalletCards className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label>
          <span className="label">Paycheck Amount</span>
          <input className="field mt-1" inputMode="decimal" min="0" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
        </label>
        <label>
          <span className="label">Note</span>
          <input className="field mt-1" value={note} onChange={(event) => setNote(event.target.value)} placeholder="June 14 paycheck" />
        </label>
        <button className="btn-secondary self-end" type="button" onClick={copyPlan} disabled={!hasPlan}>
          <Save className="h-4 w-4" /> {copied ? "Copied" : "Copy Plan"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CORE_FUND_NAMES.map((fundName) => (
          <div key={fundName} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-soft)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-bold">{fundName}</p>
              <p className="text-sm font-semibold text-[color:var(--muted)]">{allocationPercentages[fundName]}%</p>
            </div>
            <p className="mt-2 text-xl font-black">{formatCurrency(plan[fundName], currencySymbol)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[color:var(--border)] p-4">
        <p className="text-sm font-semibold text-[color:var(--muted)]">Recommended core-fund total</p>
        <p className="text-xl font-black">{formatCurrency(planTotal, currencySymbol)}</p>
      </div>

      {customFunds.length > 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-[color:var(--border)] p-4">
          <p className="text-sm font-bold">Custom funds tracked separately</p>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {customFunds.map((fund) => fund.name).join(", ")} {customFunds.length === 1 ? "is" : "are"} not included in preset budget mode allocations.
          </p>
        </div>
      )}
    </section>
  );
}
