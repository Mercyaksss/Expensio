# Expensio 💸

A modern, dark-themed personal expense tracking web application built with Next.js, React, and Recharts. Expensio helps users track their income, monitor spending by category, visualise financial data, and work toward savings goals — all within a clean, responsive dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture & Approach](#architecture--approach)
- [State Management](#state-management)
- [Data Persistence](#data-persistence)
- [Components](#components)
- [Responsive Design](#responsive-design)
- [Getting Started](#getting-started)
- [Future Improvements](#future-improvements)

---

## Overview

Expensio is a client-side expense tracker with a multi-page layout. Users can set their monthly income, log expenses under categories (Savings, Transport, Data, Work, Tech), view spending breakdowns on a chart, track a savings goal, and manage all entries from a dedicated expenses page.

All data lives in the browser via `localStorage` so it persists across page refreshes without a backend.

---

## Features

- **Dashboard** — at-a-glance view of available balance, income, total spent, spending by category, recent expenses, and savings goal progress
- **Add Expense** — modal form with name, category, amount, and date fields
- **Set Income** — separate modal to declare monthly income; drives the available balance calculation
- **Expenses Page** — full sortable table of all expenses with edit and delete actions
- **Settings Page** — update profile name, update income, and reset all data
- **Savings Goal** — semicircle gauge showing progress toward a target using spending in the Savings category
- **Spending Analysis** — area chart (Recharts) visualising total spend per category
- **Responsive Sidebar** — hidden on tablet/mobile with a floating edge tab that slides it in
- **localStorage Persistence** — all data survives page refresh

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| UI Library | React 18 |
| Styling | SCSS Modules with CSS custom properties |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Poppins (UI), Roboto Mono (card figures) |
| State | React Context API |
| Persistence | localStorage |

---

## Project Structure

```
app/
├── components/
│   ├── sidebar/
│   │   ├── sidebar.js              # Responsive sidebar with slide-in tab
│   │   └── sidebar.scss
│   ├── creditCard/
│   │   ├── creditCard.js           # Available balance card
│   │   └── creditCard.scss
│   ├── totalIncome/
│   │   ├── totalIncome.js          # Income KPI card
│   │   └── totalIncome.scss
│   ├── totalExpenses/
│   │   ├── totalExpenses.js        # Total spent KPI card
│   │   └── totalExpenses.scss
│   ├── expensesAnalysis/
│   │   ├── expensesAnalysis.js     # Recharts area chart by category
│   │   └── expensesAnalysis.scss
│   ├── recentExpensesCard/
│   │   ├── recentExpensesCard.js   # Last 4 expenses list
│   │   └── recentExpensesCard.scss
│   ├── financialGoalsCard/
│   │   ├── financialGoalsCard.js   # Semicircle savings gauge
│   │   └── financialGoalsCard.scss
│   ├── addExpenseModal/
│   │   ├── AddExpenseModal.js      # Form modal — add new expense
│   │   └── AddExpenseModal.scss
│   ├── setIncomeModal/
│   │   ├── SetIncomeModal.js       # Form modal — set monthly income
│   │   └── SetIncomeModal.scss
│   └── editExpenseModal/
│       ├── EditExpenseModal.js     # Form modal — edit existing expense
│       └── EditExpenseModal.scss
├── context/
│   └── ExpenseContext.js           # Global state + localStorage sync
├── Expenses/
│   ├── page.js                     # All expenses table with edit/delete
│   └── expenses.scss
├── Settings/
│   ├── page.js                     # Profile, income, danger zone
│   └── settings.scss
├── page.js                         # Dashboard
├── layout.js                       # Root layout — wraps app in provider
└── globals.scss                    # Design tokens, grid, base styles
```

---

## Architecture & Approach

### Single Source of Truth

All application data (expenses, income, username) lives in a single React Context (`ExpenseContext`). Every component reads from and writes to this context — no prop drilling, no duplicated state.

```
ExpenseContext
├── userName          → Sidebar, dashboard greeting, settings
├── income            → Credit card, income KPI, settings
├── expenses[]        → All cards, expenses page, analysis chart
├── totalSpent        → Credit card, expenses KPI, recent expenses footer
├── availableBalance  → Credit card (income - totalSpent)
└── spendingByCategory → Analysis chart, savings goal
```

### Derived State

Values like `totalSpent`, `availableBalance`, and `spendingByCategory` are computed inside the context from the raw `expenses` array rather than stored separately. This means they're always in sync — adding or deleting an expense instantly updates every card that depends on them.

```js
const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
const availableBalance = income - totalSpent;
const spendingByCategory = expenses.reduce((acc, e) => {
  acc[e.category] = (acc[e.category] || 0) + e.amount;
  return acc;
}, {});
```

### Hydration Safety

Because localStorage only exists in the browser, Next.js server-rendering produces `0`/`[]` for initial state while the client reads real values — causing a React hydration mismatch. Two strategies are used:

1. **Context initialisation** — state is initialised with lazy `useState` initialisers that read from localStorage only at first render (client-side only).
2. **`mounted` guard** — components that display localStorage-derived values (e.g. CreditCard) use a `mounted` flag so the server and client render the same placeholder (`—`) until the component mounts.

```js
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
// then: {mounted ? realValue : '—'}
```

---

## State Management

The context exposes the following actions:

| Action | Description |
|---|---|
| `addExpense(expense)` | Appends a new expense object with a `Date.now()` id |
| `deleteExpense(id)` | Filters the expense out by id |
| `updateIncome(amount)` | Sets the monthly income figure |
| `updateName(name)` | Updates the user's display name |
| `resetData()` | Clears all expenses and resets income to 0 |

The edit flow uses a delete + add strategy — `EditExpenseModal` deletes the original entry and adds an updated one — keeping the context API simple without needing a dedicated `editExpense` action.

---

## Data Persistence

Three keys are written to `localStorage` whenever their corresponding state changes:

| Key | Value |
|---|---|
| `luma_userName` | String — the user's display name |
| `luma_income` | Number — monthly income |
| `luma_expenses` | JSON array — all expense objects |

Both read and write operations are wrapped in `try/catch` so the app fails silently in private browsing mode or when storage is full.

```js
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
```

---

## Components

### Dashboard Grid

The dashboard uses a CSS Grid layout with explicit `grid-column` and `grid-row` placements per card. The grid is `4 columns × 3 rows` on desktop, collapsing to `2 columns` at 850px and `1 column` at 610px. All explicit column placements are reset to `auto` at 610px to allow the single-column flow.

### Credit Card

Displays available balance, card holder name, and a decorative map background image. Uses a `mounted` guard to prevent hydration errors from localStorage-initialised values.

### Spending Analysis (Recharts AreaChart)

Maps `spendingByCategory` from context to a flat array with one entry per category. Uses a `linearGradient` SVG definition for the purple-to-transparent fill under the line. The custom tooltip is defined outside the main component to prevent remounting on every render.

### Savings Goal (Recharts PieChart)

A `PieChart` with `startAngle={180}` and `endAngle={0}` renders a top semicircle. `cy="100%"` pushes the pie centre to the bottom of the wrapper so only the upper half is visible. Two slices — Saved (purple) and Remaining (dim) — must always both be present in `chartData`; a single slice would fill the entire arc regardless of its value.

### Sidebar

On desktop the sidebar is a fixed-width flex child. On tablet/mobile (≤1024px) it switches to `position: fixed`, translates off-screen, and slides in via a CSS transition when `.sidebar--open` is applied. A floating pill tab on the left edge triggers open/close. Clicking the overlay behind the sidebar also closes it.

---

## Responsive Design

| Breakpoint | Behaviour |
|---|---|
| > 1024px | Full sidebar visible, 4-column grid |
| ≤ 1024px | Sidebar hidden, slide-in tab visible, grid stays 4 columns |
| ≤ 850px | Grid height becomes `auto`, cards stack more naturally |
| ≤ 610px | Grid collapses to 1 column, all explicit card placements reset |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/your-username/expensio.git
cd expensio
npm install
```

### Dependencies

```bash
npm install chart.js recharts lucide-react
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Future Improvements

- **Backend / database** — replace localStorage with a real database (e.g. Supabase or MongoDB) so data syncs across devices
- **Authentication** — user login so multiple users can have separate data
- **Dynamic savings goal** — let users set and update their own target amount instead of a hardcoded constant
- **Multiple goals** — track several savings goals simultaneously with individual progress
- **Date filtering** — filter expenses by date range on the analysis chart and expenses page
- **Export** — download expenses as a CSV file
- **Recurring expenses** — mark expenses as monthly recurring so they auto-populate
- **Budget limits** — set a monthly spending cap per category with alerts when approaching the limit
- **Dark/light theme toggle** — the CSS variable system is already set up for this

---

## Author

Built by **Mercy Yakubu** — a personal finance dashboard project.

---

*Expensio — know where your money goes.*