const FALLBACK_MEASUREMENT_ID = "G-4MF8MBS7CC";

type AnalyticsValue = string | number | boolean | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;
const SAFE_PARAM_KEYS = new Set(["page", "theme", "location", "method", "action"]);

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || FALLBACK_MEASUREMENT_ID;

const sanitizeParams = (params: AnalyticsParams = {}) =>
  Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => SAFE_PARAM_KEYS.has(key) && ["string", "number", "boolean"].includes(typeof value))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 80) : value]),
  );

export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID) return;

  if (window.gtag) {
    if (import.meta.env.DEV) console.debug("[analytics] gtag available");
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
};

export const trackPageView = (path: string) => {
  if (import.meta.env.DEV) console.debug("[analytics] page_view", path);
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: document.title,
  });
};

export const trackEvent = (name: string, params?: AnalyticsParams) => {
  window.gtag?.("event", name, sanitizeParams(params));
};
