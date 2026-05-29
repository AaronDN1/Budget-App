import PaycheckPlannerPanel from "../components/PaycheckPlanner";
import { AppData, CoreFundName } from "../types";

interface PaycheckPlannerPageProps {
  data: AppData;
  allocationPercentages: Record<CoreFundName, number>;
}

export default function PaycheckPlanner({ data, allocationPercentages }: PaycheckPlannerPageProps) {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Paycheck Planner</p>
        <h2 className="mt-1 text-3xl font-black">Plan the next deposit</h2>
      </header>

      <PaycheckPlannerPanel
        allocationPercentages={allocationPercentages}
        budgetMode={data.settings.budgetMode}
        currencySymbol={data.settings.currencySymbol}
        funds={data.funds}
      />
    </div>
  );
}
