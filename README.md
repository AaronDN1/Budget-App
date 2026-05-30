# BudgetCommand

**A personal finance command center for planning paychecks, tracking expenses, managing funds, and staying in control of your money.**

BudgetCommand is a modern budgeting web app built for people who want more than a basic expense tracker. It brings income, expenses, subscriptions, fund goals, budget modes, paycheck planning, monthly snapshots, reports, cloud sync, themes, and mobile install support into one polished command center.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Cloud-3FCF8E?logo=supabase&logoColor=111111)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/explore/progressive-web-apps)

---

## Live App

**Live App:** [https://budgetcommand.vercel.app](https://budgetcommand.vercel.app)

---

## Preview

<!-- Add dashboard screenshot here -->
<!-- Add funds/paycheck planner screenshot here -->
<!-- Add mobile PWA screenshot here -->

No screenshot assets are currently included in this repository. Add real screenshots to the repo and reference them here when available.

---

## What BudgetCommand Helps Answer

BudgetCommand is designed around practical financial decisions:

- Where did my money go?
- Where should my next paycheck go?
- How much is left after expenses and subscriptions?
- Am I making progress toward my goals?

It combines budgeting, planning, tracking, and review into a single app experience that works on desktop and mobile.

---

## Feature Highlights

| Area | What it does |
| --- | --- |
| Dashboard command view | Summarizes income, expenses, subscriptions, available money, savings rate, budget health, setup progress, and month closeout actions. |
| Income tracking | Tracks recurring and one-time income sources with monthly normalization. |
| Expense tracking | Organizes fixed and variable expenses by category, recurrence, due date, and notes. |
| Subscription tracking | Tracks active/inactive subscriptions, billing cycles, categories, essentials, and monthly impact. |
| Funds and goals | Manages fund balances, goals, contributions, withdrawals, and contribution history. |
| Paycheck Planner | Splits a paycheck across budget allocations so users can plan where money should go before spending it. |
| Budget modes | Supports preset allocation strategies such as Balanced, Aggressive Wealth, Safety, Lifestyle, and Custom. |
| Custom allocations | Lets users tune allocation percentages for core funds. |
| Monthly progress snapshots | Saves historical budget snapshots for reporting and long-term progress tracking. |
| Reports and visualizations | Uses charts for expense categories, subscriptions, fund balances, contributions, and available money trends. |
| Theme selector | Includes multiple visual themes such as Command Cream, Slate Dark, Wall Street, Rose Capital, Ocean Ledger, and Minimal Gray. |
| Supabase cloud sync | Stores authenticated user budget data in Supabase with cloud-backed persistence. |
| PWA/mobile support | Can be installed to a phone home screen for an app-like mobile experience. |
| Backup and restore tools | Supports downloading a backup, restoring from backup, resetting account data, and saving monthly progress. |

---

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, CSS theme variables |
| Charts | Recharts |
| Icons | Lucide React |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Security | Supabase Row Level Security policies |
| Deployment | Vercel |
| Mobile | Progressive Web App support via `vite-plugin-pwa` |

---

## Project Structure

```text
src/
  components/   Reusable UI components and app shell pieces
  pages/        Dashboard, Income, Expenses, Subscriptions, Funds, Reports, Settings, Auth, Landing
  context/      Auth and budget data providers
  services/     Supabase data access and cloud sync helpers
  utils/        Calculations, formatting, and storage helpers
  data/         Default categories, budget modes, funds, and themes
  lib/          Supabase client setup

supabase/       Database schema and SQL setup files
public/         PWA icons and public assets
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AaronDN1/BudgetCommand.git
cd BudgetCommand
```

If your local folder name is different, `cd` into that project folder instead.

### 2. Install dependencies

```bash
npm install
```

### 3. Create local environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Do not commit real Supabase keys or environment files to GitHub.

### 4. Run the development server

```bash
npm run dev
```

The dev server is configured to run through Vite on `127.0.0.1`.

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## Supabase Setup

BudgetCommand requires a Supabase project for authentication and cloud-backed budget data.

1. Create a project at [supabase.com](https://supabase.com).
2. Add the project URL and publishable anon key to `.env.local`.
3. Open the Supabase SQL Editor.
4. Run the SQL files in the `supabase/` folder, starting with:

```text
supabase/schema.sql
```

The schema sets up profiles, income sources, expenses, subscriptions, funds, fund contributions, monthly snapshots, indexes, updated-at triggers, auth profile creation, and Row Level Security policies.

For authentication redirects, include both your deployed Vercel URL and local development URL in Supabase settings, for example:

```text
https://budgetcommand.vercel.app
http://127.0.0.1:5173
```

---

## PWA and Mobile Install

BudgetCommand can be installed to a phone home screen as a Progressive Web App.

On iPhone:

1. Open [https://budgetcommand.vercel.app](https://budgetcommand.vercel.app) in Safari.
2. Tap the Share button.
3. Tap **Add to Home Screen**.
4. Launch BudgetCommand from the new home screen icon.

The installed app behaves like a mobile app and receives updates from future Vercel deployments.

---

## Design Philosophy

BudgetCommand is built to feel like a personal finance operations center: clear, focused, and fast to scan. The goal is not to overwhelm users with financial noise, but to help them make the next good decision.

The app separates the major money questions into practical workflows:

- Track what comes in.
- Understand what goes out.
- Protect recurring obligations.
- Plan the next paycheck.
- Allocate money toward funds and goals.
- Save monthly progress.
- Review trends over time.

---

## Roadmap

Planned or potential improvements:

- Smarter paycheck recommendations
- Advanced custom fund allocations
- Better reports and historical trends
- Recurring financial review flow
- More mobile polish
- Optional AI-powered insights later

---

## Security and Privacy

- User data is stored in Supabase.
- Frontend environment keys should stay out of GitHub.
- Never use a Supabase service role key in the client app.
- The included schema uses Supabase Row Level Security policies to help isolate each user's data.

---

## Author

Created by **Aaron Nathans**

GitHub: [@AaronDN1](https://github.com/AaronDN1)

