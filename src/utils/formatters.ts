export const formatCurrency = (value: number, symbol = "$") =>
  `${symbol}${Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`.replace(symbol, value < 0 ? `-${symbol}` : symbol);

export const formatPercent = (value: number) => `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;

export const monthKey = (date = new Date()) => date.toISOString().slice(0, 7);

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
