import { FormEvent, useState } from "react";
import { Fund, FundContribution } from "../types";
import { formatCurrency, uid } from "../utils/formatters";
import ProgressBar from "./ProgressBar";

interface FundCardProps {
  fund: Fund;
  recommended: number;
  allocationPercent: number;
  currencySymbol: string;
  onUpdate: (fund: Fund) => void;
}

export default function FundCard({ fund, recommended, allocationPercent, currencySymbol, onUpdate }: FundCardProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState(String(fund.balance));
  const [goal, setGoal] = useState(fund.goalAmount ? String(fund.goalAmount) : "");
  const progress = fund.goalAmount ? (fund.balance / fund.goalAmount) * 100 : 0;

  const addHistory = (type: FundContribution["type"], value: number, newBalance: number) => {
    const entry: FundContribution = {
      id: uid(),
      fundName: fund.name,
      amount: value,
      type,
      date: new Date().toISOString(),
      note,
    };
    onUpdate({
      ...fund,
      balance: newBalance,
      totalContributed: type === "contribution" ? fund.totalContributed + value : fund.totalContributed,
      history: [entry, ...fund.history],
    });
    setAmount("");
    setNote("");
  };

  const contribute = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    addHistory("contribution", value, fund.balance + value);
  };

  const withdraw = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    addHistory("withdrawal", value, fund.balance - value);
  };

  const saveDetails = () => {
    const nextBalance = Number(balance);
    const nextGoal = goal === "" ? undefined : Number(goal);
    if (!Number.isFinite(nextBalance) || (nextGoal !== undefined && (!Number.isFinite(nextGoal) || nextGoal < 0))) return;
    const entry: FundContribution = {
      id: uid(),
      fundName: fund.name,
      amount: nextBalance - fund.balance,
      type: "balance-edit",
      date: new Date().toISOString(),
      note: "Manual balance update",
    };
    onUpdate({
      ...fund,
      balance: nextBalance,
      goalAmount: nextGoal,
      history: nextBalance !== fund.balance ? [entry, ...fund.history] : fund.history,
    });
  };

  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">{fund.name}</h3>
          <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">{fund.description}</p>
        </div>
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-right dark:bg-blue-950">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">{allocationPercent}% allocation</p>
          <p className="font-bold text-blue-900 dark:text-blue-100">{formatCurrency(recommended, currencySymbol)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="label">Current Balance</p>
          <p className="mt-1 text-xl font-black">{formatCurrency(fund.balance, currencySymbol)}</p>
        </div>
        <div>
          <p className="label">Total Contributed</p>
          <p className="mt-1 text-xl font-black">{formatCurrency(fund.totalContributed, currencySymbol)}</p>
        </div>
        <div>
          <p className="label">Goal</p>
          <p className="mt-1 text-xl font-black">{fund.goalAmount ? formatCurrency(fund.goalAmount, currencySymbol) : "No goal"}</p>
        </div>
      </div>

      {fund.goalAmount && (
        <div className="mt-4">
          <ProgressBar value={progress} tone="green" />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{Math.min(100, progress).toFixed(1)}% funded</p>
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <input className="field" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} aria-label={`${fund.name} balance`} />
        <input className="field" type="number" step="0.01" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal amount" aria-label={`${fund.name} goal`} />
        <button className="btn-secondary md:col-span-2" type="button" onClick={saveDetails}>Save Balance and Goal</button>
      </div>

      <form className="mt-4 grid gap-3 md:grid-cols-5" onSubmit={contribute}>
        <input className="field" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
        <input className="field md:col-span-2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" />
        <button className="btn-primary" type="submit">Add</button>
        <button className="btn-secondary" type="button" onClick={withdraw}>Withdraw</button>
      </form>

      <div className="mt-5">
        <p className="label">Contribution History</p>
        {fund.history.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No contributions recorded yet.</p>
        ) : (
          <div className="mt-3 max-h-40 space-y-2 overflow-auto">
            {fund.history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
                <span className="font-medium capitalize">{entry.type.replace("-", " ")}</span>
                <span className={entry.type === "withdrawal" ? "font-bold text-red-600" : "font-bold text-emerald-600"}>
                  {entry.type === "withdrawal" ? "-" : "+"}{formatCurrency(Math.abs(entry.amount), currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
