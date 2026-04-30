import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../DashboardPage.css";
import { getDashboardSummary } from "../services/dashboardApi";
import type { DashboardData } from "../types/dashboard";

type ActiveTab = "dashboard" | "gameZone";

const sampleDashboardData: DashboardData = {
  featuredTitle: "Try a 2-minute scenario",
  featuredDescription:
    "Practice a quick money decision and build confidence one small step at a time.",
  gameBalance: 500,
  confidence: 50,
  goalCurrent: 120,
  goalTarget: 300,
  goalDueLabel: "June 2026",
  monthlyNet: 85,
  gameMoneyPicture: {
    want: 250,
    need: 100,
    fun: 75,
    save: 75,
  },
  realMoneySnapshot: {
    availableBalance: 845,
    monthlyIncome: 650,
    monthlyExpenses: 565,
    monthlyNet: 85,
  },
  parentFeedback: {
    name: "Alex Rivera",
    token: "sample-token",
    link: "http://localhost:5173/parentFeedback?username=Alex%20Rivera",
  },
  recentScenario: {
    title: "Surprise Birthday Gift",
    description: "You decided to spend $40 on a thoughtful gift.",
    moneyImpact: -40,
    confidenceBoost: 5,
  },
};

function mergeDashboardData(
  apiData: Partial<DashboardData> | null | undefined,
): DashboardData {
  return {
    ...sampleDashboardData,
    ...apiData,
    gameMoneyPicture: {
      ...sampleDashboardData.gameMoneyPicture,
      ...(apiData?.gameMoneyPicture || {}),
    },
    realMoneySnapshot: {
      ...sampleDashboardData.realMoneySnapshot,
      ...(apiData?.realMoneySnapshot || {}),
    },
    parentFeedback: {
      ...sampleDashboardData.parentFeedback,
      ...(apiData?.parentFeedback || {}),
    },
    recentScenario: {
      ...sampleDashboardData.recentScenario,
      ...(apiData?.recentScenario || {}),
    },
  };
}

