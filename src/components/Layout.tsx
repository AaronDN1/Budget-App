import { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import Sidebar, { PageKey } from "./Sidebar";

interface LayoutProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  userEmail?: string;
  onSignOut?: () => void;
  onOpenLanding?: () => void;
  children: ReactNode;
}

export default function Layout({ activePage, setActivePage, userEmail, onSignOut, onOpenLanding, children }: LayoutProps) {
  const titles: Record<PageKey, string> = {
    dashboard: "Dashboard",
    income: "Income",
    expenses: "Expenses",
    subscriptions: "Subscriptions",
    funds: "Funds",
    paycheckPlanner: "Paycheck Planner",
    reports: "Reports",
    settings: "Settings",
  };
  const title = titles[activePage];
  return (
    <div className="theme-page min-h-screen lg:flex">
      <MobileHeader title={title} userEmail={userEmail} onSignOut={onSignOut} onOpenLanding={onOpenLanding} />
      <Sidebar activePage={activePage} setActivePage={setActivePage} userEmail={userEmail} onSignOut={onSignOut} onOpenLanding={onOpenLanding} />
      <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
