import { FormEvent, useEffect, useState } from "react";
import { IncomeSource, PayFrequency } from "../types";
import { monthKey, uid } from "../utils/formatters";

interface IncomeFormProps {
  editing?: IncomeSource | null;
  onSave: (income: IncomeSource) => void;
  onCancel?: () => void;
}

const frequencies: PayFrequency[] = ["weekly", "biweekly", "semi-monthly", "monthly", "yearly", "one-time"];

const blankIncome = (): IncomeSource => ({
  id: uid(),
  name: "",
  amount: 0,
  frequency: "monthly",
  recurring: true,
  month: monthKey(),
});

export default function IncomeForm({ editing, onSave, onCancel }: IncomeFormProps) {
  const [form, setForm] = useState<IncomeSource>(editing || blankIncome());
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editing || blankIncome());
    setError("");
  }, [editing]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Income source name is required.");
    if (!Number.isFinite(form.amount) || form.amount <= 0) return setError("Enter a valid positive amount.");
    onSave({ ...form, name: form.name.trim(), month: form.recurring ? undefined : form.month || monthKey() });
    if (!editing) setForm(blankIncome());
    setError("");
  };

  return (
    <form className="panel p-5" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="md:col-span-2">
          <span className="label">Source</span>
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Paycheck, bonus, side gig" />
        </label>
        <label>
          <span className="label">Amount</span>
          <input className="field mt-1" type="number" min="0" step="0.01" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
        </label>
        <label>
          <span className="label">Frequency</span>
          <select className="field mt-1" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value as PayFrequency, recurring: e.target.value !== "one-time" ? form.recurring : false })}>
            {frequencies.map((frequency) => (
              <option key={frequency} value={frequency}>{frequency}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Month</span>
          <input className="field mt-1" type="month" value={form.month || monthKey()} disabled={form.recurring} onChange={(e) => setForm({ ...form, month: e.target.value })} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.recurring} disabled={form.frequency === "one-time"} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
          Recurring
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">{editing ? "Save Income" : "Add Income"}</button>
        {editing && onCancel && <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
