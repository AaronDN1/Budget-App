import { FormEvent, useEffect, useState } from "react";
import { SUBSCRIPTION_CATEGORIES } from "../data/defaultCategories";
import { Subscription, SubscriptionCycle } from "../types";
import { monthKey, uid } from "../utils/formatters";

interface SubscriptionFormProps {
  editing?: Subscription | null;
  onSave: (subscription: Subscription) => void;
  onCancel?: () => void;
}

const cycles: SubscriptionCycle[] = ["weekly", "monthly", "yearly", "one-time"];

const blankSubscription = (): Subscription => ({
  id: uid(),
  name: "",
  cost: 0,
  billingCycle: "monthly",
  billingDate: "",
  category: SUBSCRIPTION_CATEGORIES[0],
  essential: false,
  active: true,
  notes: "",
  month: monthKey(),
});

export default function SubscriptionForm({ editing, onSave, onCancel }: SubscriptionFormProps) {
  const [form, setForm] = useState<Subscription>(editing || blankSubscription());
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editing || blankSubscription());
    setError("");
  }, [editing]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Subscription name is required.");
    if (!Number.isFinite(form.cost) || form.cost <= 0) return setError("Enter a valid positive cost.");
    onSave({ ...form, name: form.name.trim(), month: form.billingCycle === "one-time" ? form.month || monthKey() : undefined });
    if (!editing) setForm(blankSubscription());
    setError("");
  };

  return (
    <form className="panel p-5" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="md:col-span-2">
          <span className="label">Subscription</span>
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Netflix, iCloud, gym app" />
        </label>
        <label>
          <span className="label">Cost</span>
          <input className="field mt-1" type="number" min="0" step="0.01" value={form.cost || ""} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
        </label>
        <label>
          <span className="label">Cycle</span>
          <select className="field mt-1" value={form.billingCycle} onChange={(e) => setForm({ ...form, billingCycle: e.target.value as SubscriptionCycle })}>
            {cycles.map((cycle) => <option key={cycle}>{cycle}</option>)}
          </select>
        </label>
        <label>
          <span className="label">Billing Date</span>
          <input className="field mt-1" type="date" value={form.billingDate} onChange={(e) => setForm({ ...form, billingDate: e.target.value })} />
        </label>
        <label>
          <span className="label">Category</span>
          <select className="field mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {SUBSCRIPTION_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="md:col-span-2">
          <span className="label">Notes</span>
          <input className="field mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
        </label>
        <label>
          <span className="label">Month</span>
          <input className="field mt-1" type="month" value={form.month || monthKey()} disabled={form.billingCycle !== "one-time"} onChange={(e) => setForm({ ...form, month: e.target.value })} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.essential} onChange={(e) => setForm({ ...form, essential: e.target.checked })} />
          Essential
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          Active
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">{editing ? "Save Subscription" : "Add Subscription"}</button>
        {editing && onCancel && <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
