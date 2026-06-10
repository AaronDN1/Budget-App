import { Check, CreditCard, Landmark, PiggyBank, Settings, ToggleLeft, Wallet } from "lucide-react";
import { AppData } from "../types";

type OnboardingPage = "income" | "expenses" | "subscriptions" | "funds" | "settings";

interface OnboardingChecklistProps {
  data: AppData;
  onNavigate?: (page: OnboardingPage) => void;
}

export default function OnboardingChecklist({ data, onNavigate }: OnboardingChecklistProps) {
  const hasFundProgress = data.funds.some((fund) => fund.balance > 0 || fund.totalContributed > 0 || fund.goalAmount);
  const hasReviewedFundAllocation = data.settings.hasReviewedFundAllocation || hasFundProgress;
  const steps: Array<{ label: string; action: string; page: OnboardingPage; complete: boolean; icon: typeof Wallet }> = [
    { label: "Add your income", action: "Add Income", page: "income", complete: data.incomeSources.length > 0, icon: Wallet },
    { label: "Add fixed expenses", action: "Add Expenses", page: "expenses", complete: data.expenses.some((expense) => expense.type === "fixed"), icon: CreditCard },
    { label: "Add subscriptions", action: "Add Subscriptions", page: "subscriptions", complete: data.subscriptions.length > 0, icon: Landmark },
    { label: "Pick a budget mode", action: "Choose Mode", page: "settings", complete: data.settings.hasChosenBudgetMode, icon: Settings },
    { label: "Review fund allocation", action: "Review Funds", page: "funds", complete: hasReviewedFundAllocation, icon: PiggyBank },
  ];
  const completeCount = steps.filter((step) => step.complete).length;

  if (completeCount >= steps.length) return null;

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Setup</p>
          <h3 className="mt-1 text-lg font-bold">Set up your command center</h3>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{completeCount} of {steps.length} steps complete</p>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-[color:var(--bg-soft)]">
          <div className="h-full rounded-full bg-[color:var(--primary)]" style={{ width: `${(completeCount / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        {steps.map(({ label, action, page, complete, icon: Icon }) => {
          const StatusIcon = complete ? Check : ToggleLeft;
          return (
            <div key={label} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-soft)] p-3">
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-5 w-5 text-[color:var(--primary)]" />
                <StatusIcon className={`h-5 w-5 ${complete ? "text-[color:var(--success)]" : "text-[color:var(--muted)]"}`} />
              </div>
              <p className="mt-3 min-h-10 text-sm font-bold">{label}</p>
              <button className="btn-secondary mt-3 w-full px-3" type="button" onClick={() => onNavigate?.(page)}>
                {complete ? "View" : action}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
