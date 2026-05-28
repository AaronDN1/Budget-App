interface ProgressBarProps {
  value: number;
  tone?: "blue" | "green" | "red";
}

const tones = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
};

export default function ProgressBar({ value, tone = "blue" }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div className={`h-full rounded-full ${tones[tone]}`} style={{ width: `${safeValue}%` }} />
    </div>
  );
}
