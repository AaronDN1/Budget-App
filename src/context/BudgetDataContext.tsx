import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppData, MonthlySnapshot } from "../types";
import { hasLocalData, loadData } from "../utils/storage";
import { validateBudgetBackupFile } from "../utils/backupValidation";
import { applyTheme } from "../data/themes";
import { useAuth } from "./AuthContext";
import {
  getProfile,
  loadCloudBudgetData,
  markLocalMigrationComplete,
  replaceCloudBudgetData,
  resetCloudBudgetData,
  saveMonthlySnapshot as saveMonthlySnapshotToCloud,
} from "../services/budgetService";

interface BudgetDataContextValue {
  data: AppData;
  loading: boolean;
  saving: boolean;
  error: string;
  needsMigration: boolean;
  setData: (updater: (data: AppData) => AppData) => void;
  replaceData: (data: AppData) => void;
  refresh: () => Promise<void>;
  importLocalData: () => Promise<void>;
  skipLocalMigration: () => Promise<void>;
  remindLater: () => void;
  exportCloudData: () => Blob;
  importCloudData: (file: File) => Promise<void>;
  resetCloudData: () => Promise<void>;
  saveMonthlySnapshot: (snapshot: MonthlySnapshot) => Promise<void>;
}

const BudgetDataContext = createContext<BudgetDataContextValue | undefined>(undefined);

export function BudgetDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setDataState] = useState<AppData>(() => loadData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [needsMigration, setNeedsMigration] = useState(false);
  const readyToSync = useRef(false);
  const saveTimer = useRef<number | undefined>(undefined);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    readyToSync.current = false;
    try {
      const fallback = loadData();
      const cloudData = await loadCloudBudgetData(user.id, fallback);
      setDataState(cloudData);
      const profile = await getProfile(user.id);
      setNeedsMigration(hasLocalData() && !profile.local_migration_completed);
      readyToSync.current = true;
    } catch (err) {
      setError("Could not load cloud budget data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    applyTheme(data.settings.theme);
  }, [data.settings.theme]);

  const scheduleCloudSave = useCallback(
    (nextData: AppData) => {
      if (!user || !readyToSync.current) return;
      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        setSaving(true);
        setError("");
        try {
          await replaceCloudBudgetData(user.id, nextData);
        } catch (err) {
          setError("Could not save budget data.");
        } finally {
          setSaving(false);
        }
      }, 500);
    },
    [user],
  );

  const setData = useCallback(
    (updater: (data: AppData) => AppData) => {
      setDataState((current) => {
        const next = updater(current);
        scheduleCloudSave(next);
        return next;
      });
    },
    [scheduleCloudSave],
  );

  const replaceData = useCallback(
    (next: AppData) => {
      setDataState(next);
      scheduleCloudSave(next);
    },
    [scheduleCloudSave],
  );

  const importLocalData = useCallback(async () => {
    if (!user) return;
    const local = loadData();
    setSaving(true);
    try {
      await replaceCloudBudgetData(user.id, local);
      await markLocalMigrationComplete(user.id);
      setDataState(local);
      setNeedsMigration(false);
      readyToSync.current = true;
    } finally {
      setSaving(false);
    }
  }, [user]);

  const skipLocalMigration = useCallback(async () => {
    if (!user) return;
    await markLocalMigrationComplete(user.id);
    setNeedsMigration(false);
  }, [user]);

  const importCloudData = useCallback(
    async (file: File) => {
      if (!user) return;
      const imported = await validateBudgetBackupFile(file);
      await replaceCloudBudgetData(user.id, imported);
      setDataState(imported);
    },
    [user],
  );

  const resetCloudData = useCallback(async () => {
    if (!user) return;
    await resetCloudBudgetData(user.id);
    await refresh();
  }, [refresh, user]);

  const saveMonthlySnapshot = useCallback(
    async (snapshot: MonthlySnapshot) => {
      if (!user) return;
      setSaving(true);
      setError("");
      try {
        await saveMonthlySnapshotToCloud(user.id, snapshot);
        setDataState((current) => ({ ...current, monthlySnapshots: [snapshot, ...current.monthlySnapshots].slice(0, 36) }));
      } catch (err) {
        setError("Could not save monthly snapshot.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  const value = useMemo<BudgetDataContextValue>(
    () => ({
      data,
      loading,
      saving,
      error,
      needsMigration,
      setData,
      replaceData,
      refresh,
      importLocalData,
      skipLocalMigration,
      remindLater: () => setNeedsMigration(false),
      exportCloudData: () => new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      importCloudData,
      resetCloudData,
      saveMonthlySnapshot,
    }),
    [data, error, importCloudData, importLocalData, loading, needsMigration, refresh, replaceData, resetCloudData, saveMonthlySnapshot, saving, setData, skipLocalMigration],
  );

  return <BudgetDataContext.Provider value={value}>{children}</BudgetDataContext.Provider>;
}

export function useBudgetData() {
  const context = useContext(BudgetDataContext);
  if (!context) throw new Error("useBudgetData must be used inside BudgetDataProvider.");
  return context;
}
