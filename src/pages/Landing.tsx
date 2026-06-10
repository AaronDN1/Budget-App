import { ArrowRight, BarChart3, Cloud, CreditCard, LineChart, PiggyBank, ShieldCheck, Smartphone } from "lucide-react";
import Logo from "../components/Logo";
import PiggyBankHeroGraphic from "../components/PiggyBankHeroGraphic";
import { trackEvent } from "../lib/analytics";

interface LandingProps {
  navigate: (path: string) => void;
  isSignedIn: boolean;
  onSignOut?: () => Promise<void>;
}

const features = [
  { title: "Smart income allocation", icon: PiggyBank, text: "Automatically route leftover money into savings, investing, travel, real estate, and fun." },
  { title: "Subscription control", icon: CreditCard, text: "Spot recurring costs, separate essentials, and keep lifestyle creep in check." },
  { title: "Goal-based funds", icon: LineChart, text: "Track balances, goals, contributions, withdrawals, and progress in one command view." },
  { title: "Safe-to-spend clarity", icon: ShieldCheck, text: "See what is available after income, expenses, and subscriptions are accounted for." },
  { title: "Cloud sync", icon: Cloud, text: "Your budget follows you securely across devices with Supabase-backed sync." },
  { title: "iPhone/PWA ready", icon: Smartphone, text: "Install BudgetCommand from Safari and launch it like a native app." },
];

const funds = [
  ["Savings", 25, "bg-emerald-500"],
  ["Real Estate", 25, "bg-teal-500"],
  ["Retirement", 20, "bg-blue-500"],
  ["Stocks", 15, "bg-cyan-500"],
  ["Travel", 10, "bg-amber-500"],
  ["Fun Fund", 5, "bg-rose-500"],
] as const;

const heroChips = ["Smart Allocation", "Subscription Control", "Goal Funds"];

export default function Landing({ navigate, isSignedIn, onSignOut }: LandingProps) {
  const openApp = () => {
    trackEvent("landing_cta_clicked", { destination: isSignedIn ? "dashboard" : "signup" });
    navigate(isSignedIn ? "/app/dashboard" : "/signup");
  };

  return (
    <main className="theme-page relative min-h-screen overflow-hidden">
      <div className="landing-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute left-[-10rem] top-24 h-80 w-80 rounded-full bg-[color:var(--accent)]/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8rem] top-72 h-96 w-96 rounded-full bg-[color:var(--primary)]/15 blur-3xl" aria-hidden="true" />

      <nav className="safe-top safe-x relative z-10 mx-auto flex max-w-7xl items-center justify-between pb-4 pt-4 sm:px-6 lg:px-8">
        <button className="text-left" type="button" onClick={() => navigate("/")} aria-label="BudgetCommand home">
          <Logo size="md" />
        </button>
        <div className="hidden gap-3 sm:flex">
          {isSignedIn ? (
            <>
              <button className="btn-secondary" type="button" onClick={onSignOut}>Sign Out</button>
              <button className="btn-primary" type="button" onClick={openApp}>Open App</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" type="button" onClick={() => navigate("/login")}>Sign In</button>
              <button className="btn-primary" type="button" onClick={openApp}>Launch BudgetCommand</button>
            </>
          )}
        </div>
      </nav>

      <section className="safe-x relative z-10 mx-auto grid max-w-7xl gap-10 pb-12 pt-8 sm:px-6 lg:grid-cols-[1fr_0.94fr] lg:px-8 lg:pb-20 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="w-fit rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1 text-sm font-black text-[color:var(--primary)] shadow-sm">
            Personal finance command center
          </div>
          <div className="mt-6 grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-[color:var(--text)] sm:text-6xl lg:text-7xl">
              Command your money before it disappears.
            </h1>
            <PiggyBankHeroGraphic />
          </div>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--muted)] sm:text-lg sm:leading-8">
            BudgetCommand turns your income, expenses, subscriptions, and goals into a clear monthly money plan.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <button className="btn-primary w-full text-base sm:w-auto" type="button" onClick={openApp}>
              {isSignedIn ? "Open App" : "Launch BudgetCommand"} <ArrowRight className="h-5 w-5" />
            </button>
            {isSignedIn ? (
              <button className="btn-secondary w-full text-base sm:w-auto" type="button" onClick={onSignOut}>Sign Out</button>
            ) : (
              <button className="btn-secondary w-full text-base sm:w-auto" type="button" onClick={() => navigate("/login")}>Sign In</button>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {heroChips.map((item) => (
              <span key={item} className="rounded-full border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-1.5 text-xs font-black text-[color:var(--text)] shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="float-soft absolute right-4 top-2 hidden rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-sm font-black text-[color:var(--success)] shadow-soft sm:block">
            +$840 allocated
          </div>
          <div className="panel relative overflow-hidden p-4 sm:p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[color:var(--accent)]/20 blur-2xl" aria-hidden="true" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-[color:var(--muted)]">Monthly command view</p>
                <h2 className="mt-1 text-2xl font-black text-[color:var(--text)]">Budget Health 92</h2>
              </div>
              <div className="rounded-lg bg-[color:var(--accent-soft)] px-3 py-2 text-right">
                <p className="text-xs font-bold text-[color:var(--muted)]">Available</p>
                <p className="text-xl font-black text-[color:var(--success)]">$2,425</p>
              </div>
            </div>

            <svg className="mt-5 h-28 w-full" viewBox="0 0 420 120" role="img" aria-label="Upward budget trend preview">
              <defs>
                <linearGradient id="trend" x1="0" x2="1">
                  <stop stopColor="var(--primary)" />
                  <stop offset="1" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
              <path d="M6 105 L72 82 L130 91 L196 48 L254 62 L318 30 L414 18" fill="none" stroke="url(#trend)" strokeWidth="7" strokeLinecap="round" className="trend-line" />
              {[72, 196, 318, 414].map((x, i) => (
                <circle key={x} cx={x} cy={[82, 48, 30, 18][i]} r="5" fill="var(--accent)" />
              ))}
            </svg>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Monthly Income", "$6,500"],
                ["Expenses", "$3,250"],
                ["Subscriptions", "$825"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-soft)] p-3">
                  <p className="text-xs font-bold text-[color:var(--muted)]">{label}</p>
                  <p className="mt-1 text-lg font-black text-[color:var(--text)]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {funds.map(([name, value, color]) => (
                <div key={name as string}>
                  <div className="flex justify-between text-xs font-black text-[color:var(--muted)]">
                    <span>{name}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--accent-soft)]">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="safe-x relative z-10 mx-auto grid max-w-7xl gap-4 pb-20 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {features.map(({ title, icon: Icon, text }) => (
          <article key={title} className="panel group p-5 transition hover:-translate-y-1 hover:bg-[color:var(--card-hover)]">
            <div className="w-fit rounded-lg bg-[color:var(--accent-soft)] p-2 text-[color:var(--primary)]"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-4 text-lg font-black text-[color:var(--text)]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{text}</p>
          </article>
        ))}
      </section>

      <div className="safe-x fixed inset-x-0 bottom-3 z-20 sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          <button className="btn-primary" type="button" onClick={openApp}>{isSignedIn ? "Open App" : "Launch"}</button>
          <button className="btn-secondary" type="button" onClick={isSignedIn ? onSignOut : () => navigate("/login")}>{isSignedIn ? "Sign Out" : "Sign In"}</button>
        </div>
      </div>
    </main>
  );
}
