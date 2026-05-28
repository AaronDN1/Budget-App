import { ReactNode } from "react";
import MobileHeader from "./MobileHeader";
import MobileNav from "./MobileNav";
import Sidebar, { PageKey } from "./Sidebar";

interface LayoutProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  userEmail?: string;
  onSignOut?: () => void;
  children: ReactNode;
}

export default function Layout({ activePage, setActivePage, userEmail, onSignOut, children }: LayoutProps) {
  const title = activePage.charAt(0).toUpperCase() + activePage.slice(1);
  return (
    <div className="theme-page min-h-screen lg:flex">
      <MobileHeader title={title} userEmail={userEmail} onSignOut={onSignOut} />
      <Sidebar activePage={activePage} setActivePage={setActivePage} userEmail={userEmail} onSignOut={onSignOut} />
      <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
