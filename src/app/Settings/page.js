"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useExpenses } from "../context/ExpenseContext";
import "./settings.scss";

function SettingsPage() {
  const {
    income, updateIncome,
    userName, updateName,
    profilePic, updateProfilePic,
    goal, updateGoal,
    resetData,
  } = useExpenses();

  // ── Profile section ──
  const [name,      setName]      = useState(userName || "");
  const [nameSaved, setNameSaved] = useState(false);
  const fileInputRef = useRef(null); // lets us trigger the hidden file input

  // ── Income section ──
  const [incomeVal,   setIncomeVal]   = useState(income || "");
  const [incomeSaved, setIncomeSaved] = useState(false);

  // ── Goal section ──
  const [goalLabel,  setGoalLabel]  = useState(goal?.label  || "");
  const [goalTarget, setGoalTarget] = useState(goal?.target || "");
  const [goalSaved,  setGoalSaved]  = useState(false);

  // ── Reset confirmation ──
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveName = () => {
    if (!name.trim()) return;
    updateName(name.trim());
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleSaveIncome = () => {
    if (!incomeVal || parseFloat(incomeVal) <= 0) return;
    updateIncome(incomeVal);
    setIncomeSaved(true);
    setTimeout(() => setIncomeSaved(false), 2000);
  };

  const handleSaveGoal = () => {
    if (!goalLabel.trim() || !goalTarget || parseFloat(goalTarget) <= 0) return;
    updateGoal(goalLabel.trim(), goalTarget);
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 2000);
  };

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
  };

  // ── Profile picture upload ──
  // Converts the selected file to a base64 string and saves it to context
  const handlePicUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation — only images, max ~2MB to keep localStorage happy
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please choose one under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is the base64 data URL — store it directly
      updateProfilePic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Removes the current profile picture
  const handleRemovePic = () => {
    updateProfilePic(null);
  };

  return (
    <section className="page settings-page">

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

            {/* Profile picture upload */}
            <div className="pic-upload-row">
              <div className="pic-preview">
                {profilePic ? (
                  <Image src={profilePic} alt="Profile picture" fill sizes="64px" />
                ) : (
                  <span className="pic-placeholder">
                    {name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <div className="pic-actions">
                {/* Hidden file input — triggered by the visible button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePicUpload}
                  style={{ display: "none" }}
                />
                <button className="save-btn small" onClick={() => fileInputRef.current.click()}>
                  Upload Photo
                </button>
                {profilePic && (
                  <button className="cancel-btn small" onClick={handleRemovePic}>
                    Remove
                  </button>
                )}
              </div>
            </div>

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

        {/* ── Savings goal section ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <p className="section-label">Savings Goal</p>
          </div>
          <div className="settings-card-body">
            <div className="field-row">
              <div className="field">
                <label htmlFor="goal-label">Goal Name</label>
                <input
                  id="goal-label"
                  type="text"
                  value={goalLabel}
                  placeholder="e.g. New Laptop"
                  onChange={(e) => { setGoalLabel(e.target.value); setGoalSaved(false); }}
                />
              </div>
              <div className="field">
                <label htmlFor="goal-target">Target Amount (₦)</label>
                <input
                  id="goal-target"
                  type="number"
                  value={goalTarget}
                  placeholder="e.g. 150000"
                  onChange={(e) => { setGoalTarget(e.target.value); setGoalSaved(false); }}
                />
              </div>
            </div>
            <div className="action-row">
              <button className="save-btn" onClick={handleSaveGoal}>
                Save Goal
              </button>
              {goalSaved && <span className="success-msg">✓ Goal updated</span>}
            </div>
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="settings-card danger-card">
          <div className="settings-card-header">
            <p className="section-label">Danger Zone</p>
          </div>
          <div className="settings-card-body">
            <p className="danger-desc">
              This will permanently delete all your expenses, income, and goal data. This action cannot be undone.
            </p>

            {!confirmReset ? (
              <button className="reset-btn" onClick={() => setConfirmReset(true)}>
                Reset All Data
              </button>
            ) : (
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