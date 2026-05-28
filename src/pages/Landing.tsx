import { ArrowRight, BarChart3, Cloud, CreditCard, LineChart, PiggyBank, ShieldCheck } from "lucide-react";

interface LandingProps {
  navigate: (path: string) => void;
}

const features = [
  { title: "Smart monthly allocation", icon: PiggyBank, text: "Automatically divide what is left into savings, investing, travel, real estate, and lifestyle funds." },
  { title: "Subscription tracking", icon: CreditCard, text: "See recurring spending clearly and catch nonessential costs before they quietly balloon." },
  { title: "Cloud sync", icon: Cloud, text: "Save your budget securely in Supabase and pick up from another device." },
  { title: "Reports and charts", icon: BarChart3, text: "Turn income, expenses, subscriptions, and fund progress into simple visual reports." },
  { title: "Fund progress", icon: LineChart, text: "Track balances, goals, contributions, withdrawals, and history for each personal fund." },
  { title: "Private by design", icon: ShieldCheck, text: "Your rows are protected with Supabase Auth and Row Level Security." },
];

export default function Landing({ navigate }: LandingProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <button className="text-left" type="button" onClick={() => navigate("/")}>
          <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Budget OS</p>
          <p className="text-lg font-black">Command Center</p>
        </button>
        <div className="flex gap-3">
          <button className="btn-secondary" type="button" onClick={() => navigate("/login")}>Sign In</button>
          <button className="btn-primary" type="button" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="flex flex-col justify-center">
          <div className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            Cloud-synced personal finance planning
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Plan your income and put every extra dollar to work.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Plan your income, control your expenses, and automatically divide your money into the funds that matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary" type="button" onClick={() => navigate("/signup")}>Get Started <ArrowRight className="h-4 w-4" /></button>
            <button className="btn-secondary" type="button" onClick={() => navigate("/login")}>Sign In</button>
          </div>
        </div>

        <div className="panel p-5">
          <div className="rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 p-5 text-white">
            <p className="text-sm font-semibold opacity-90">Monthly plan</p>
            <p className="mt-2 text-4xl font-black">$2,425</p>
            <p className="text-sm opacity-90">available to allocate</p>
          </div>
          <div className="mt-5 grid gap-3">
            {[
              ["Income", "$6,500", "bg-emerald-500"],
              ["Expenses", "$3,250", "bg-red-500"],
              ["Subscriptions", "$825", "bg-blue-500"],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                <div className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${color}`} /><span className="font-semibold">{label}</span></div>
                <span className="font-black">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["Savings 25%", "Real Estate 25%", "Retirement 20%", "Stocks 15%", "Travel 10%", "Fun Fund 5%"].map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-800">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {features.map(({ title, icon: Icon, text }) => (
          <article key={title} className="panel p-5">
            <div className="w-fit rounded-lg bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Icon className="h-5 w-5" /></div>
            <h2 className="mt-4 text-lg font-black">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
