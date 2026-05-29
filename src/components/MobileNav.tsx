import { BarChart3, CreditCard, Gauge, Landmark, PiggyBank, Settings, WalletCards } from "lucide-react";
import { useState } from "react";
import { PageKey } from "./Sidebar";

const tabs: Array<{ key: PageKey; label: string; icon: typeof Gauge }> = [
  { key: "dashboard", label: "Home", icon: Gauge },
  { key: "expenses", label: "Expenses", icon: CreditCard },
  { key: "funds", label: "Funds", icon: PiggyBank },
  { key: "reports", label: "Reports", icon: BarChart3 },
];

const moreItems: Array<{ key: PageKey; label: string; icon: typeof Gauge }> = [
  { key: "income", label: "Income", icon: WalletCards },
  { key: "subscriptions", label: "Subscriptions", icon: Landmark },
  { key: "paycheckPlanner", label: "Paycheck Planner", icon: WalletCards },
  { key: "settings", label: "Settings", icon: Settings },
];

interface MobileNavProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
}

export default function MobileNav({ activePage, setActivePage }: MobileNavProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = moreItems.some((item) => item.key === activePage);
  const openPage = (page: PageKey) => {
    setActivePage(page);
    setMoreOpen(false);
  };

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)] bg-[color:var(--card)] px-2 pt-2 shadow-[0_-14px_40px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      {moreOpen && (
        <div className="mx-auto mb-2 grid max-w-lg grid-cols-2 gap-2 rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] p-2 shadow-[0_-14px_40px_rgba(15,23,42,0.08)]">
          {moreItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-bold transition ${
                activePage === key ? "bg-[color:var(--primary)] text-white" : "text-[color:var(--muted)] hover:bg-[color:var(--card-hover)]"
              }`}
              type="button"
              onClick={() => openPage(key)}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = activePage === key;
          return (
            <button
              key={key}
              className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition ${
                active ? "bg-[color:var(--primary)] text-white" : "text-[color:var(--muted)] hover:bg-[color:var(--card-hover)]"
              }`}
              type="button"
              onClick={() => openPage(key)}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
        <button
          className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold transition ${
            moreActive || moreOpen ? "bg-[color:var(--primary)] text-white" : "text-[color:var(--muted)] hover:bg-[color:var(--card-hover)]"
          }`}
          type="button"
          onClick={() => setMoreOpen((open) => !open)}
        >
          <Settings className="h-5 w-5" />
          More
        </button>
      </div>
    </nav>
  );
}
