import { Download, RotateCcw, Save, Upload } from "lucide-react";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { BUDGET_MODES, CORE_FUND_NAMES } from "../data/defaultBudgetModes";
import { normalizeTheme, ThemeId } from "../data/themes";
import { AppData, BudgetModeName, CustomAllocation, MonthlySnapshot } from "../types";
import { generateMonthlySnapshot } from "../utils/calculations";
import ThemeSelector from "../components/ThemeSelector";

interface SettingsProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
  replaceData: (data: AppData) => void;
  userEmail?: string;
  signOut: () => Promise<void>;
  exportCloudData: () => Blob;
  importCloudData: (file: File) => Promise<void>;
  resetCloudData: () => Promise<void>;
  saveMonthlySnapshot: (snapshot: MonthlySnapshot) => Promise<void>;
}

export default function Settings({ data, setData, userEmail, signOut, exportCloudData, importCloudData, resetCloudData, saveMonthlySnapshot }: SettingsProps) {
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
    setData((current) => ({ ...current, settings: { ...current.settings, customAllocation: custom, budgetMode: "Custom", hasChosenBudgetMode: true } }));
    setMessage("Custom allocation applied.");
  };

  const chooseBudgetMode = (mode: BudgetModeName) => {
    setData((current) => ({ ...current, settings: { ...current.settings, budgetMode: mode, hasChosenBudgetMode: true } }));
  };

  const downloadData = () => {
    const blob = exportCloudData();
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
    if (!window.confirm("Restoring a backup will replace your current BudgetCommand data. Continue?")) {
      event.target.value = "";
      return;
    }
    try {
      await importCloudData(file);
      setMessage("Backup restored successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import failed.");
    } finally {
      event.target.value = "";
    }
  };

  const snapshot = async () => {
    const nextSnapshot = generateMonthlySnapshot(data);
    if (data.monthlySnapshots.some((item) => item.month === nextSnapshot.month) && !window.confirm("A snapshot for this month already exists. Save another one?")) return;
    try {
      await saveMonthlySnapshot(nextSnapshot);
      setMessage("This month's progress was saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save this month's progress.");
    }
  };

  const reset = async () => {
    if (!window.confirm("Reset Account Data? This will permanently erase your BudgetCommand data. Continue?")) return;
    await resetCloudData();
    setMessage("Account data reset.");
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-[color:var(--primary)]">Settings</p>
        <h2 className="mt-1 text-3xl font-black">Tune the system</h2>
      </header>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Cloud account</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{userEmail || "Signed in"}</p>
          </div>
          <button className="btn-secondary" type="button" onClick={signOut}>Sign Out</button>
        </div>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-bold">Budget mode</h3>
        {!data.settings.hasChosenBudgetMode && (
          <p className="mt-1 text-sm text-[color:var(--muted)]">Choose how BudgetCommand should route your available money.</p>
        )}
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {BUDGET_MODES.map((mode) => (
            <button
              key={mode.name}
              className={`rounded-lg border px-4 py-3 text-left transition ${
                data.settings.budgetMode === mode.name
                  ? "border-[color:var(--primary)] bg-[color:var(--accent-soft)] text-[color:var(--text)]"
                  : "border-[color:var(--border)] hover:bg-[color:var(--card-hover)]"
              }`}
              type="button"
              onClick={() => chooseBudgetMode(mode.name as BudgetModeName)}
            >
              <span className="font-bold">{mode.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Custom allocation</h3>
          <span className={`text-sm font-bold ${customValid ? "text-[color:var(--success)]" : "text-[color:var(--danger)]"}`}>Total: {customTotal}%</span>
        </div>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Custom allocation controls the six core funds. User-created funds are tracked separately for now.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CORE_FUND_NAMES.map((fund) => (
            <label key={fund}>
              <span className="label">{fund}</span>
              <input className="field mt-1" type="number" min="0" max="100" step="1" value={custom[fund]} onChange={(e) => setCustom({ ...custom, [fund]: Number(e.target.value) })} />
            </label>
          ))}
        </div>
        {!customValid && <p className="mt-3 text-sm font-semibold text-[color:var(--danger)]">Custom percentages must add up to exactly 100%.</p>}
        <button className="btn-primary mt-4" type="button" onClick={applyCustom}><Save className="h-4 w-4" /> Apply Custom Allocation</button>
      </section>

      <section className="panel p-5">
        <h3 className="text-lg font-bold">Preferences</h3>
        <div className="mt-4">
          <ThemeSelector value={normalizeTheme(data.settings.theme)} onChange={(theme: ThemeId) => updateSetting("theme", theme)} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
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
        <p className="mt-1 text-sm text-[color:var(--muted)]">Back up your BudgetCommand data, restore a backup, or save this month&apos;s progress for reports.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-secondary" type="button" onClick={snapshot}>Save This Month&apos;s Progress</button>
          <button className="btn-secondary" type="button" onClick={downloadData}><Download className="h-4 w-4" /> Download Backup</button>
          <button className="btn-secondary" type="button" onClick={() => importRef.current?.click()}><Upload className="h-4 w-4" /> Restore From Backup</button>
          <button className="btn-danger" type="button" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset Account Data</button>
          <input ref={importRef} className="hidden" type="file" accept="application/json" onChange={uploadData} />
        </div>
        {message && <p className="mt-3 text-sm font-semibold text-[color:var(--primary)]">{message}</p>}
      </section>
    </div>
  );
}