function formatMoney(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value)}`;
}

function formatPositiveMoney(value: number) {
  return value >= 0 ? `+$${value}` : `-$${Math.abs(value)}`;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(sampleDashboardData);

  const LOGO_SRC = "/MCFL.png";

  useEffect(() => {
    let isCancelled = false;

    getDashboardSummary()
      .then((apiData) => {
        if (isCancelled) {
          return;
        }

        const safeData = mergeDashboardData(apiData);
        setDashboardData(safeData);
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        console.error("Dashboard data did not load from backend.", error);
        setDashboardData(sampleDashboardData);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  function openDashboardTab() {
    setActiveTab("dashboard");
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const maxPictureValue = Math.max(
    dashboardData.gameMoneyPicture.want,
    dashboardData.gameMoneyPicture.need,
    dashboardData.gameMoneyPicture.fun,
    dashboardData.gameMoneyPicture.save,
    1,
  );

  const pictureItems = [
    {
      label: "Want",
      value: dashboardData.gameMoneyPicture.want,
      className: "mini-chart-want",
    },
    {
      label: "Need",
      value: dashboardData.gameMoneyPicture.need,
      className: "mini-chart-need",
    },
    {
      label: "Fun",
      value: dashboardData.gameMoneyPicture.fun,
      className: "mini-chart-fun",
    },
    {
      label: "Save",
      value: dashboardData.gameMoneyPicture.save,
      className: "mini-chart-save",
    },
  ];

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

  const parentFeedbackToken =
  dashboardData.parentFeedback.token || "sample-token";
  const parentFeedbackUrl = `${window.location.origin}/parentFeedback?token=${encodeURIComponent(
  parentFeedbackToken,
  )}`;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-inner">
          <Link to="/" className="dashboard-brand" onClick={closeMobileMenu}>
            <div className="dashboard-brand-logo">
              {!logoBroken ? (
                <img
                  src={LOGO_SRC}
                  alt="Money Confidence for Life"
                  className="dashboard-brand-logo-image"
                  onError={() => setLogoBroken(true)}
                />
              ) : (
                <span className="dashboard-brand-logo-fallback">MC</span>
              )}
            </div>

            <div className="dashboard-brand-text">
              <h1>Money Confidence for Life</h1>
              <p>Build confidence with money</p>
            </div>
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((oldValue) => !oldValue)}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>

          <div
            className={`dashboard-header-right ${mobileMenuOpen ? "open" : ""}`}
          >
            <nav className="dashboard-nav">
              <button
                type="button"
                onClick={openDashboardTab}
                className={`dashboard-nav-item ${
                  activeTab === "dashboard" ? "dashboard-nav-item-active" : ""
                }`}
              >
                Dashboard
              </button>

              <Link
                to="/game-money"
                className="dashboard-nav-link"
                onClick={closeMobileMenu}
              >
                Game Money
              </Link>

              <Link
                to="/real-money"
                className="dashboard-nav-link"
                onClick={closeMobileMenu}
              >
                Real Money
              </Link>

              <Link
                to="/feedback"
                className="dashboard-nav-link"
                onClick={closeMobileMenu}
              >
                Share Feedback
              </Link>
            </nav>

            <Link
              to="/login"
              className="dashboard-logout-button"
              onClick={closeMobileMenu}
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="dashboard-shell">
        <div className="dashboard-content">
          {activeTab === "dashboard" ? (
            <>
              <section className="scenario-banner">
                <div className="scenario-banner-copy">
                  <span className="scenario-badge">Featured</span>
                  <h2>{dashboardData.featuredTitle}</h2>
                  <p>{dashboardData.featuredDescription}</p>
                </div>

                <div className="scenario-banner-actions">
                  <Link
                    to="/game-money"
                    className="scenario-banner-button"
                    onClick={closeMobileMenu}
                  >
                    Start Scenario
                  </Link>
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <h2>Game Money Overview</h2>
                  <p>
                    See your in-game balance, confidence, and money picture.
                  </p>
                </div>

                <div className="stats-grid three-grid">
                  <article className="stat-card">
                    <div className="stat-body">
                      <span className="stat-label">Game Balance</span>
                      <span className="stat-value">
                        {formatMoney(dashboardData.gameBalance)}
                      </span>
                      <p className="stat-note">
                        In-game money across all categories
                      </p>
                    </div>
                  </article>

                  <article className="stat-card">
                    <div className="stat-body">
                      <span className="stat-label">Confidence</span>
                      <span className="stat-value">{confidencePercent}%</span>

                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${confidencePercent}%` }}
                        />
                      </div>

                      <p className="stat-note">
                        Keep building confidence step by step.
                      </p>
                    </div>
                  </article>

                  <Link
                  to="/game-money"
                  className="stat-card picture-link-card"
                  onClick={closeMobileMenu}
                >
                  <div className="stat-body">
                    <span className="stat-label">Game Money Picture</span>
                    <p className="picture-summary-text">
                      View your Want, Need, Fun, Save breakdown
                    </p>
                    <span className="picture-link-text">
                      Open Game Money →
                    </span>
                  </div>
                </Link>
                </div>
              </section>

              <section className="section-block">
                <div className="section-heading">
                  <h2>Real Money Overview</h2>
                  <p>
                    See your saving progress, real money summary, and feedback
                    link.
                  </p>
                </div>

                <div className="stats-grid two-grid">
                  <article className="stat-card">
                    <div className="stat-body">
                      <span className="stat-label">Your Goal</span>
                      <span className="stat-value">
                        {formatMoney(dashboardData.goalCurrent)} /{" "}
                        {formatMoney(dashboardData.goalTarget)}
                      </span>
                      <p className="stat-note">
                        Target by {dashboardData.goalDueLabel}
                      </p>

                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${goalPercent}%` }}
                        />
                      </div>
                    </div>
                  </article>

                  <article className="stat-card">
                    <div className="stat-body">
                      <span className="stat-label">Monthly Net</span>
                      <span className="stat-value positive-text">
                        {formatPositiveMoney(dashboardData.monthlyNet)}
                      </span>
                      <p className="stat-note">
                        Income minus expenses this month
                      </p>
                    </div>
                  </article>
                </div>

                <div className="detail-grid">
                  <article className="detail-card">
                    <div className="detail-card-header">
                      <div>
                        <h3>Real Money Snapshot</h3>
                        <p>A quick look at your current real money progress.</p>
                      </div>
                    </div>

                    <div className="snapshot-list">
                      <div className="snapshot-row">
                        <span>Available Balance</span>
                        <strong>
                          {formatMoney(
                            dashboardData.realMoneySnapshot.availableBalance,
                          )}
                        </strong>
                      </div>

                      <div className="snapshot-row">
                        <span>Monthly Income</span>
                        <strong>
                          {formatMoney(
                            dashboardData.realMoneySnapshot.monthlyIncome,
                          )}
                        </strong>
                      </div>

                      <div className="snapshot-row">
                        <span>Monthly Expenses</span>
                        <strong>
                          {formatMoney(
                            dashboardData.realMoneySnapshot.monthlyExpenses,
                          )}
                        </strong>
                      </div>

                      <div className="snapshot-row">
                        <span>Monthly Net</span>
                        <strong>
                          {formatPositiveMoney(
                            dashboardData.realMoneySnapshot.monthlyNet,
                          )}
                        </strong>
                      </div>
                    </div>

                    
                  </article>

                  <article className="detail-card">
                    <div className="detail-card-header">
                      <div>
                        <h3>Parent Feedback Link</h3>
                        <p>
                          Share this link with a parent or guardian. It opens
                          the feedback page directly and includes the user name:{" "}
                          <strong>{dashboardData.parentFeedback.name}</strong>.
                        </p>
                      </div>
                    </div>

                    <div className="feedback-link-box">
                      {parentFeedbackUrl}
                    </div>

                    
                  </article>
                </div>
              </section>
            </>
          ) : (
            <>
              <section className="game-zone-header">
                <div className="game-zone-header-text">
                  <h2>Game Money</h2>
                  <p>
                    Practice making money decisions in quick, low-stakes
                    scenarios.
                  </p>
                </div>
              </section>

              <section className="scenario-banner game-zone-banner">
                <div className="scenario-banner-copy">
                  <span className="scenario-badge">Featured</span>
                  <h2>{dashboardData.featuredTitle}</h2>
                  <p>{dashboardData.featuredDescription}</p>
                </div>

                <div className="scenario-banner-actions">
                  <Link
                    to="/game-money"
                    className="scenario-banner-button"
                    onClick={closeMobileMenu}
                  >
                    Start Scenario
                  </Link>
                </div>
              </section>

              <section className="section-block">
                <div className="game-zone-overview-layout">
                  <div className="game-zone-small-stack">
                    <article className="stat-card game-zone-small-card">
                      <div className="stat-body">
                        <span className="stat-label">Game Balance</span>
                        <span className="stat-value">
                          {formatMoney(dashboardData.gameBalance)}
                        </span>
                        <p className="stat-note">
                          In-game money across all categories
                        </p>
                      </div>
                    </article>

                    <article className="stat-card game-zone-small-card">
                      <div className="stat-body">
                        <span className="stat-label">Confidence</span>
                        <span className="stat-value">{confidencePercent}%</span>

                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${confidencePercent}%` }}
                          />
                        </div>

                        <p className="stat-note">
                          Keep playing to build your confidence!
                        </p>
                      </div>
                    </article>
                  </div>

                  <article className="stat-card game-money-picture-large chart-card">
                    <div className="stat-body">
                      <span className="stat-label">Game Money Picture</span>
                      <p className="picture-summary-text">
                        View your Want, Need, Fun, Save breakdown
                      </p>

                      <div className="mini-chart">
                        {pictureItems.map((item) => {
                          const barHeightPercent = Math.max(
                            20,
                            Math.round((item.value / maxPictureValue) * 100),
                          );

                          return (
                            <div className="mini-chart-item" key={item.label}>
                              <span className="mini-chart-amount">
                                {formatMoney(item.value)}
                              </span>

                              <div
                                className={`mini-chart-bar ${item.className}`}
                                style={{ height: `${barHeightPercent}%` }}
                              />

                              <span className="mini-chart-label">
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <p className="chart-footnote">
                        Reflects your latest scenario decision
                      </p>
                    </div>
                  </article>
                </div>
              </section>

              <section className="recent-scenario-card">
                <div className="recent-scenario-copy">
                  <span className="recent-scenario-kicker">
                    Recent Scenario
                  </span>
                  <h3>{dashboardData.recentScenario.title}</h3>
                  <p>{dashboardData.recentScenario.description}</p>

                  <div className="recent-scenario-tags">
                    <span className="tag tag-danger">
                      Money Impact{" "}
                      {formatMoney(dashboardData.recentScenario.moneyImpact)}
                    </span>

                    <span className="tag tag-success">
                      Confidence Boost +
                      {dashboardData.recentScenario.confidenceBoost}%
                    </span>
                  </div>
                </div>

                <button type="button" className="recent-scenario-button">
                  View Details
                </button>
              </section>

              <section className="tip-row">
                <div className="tip-row-left">
                  <p>
                    Tip: Every decision you make helps you build money
                    confidence for real life.
                  </p>
                </div>

                <button type="button" className="tip-link-button">
                  How it works
                </button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
