import { FormEvent, useState } from "react";
import { Fund, FundContribution } from "../types";
import { formatCurrency, uid } from "../utils/formatters";
import ProgressBar from "./ProgressBar";

interface FundCardProps {
  fund: Fund;
  recommended?: number;
  allocationPercent?: number;
  currencySymbol: string;
  onUpdate: (fund: Fund, previousName: string) => void;
  onDelete?: (fundName: string) => void;
  isCore: boolean;
}

export default function FundCard({ fund, recommended = 0, allocationPercent = 0, currencySymbol, onUpdate, onDelete, isCore }: FundCardProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [name, setName] = useState(fund.name);
  const [description, setDescription] = useState(fund.description);
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
    }, fund.name);
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
    const nextName = isCore ? fund.name : name.trim();
    if (!nextName) return;
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
      name: nextName,
      description: description.trim(),
      balance: nextBalance,
      goalAmount: nextGoal,
      history: (nextBalance !== fund.balance ? [entry, ...fund.history] : fund.history).map((item) => ({ ...item, fundName: nextName })),
    }, fund.name);
  };

  return (
    <article className="panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">{fund.name}</h3>
          <p className="mt-1 max-w-xl text-sm text-[color:var(--muted)]">{fund.description}</p>
          {!isCore && <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Custom fund</p>}
        </div>
        <div className="rounded-lg bg-[color:var(--accent-soft)] px-3 py-2 text-right">
          <p className="text-xs font-semibold text-[color:var(--primary)]">{allocationPercent}% allocation</p>
          <p className="font-bold text-[color:var(--text)]">{formatCurrency(recommended, currencySymbol)}</p>
        </div>
      </div>

      {!isCore && (
        <p className="mt-3 rounded-lg border border-dashed border-[color:var(--border)] p-3 text-sm text-[color:var(--muted)]">
          Custom funds are tracked separately and are not included in preset budget mode allocations.
        </p>
      )}

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
          <p className="mt-1 text-xs text-[color:var(--muted)]">{Math.min(100, progress).toFixed(1)}% funded</p>
        </div>
      )}

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} disabled={isCore} aria-label={`${fund.name} name`} />
        <input className="field md:col-span-3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" aria-label={`${fund.name} description`} />
        <input className="field" type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} aria-label={`${fund.name} balance`} />
        <input className="field" type="number" step="0.01" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal amount" aria-label={`${fund.name} goal`} />
        <button className="btn-secondary md:col-span-2" type="button" onClick={saveDetails}>Save Fund Details</button>
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
          <p className="mt-3 rounded-lg border border-dashed border-[color:var(--border)] p-4 text-sm text-[color:var(--muted)]">No contributions recorded yet.</p>
        ) : (
          <div className="mt-3 max-h-40 space-y-2 overflow-auto">
            {fund.history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-lg bg-[color:var(--bg-soft)] px-3 py-2 text-sm">
                <span className="font-medium capitalize">{entry.type.replace("-", " ")}</span>
                <span className={entry.type === "withdrawal" ? "font-bold text-[color:var(--danger)]" : "font-bold text-[color:var(--success)]"}>
                  {entry.type === "withdrawal" ? "-" : "+"}{formatCurrency(Math.abs(entry.amount), currencySymbol)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isCore && onDelete && (
        <button className="btn-danger mt-5" type="button" onClick={() => onDelete(fund.name)}>
          Delete Custom Fund
        </button>
      )}
    </article>
  );
}
