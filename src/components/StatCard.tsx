import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "red" | "slate";
}

const toneClasses = {
  blue: "bg-[color:var(--accent-soft)] text-[color:var(--primary)]",
  green: "bg-[color:var(--accent-soft)] text-[color:var(--success)]",
  red: "bg-[color:var(--bg-soft)] text-[color:var(--danger)]",
  slate: "bg-[color:var(--bg-soft)] text-[color:var(--muted)]",
};

export default function StatCard({ title, value, detail, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--muted)]">{title}</p>
          <p className="mt-2 break-words text-xl font-bold sm:text-2xl">{value}</p>
          {detail && <p className="mt-1 text-xs text-[color:var(--muted)]">{detail}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
