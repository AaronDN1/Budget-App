import { getBudgetHealthLabel } from "../utils/calculations";
import ProgressBar from "./ProgressBar";

export default function BudgetHealthScore({ score }: { score: number }) {
  const label = getBudgetHealthLabel(score);
  const tone = score >= 75 ? "green" : score >= 40 ? "blue" : "red";
  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Budget Health</p>
          <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{score}/100</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {label}
        </span>
      </div>
      <div className="mt-4">
        <ProgressBar value={score} tone={tone} />
      </div>
    </div>
  );
}
