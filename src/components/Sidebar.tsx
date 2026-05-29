import { BarChart3, CreditCard, Gauge, Landmark, LogOut, PiggyBank, Settings, WalletCards } from "lucide-react";
import Logo from "./Logo";

export type PageKey = "dashboard" | "income" | "expenses" | "subscriptions" | "funds" | "paycheckPlanner" | "reports" | "settings";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  { key: "income", label: "Income", icon: WalletCards },
  { key: "expenses", label: "Expenses", icon: CreditCard },
  { key: "subscriptions", label: "Subscriptions", icon: Landmark },
  { key: "funds", label: "Funds", icon: PiggyBank },
  { key: "paycheckPlanner", label: "Paycheck Planner", icon: WalletCards },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export default function Sidebar({ activePage, setActivePage, userEmail, onSignOut }: SidebarProps) {
  return (
    <aside className="hidden border-b border-[color:var(--border)] bg-[color:var(--card)] backdrop-blur lg:flex lg:min-h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6">
        <Logo size="md" />
      </div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:px-4">
        {navItems.map(({ key, label, icon: Icon }) => {
          const active = key === activePage;
          return (
            <button
              key={key}
              className={`flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition lg:w-full ${
                active
                  ? "bg-[color:var(--primary)] text-white shadow-sm"
                  : "text-[color:var(--muted)] hover:bg-[color:var(--card-hover)]"
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
      <div className="px-4 pb-5 lg:mt-auto">
        {userEmail && <p className="mb-3 truncate text-xs font-semibold text-[color:var(--muted)]">{userEmail}</p>}
        {onSignOut && (
          <button className="btn-secondary w-full" type="button" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
