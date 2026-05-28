import { X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "budgetcommand-install-hint-dismissed";

const isIosSafariLike = () => {
  const ua = window.navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
  return isIos && !isStandalone;
};

export default function InstallPwaHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isIosSafariLike() && localStorage.getItem(DISMISS_KEY) !== "true");
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-50 rounded-lg border border-emerald-200 bg-white p-4 shadow-soft dark:border-emerald-900 dark:bg-slate-900 lg:hidden">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-black text-slate-950 dark:text-white">Install BudgetCommand</p>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            To install BudgetCommand on your iPhone, tap Share, then Add to Home Screen.
          </p>
        </div>
        <button
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          type="button"
          aria-label="Dismiss install hint"
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "true");
            setVisible(false);
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
