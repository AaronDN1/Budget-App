import { BarChart3, CreditCard, Gauge, PiggyBank, Settings } from "lucide-react";
import { PageKey } from "./Sidebar";

const tabs: Array<{ key: PageKey; label: string; icon: typeof Gauge }> = [
  { key: "dashboard", label: "Home", icon: Gauge },
  { key: "expenses", label: "Expenses", icon: CreditCard },
  { key: "funds", label: "Funds", icon: PiggyBank },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}

export default function MobileNav({ activePage, setActivePage }: MobileNavProps) {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pt-2 shadow-[0_-14px_40px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition ${
                active ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
              }`}
              type="button"
              onClick={() => setActivePage(key)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
