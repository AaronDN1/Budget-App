import { Check } from "lucide-react";
import { ThemeId, themes } from "../data/themes";

interface ThemeSelectorProps {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
}

export default function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {themes.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => onChange(theme.id)}
            className={`relative rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${
              selected ? "border-[color:var(--primary)] bg-[color:var(--accent-soft)]" : "border-[color:var(--border)] bg-[color:var(--card)] hover:bg-[color:var(--card-hover)]"
            }`}
            aria-pressed={selected}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-black text-[color:var(--text)]">{theme.name}</h4>
                <p className="mt-1 text-sm leading-5 text-[color:var(--muted)]">{theme.description}</p>
              </div>
              {selected && (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color:var(--primary)] text-white">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              {theme.preview.map((color) => (
                <span key={color} className="h-6 w-6 rounded-full border border-black/10" style={{ backgroundColor: color }} />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
