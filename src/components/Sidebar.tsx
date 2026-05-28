import { BarChart3, CreditCard, Gauge, Landmark, PiggyBank, Settings, WalletCards } from "lucide-react";

export type PageKey = "dashboard" | "income" | "expenses" | "subscriptions" | "funds" | "reports" | "settings";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { key: "income", label: "Income", icon: WalletCards },
  { key: "expenses", label: "Expenses", icon: CreditCard },
  { key: "subscriptions", label: "Subscriptions", icon: Landmark },
  { key: "funds", label: "Funds", icon: PiggyBank },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Command Center</p>
          <h1 className="text-lg font-black text-slate-950 dark:text-white">Budget OS</h1>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4">
        {navItems.map(({ key, label, icon: Icon }) => {
          const active = key === activePage;
          return (
            <button
              key={key}
              className={`flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition lg:w-full ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
              onClick={() => setActivePage(key)}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
