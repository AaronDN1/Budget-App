import { LogOut } from "lucide-react";

interface MobileHeaderProps {
  title: string;
  userEmail?: string;
  onSignOut?: () => void;
}

export default function MobileHeader({ title, userEmail, onSignOut }: MobileHeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 pb-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">BudgetCommand</p>
          <h1 className="truncate text-xl font-black text-slate-950 dark:text-white">{title}</h1>
          {userEmail && <p className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{userEmail}</p>}
        </div>
        {onSignOut && (
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200" type="button" onClick={onSignOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
