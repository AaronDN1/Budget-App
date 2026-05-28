export type ThemeId =
  | "command-cream"
  | "slate-dark"
  | "wall-street"
  | "rose-capital"
  | "ocean-ledger"
  | "minimal-gray";

export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  dark: boolean;
  preview: string[];
  variables: Record<string, string>;
}

export const DEFAULT_THEME: ThemeId = "command-cream";
export const THEME_STORAGE_KEY = "budgetcommand-theme";

export const themes: AppTheme[] = [
  {
    id: "command-cream",
    name: "Command Cream",
    description: "Soft cream, navy text, and emerald financial accents.",
    dark: false,
    preview: ["#f7f1e8", "#fffaf1", "#0f2f2f", "#10b981"],
    variables: {
      "--bg": "#f7f1e8",
      "--bg-soft": "#fdf8ee",
      "--card": "rgba(255, 250, 241, 0.92)",
      "--card-hover": "#fffdf7",
      "--text": "#10201f",
      "--muted": "#66736f",
      "--border": "#e8ddcc",
      "--primary": "#0f766e",
      "--primary-hover": "#115e59",
      "--accent": "#10b981",
      "--accent-soft": "#dff8ec",
      "--danger": "#dc2626",
      "--success": "#059669",
      "--warning": "#d97706",
      "--shadow": "0 18px 50px rgba(44, 35, 22, 0.10)",
    },
  },
  {
    id: "slate-dark",
    name: "Slate Dark",
    description: "Deep slate surfaces with calm blue and emerald accents.",
    dark: true,
    preview: ["#0f172a", "#111827", "#38bdf8", "#10b981"],
    variables: {
      "--bg": "#0f172a",
      "--bg-soft": "#111827",
      "--card": "rgba(15, 23, 42, 0.88)",
      "--card-hover": "#182235",
      "--text": "#f8fafc",
      "--muted": "#aab5c3",
      "--border": "#263244",
      "--primary": "#2563eb",
      "--primary-hover": "#1d4ed8",
      "--accent": "#10b981",
      "--accent-soft": "rgba(16, 185, 129, 0.16)",
      "--danger": "#f87171",
      "--success": "#34d399",
      "--warning": "#fbbf24",
      "--shadow": "0 18px 50px rgba(0, 0, 0, 0.32)",
    },
  },
  {
    id: "wall-street",
    name: "Wall Street",
    description: "Trading-desk navy and green with a premium glow.",
    dark: true,
    preview: ["#061917", "#0b2b2c", "#14b8a6", "#22c55e"],
    variables: {
      "--bg": "#061917",
      "--bg-soft": "#092320",
      "--card": "rgba(9, 35, 32, 0.88)",
      "--card-hover": "#0d302c",
      "--text": "#ecfdf5",
      "--muted": "#9bbdb0",
      "--border": "#18433c",
      "--primary": "#059669",
      "--primary-hover": "#047857",
      "--accent": "#22c55e",
      "--accent-soft": "rgba(34, 197, 94, 0.16)",
      "--danger": "#fb7185",
      "--success": "#22c55e",
      "--warning": "#facc15",
      "--shadow": "0 20px 60px rgba(2, 44, 34, 0.45)",
    },
  },
  {
    id: "rose-capital",
    name: "Rose Capital",
    description: "Soft blush, rose accents, and refined finance contrast.",
    dark: false,
    preview: ["#fff1f4", "#fff7ed", "#be185d", "#fb7185"],
    variables: {
      "--bg": "#fff1f4",
      "--bg-soft": "#fff7ed",
      "--card": "rgba(255, 250, 247, 0.92)",
      "--card-hover": "#fffafd",
      "--text": "#2b1720",
      "--muted": "#7a606a",
      "--border": "#f1d1dc",
      "--primary": "#be185d",
      "--primary-hover": "#9d174d",
      "--accent": "#fb7185",
      "--accent-soft": "#ffe4ea",
      "--danger": "#dc2626",
      "--success": "#059669",
      "--warning": "#c2410c",
      "--shadow": "0 18px 50px rgba(121, 23, 64, 0.12)",
    },
  },
  {
    id: "ocean-ledger",
    name: "Ocean Ledger",
    description: "Clean blue/cyan ledger tones for a calm money view.",
    dark: false,
    preview: ["#ecfeff", "#f8fafc", "#0369a1", "#06b6d4"],
    variables: {
      "--bg": "#ecfeff",
      "--bg-soft": "#f8fafc",
      "--card": "rgba(248, 250, 252, 0.92)",
      "--card-hover": "#ffffff",
      "--text": "#102033",
      "--muted": "#64748b",
      "--border": "#cce9f2",
      "--primary": "#0369a1",
      "--primary-hover": "#075985",
      "--accent": "#06b6d4",
      "--accent-soft": "#cffafe",
      "--danger": "#dc2626",
      "--success": "#059669",
      "--warning": "#d97706",
      "--shadow": "0 18px 50px rgba(3, 105, 161, 0.10)",
    },
  },
  {
    id: "minimal-gray",
    name: "Minimal Gray",
    description: "Quiet neutral gray for a focused professional workspace.",
    dark: false,
    preview: ["#f3f4f6", "#ffffff", "#374151", "#10b981"],
    variables: {
      "--bg": "#f3f4f6",
      "--bg-soft": "#f9fafb",
      "--card": "rgba(255, 255, 255, 0.92)",
      "--card-hover": "#ffffff",
      "--text": "#111827",
      "--muted": "#6b7280",
      "--border": "#d9dee7",
      "--primary": "#374151",
      "--primary-hover": "#1f2937",
      "--accent": "#10b981",
      "--accent-soft": "#d1fae5",
      "--danger": "#dc2626",
      "--success": "#059669",
      "--warning": "#d97706",
      "--shadow": "0 18px 50px rgba(17, 24, 39, 0.08)",
    },
  },
];

export const normalizeTheme = (theme?: string | null): ThemeId => {
  if (theme === "dark") return "slate-dark";
  if (theme === "light") return DEFAULT_THEME;
  return themes.some((item) => item.id === theme) ? (theme as ThemeId) : DEFAULT_THEME;
};

export const getTheme = (theme?: string | null) => themes.find((item) => item.id === normalizeTheme(theme)) || themes[0];

export const applyTheme = (themeId?: string | null) => {
  const theme = getTheme(themeId);
  document.documentElement.dataset.theme = theme.id;
  document.documentElement.classList.toggle("dark", theme.dark);
  Object.entries(theme.variables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
};
