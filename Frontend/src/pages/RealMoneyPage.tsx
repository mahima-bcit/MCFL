import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { displayCategory } from "../utils/categoryUtils";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CircleDollarSign,
  Gift,
  Home,
  Music,
  Pencil,
  PiggyBank,
  Plus,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";
import "../RealMoneyPage.css";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  createRealMoneyEntry,
  getRealMoneyCategories,
  getRealMoneySummary,
} from "../services/realMoneyApi";
import { createGoal, getActiveGoal, type ActiveGoal, type CreateGoalPayload } from "../services/goalApi";
import type {
  CashInCategory,
  CashOutCategory,
  EntryType,
  RealMoneyEntry,
  RealMoneySummary,
} from "../types/realMoney";

const fallbackCashInCategories: CashInCategory[] = [
  "Paycheck",
  "Gift",
  "Allowance / Parents",
  "Other",
];

const fallbackCashOutCategories: CashOutCategory[] = ["Want", "Need", "Fun", "Save"];

const categoryIcons: Record<string, React.ElementType> = {
  "Paycheck": Briefcase,
  "Gift": Gift,
  "Allowance / Parents": Users,
  "Other": Plus,
  "Want": ShoppingBag,
  "Need": Home,
  "Fun": Music,
  "Save": PiggyBank,
};

const emptyRealMoneySummary: RealMoneySummary = {
  totalCashIn: 0,
  totalCashOut: 0,
  net: 0,
  entries: [],
};

