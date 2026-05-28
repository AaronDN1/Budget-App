import { FormEvent, useEffect, useState } from "react";
import { EXPENSE_CATEGORIES } from "../data/defaultCategories";
import { Expense, ExpenseType } from "../types";
import { monthKey, uid } from "../utils/formatters";

interface ExpenseFormProps {
  editing?: Expense | null;
  onSave: (expense: Expense) => void;
  onCancel?: () => void;
}

const blankExpense = (): Expense => ({
  id: uid(),
  name: "",
  amount: 0,
  category: EXPENSE_CATEGORIES[0],
  type: "fixed",
  dueDate: "",
  recurring: true,
  notes: "",
  month: monthKey(),
});

export default function ExpenseForm({ editing, onSave, onCancel }: ExpenseFormProps) {
  const [form, setForm] = useState<Expense>(editing || blankExpense());
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(editing || blankExpense());
    setError("");
  }, [editing]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Expense name is required.");
    if (!Number.isFinite(form.amount) || form.amount <= 0) return setError("Enter a valid positive amount.");
    onSave({ ...form, name: form.name.trim(), month: form.recurring ? undefined : form.month || monthKey() });
    if (!editing) setForm(blankExpense());
    setError("");
  };

  return (
    <form className="panel p-5" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <label className="md:col-span-2">
          <span className="label">Expense</span>
          <input className="field mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rent, groceries, gym" />
        </label>
        <label>
          <span className="label">Amount</span>
          <input className="field mt-1" type="number" min="0" step="0.01" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
        </label>
        <label>
          <span className="label">Category</span>
          <select className="field mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {EXPENSE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label>
          <span className="label">Type</span>
          <select className="field mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ExpenseType })}>
            <option value="fixed">fixed</option>
            <option value="variable">variable</option>
          </select>
        </label>
        <label>
          <span className="label">Due Date</span>
          <input className="field mt-1" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className="label">Notes</span>
          <input className="field mt-1" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional" />
        </label>
        <label>
          <span className="label">Month</span>
          <input className="field mt-1" type="month" value={form.month || monthKey()} disabled={form.recurring} onChange={(e) => setForm({ ...form, month: e.target.value })} />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
          Recurring
        </label>
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="btn-primary" type="submit">{editing ? "Save Expense" : "Add Expense"}</button>
        {editing && onCancel && <button className="btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
