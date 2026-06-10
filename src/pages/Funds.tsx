import FundCard from "../components/FundCard";
import { isCoreFund } from "../data/defaultBudgetModes";
import { AppData, CoreFundName, Fund } from "../types";
import { useEffect, useState } from "react";

interface FundsProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
  allocations: Record<CoreFundName, number>;
  allocationPercentages: Record<CoreFundName, number>;
}

export default function Funds({ data, setData, allocations, allocationPercentages }: FundsProps) {
  const [newFund, setNewFund] = useState({ name: "", description: "", balance: "", goalAmount: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (data.settings.hasReviewedFundAllocation) return;
    setData((current) => ({
      ...current,
      settings: {
        ...current.settings,
        hasReviewedFundAllocation: true,
      },
    }));
  }, [data.settings.hasReviewedFundAllocation, setData]);

  const updateFund = (fund: Fund, previousName: string) => {
    setData((current) => {
      const existing = current.funds.find((item) => item.name.toLowerCase() === fund.name.toLowerCase() && item.name !== previousName);
      if (existing) {
        setMessage("A fund with that name already exists.");
        return current;
      }
      setMessage("");
      return { ...current, funds: current.funds.map((item) => (item.name === previousName ? fund : item)) };
    });
  };

  const addFund = () => {
    const name = newFund.name.trim();
    if (!name) {
      setMessage("Fund name is required.");
      return;
    }
    if (data.funds.some((fund) => fund.name.toLowerCase() === name.toLowerCase())) {
      setMessage("A fund with that name already exists.");
      return;
    }
    const balance = Number(newFund.balance || 0);
    const goalAmount = newFund.goalAmount === "" ? undefined : Number(newFund.goalAmount);
    if (!Number.isFinite(balance) || (goalAmount !== undefined && (!Number.isFinite(goalAmount) || goalAmount < 0))) {
      setMessage("Use valid numbers for balance and goal.");
      return;
    }
    setData((current) => ({
      ...current,
      funds: [
        ...current.funds,
        {
          name,
          description: newFund.description.trim() || "Custom fund.",
          balance,
          goalAmount,
          totalContributed: 0,
          history: [],
        },
      ],
    }));
    setNewFund({ name: "", description: "", balance: "", goalAmount: "" });
    setMessage("Custom fund added.");
  };

  const deleteFund = (fundName: string) => {
    if (isCoreFund(fundName)) return;
    if (!window.confirm(`Delete ${fundName}? This will remove its balance and contribution history.`)) return;
    setData((current) => ({ ...current, funds: current.funds.filter((fund) => fund.name !== fundName) }));
    setMessage("Custom fund deleted.");
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Funds</p>
        <h2 className="mt-1 text-3xl font-black">Allocate with intention</h2>
      </header>
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold">Add a custom fund</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">Core funds follow budget mode allocations. Custom funds are tracked separately.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input className="field" value={newFund.name} onChange={(event) => setNewFund({ ...newFund, name: event.target.value })} placeholder="Fund name" />
          <input className="field md:col-span-3" value={newFund.description} onChange={(event) => setNewFund({ ...newFund, description: event.target.value })} placeholder="Description" />
          <input className="field" type="number" step="0.01" min="0" value={newFund.balance} onChange={(event) => setNewFund({ ...newFund, balance: event.target.value })} placeholder="Starting balance" />
          <input className="field" type="number" step="0.01" min="0" value={newFund.goalAmount} onChange={(event) => setNewFund({ ...newFund, goalAmount: event.target.value })} placeholder="Goal amount" />
          <button className="btn-primary md:col-span-2" type="button" onClick={addFund}>Add Fund</button>
        </div>
        {message && <p className="mt-3 text-sm font-semibold text-[color:var(--primary)]">{message}</p>}
      </section>
      <div className="grid gap-5">
        {data.funds.map((fund) => (
          <FundCard
            key={fund.name}
            fund={fund}
            recommended={isCoreFund(fund.name) ? allocations[fund.name] : 0}
            allocationPercent={isCoreFund(fund.name) ? allocationPercentages[fund.name] : 0}
            currencySymbol={data.settings.currencySymbol}
            onUpdate={updateFund}
            onDelete={deleteFund}
            isCore={isCoreFund(fund.name)}
          />
        ))}
      </div>
    </div>
  );
}
