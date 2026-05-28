import { Download, RotateCcw, Save, Upload } from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { BUDGET_MODES } from "../data/defaultBudgetModes";
import { AppData, BudgetModeName, CustomAllocation, FundName } from "../types";
import { generateMonthlySnapshot } from "../utils/calculations";
import { exportData, importData, resetData } from "../utils/storage";

interface SettingsProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
  replaceData: (data: AppData) => void;
}

const fundOrder: FundName[] = ["Savings", "Real Estate", "Retirement", "Stocks", "Travel", "Fun Fund"];

export default function Settings({ data, setData, replaceData }: SettingsProps) {
  const [custom, setCustom] = useState<CustomAllocation>(data.settings.customAllocation);
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const customTotal = useMemo(() => Object.values(custom).reduce((sum, value) => sum + Number(value || 0), 0), [custom]);
  const customValid = Math.abs(customTotal - 100) < 0.001;

  const updateSetting = <K extends keyof AppData["settings"]>(key: K, value: AppData["settings"][K]) => {
    setData((current) => ({ ...current, settings: { ...current.settings, [key]: value } }));
  };

  const applyCustom = () => {
    if (!customValid) {
      setMessage("Custom percentages must add up to exactly 100% before they can be applied.");
      return;
    }
    setData((current) => ({ ...current, settings: { ...current.settings, customAllocation: custom, budgetMode: "Custom" } }));
    setMessage("Custom allocation applied.");
  };

  const downloadData = () => {
    const blob = exportData(data);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "budget-command-center-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const uploadData = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      replaceData(await importData(file));
      setMessage("Data imported successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  const snapshot = () => {
    setData((current) => ({ ...current, monthlySnapshots: [generateMonthlySnapshot(current), ...current.monthlySnapshots].slice(0, 36) }));
    setMessage("Monthly snapshot saved.");
  };

  const reset = () => {
    if (!window.confirm("Reset all budget data? This cannot be undone.")) return;
    replaceData(resetData());
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Settings</p>
        <h2 className="mt-1 text-3xl font-black">Tune the system</h2>
      </header>

      <section className="panel p-5">
        <h3 className="text-lg font-bold">Budget mode</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {BUDGET_MODES.map((mode) => (
            <button
              key={mode.name}
              className={`rounded-lg border px-4 py-3 text-left transition ${
                data.settings.budgetMode === mode.name
                  ? "border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                  : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
              }`}
              type="button"
              onClick={() => updateSetting("budgetMode", mode.name as BudgetModeName)}
            >
              <span className="font-bold">{mode.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Custom allocation</h3>
          <span className={`text-sm font-bold ${customValid ? "text-emerald-600" : "text-red-600"}`}>Total: {customTotal}%</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {fundOrder.map((fund) => (
            <label key={fund}>
              <span className="label">{fund}</span>
              <input className="field mt-1" type="number" min="0" max="100" step="1" value={custom[fund]} onChange={(e) => setCustom({ ...custom, [fund]: Number(e.target.value) })} />
            </label>
          ))}
        </div>
        {!customValid && <p className="mt-3 text-sm font-semibold text-red-600">Custom percentages must add up to exactly 100%.</p>}
        <button className="btn-primary mt-4" type="button" onClick={applyCustom}><Save className="h-4 w-4" /> Apply Custom Allocation</button>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-bold">Preferences</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label>
            <span className="label">Theme</span>
            <select className="field mt-1" value={data.settings.theme} onChange={(e) => updateSetting("theme", e.target.value as "light" | "dark")}>
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </label>
          <label>
            <span className="label">Currency Symbol</span>
            <input className="field mt-1" value={data.settings.currencySymbol} maxLength={4} onChange={(e) => updateSetting("currencySymbol", e.target.value || "$")} />
          </label>
          <label>
            <span className="label">Budget Month Start Day</span>
            <input className="field mt-1" type="number" min="1" max="31" value={data.settings.budgetMonthStartDay} onChange={(e) => updateSetting("budgetMonthStartDay", Math.min(31, Math.max(1, Number(e.target.value))))} />
          </label>
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-bold">Data</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-secondary" type="button" onClick={snapshot}>Save Monthly Snapshot</button>
          <button className="btn-secondary" type="button" onClick={downloadData}><Download className="h-4 w-4" /> Export JSON</button>
          <button className="btn-secondary" type="button" onClick={() => importRef.current?.click()}><Upload className="h-4 w-4" /> Import JSON</button>
          <button className="btn-danger" type="button" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset All Data</button>
          <input ref={importRef} className="hidden" type="file" accept="application/json" onChange={uploadData} />
        </div>
        {message && <p className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-300">{message}</p>}
      </section>
    </div>
  );
}
