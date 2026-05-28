import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import { EXPENSE_CATEGORIES } from "../data/defaultCategories";
import { AppData, Expense, ExpenseType } from "../types";
import { calculateMonthlyExpenseTotal } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

interface ExpensesProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
}

export default function Expenses({ data, setData }: ExpensesProps) {
  const [editing, setEditing] = useState<Expense | null>(null);
  const [category, setCategory] = useState("All");
  const [type, setType] = useState<ExpenseType | "All">("All");
  const currency = data.settings.currencySymbol;
  const filtered = useMemo(
    () => data.expenses.filter((expense) => (category === "All" || expense.category === category) && (type === "All" || expense.type === type)),
    [data.expenses, category, type],
  );

  const saveExpense = (expense: Expense) => {
    setData((current) => ({
      ...current,
      expenses: current.expenses.some((item) => item.id === expense.id)
        ? current.expenses.map((item) => (item.id === expense.id ? expense : item))
        : [expense, ...current.expenses],
    }));
    setEditing(null);
  };

  const deleteExpense = (id: string) => setData((current) => ({ ...current, expenses: current.expenses.filter((item) => item.id !== id) }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Expenses</p>
        <h2 className="mt-1 text-3xl font-black">Monthly expenses: {formatCurrency(calculateMonthlyExpenseTotal(data.expenses), currency)}</h2>
      </header>
      <ExpenseForm editing={editing} onSave={saveExpense} onCancel={() => setEditing(null)} />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel p-4"><p className="label">Fixed</p><p className="text-2xl font-black">{formatCurrency(calculateMonthlyExpenseTotal(data.expenses, "fixed"), currency)}</p></div>
        <div className="panel p-4"><p className="label">Variable</p><p className="text-2xl font-black">{formatCurrency(calculateMonthlyExpenseTotal(data.expenses, "variable"), currency)}</p></div>
        <div className="panel p-4"><p className="label">All Expenses</p><p className="text-2xl font-black">{formatCurrency(calculateMonthlyExpenseTotal(data.expenses), currency)}</p></div>
      </div>
      <section className="panel p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            {EXPENSE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={type} onChange={(e) => setType(e.target.value as ExpenseType | "All")}>
            <option>All</option><option value="fixed">fixed</option><option value="variable">variable</option>
          </select>
        </div>
        {filtered.length === 0 ? (
          <p className="mt-5 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No expenses added yet.</p>
        ) : (
          <div className="mt-5 grid gap-3">
            {filtered.map((expense) => (
              <div key={expense.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="font-bold">{expense.name}</p>
                  <p className="text-sm text-slate-500">{expense.category} | {expense.type} | {expense.recurring ? "recurring" : "one-time"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="mr-2 text-lg font-black">{formatCurrency(expense.amount, currency)}</p>
                  <button className="btn-secondary px-3" type="button" onClick={() => setEditing(expense)}><Pencil className="h-4 w-4" /></button>
                  <button className="btn-danger px-3" type="button" onClick={() => deleteExpense(expense.id)}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
