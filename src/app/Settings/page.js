"use client";

import React, { useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import "./settings.scss";

function SettingsPage() {
  const { income, updateIncome, updateName, userName, resetData } = useExpenses();

  // ── Profile section state ──
  // Pre-filled with the current name from context
  const [name,      setName]      = useState(userName || "");
  const [nameSaved, setNameSaved] = useState(false); // shows a brief success message

  // ── Income section state ──
  // Pre-filled with the current income from context
  const [incomeVal,   setIncomeVal]   = useState(income || "");
  const [incomeSaved, setIncomeSaved] = useState(false);

  // ── Reset confirmation state ──
  // Toggles a confirmation prompt before wiping data
  const [confirmReset, setConfirmReset] = useState(false);

  // Save the updated name to context
  const handleSaveName = () => {
    if (!name.trim()) return;
    updateName(name.trim());
    setNameSaved(true);
    // Clear the success message after 2 seconds
    setTimeout(() => setNameSaved(false), 2000);
  };

  // Save the updated income to context
  const handleSaveIncome = () => {
    if (!incomeVal || parseFloat(incomeVal) <= 0) return;
    updateIncome(incomeVal);
    setIncomeSaved(true);
    setTimeout(() => setIncomeSaved(false), 2000);
  };

  // Wipe all expenses from context after confirmation
  const handleReset = () => {
    resetData();
    setConfirmReset(false);
  };

  return (
    <section className="page settings-page">

      {/* ── Page header ── */}
      <nav>
        <div>
          <h2>Settings</h2>
          <p className="page-subtitle">Manage your profile and preferences</p>
        </div>
      </nav>

      <div className="settings-sections">

        {/* ── Profile section ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <p className="section-label">Profile</p>
          </div>
          <div className="settings-card-body">
            <div className="field">
              <label htmlFor="full-name">Full Name</label>
              <input
                id="full-name"
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => { setName(e.target.value); setNameSaved(false); }}
              />
            </div>
            <div className="action-row">
              <button className="save-btn" onClick={handleSaveName}>
                Save Changes
              </button>
              {/* Brief success confirmation */}
              {nameSaved && <span className="success-msg">✓ Name updated</span>}
            </div>
          </div>
        </div>

        {/* ── Income section ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <p className="section-label">Income</p>
          </div>
          <div className="settings-card-body">
            <div className="field">
              <label htmlFor="monthly-income">Monthly Income (₦)</label>
              <input
                id="monthly-income"
                type="number"
                value={incomeVal}
                placeholder="e.g. 500000"
                onChange={(e) => { setIncomeVal(e.target.value); setIncomeSaved(false); }}
              />
            </div>
            <div className="action-row">
              <button className="save-btn" onClick={handleSaveIncome}>
                Update Income
              </button>
              {incomeSaved && <span className="success-msg">✓ Income updated</span>}
            </div>
          </div>
        </div>

        {/* ── Danger zone — reset all data ── */}
        <div className="settings-card danger-card">
          <div className="settings-card-header">
            <p className="section-label">Danger Zone</p>
          </div>
          <div className="settings-card-body">
            <p className="danger-desc">
              This will permanently delete all your expenses. This action cannot be undone.
            </p>

            {/* First click shows the confirmation prompt */}
            {!confirmReset ? (
              <button className="reset-btn" onClick={() => setConfirmReset(true)}>
                Reset All Data
              </button>
            ) : (
              // Confirmation row — user must confirm before data is wiped
              <div className="confirm-row">
                <p className="confirm-text">Are you sure? This cannot be undone.</p>
                <div className="confirm-actions">
                  <button className="cancel-btn" onClick={() => setConfirmReset(false)}>
                    Cancel
                  </button>
                  <button className="confirm-reset-btn" onClick={handleReset}>
                    Yes, delete everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

export default SettingsPage;