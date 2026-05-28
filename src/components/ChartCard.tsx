import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  empty?: boolean;
}

export default function ChartCard({ title, children, empty }: ChartCardProps) {
  return (
    <section className="panel p-5">
      <h2 className="text-base font-bold text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 h-64 sm:h-72">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No chart data available yet.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
