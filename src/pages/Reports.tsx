import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "../components/ChartCard";
import { AppData, FundName } from "../types";
import { groupExpensesByCategory, groupSubscriptionsByCategory } from "../utils/calculations";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#64748b"];

interface ReportsProps {
  data: AppData;
  metrics: {
    income: number;
    expenses: number;
    subscriptions: number;
    available: number;
    allocations: Record<FundName, number>;
  };
}

export default function Reports({ data, metrics }: ReportsProps) {
  const expenseData = groupExpensesByCategory(data.expenses);
  const subscriptionData = groupSubscriptionsByCategory(data.subscriptions);
  const contributionData = data.funds.map((fund) => ({ name: fund.name, value: fund.totalContributed }));
  const balanceTrend = data.monthlySnapshots.map((snapshot) => ({
    month: snapshot.month,
    ...snapshot.fundBalances,
  }));
  const comparison = [
    { name: "Income", value: metrics.income },
    { name: "Expenses", value: metrics.expenses + metrics.subscriptions },
    { name: "Available", value: metrics.available },
  ];
  const availableTrend = data.monthlySnapshots.map((snapshot) => ({ month: snapshot.month, available: snapshot.availableToAllocate }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Reports</p>
        <h2 className="mt-1 text-3xl font-black">Graphs that keep you honest</h2>
      </header>
      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Expenses by Category" empty={expenseData.length === 0}>
          <ResponsiveContainer>
            <PieChart><Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={90} label>{expenseData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Fund Contributions" empty={contributionData.every((item) => item.value === 0)}>
          <ResponsiveContainer><BarChart data={contributionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Fund Balances Over Time" empty={balanceTrend.length === 0}>
          <ResponsiveContainer><LineChart data={balanceTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />{data.funds.map((fund, index) => <Line key={fund.name} dataKey={fund.name} stroke={COLORS[index % COLORS.length]} strokeWidth={2} dot={false} />)}</LineChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Subscription Spending by Category" empty={subscriptionData.length === 0}>
          <ResponsiveContainer><BarChart data={subscriptionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Income vs Expenses" empty={metrics.income === 0 && metrics.expenses === 0 && metrics.subscriptions === 0}>
          <ResponsiveContainer><BarChart data={comparison}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Available Trend" empty={availableTrend.length === 0}>
          <ResponsiveContainer><LineChart data={availableTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line dataKey="available" stroke="#2563eb" strokeWidth={3} /></LineChart></ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
