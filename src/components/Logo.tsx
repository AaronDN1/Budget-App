import { useId } from "react";

type LogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { icon: "h-9 w-9", text: "text-base", eyebrow: "text-[10px]" },
  md: { icon: "h-11 w-11", text: "text-lg", eyebrow: "text-xs" },
  lg: { icon: "h-16 w-16", text: "text-3xl", eyebrow: "text-sm" },
};

function BudgetCommandMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const bgGradient = `bgGradient-${id}`;
  const markGradient = `markGradient-${id}`;
  const softGlow = `softGlow-${id}`;
  const shadow = `shadow-${id}`;

  return (
    <svg className={className} viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BudgetCommand">
      <defs>
        <linearGradient id={bgGradient} x1="20" y1="20" x2="160" y2="160">
          <stop offset="0%" stopColor="#153F38" />
          <stop offset="55%" stopColor="#0B2F2B" />
          <stop offset="100%" stopColor="#061F1D" />
        </linearGradient>

        <linearGradient id={markGradient} x1="48" y1="38" x2="128" y2="145">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#CFFFF5" />
          <stop offset="100%" stopColor="#39E6CB" />
        </linearGradient>

        <filter id={softGlow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={shadow} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.24" />
        </filter>
      </defs>

      <rect x="16" y="16" width="148" height="148" rx="34" fill={`url(#${bgGradient})`} filter={`url(#${shadow})`} />
      <rect x="24" y="24" width="132" height="132" rx="28" fill="none" stroke="#36E6C8" strokeWidth="3" opacity="0.55" />
      <rect x="30" y="30" width="120" height="120" rx="24" fill="none" stroke="#77FFE8" strokeWidth="2" opacity="0.18" />

      <g transform="translate(-5 0)">
        <path
          d="M66 42 C66 38, 69 35, 73 35 H94 C114 35, 127 47, 127 63 C127 75, 120 83, 109 88 C123 92, 132 103, 132 117 C132 136, 117 148, 93 148 H73 C69 148, 66 145, 66 141 Z"
          fill={`url(#${markGradient})`}
          filter={`url(#${softGlow})`}
        />
        <path d="M81 52 H94 C104 52, 110 58, 110 67 C110 75, 104 81, 94 81 H81 Z" fill="#0B2F2B" opacity="0.96" />
        <path d="M81 99 H97 C108 99, 115 106, 115 116 C115 126, 108 132, 97 132 H81 Z" fill="#0B2F2B" opacity="0.96" />
        <path
          d="M49 116 L65 101 L80 112 L101 90 L117 101 L136 81"
          fill="none"
          stroke="#37E6C8"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
        <circle cx="129" cy="63" r="7" fill="#9FFFF0" opacity="0.9" />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  showText = true,
  size = "md",
}: LogoProps) {
  const current = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="BudgetCommand">
      <BudgetCommandMark className={`${current.icon} shrink-0 ${iconClassName}`} />
      {showText && (
        <div className={`min-w-0 ${textClassName}`}>
          <p className={`${current.eyebrow} font-black uppercase tracking-[0.18em] text-[color:var(--accent)]`}>BudgetCommand</p>
          <p className={`${current.text} truncate font-black text-[color:var(--text)]`}>Money Command Center</p>
        </div>
      )}
    </div>
  );
}
