import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  empty?: boolean;
}

export default function ChartCard({ title, children, empty }: ChartCardProps) {
  return (
    <section className="panel p-5">
      <h2 className="text-base font-bold">{title}</h2>
      <div className="mt-4 h-64 sm:h-72">
        {empty ? (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-[color:var(--border)] text-sm text-[color:var(--muted)]">
            No chart data available yet.
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
