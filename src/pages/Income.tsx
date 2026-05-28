import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import IncomeForm from "../components/IncomeForm";
import { AppData, IncomeSource } from "../types";
import { calculateMonthlyIncome, incomeToMonthly } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";

interface IncomeProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
}

export default function Income({ data, setData }: IncomeProps) {
  const [editing, setEditing] = useState<IncomeSource | null>(null);
  const currency = data.settings.currencySymbol;

  const saveIncome = (income: IncomeSource) => {
    setData((current) => ({
      ...current,
      incomeSources: current.incomeSources.some((item) => item.id === income.id)
        ? current.incomeSources.map((item) => (item.id === income.id ? income : item))
        : [income, ...current.incomeSources],
    }));
    setEditing(null);
  };

  const deleteIncome = (id: string) => setData((current) => ({ ...current, incomeSources: current.incomeSources.filter((item) => item.id !== id) }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Income</p>
        <h2 className="mt-1 text-3xl font-black">Expected monthly income: {formatCurrency(calculateMonthlyIncome(data.incomeSources), currency)}</h2>
      </header>
      <IncomeForm editing={editing} onSave={saveIncome} onCancel={() => setEditing(null)} />
      <section className="panel overflow-hidden">
        {data.incomeSources.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">No income sources added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                <tr><th className="p-4">Source</th><th>Amount</th><th>Frequency</th><th>Monthly</th><th>Recurring</th><th className="text-right pr-4">Actions</th></tr>
              </thead>
              <tbody>
                {data.incomeSources.map((source) => (
                  <tr key={source.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="p-4 font-semibold">{source.name}</td>
                    <td>{formatCurrency(source.amount, currency)}</td>
                    <td className="capitalize">{source.frequency}</td>
                    <td className="font-bold">{formatCurrency(incomeToMonthly(source), currency)}</td>
                    <td>{source.recurring ? "Yes" : "No"}</td>
                    <td className="pr-4 text-right">
                      <button className="btn-secondary mr-2 px-3" type="button" onClick={() => setEditing(source)}><Pencil className="h-4 w-4" /></button>
                      <button className="btn-danger px-3" type="button" onClick={() => deleteIncome(source.id)}><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
