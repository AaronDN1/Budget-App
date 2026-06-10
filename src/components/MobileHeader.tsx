import { LogOut } from "lucide-react";
import Logo from "./Logo";

interface MobileHeaderProps {
  title: string;
  userEmail?: string;
  onSignOut?: () => void;
  onOpenLanding?: () => void;
}

export default function MobileHeader({ title, userEmail, onSignOut, onOpenLanding }: MobileHeaderProps) {
  return (
    <header className="safe-top sticky top-0 z-30 border-b border-[color:var(--border)] bg-[color:var(--card)] px-4 pb-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <button className="min-w-0 text-left" type="button" onClick={onOpenLanding} aria-label="Open landing page">
          <Logo size="sm" showTagline={false} />
          <h1 className="mt-1 truncate text-lg font-black text-[color:var(--text)]">{title}</h1>
          {userEmail && <p className="truncate text-xs font-semibold text-[color:var(--muted)]">{userEmail}</p>}
        </button>
        {onSignOut && (
          <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--text)]" type="button" onClick={onSignOut} aria-label="Sign out">
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
}
