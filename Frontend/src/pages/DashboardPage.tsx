import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Banknote,
  ChevronRight,
  CircleDollarSign,
  Gamepad2,
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

  return (
    <DashboardLayout>
      <div className="dashboard-shell">
        <div className="dashboard-content">

          {/* 1. Quick Start Banner */}
          <Link
            to="/game-money"
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

          {/* 3. Game Money Picture card */}
          <Link to="/game-money" className="wide-card wide-card-clickable">
            <div className="wide-card-icon-circle">
              <Gamepad2 size={20} />
            </div>
            <div className="wide-card-text">
              <strong>Game Money Picture</strong>
              <p>View your Have, Need, Fun, Save breakdown</p>
            </div>
            <ChevronRight size={20} className="wide-card-arrow" />
          </Link>

          {/* 4. Real Money */}
          <section className="section-block">
            <div className="section-heading-row">
              <CircleDollarSign size={20} className="section-heading-icon" />
              <h2>Real Money</h2>
            </div>

            <div className="stats-grid two-grid">
              <article className="stat-card stat-card-goal">
                <div className="stat-card-goal-header">
                  <div className="stat-icon-circle">
                    <Target size={20} />
                  </div>
                  <div>
                    <strong className="stat-label">Your Goal</strong>
                    <p className="stat-goal-desc">{dashboardData.goalTitle}</p>
                  </div>
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
              </article>

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
            </div>
          </section>

          {/* 5. Parent Feedback card */}
          <article className="wide-card parent-feedback-card">
            <div className="wide-card-icon-circle">
              <Users size={20} />
            </div>
            <div className="wide-card-text">
              <strong>Parent Feedback</strong>
              <p>
                Share this link with your parent/guardian so they can provide
                feedback about your money learning journey.
              </p>
            </div>
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
          </article>

        </div>
      </div>
    </DashboardLayout>
  );
}
