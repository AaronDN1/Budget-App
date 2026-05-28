import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

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

  useEffect(() => {
    if (user) navigate("/app/dashboard");
  }, [navigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (isSignup) {
        await signUp(email, password);
        setMessage("Account created. Check your email if confirmation is enabled, then sign in.");
      } else {
        await signIn(email, password);
        navigate("/app/dashboard");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="panel w-full max-w-md p-6">
        <button className="text-sm font-bold text-blue-600 dark:text-blue-400" type="button" onClick={() => navigate("/")}>Back to Budget OS</button>
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
          <button className="btn-primary w-full" type="submit" disabled={loading}>{loading ? "Working..." : isSignup ? "Create Account" : "Sign In"}</button>
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
