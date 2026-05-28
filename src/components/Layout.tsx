import { ReactNode } from "react";
import Sidebar, { PageKey } from "./Sidebar";

interface LayoutProps {
  activePage: PageKey;
  setActivePage: (page: PageKey) => void;
  children: ReactNode;
}

export default function Layout({ activePage, setActivePage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
