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

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="BudgetCommand logo">
      <defs>
        <linearGradient id="bc-mark-bg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#071827" />
          <stop offset="0.56" stopColor="#0b3a3f" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="15" fill="url(#bc-mark-bg)" />
      <rect x="11" y="11" width="42" height="42" rx="11" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />

      <path
        d="M22 19v26h11.5c5.2 0 8.5-2.8 8.5-7 0-3.2-2-5.3-5.2-6.1 2.5-.9 4.1-2.9 4.1-5.7 0-4.3-3.3-7.2-8.4-7.2H22Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
      <path d="M22 31h10.5" stroke="#ffffff" strokeWidth="4.2" strokeLinecap="round" />
      <path
        d="M47 23.5c-2.6-3.2-6.3-4.9-10.6-4.9-7.1 0-12.5 5.7-12.5 13.4s5.4 13.4 12.5 13.4c4.5 0 8.4-1.9 11-5.3"
        fill="none"
        stroke="#a7f3d0"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path d="M20 43c8.3-2.2 16.4-5.8 24-13" fill="none" stroke="#67e8f9" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M39.5 30h6v6" fill="none" stroke="#67e8f9" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const current = sizes[size];
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${current.box} shrink-0 drop-shadow-[0_14px_30px_rgba(15,118,110,0.22)]`}>
        <LogoMark className="h-full w-full" />
      </div>
      {showText && (
        <div className="min-w-0">
          <p className={`${current.sub} font-black uppercase tracking-[0.18em] text-[color:var(--accent)]`}>BudgetCommand</p>
          <p className={`${current.text} truncate font-black text-[color:var(--text)]`}>Money Command Center</p>
        </div>
      )}
    </div>
  );
}
