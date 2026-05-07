import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CircleDollarSign,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import "../DashboardPage.css";
import "../GameZonePage.css";
import DashboardLayout from "../components/layout/DashboardLayout";
import { getDashboardSummary } from "../services/dashboardApi";
import type { DashboardData } from "../types/dashboard";

const sampleData: Pick<DashboardData, "gameBalance" | "confidence" | "recentScenario"> = {
  gameBalance: 0,
  confidence: 0,
  recentScenario: null,
};

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

export default function GameZonePage() {
  const [data, setData] = useState<typeof sampleData | null>(null);

  useEffect(() => {
    let cancelled = false;

    getDashboardSummary()
      .then((apiData) => {
        if (cancelled) return;
        setData({
          gameBalance: apiData.gameBalance ?? sampleData.gameBalance,
          confidence: apiData.confidence ?? sampleData.confidence,
          recentScenario: apiData.recentScenario ?? null,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setData(sampleData);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <DashboardLayout>
        <div className="game-zone-shell">
          <div className="game-zone-content">
            <div className="dashboard-loading">Loading Game Zone…</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const confidencePercent = Math.min(100, Math.max(0, data.confidence));

  return (
    <DashboardLayout>
      <div className="game-zone-shell">
        <div className="game-zone-content">

          {/* Banner */}
          <Link to="/game" className="scenario-banner scenario-banner-clickable">
            <div className="scenario-banner-copy">
              <span className="scenario-badge">Game Zone</span>
              <h2>Jump into a money scenario</h2>
              <p>Test your money skills — spin the wheel and make real-time decisions.</p>
            </div>
            <div className="scenario-banner-arrow">
              <ChevronRight size={20} />
            </div>
          </Link>

          {/* Game Stats */}
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
                <strong className="stat-value">{formatMoney(data.gameBalance)}</strong>
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

          {/* Latest Scenario */}
          <section className="section-block">
            <div className="section-heading-row">
              <CircleDollarSign size={20} className="section-heading-icon" />
              <h2>Latest Scenario</h2>
            </div>

            <div className="game-zone-recent-card">
              {data.recentScenario ? (
                <div className="game-zone-scenario-row">
                  <div className="game-zone-scenario-info">
                    <span className="game-zone-recent-kicker">Last played</span>
                    <h3>{data.recentScenario.title}</h3>
                    <p>{data.recentScenario.description}</p>
                    <div className="game-zone-tags">
                      <span className={`tag ${data.recentScenario.moneyImpact >= 0 ? "tag-success" : "tag-danger"}`}>
                        {data.recentScenario.moneyImpact >= 0 ? "+" : "-"}
                        ${Math.abs(data.recentScenario.moneyImpact).toFixed(2)} game money
                      </span>
                      <span className={`tag ${data.recentScenario.moneyImpact >= 0 ? "tag-success" : "tag-danger"}`}>
                        {data.recentScenario.moneyImpact >= 0 ? "+" : "-"}
                        {data.recentScenario.confidenceBoost} confidence
                      </span>
                    </div>
                  </div>
                  <Link to="/game" className="game-zone-play-btn">Play again</Link>
                </div>
              ) : (
                <>
                  <span className="game-zone-recent-kicker">No scenarios yet</span>
                  <h3>Play your first scenario!</h3>
                  <p>Spin the wheel and start building your money skills.</p>
                  <Link to="/game" className="game-zone-play-btn">Play now</Link>
                </>
              )}
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}
