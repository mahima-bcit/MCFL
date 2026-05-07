import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
  Pencil,
  Plus,
  ShieldCheck,
  Star,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import "../DashboardPage.css";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getDashboardSummary } from "../services/dashboardApi";
import { regenerateParentFeedbackToken } from "../services/parentFeedbackApi";
import { createGoal } from "../services/goalApi";
import type { DashboardData } from "../types/dashboard";

const sampleDashboardData: DashboardData = {
  featuredTitle: "Try a 2-minute scenario",
  featuredDescription:
    "Spin the wheel and see how you'd handle a money decision.",
  gameBalance: 0,
  confidence: 0,
  goalCurrent: 0,
  goalTarget: 0,
  goalDueLabel: "",
  goalTitle: "Save towards your goal",
  monthlyNet: 0,
  gameMoneyPicture: { want: 0, need: 0, fun: 0, save: 0 },
  realMoneySnapshot: { availableBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, monthlyNet: 0 },
  parentFeedback: {
    name: "",
    link: "",
  },
};

function mergeDashboardData(
  apiData: Partial<DashboardData> | null | undefined,
): DashboardData {
  return {
    ...sampleDashboardData,
    ...apiData,
    parentFeedback: {
      ...sampleDashboardData.parentFeedback,
      ...(apiData?.parentFeedback || {}),
    },
  };
}

