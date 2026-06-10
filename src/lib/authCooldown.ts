import { useCallback, useEffect, useMemo, useState } from "react";

type AuthAction = "login" | "signup" | "password_reset" | "confirmation_resend";

type CooldownState = {
  failures: number;
  lockedUntil: number;
};

const STORAGE_PREFIX = "budgetcommand-auth-cooldown";
const now = () => Date.now();

const cooldownForFailures = (failures: number) => {
  if (failures >= 5) return 120_000;
  if (failures >= 3) return 30_000;
  return 0;
};

const readState = (action: AuthAction): CooldownState => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${action}`);
    if (!raw) return { failures: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as Partial<CooldownState>;
    return {
      failures: Number(parsed.failures || 0),
      lockedUntil: Number(parsed.lockedUntil || 0),
    };
  } catch {
    return { failures: 0, lockedUntil: 0 };
  }
};

const writeState = (action: AuthAction, state: CooldownState) => {
  localStorage.setItem(`${STORAGE_PREFIX}:${action}`, JSON.stringify(state));
};

export const useAuthCooldown = (action: AuthAction) => {
  const [state, setState] = useState<CooldownState>(() => readState(action));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (state.lockedUntil <= now()) return;
    const interval = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [state.lockedUntil]);

  const secondsRemaining = useMemo(
    () => Math.max(0, Math.ceil((state.lockedUntil - now()) / 1000)),
    [state.lockedUntil, tick],
  );

  const recordFailure = useCallback(() => {
    setState((current) => {
      const failures = current.failures + 1;
      const cooldown = cooldownForFailures(failures);
      const next = { failures, lockedUntil: cooldown ? now() + cooldown : 0 };
      writeState(action, next);
      return next;
    });
  }, [action]);

  const recordSuccess = useCallback(() => {
    const next = { failures: 0, lockedUntil: 0 };
    writeState(action, next);
    setState(next);
  }, [action]);

  return {
    isCoolingDown: secondsRemaining > 0,
    secondsRemaining,
    recordFailure,
    recordSuccess,
  };
};

// Client cooldowns improve UX and reduce casual abuse. Supabase Auth rate limits
// should still be configured in the Supabase dashboard as the real boundary.
