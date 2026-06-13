"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────
// Helper — safely read from localStorage
// Returns the parsed value, or `fallback` if
// the key doesn't exist or JSON.parse fails
// ─────────────────────────────────────────────
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// ─────────────────────────────────────────────
// Helper — safely write to localStorage
// ─────────────────────────────────────────────
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export const ExpenseContext = createContext(null);

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────
export function ExpenseProvider({ children }) {

  // ── State — initialised from localStorage so data survives refresh ──
  const [userName, setUserName] = useState(() => readStorage("luma_userName", "Mercy Yakubu"));
  const [expenses, setExpenses] = useState(() => readStorage("luma_expenses", []));
  const [income,   setIncome]   = useState(() => readStorage("luma_income",   0));

  // ── Persist to localStorage whenever state changes ──
  useEffect(() => { writeStorage("luma_userName", userName); }, [userName]);
  useEffect(() => { writeStorage("luma_expenses", expenses); }, [expenses]);
  useEffect(() => { writeStorage("luma_income",   income);   }, [income]);

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

  // Wipes expenses and income but keeps the user's name
  const resetData = () => {
    setExpenses([]);
    setIncome(0);
    // Also clear localStorage keys directly so stale data doesn't linger
    writeStorage("luma_expenses", []);
    writeStorage("luma_income",   0);
  };

  // ── Derived values ────────────────────────────

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const availableBalance = income - totalSpent;

  // e.g. { savings: 15000, transport: 8000 }
  const spendingByCategory = expenses.reduce((acc, e) => {
    const cat = e.category.toLowerCase();
    acc[cat] = (acc[cat] || 0) + e.amount;
    return acc;
  }, {});

  const value = {
    userName,
    updateName,
    expenses,
    addExpense,
    deleteExpense,
    income,
    updateIncome,
    totalSpent,
    availableBalance,
    spendingByCategory,
    resetData,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

// ─────────────────────────────────────────────
// CUSTOM HOOK
// Usage: const { expenses, addExpense } = useExpenses();
// ─────────────────────────────────────────────
export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses() must be used inside <ExpenseProvider>.");
  }
  return context;
}