function formatMoney(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value)}`;
}

function confidenceToStars(score: number): number {
  if (score <= 20) return 1;
  if (score <= 40) return 2;
  if (score <= 60) return 3;
  if (score <= 80) return 4;
  return 5;
}

function StarRating({ score }: { score: number }) {
  const filled = confidenceToStars(score);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= filled ? (
          <Star key={i} size={24} className="star-filled" fill="currentColor" />
        ) : (
          <Star key={i} size={24} className="star-empty" />
        ),
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ goalTitle: "", targetAmount: "", targetDate: "" });
  const [goalError, setGoalError] = useState("");
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const goalTitleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isCancelled = false;

    getDashboardSummary()
      .then((apiData) => {
        if (isCancelled) return;
        setDashboardData(mergeDashboardData(apiData));
      })
      .catch((error) => {
        if (isCancelled) return;
        console.error("Dashboard data did not load from backend.", error);
        setDashboardData(sampleDashboardData);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="dashboard-shell">
          <div className="dashboard-content">
            <div className="dashboard-loading">Loading your dashboard…</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const goalPercent = Math.min(
    100,
    Math.round(
      (dashboardData.goalCurrent / Math.max(dashboardData.goalTarget, 1)) * 100,
    ),
  );

  const confidencePercent = Math.min(
    100,
    Math.max(0, dashboardData.confidence),
  );

  const parentFeedbackUrl = dashboardData.parentFeedback.link;

  function copyLink() {
    navigator.clipboard.writeText(parentFeedbackUrl).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  async function regenerateLink() {
    setIsRegenerating(true);
    try {
      await regenerateParentFeedbackToken();
      const fresh = await getDashboardSummary();
      setDashboardData(mergeDashboardData(fresh));
    } catch (err) {
      console.error("Failed to regenerate parent feedback link.", err);
    } finally {
      setIsRegenerating(false);
    }
  }

  function openGoalModal() {
    setGoalForm({ goalTitle: "", targetAmount: "", targetDate: "" });
    setGoalError("");
    setShowGoalModal(true);
    setTimeout(() => goalTitleRef.current?.focus(), 50);
  }

  async function saveGoal(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(goalForm.targetAmount);
    if (!goalForm.goalTitle.trim()) {
      setGoalError("Goal title is required.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setGoalError("Enter a valid target amount.");
      return;
    }
    setGoalError("");
    setIsSavingGoal(true);
    try {
      await createGoal({
        goalTitle: goalForm.goalTitle.trim(),
        targetAmount: amount,
        targetDate: goalForm.targetDate || undefined,
      });
      const fresh = await getDashboardSummary();
      setDashboardData(mergeDashboardData(fresh));
      setShowGoalModal(false);
    } catch (err) {
      console.error("Failed to save goal.", err);
      setGoalError("Could not save goal. Please try again.");
    } finally {
      setIsSavingGoal(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="dashboard-shell">
        <div className="dashboard-content">

          {/* 1. Quick Start Banner */}
          <Link
            to="/game"
            className="scenario-banner scenario-banner-clickable"
          >
            <div className="scenario-banner-copy">
              <span className="scenario-badge">Quick Start</span>
              <h2>{dashboardData.featuredTitle}</h2>
              <p>{dashboardData.featuredDescription}</p>
            </div>
            <div className="scenario-banner-arrow">
              <ChevronRight size={20} />
            </div>
          </Link>

          {/* 2. Game Stats */}
          <section className="section-block">
            <div className="section-heading-row">
              <CircleDollarSign size={20} className="section-heading-icon" />
              <h2>Game Stats</h2>
            </div>

            <div className="stats-grid two-grid">
              <article className="stat-card stat-card-icon">
                <div className="stat-card-icon-header">
                  <div className="stat-icon-circle">
                    <Wallet size={20} />
                  </div>
                  <span className="stat-label">Game Balance</span>
                </div>
                <strong className="stat-value">
                  {formatMoney(dashboardData.gameBalance)}
                </strong>
              </article>

              <article className="stat-card stat-card-icon">
                <div className="stat-card-icon-header">
                  <div className="stat-icon-circle">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="stat-label">Confidence</span>
                </div>
                <StarRating score={confidencePercent} />
              </article>
            </div>
          </section>

          {/* 4. Real Money */}
          <section className="section-block">
            <div className="section-heading-row">
              <CircleDollarSign size={20} className="section-heading-icon" />
              <h2>Real Money</h2>
            </div>

            <div className="stats-grid two-grid">
              <article className="stat-card stat-card-goal">
                {dashboardData.goalTitle ? (
                  <>
                    <div className="stat-card-goal-header">
                      <div className="stat-icon-circle">
                        <Target size={20} />
                      </div>
                      <div className="goal-header-text">
                        <strong className="stat-label">Your Goal</strong>
                        <p className="stat-goal-desc">{dashboardData.goalTitle}</p>
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
                        style={{ "--goal-pct": `${goalPercent}%` } as React.CSSProperties}
                      />
                    </div>
                    <div className="stat-goal-footer">
                      <span>
                        {formatMoney(dashboardData.goalCurrent)} /{" "}
                        {formatMoney(dashboardData.goalTarget)}
                      </span>
                      <span className="goal-pct-label">{goalPercent}%</span>
                      <span>By {dashboardData.goalDueLabel}</span>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    className="goal-empty-prompt"
                    onClick={openGoalModal}
                  >
                    <div className="goal-empty-icon">
                      <Target size={26} />
                    </div>
                    <strong className="goal-empty-title">Set a savings goal</strong>
                    <span className="goal-empty-sub">Track what you're working towards</span>
                    <span className="goal-empty-cta">
                      <Plus size={14} strokeWidth={2.5} />
                      Add Goal
                    </span>
                  </button>
                )}
              </article>

              <div className="real-money-right-col">
                <Link to="/real-money" className="stat-card stat-card-row wide-card-clickable">
                  <div className="stat-icon-circle">
                    <Banknote size={20} />
                  </div>
                  <div className="wide-card-text">
                    <strong className="stat-label">Track Real Money</strong>
                    <p>Cash In &amp; Cash Out transactions</p>
                  </div>
                  <ChevronRight size={20} className="wide-card-arrow" />
                </Link>

                <Link to="/real-money/money-picture" className="stat-card stat-card-row wide-card-clickable">
                  <div className="stat-icon-circle">
                    <Gamepad2 size={20} />
                  </div>
                  <div className="wide-card-text">
                    <strong className="stat-label">Money Picture</strong>
                    <p>View your Have, Need, Fun, Save breakdown</p>
                  </div>
                  <ChevronRight size={20} className="wide-card-arrow" />
                </Link>
              </div>
            </div>
          </section>

          {/* 5. Parent Feedback card */}
          <article className="wide-card parent-feedback-card">
            <div className="parent-feedback-header">
              <div className="wide-card-icon-circle">
                <Users size={20} />
              </div>
              <strong>Parent Feedback</strong>
            </div>
            <p className="parent-feedback-desc">
              Share this link with your parent/guardian so they can provide
              feedback about your money learning journey.
            </p>
            <div className="parent-feedback-link-row">
              <div className="feedback-link-pill">{parentFeedbackUrl}</div>
              <button
                type="button"
                className="feedback-copy-btn"
                onClick={copyLink}
              >
                {linkCopied ? "Copied!" : "Copy Link"}
              </button>
              <button
                type="button"
                className="feedback-copy-btn"
                onClick={regenerateLink}
                disabled={isRegenerating}
              >
                {isRegenerating ? "Regenerating…" : "Regenerate Link"}
              </button>
            </div>
          </article>

        </div>
      </div>

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
                  value={goalForm.targetAmount}
                  onChange={(e) => setGoalForm((f) => ({ ...f, targetAmount: e.target.value }))}
                />
              </label>
              <label className="goal-modal-label">
                Target Date (optional)
                <input
                  className="goal-modal-input"
                  type="date"
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm((f) => ({ ...f, targetDate: e.target.value }))}
                />
              </label>
              {goalError && <p className="goal-modal-error">{goalError}</p>}
              <div className="goal-modal-actions">
                <button
                  type="button"
                  className="goal-modal-cancel"
                  onClick={() => setShowGoalModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="goal-modal-save"
                  disabled={isSavingGoal}
                >
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
