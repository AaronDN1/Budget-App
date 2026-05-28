import FundCard from "../components/FundCard";
import { AppData, Fund, FundName } from "../types";

interface FundsProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
  allocations: Record<FundName, number>;
  allocationPercentages: Record<FundName, number>;
}

export default function Funds({ data, setData, allocations, allocationPercentages }: FundsProps) {
  const updateFund = (fund: Fund) => {
    setData((current) => ({ ...current, funds: current.funds.map((item) => (item.name === fund.name ? fund : item)) }));
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Funds</p>
        <h2 className="mt-1 text-3xl font-black">Allocate with intention</h2>
      </header>
      <div className="grid gap-5">
        {data.funds.map((fund) => (
          <FundCard
            key={fund.name}
            fund={fund}
            recommended={allocations[fund.name]}
            allocationPercent={allocationPercentages[fund.name]}
            currencySymbol={data.settings.currencySymbol}
            onUpdate={updateFund}
          />
        ))}
      </div>
    </div>
  );
}
