interface PiggyBankHeroGraphicProps {
  className?: string;
  animated?: boolean;
}

export default function PiggyBankHeroGraphic({ className = "", animated = true }: PiggyBankHeroGraphicProps) {
  return (
    <div className={`relative mx-auto w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-[24rem] ${className}`} aria-hidden="true">
      <svg className="h-auto w-full" viewBox="0 0 520 420" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Piggy bank">
        <defs>
          <linearGradient id="piggy-body" x1="120" y1="130" x2="390" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="color-mix(in srgb, var(--card-hover) 52%, #f59ab3)" />
            <stop offset="0.58" stopColor="color-mix(in srgb, var(--bg-soft) 34%, #f59ab3)" />
            <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 14%, #e97898)" />
          </linearGradient>
          <linearGradient id="piggy-leg" x1="165" y1="285" x2="356" y2="352" gradientUnits="userSpaceOnUse">
            <stop stopColor="color-mix(in srgb, var(--primary) 12%, #eb789a)" />
            <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 20%, #da688a)" />
          </linearGradient>
          <linearGradient id="piggy-coin" x1="214" y1="26" x2="306" y2="118" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffe88a" />
            <stop offset="0.48" stopColor="#ffd54a" />
            <stop offset="1" stopColor="#f2aa13" />
          </linearGradient>
        </defs>

        <ellipse cx="265" cy="350" rx="145" ry="16" fill="#020617" opacity="0.08" />

        <g className={animated ? "coin-drop" : undefined}>
          <circle cx="260" cy="72" r="46" fill="url(#piggy-coin)" />
          <circle cx="260" cy="72" r="35" fill="#ffc928" opacity="0.68" />
          <path
            d="M238 57 C248 44, 274 44, 286 59"
            fill="none"
            stroke="#fff4b8"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.82}
          />
        </g>

        <rect x="315" y="285" width="42" height="60" rx="8" fill="url(#piggy-leg)" />
        <rect x="315" y="336" width="42" height="16" rx="6" fill="color-mix(in srgb, var(--primary) 22%, #da688a)" />
        <rect x="165" y="285" width="42" height="60" rx="8" fill="url(#piggy-leg)" />
        <rect x="165" y="336" width="42" height="16" rx="6" fill="color-mix(in srgb, var(--primary) 22%, #da688a)" />

        <path
          d="M402 214 C420 206, 430 193, 428 181 C426 171, 415 169, 410 176 C405 183, 409 191, 418 193"
          fill="none"
          stroke="color-mix(in srgb, var(--primary) 12%, #f39bb4)"
          strokeWidth={12}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <ellipse cx="255" cy="225" rx="145" ry="95" fill="url(#piggy-body)" />
        <path
          d="M122 245 C145 298, 200 323, 272 323 C348 323, 398 292, 406 234 C400 297, 338 332, 257 332 C183 332, 132 297, 122 245 Z"
          fill="color-mix(in srgb, var(--primary) 16%, #e97898)"
          opacity={0.26}
        />
        <ellipse cx="235" cy="190" rx="82" ry="45" fill="#ffffff" opacity={0.16} />

        <path
          d="M160 156 C145 128, 118 126, 108 147 C101 165, 112 186, 138 188 C153 182, 161 171, 160 156 Z"
          fill="url(#piggy-body)"
        />
        <path
          d="M147 156 C138 141, 123 141, 118 153 C115 164, 122 175, 137 176 C145 173, 149 165, 147 156 Z"
          fill="color-mix(in srgb, var(--primary) 18%, #e97898)"
          opacity={0.42}
        />

        <ellipse cx="118" cy="234" rx="43" ry="34" fill="url(#piggy-body)" />
        <ellipse cx="103" cy="238" rx="22" ry="18" fill="color-mix(in srgb, var(--primary) 14%, #ee87a6)" opacity={0.35} />
        <ellipse cx="100" cy="236" rx="4.5" ry="6.5" fill="color-mix(in srgb, var(--text) 34%, #d45e81)" opacity={0.62} />

        <circle cx="180" cy="208" r="8" fill="var(--text)" opacity={0.82} />
        <path
          d="M220 138 C250 131, 286 131, 317 138"
          fill="none"
          stroke="color-mix(in srgb, var(--text) 82%, #333333)"
          strokeWidth={11}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
