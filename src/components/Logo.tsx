interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { box: "h-9 w-9", text: "text-base", sub: "text-[10px]" },
  md: { box: "h-11 w-11", text: "text-lg", sub: "text-xs" },
  lg: { box: "h-16 w-16", text: "text-3xl", sub: "text-sm" },
};

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const current = sizes[size];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${current.box} relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-[linear-gradient(135deg,#071827,#0f3f46_55%,#10b981)] shadow-[0_14px_35px_rgba(16,185,129,0.20)]`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,0.30),transparent_28%)]" />
        <svg className="absolute inset-1 h-auto w-auto text-emerald-200 opacity-95" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M13 39c7 11 23 13 32 4 5-5 8-11 8-18" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M13 22h38" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
          <path d="M13 30h21" fill="none" stroke="#67e8f9" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
        </svg>
        <span className="relative mt-3 text-sm font-black tracking-tight text-white">BC</span>
      </div>
      {showText && (
        <div className="min-w-0">
          <p className={`${current.sub} font-black uppercase tracking-[0.18em] text-[color:var(--accent)]`}>BudgetCommand</p>
          <p className={`${current.text} truncate font-black text-[color:var(--text)]`}>Command Center</p>
        </div>
      )}
    </div>
  );
}
