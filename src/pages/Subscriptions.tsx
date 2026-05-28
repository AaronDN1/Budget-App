import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import SubscriptionForm from "../components/SubscriptionForm";
import { AppData, Subscription } from "../types";
import { calculateMonthlySubscriptionTotal, subscriptionToMonthly } from "../utils/calculations";
import { formatCurrency } from "../utils/formatters";
import { CalendarClock, CircleDollarSign, ToggleLeft, Wallet } from "lucide-react";

interface SubscriptionsProps {
  data: AppData;
  setData: (updater: (data: AppData) => AppData) => void;
}

export default function Subscriptions({ data, setData }: SubscriptionsProps) {
  const [editing, setEditing] = useState<Subscription | null>(null);
  const currency = data.settings.currencySymbol;
  const active = data.subscriptions.filter((item) => item.active);
  const inactive = data.subscriptions.filter((item) => !item.active);
  const nonessential = active.filter((item) => !item.essential).reduce((total, item) => total + subscriptionToMonthly(item), 0);
  const dueSoon = useMemo(() => {
    const now = new Date();
    const inTwoWeeks = new Date();
    inTwoWeeks.setDate(now.getDate() + 14);
    return active.filter((item) => item.billingDate && new Date(item.billingDate) >= now && new Date(item.billingDate) <= inTwoWeeks);
  }, [active]);

  const saveSubscription = (subscription: Subscription) => {
    setData((current) => ({
      ...current,
      subscriptions: current.subscriptions.some((item) => item.id === subscription.id)
        ? current.subscriptions.map((item) => (item.id === subscription.id ? subscription : item))
        : [subscription, ...current.subscriptions],
    }));
    setEditing(null);
  };

  const deleteSubscription = (id: string) => setData((current) => ({ ...current, subscriptions: current.subscriptions.filter((item) => item.id !== id) }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Subscriptions</p>
        <h2 className="mt-1 text-3xl font-black">Subscription control room</h2>
      </header>
      <SubscriptionForm editing={editing} onSave={saveSubscription} onCancel={() => setEditing(null)} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Monthly Cost" value={formatCurrency(calculateMonthlySubscriptionTotal(data.subscriptions), currency)} icon={Wallet} tone="blue" />
        <StatCard title="Yearly Cost" value={formatCurrency(calculateMonthlySubscriptionTotal(data.subscriptions) * 12, currency)} icon={CircleDollarSign} tone="green" />
        <StatCard title="Active" value={String(active.length)} icon={ToggleLeft} tone="slate" />
        <StatCard title="Nonessential" value={formatCurrency(nonessential, currency)} icon={CalendarClock} tone="red" />
      </div>
      <section className="panel p-5">
        <h3 className="text-lg font-bold">Active subscriptions</h3>
        {active.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No subscriptions added yet.</p>
        ) : (
          <div className="mt-4 grid gap-3">
            {active.map((subscription) => (
              <div key={subscription.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <p className="font-bold">{subscription.name}</p>
                  <p className="text-sm text-slate-500">{subscription.category} | {subscription.billingCycle} | {subscription.essential ? "essential" : "nonessential"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="mr-2 text-lg font-black">{formatCurrency(subscriptionToMonthly(subscription), currency)}/mo</p>
                  <button className="btn-secondary px-3" type="button" onClick={() => setEditing(subscription)}><Pencil className="h-4 w-4" /></button>
                  <button className="btn-danger px-3" type="button" onClick={() => deleteSubscription(subscription.id)}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-5">
          <h3 className="text-lg font-bold">Due soon</h3>
          {dueSoon.length === 0 ? <p className="mt-3 text-sm text-slate-500">No subscriptions due in the next 14 days.</p> : dueSoon.map((item) => <p key={item.id} className="mt-3 text-sm font-semibold">{item.name} on {item.billingDate}</p>)}
        </section>
        <section className="panel p-5">
          <h3 className="text-lg font-bold">Inactive subscriptions</h3>
          {inactive.length === 0 ? <p className="mt-3 text-sm text-slate-500">No inactive subscriptions.</p> : inactive.map((item) => <p key={item.id} className="mt-3 text-sm font-semibold">{item.name}</p>)}
        </section>
      </div>
    </div>
  );
}
