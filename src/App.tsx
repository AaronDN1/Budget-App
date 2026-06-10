import { useEffect, useMemo, useState } from "react";
import Layout from "./components/Layout";
import InstallPwaHint from "./components/InstallPwaHint";
import MigrationPrompt from "./components/MigrationPrompt";
import { PageKey } from "./components/Sidebar";
import { BudgetDataProvider, useBudgetData } from "./context/BudgetDataContext";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Funds from "./pages/Funds";
import Income from "./pages/Income";
import PaycheckPlanner from "./pages/PaycheckPlanner";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import { trackPageView } from "./lib/analytics";
import {
  calculateAvailableToAllocate,
  calculateBudgetHealthScore,
  calculateFundAllocations,
  calculateMonthlyExpenseTotal,
  calculateMonthlyIncome,
  calculateMonthlySubscriptionTotal,
  getActiveAllocation,
} from "./utils/calculations";
import { applyTheme, THEME_STORAGE_KEY } from "./data/themes";

const pageToPath: Record<PageKey, string> = {
  dashboard: "/app/dashboard",
  income: "/app/income",
  expenses: "/app/expenses",
  subscriptions: "/app/subscriptions",
  funds: "/app/funds",
  paycheckPlanner: "/app/paycheck-planner",
  reports: "/app/reports",
  settings: "/app/settings",
};

const pathToPage = (path: string): PageKey => {
  const match = Object.entries(pageToPath).find(([, route]) => route === path);
  return (match?.[0] as PageKey | undefined) || "dashboard";
};

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  const navigate = (nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  return { path, navigate };
}

function AppRoutes() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { path, navigate } = useRoute();

  useEffect(() => {
    applyTheme(localStorage.getItem(THEME_STORAGE_KEY));
  }, []);

  useEffect(() => {
    trackPageView(path);
  }, [path]);

  useEffect(() => {
    if (!authLoading && !user && path.startsWith("/app")) navigate("/login");
    if (!authLoading && user && (path === "/login" || path === "/signup")) navigate("/app/dashboard");
  }, [authLoading, navigate, path, user]);

  if (authLoading) {
    return <div className="theme-page flex min-h-screen items-center justify-center font-bold">Loading BudgetCommand...</div>;
  }

  if (!user) {
    if (path === "/login") return <><Auth mode="login" navigate={navigate} /><InstallPwaHint /></>;
    if (path === "/signup") return <><Auth mode="signup" navigate={navigate} /><InstallPwaHint /></>;
    return <><Landing navigate={navigate} isSignedIn={false} /><InstallPwaHint /></>;
  }

  if (path === "/") {
    return <><Landing navigate={navigate} isSignedIn onSignOut={signOut} /><InstallPwaHint /></>;
  }

  return (
    <BudgetDataProvider>
      <SignedInApp path={path} navigate={navigate} signOut={signOut} userEmail={user.email} />
    </BudgetDataProvider>
  );
}

function SignedInApp({
  path,
  navigate,
  signOut,
  userEmail,
}: {
  path: string;
  navigate: (path: string) => void;
  signOut: () => Promise<void>;
  userEmail?: string;
}) {
  const {
    data,
    setData,
    replaceData,
    loading,
    saving,
    error,
    needsMigration,
    importLocalData,
    skipLocalMigration,
    remindLater,
    exportCloudData,
    importCloudData,
    resetCloudData,
    saveMonthlySnapshot,
  } = useBudgetData();
  const activePage = pathToPage(path);

  useEffect(() => {
    applyTheme(data.settings.theme);
  }, [data.settings.theme]);

  const metrics = useMemo(() => {
    const income = calculateMonthlyIncome(data.incomeSources);
    const fixed = calculateMonthlyExpenseTotal(data.expenses, "fixed");
    const variable = calculateMonthlyExpenseTotal(data.expenses, "variable");
    const subscriptions = calculateMonthlySubscriptionTotal(data.subscriptions);
    const expenses = fixed + variable;
    const available = calculateAvailableToAllocate(income, fixed, variable, subscriptions);
    const allocationPercentages = getActiveAllocation(data.settings.budgetMode, data.settings.customAllocation);
    const allocations = calculateFundAllocations(available, data.settings.budgetMode, data.settings.customAllocation);
    const savingsInvestingAllocation =
      allocations.Savings + allocations.Retirement + allocations.Stocks + allocations["Real Estate"];
    const healthScore = calculateBudgetHealthScore(income, expenses + subscriptions, subscriptions, available, savingsInvestingAllocation);
    return { income, fixed, variable, subscriptions, expenses, available, healthScore, allocations, allocationPercentages };
  }, [data]);

  const setActivePage = (page: PageKey) => navigate(pageToPath[page]);

  const page = {
    dashboard: <Dashboard data={data} metrics={metrics} onNavigate={setActivePage} onSaveSnapshot={saveMonthlySnapshot} />,
    income: <Income data={data} setData={setData} />,
    expenses: <Expenses data={data} setData={setData} />,
    subscriptions: <Subscriptions data={data} setData={setData} />,
    funds: <Funds data={data} setData={setData} allocations={metrics.allocations} allocationPercentages={metrics.allocationPercentages} />,
    paycheckPlanner: <PaycheckPlanner data={data} allocationPercentages={metrics.allocationPercentages} />,
    reports: <Reports data={data} metrics={metrics} />,
    settings: (
      <Settings
        data={data}
        setData={setData}
        replaceData={replaceData}
        userEmail={userEmail}
        signOut={signOut}
        exportCloudData={exportCloudData}
        importCloudData={importCloudData}
        resetCloudData={resetCloudData}
        saveMonthlySnapshot={saveMonthlySnapshot}
      />
    ),
  }[activePage];

  if (loading) {
    return <div className="theme-page flex min-h-screen items-center justify-center font-bold">Loading cloud budget...</div>;
  }

  return (
    <>
      <Layout activePage={activePage} setActivePage={setActivePage} userEmail={userEmail} onSignOut={signOut} onOpenLanding={() => navigate("/")}>
        {(saving || error) && (
          <div className={`mb-4 rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-soft)] px-4 py-3 text-sm font-semibold ${error ? "text-[color:var(--danger)]" : "text-[color:var(--primary)]"}`}>
            {error || "Saving to cloud..."}
          </div>
        )}
        {page}
      </Layout>
      <InstallPwaHint />
      {needsMigration && <MigrationPrompt saving={saving} onImport={importLocalData} onSkip={skipLocalMigration} onLater={remindLater} />}
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
