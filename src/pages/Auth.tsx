import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { useAuthCooldown } from "../lib/authCooldown";
import { trackEvent } from "../lib/analytics";

interface AuthProps {
  mode: "login" | "signup";
  navigate: (path: string) => void;
}

export default function Auth({ mode, navigate }: AuthProps) {
  const { signIn, signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";
  const cooldown = useAuthCooldown(isSignup ? "signup" : "login");

  useEffect(() => {
    if (user) navigate("/app/dashboard");
  }, [navigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (cooldown.isCoolingDown) {
      setMessage(`Too many attempts. Please wait ${cooldown.secondsRemaining} seconds before trying again.`);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      if (isSignup) {
        trackEvent("signup_started");
        await signUp(email, password);
        cooldown.recordSuccess();
        setMessage("Account created. Check your email if confirmation is enabled, then sign in.");
      } else {
        trackEvent("login_started");
        await signIn(email, password);
        cooldown.recordSuccess();
        navigate("/app/dashboard");
      }
    } catch (error) {
      cooldown.recordFailure();
      setMessage(isSignup ? "Please check your email or try again later." : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="theme-page safe-x flex min-h-screen items-center justify-center py-8 sm:py-10">
      <section className="panel w-full max-w-md p-6">
        <button className="text-sm font-bold text-[color:var(--primary)]" type="button" onClick={() => navigate("/")}>Back to BudgetCommand</button>
        <Logo size="md" className="mt-5" />
        <h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {isSignup ? "Start syncing your budget securely across devices." : "Sign in to open your budget command center."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label>
            <span className="label">Email</span>
            <input className="field mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span className="label">Password</span>
            <input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
          </label>
          {message && <p className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</p>}
          {cooldown.isCoolingDown && !message && (
            <p className="rounded-lg bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Too many attempts. Please wait {cooldown.secondsRemaining} seconds before trying again.
            </p>
          )}
          <button className="btn-primary w-full" type="submit" disabled={loading || cooldown.isCoolingDown}>{loading ? "Working..." : isSignup ? "Create Account" : "Sign In"}</button>
        </form>
        <button
          className="mt-5 w-full text-center text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300"
          type="button"
          onClick={() => navigate(isSignup ? "/login" : "/signup")}
        >
          {isSignup ? "Already have an account? Sign in" : "Need an account? Get started"}
        </button>
      </section>
    </main>
  );
}