export default function RealMoneyPage() {
  const [entryType, setEntryType] = useState<EntryType>("cashIn");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CashInCategory | CashOutCategory
  >("Paycheck");
  const [comment, setComment] = useState("");
  const [summary, setSummary] = useState<RealMoneySummary>(
    emptyRealMoneySummary,
  );
  const [categories, setCategories] = useState({
    cashIn: fallbackCashInCategories,
    cashOut: fallbackCashOutCategories,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [entryModal, setEntryModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const [activeGoal, setActiveGoal] = useState<ActiveGoal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState<CreateGoalPayload>({ goalTitle: "", targetAmount: 0 });
  const [goalError, setGoalError] = useState("");
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const goalTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadRealMoneySummary();
    getRealMoneyCategories()
      .then((data) => setCategories(data))
      .catch(() => { /* keep fallback */ });
    getActiveGoal().then(setActiveGoal);
  }, []);

  function openGoalModal() {
    setGoalForm({ goalTitle: "", targetAmount: 0 });
    setGoalError("");
    setShowGoalModal(true);
    setTimeout(() => goalTitleRef.current?.focus(), 50);
  }

  async function saveGoal(e: FormEvent) {
    e.preventDefault();
    if (!goalForm.goalTitle.trim()) {
      setGoalError("Goal title is required.");
      return;
    }
    if (!goalForm.targetAmount || goalForm.targetAmount <= 0) {
      setGoalError("Please enter a target amount greater than $0.");
      return;
    }
    setIsSavingGoal(true);
    try {
      const saved = await createGoal(goalForm);
      setActiveGoal(saved);
      setShowGoalModal(false);
    } catch {
      setGoalError("Could not save goal. Please try again.");
    } finally {
      setIsSavingGoal(false);
    }
  }

  async function loadRealMoneySummary() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const data = await getRealMoneySummary();
      setSummary({
        ...emptyRealMoneySummary,
        ...data,
        entries: data.entries || [],
      });
    } catch (error) {
      console.error("Could not load real money summary.", error);
      setErrorMessage("Could not load real money data. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }

  const availableCategories = useMemo(() => {
    return entryType === "cashIn" ? categories.cashIn : categories.cashOut;
  }, [entryType, categories]);

  function handleTypeChange(type: EntryType) {
    setEntryType(type);
    setSelectedCategory(type === "cashIn" ? "Paycheck" : "Want");
  }

  async function handleAddEntry(e: FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setEntryModal({
        title: "Enter an amount",
        message: "Please enter an amount greater than $0.",
      });
      return;
    }

    try {
      setIsSaving(true);

      await createRealMoneyEntry({
        type: entryType,
        amount: numericAmount,
        category: selectedCategory,
        comment,
      });

      setEntryModal({
        title: "Transaction added",
        message:
          entryType === "cashIn"
            ? "You successfully added a new Cash In transaction."
            : "You successfully added a new Cash Out transaction.",
      });

      setAmount("");
      setComment("");
      await loadRealMoneySummary();
    } catch (error) {
      console.error("Could not save transaction.", error);
      setEntryModal({
        title: "Could not save",
        message: "Could not save transaction. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <main className="real-money-page">
        <section className="real-money-header">
          <div>
            <h1>Real Money</h1>
            <p>Track your cash in, cash out, and current money balance.</p>
          </div>

          <div className="real-money-header-actions">
            <Link to="/real-money/transactions" className="real-money-add-top-btn">
              View All Transactions
            </Link>
            <Link to="/real-money/picture" className="real-money-add-top-btn">
              Money Picture
            </Link>
          </div>
        </section>

        {isLoading && (
          <section className="real-money-card">
            <p>Loading real money data...</p>
          </section>
        )}

        {errorMessage && (
          <section className="real-money-card">
            <p>{errorMessage}</p>
          </section>
        )}

        {!isLoading && (
          <>
            <section className="real-money-card real-money-goal-card">
              {activeGoal ? (
                <>
                  <div className="stat-card-goal-header">
                    <div className="stat-icon-circle">
                      <Target size={20} />
                    </div>
                    <div className="goal-header-text">
                      <strong className="stat-label">Your Goal</strong>
                      <p className="stat-goal-desc">{activeGoal.goalTitle}</p>
                    </div>
                    <button
                      type="button"
                      className="goal-edit-btn"
                      onClick={openGoalModal}
                      title="Edit Goal"
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill progress-bar-animated"
                      style={{
                        "--goal-pct": `${Math.min(100, activeGoal.targetAmount > 0 ? (activeGoal.currentSavedAmount / activeGoal.targetAmount) * 100 : 0)}%`,
                      } as React.CSSProperties}
                    />
                  </div>
                  <div className="stat-goal-footer">
                    <span>${activeGoal.currentSavedAmount.toFixed(2)} / ${activeGoal.targetAmount.toFixed(2)}</span>
                    <span className="goal-pct-label">
                      {Math.min(100, activeGoal.targetAmount > 0 ? Math.round((activeGoal.currentSavedAmount / activeGoal.targetAmount) * 100) : 0)}%
                    </span>
                    <span>By {activeGoal.targetDate ?? "No target date"}</span>
                  </div>
                </>
              ) : (
                <button type="button" className="goal-empty-prompt goal-empty-prompt--row" onClick={openGoalModal}>
                  <div className="goal-empty-icon">
                    <Target size={22} />
                  </div>
                  <strong className="goal-empty-title">Set a savings goal</strong>
                  <span className="goal-empty-sub">Track what you're working towards</span>
                  <span className="goal-empty-cta">
                    <Plus size={14} strokeWidth={2.5} />
                    Add Goal
                  </span>
                </button>
              )}
            </section>

            <div className="real-money-stats-row">
              <div className="stat-mini-card">
                <p>Balance</p>
                <strong className={summary.net >= 0 ? "cash-in" : "cash-out"}>
                  ${summary.net.toFixed(2)}
                </strong>
              </div>
              <div className="stat-mini-card">
                <p>Total In</p>
                <strong className="cash-in">+${summary.totalCashIn.toFixed(2)}</strong>
              </div>
              <div className="stat-mini-card">
                <p>Total Out</p>
                <strong className="cash-out">-${summary.totalCashOut.toFixed(2)}</strong>
              </div>
            </div>

            <section id="add-entry" className="real-money-card">
              <h2>Add Transaction</h2>

              <form onSubmit={handleAddEntry}>
                <div className="entry-toggle">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("cashIn")}
                    className={entryType === "cashIn" ? "active" : ""}
                  >
                    Cash In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange("cashOut")}
                    className={entryType === "cashOut" ? "active active-out" : ""}
                  >
                    Cash Out
                  </button>
                </div>

                <div className="amount-field">
                  <label className="field-label">Amount</label>
                  <div className="amount-input-wrap">
                    <span>$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="entry-category-section">
                  <label className="field-label">Category</label>
                  <div className="category-chip-row">
                    {availableCategories.map((category) => {
                      const Icon = categoryIcons[category] ?? CircleDollarSign;
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category ? "selected" : ""}
                        >
                          <Icon size={20} strokeWidth={1.8} />
                          <span>{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="note-field">
                  <label className="field-label">Note (Optional)</label>
                  <input
                    className="comment-input"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a quick note..."
                  />
                </div>

                <button type="submit" className="save-entry-btn" disabled={isSaving}>
                  <Plus size={18} strokeWidth={2.5} />
                  {isSaving ? "Saving..." : "Add Transaction"}
                </button>
              </form>
            </section>

            <section className="real-money-card">
              <h2>Latest Transactions</h2>

              <div className="recent-entry-list">
                {summary.entries.slice(0, 5).map((entry: RealMoneyEntry) => (
                  <div key={entry.id} className="recent-entry">
                    <div>
                      <strong>
                        {entry.type === "cashIn" ? "Cash In" : "Cash Out"}
                      </strong>
                      <span>
                        {displayCategory(entry.category)}
                        {entry.comment ? ` · ${entry.comment}` : ""}
                      </span>
                    </div>
                    <strong className={entry.type === "cashIn" ? "cash-in" : "cash-out"}>
                      {entry.type === "cashIn" ? "+" : "-"}${entry.amount.toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {entryModal && (
        <div className="money-modal-backdrop" role="dialog" aria-modal="true">
          <div className="money-modal">
            <h2>{entryModal.title}</h2>
            <p>{entryModal.message}</p>
            <button type="button" className="money-modal-button" onClick={() => setEntryModal(null)}>
              OK
            </button>
          </div>
        </div>
      )}

      {showGoalModal && (
        <div className="goal-modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="goal-modal-title">Set Your Goal</h3>
            <form onSubmit={saveGoal} className="goal-modal-form">
              <label className="goal-modal-label">
                Goal Title
                <input
                  ref={goalTitleRef}
                  className="goal-modal-input"
                  type="text"
                  maxLength={100}
                  placeholder="e.g. Save for an iPad"
                  value={goalForm.goalTitle}
                  onChange={(e) => setGoalForm((f) => ({ ...f, goalTitle: e.target.value }))}
                />
              </label>
              <label className="goal-modal-label">
                Target Amount ($)
                <input
                  className="goal-modal-input"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 300"
                  value={goalForm.targetAmount || ""}
                  onChange={(e) => setGoalForm((f) => ({ ...f, targetAmount: parseFloat(e.target.value) }))}
                />
              </label>
              <label className="goal-modal-label">
                Target Date (optional)
                <input
                  className="goal-modal-input"
                  type="date"
                  value={goalForm.targetDate ?? ""}
                  onChange={(e) => setGoalForm((f) => ({ ...f, targetDate: e.target.value || undefined }))}
                />
              </label>
              {goalError && <p className="goal-modal-error">{goalError}</p>}
              <div className="goal-modal-actions">
                <button type="button" className="goal-modal-cancel" onClick={() => setShowGoalModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="goal-modal-save" disabled={isSavingGoal}>
                  {isSavingGoal ? "Saving…" : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

