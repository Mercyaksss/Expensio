"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {

  // ── Profile ──────────────────────────────────
  const [userName, setUserName]   = useState(() => readStorage("luma_userName", "User"));
  // Base64 image string, or null if no picture set
  const [profilePic, setProfilePic] = useState(() => readStorage("luma_profilePic", null));

  // ── Expenses + income ────────────────────────
  const [expenses, setExpenses] = useState(() => readStorage("luma_expenses", []));
  const [income,   setIncome]   = useState(() => readStorage("luma_income",   0));

  // ── Savings goal ──────────────────────────────
  // { label: "New Laptop", target: 150000 }
  const [goal, setGoal] = useState(() => readStorage("luma_goal", { label: "", target: 0 }));

  // ── Persist on every change ──────────────────
  useEffect(() => { writeStorage("luma_userName",   userName);   }, [userName]);
  useEffect(() => { writeStorage("luma_profilePic", profilePic); }, [profilePic]);
  useEffect(() => { writeStorage("luma_expenses",   expenses);   }, [expenses]);
  useEffect(() => { writeStorage("luma_income",     income);     }, [income]);
  useEffect(() => { writeStorage("luma_goal",       goal);       }, [goal]);

  // ── Actions ──────────────────────────────────

  const addExpense = (newExpense) => {
    setExpenses((prev) => [...prev, { ...newExpense, id: Date.now() }]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateIncome = (amount) => {
    setIncome(parseFloat(amount));
  };

  const updateName = (name) => {
    setUserName(name);
  };

  // Accepts a base64 string (or null to remove the picture)
  const updateProfilePic = (base64) => {
    setProfilePic(base64);
  };

  // Sets the savings goal — { label, target }
  const updateGoal = (label, target) => {
    setGoal({ label, target: parseFloat(target) });
  };

  // Wipes expenses, income, and name — keeps profile picture untouched
  // (remove the profilePic line below if you want it wiped too)
  const resetData = () => {
    setExpenses([]);
    setIncome(0);
    setUserName("User");
    setProfilePic(null);
    setGoal({ label: "", target: 0 });
    writeStorage("luma_expenses", []);
    writeStorage("luma_income", 0);
    writeStorage("luma_userName", "User");
    writeStorage("luma_goal", { label: "", target: 0 });
    writeStorage("luma_profilePic", null);
  };

  // ── Derived values ────────────────────────────

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const availableBalance = income - totalSpent;

  const spendingByCategory = expenses.reduce((acc, e) => {
    const cat = e.category.toLowerCase();
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const value = {
    userName,
    updateName,
    profilePic,
    updateProfilePic,
    expenses,
    addExpense,
    deleteExpense,
    income,
    updateIncome,
    totalSpent,
    availableBalance,
    spendingByCategory,
    goal,
    updateGoal,
    resetData,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses() must be used inside <ExpenseProvider>.");
  }
  return context;
}