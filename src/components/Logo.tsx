import { useId } from "react";

type LogoProps = {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { icon: "h-9 w-9", text: "text-sm", eyebrow: "text-[10px]" },
  md: { icon: "h-11 w-11", text: "text-base", eyebrow: "text-xs" },
  lg: { icon: "h-16 w-16", text: "text-3xl", eyebrow: "text-sm" },
};

function BudgetCommandMark({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const bgGradient = `bgGradient-${id}`;
  const lineGradient = `lineGradient-${id}`;
  const shadow = `shadow-${id}`;
  const clip = `clip-${id}`;

  return (
    <svg className={className} viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="BudgetCommand">
      <defs>
        <linearGradient id={bgGradient} x1="28" y1="16" x2="152" y2="164">
          <stop offset="0%" stopColor="#153F3A" />
          <stop offset="55%" stopColor="#082D2A" />
          <stop offset="100%" stopColor="#021615" />
        </linearGradient>

        <linearGradient id={lineGradient} x1="40" y1="116" x2="142" y2="70">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#C6F6D5" />
        </linearGradient>

        <filter id={shadow} x="-16%" y="-16%" width="132%" height="132%">
          <feDropShadow dx="0" dy="9" stdDeviation="9" floodColor="#020617" floodOpacity="0.25" />
        </filter>

        <clipPath id={clip}>
          <rect x="16" y="16" width="148" height="148" rx="34" />
        </clipPath>
      </defs>

      <rect x="16" y="16" width="148" height="148" rx="34" fill={`url(#${bgGradient})`} filter={`url(#${shadow})`} />
      <g clipPath={`url(#${clip})`}>
        <path d="M34 124 H146" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.14" />
        <path d="M34 96 H146" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.1" />
        <path d="M34 68 H146" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.08" />
        <path d="M55 144 V42" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.08" />
        <path d="M125 144 V42" stroke="#CCFBF1" strokeWidth="2" strokeLinecap="round" opacity="0.08" />

        <text
          x="90"
          y="128"
          textAnchor="middle"
          fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
          fontSize="108"
          fontWeight="900"
          letterSpacing="-5"
          fill="#F8FAFC"
        >
          B
        </text>

        <path d="M40 116 L65 99 L86 106 L111 79 L132 86 L145 66" fill="none" stroke="#021615" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
        <path d="M40 116 L65 99 L86 106 L111 79 L132 86 L145 66" fill="none" stroke={`url(#${lineGradient})`} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M145 66 L136 68 L142 76 Z" fill="#C6F6D5" stroke="#021615" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <rect x="16" y="16" width="148" height="148" rx="34" fill="none" stroke="#5EEAD4" strokeWidth="3" opacity="0.48" />
      <rect x="25" y="25" width="130" height="130" rx="27" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.1" />
    </svg>
  );
}

export default function Logo({
  className = "",
  iconClassName = "",
  textClassName = "",
  showText = true,
  showTagline = true,
  size = "md",
}: LogoProps) {
  const current = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="BudgetCommand">
      <BudgetCommandMark className={`${current.icon} shrink-0 ${iconClassName}`} />
      {showText && (
        <div className={`min-w-0 ${textClassName}`}>
          <p className={`${showTagline ? current.eyebrow : current.text} truncate font-black uppercase leading-none tracking-[0.12em] text-[color:var(--accent)]`}>
            BudgetCommand
          </p>
          {showTagline && <p className={`${current.text} truncate font-black leading-tight text-[color:var(--text)]`}>Money Command Center</p>}
        </div>
      )}
    </div>
  );
}
