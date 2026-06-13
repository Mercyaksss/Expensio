"use client";

import React, { useState } from "react";
import { useExpenses } from "./context/ExpenseContext";
import CreditCard from "./components/creditCard/creditCard";
import RecentExpensesCard from "./components/recentExpensesCard/recentExpensesCard";
import FinancialGoalsCard from "./components/financialGoalsCard/financialGoalsCard";
import ExpensesAnalysis from "./components/expensesAnalysis/expensesAnalysis";
import AddExpenseModal from "./components/addExpenseModal/addExpenseModal";
import SetIncomeModal from "./components/setIncomeModal/setIncomeModal";
import { Plus } from "lucide-react";
import TotalIncome from "./components/totalIncome/totalIncome";
import TotalExpenses from "./components/totalExpenses/totalExpenses";

function Home() {
  // Pull the live user name — updates instantly when changed in Settings
  const { userName } = useExpenses();

  // Show only the first name in the greeting e.g. "Mercy Yakubu" → "Mercy"
  const firstName = userName?.split(" ")[0] ?? userName;

  const [addOpen,    setAddOpen]    = useState(false);
  const [incomeOpen, setIncomeOpen] = useState(false);

  return (
    <section className="page">

      {/* Nav — greeting uses live first name from context */}
      <nav>
        <h2>Welcome <span>{firstName}</span> </h2>
        <div className="nav-actions">
          <button className="income-btn"      onClick={() => setIncomeOpen(true)}>Set Income</button>
          <button className="add-expense-btn" onClick={() => setAddOpen(true)}> <Plus size={20}/> Add Expense</button>
        </div>
      </nav>

      {/* Dashboard grid */}
      <div className="grid">
        <CreditCard />
        <TotalIncome/>
        <TotalExpenses/>
        <ExpensesAnalysis />
        <RecentExpensesCard />
        <FinancialGoalsCard />
      </div>

      {/* Modals */}
      <AddExpenseModal  isOpen={addOpen}    onClose={() => setAddOpen(false)}    />
      <SetIncomeModal   isOpen={incomeOpen} onClose={() => setIncomeOpen(false)} />

    </section>
  );
}

export default Home;