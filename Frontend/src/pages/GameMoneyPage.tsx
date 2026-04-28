import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../GameMoneyPage.css";
import {
  getGameMoneySummary,
  saveGameMoneyFeeling,
} from "../services/gameMoneyApi";
import type {
  GameMoneyCategory,
  GameMoneyItem,
  GameMoneySummary,
} from "../types/gameMoney";

type Feeling = "Good" | "Unsure" | "Worried";

const categoryColors: Record<GameMoneyCategory, string> = {
  Want: "#1f7f5c",
  Need: "#172d67",
  Fun: "#754cf2",
  Save: "#29c69b",
};

const emptyGameMoneySummary: GameMoneySummary = {
  items: [
    {
      id: 1,
      category: "Want",
      amount: 0,
      note: "Money used for wants",
    },
    {
      id: 2,
      category: "Need",
      amount: 0,
      note: "Money used for needs",
    },
    {
      id: 3,
      category: "Fun",
      amount: 0,
      note: "Money used for fun",
    },
    {
      id: 4,
      category: "Save",
      amount: 0,
      note: "Money saved for later",
    },
  ],
  totals: {
    want: 0,
    need: 0,
    fun: 0,
    save: 0,
    total: 0,
  },
  recentScenario: {
    title: "No scenario yet",
    description: "Start a scenario to see your latest result.",
    moneyImpact: 0,
    confidenceBoost: 0,
  },
};

export default function GameMoneyPage() {
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const [summary, setSummary] = useState<GameMoneySummary>(emptyGameMoneySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadGameMoneySummary();
  }, []);

  async function loadGameMoneySummary() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getGameMoneySummary();

      setSummary({
        ...emptyGameMoneySummary,
        ...data,
        items: data.items?.length ? data.items : emptyGameMoneySummary.items,
        totals: {
          ...emptyGameMoneySummary.totals,
          ...data.totals,
        },
        recentScenario: {
          ...emptyGameMoneySummary.recentScenario,
          ...data.recentScenario,
        },
      });
    } catch (error) {
      console.error("Could not load game money summary.", error);
      setErrorMessage("Could not load game money data. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }

  const categoryItems = useMemo(
    () => [
      { label: "Want" as const, amount: summary.totals.want },
      { label: "Need" as const, amount: summary.totals.need },
      { label: "Fun" as const, amount: summary.totals.fun },
      { label: "Save" as const, amount: summary.totals.save },
    ],
    [summary]
  );

  const maxAmount = Math.max(
    summary.totals.want,
    summary.totals.need,
    summary.totals.fun,
    summary.totals.save,
    1
  );

  async function handleSaveFeeling() {
    if (!feeling) {
      return;
    }

    try {
      await saveGameMoneyFeeling({ feeling });
      alert("Feeling saved.");
    } catch (error) {
      console.error("Could not save feeling.", error);
      alert("Could not save feeling. Please try again.");
    }
  }

  return (
    <div className="game-money-layout">
      <header className="money-app-header">
        <div className="money-app-header-inner">
          <Link
            to="/"
            className="money-app-brand"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/MCFL.png"
              alt="Money Confidence for Life"
              className="money-app-logo"
            />

            <div>
              <h1>Money Confidence for Life</h1>
              <p>Build confidence with money</p>
            </div>
          </Link>

          <button
            type="button"
            className="money-mobile-menu-button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((oldValue) => !oldValue)}
          >
            {mobileMenuOpen ? "×" : "☰"}
          </button>

          <div className={`money-app-menu ${mobileMenuOpen ? "open" : ""}`}>
            <nav className="money-app-nav">
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </Link>

              <Link
                to="/game-money"
                className={location.pathname === "/game-money" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Game Money
              </Link>

              <Link
                to="/real-money"
                className={location.pathname === "/real-money" ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Real Money
              </Link>

              <Link to="/feedback" onClick={() => setMobileMenuOpen(false)}>
                Share Feedback
              </Link>
            </nav>

            <Link
              to="/login"
              className="money-app-logout"
              onClick={() => setMobileMenuOpen(false)}
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="game-money-page">
        <section className="game-money-header">
          <div>
            <h1>Game Money Picture</h1>
            
          </div>
        </section>

        {isLoading && (
          <section className="game-money-card">
            <p>Loading game money data...</p>
          </section>
        )}

        {errorMessage && (
          <section className="game-money-card">
            <p>{errorMessage}</p>
          </section>
        )}

        {!isLoading && (
          <>
            <section className="game-money-hero">
              <div className="game-money-hero-copy">
                <span className="game-money-badge">Recent Scenario</span>
                <h2>Game Scenario</h2>
                <p>{summary.recentScenario.description}</p>
              </div>

              <button type="button" className="game-money-hero-btn">
                Start Scenario
              </button>
            </section>

            <section className="game-money-top-grid">
              <div className="game-money-card breakdown-card">
                <h2>Breakdown</h2>

                <div className="bar-chart">
                  {categoryItems.map((item) => (
                    <CategoryBar
                      key={item.label}
                      label={item.label}
                      amount={item.amount}
                      maxAmount={maxAmount}
                    />
                  ))}
                </div>
              </div>

              <div className="game-money-card">
                <h2>Categories</h2>

                <div className="category-list">
                  {categoryItems.map((item) => (
                    <CategoryRow
                      key={item.label}
                      label={item.label}
                      amount={item.amount}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="game-money-card game-total-card">
              <div>
                <p>Total Game Money</p>
                <strong>${summary.totals.total.toFixed(2)}</strong>
              </div>

              <div>
                <p>Highest Category</p>
                <strong>{getHighestCategory(categoryItems)}</strong>
              </div>

              <div>
                <p>Categories</p>
                <strong>4</strong>
              </div>
            </section>

            <section className="game-money-card">
              <h2>How do you feel about your money picture?</h2>

              <div className="feeling-grid">
                <button
                  type="button"
                  onClick={() => setFeeling("Good")}
                  className={feeling === "Good" ? "selected" : ""}
                >
                  <span>😊</span>
                  Good
                </button>

                <button
                  type="button"
                  onClick={() => setFeeling("Unsure")}
                  className={feeling === "Unsure" ? "selected" : ""}
                >
                  <span>😐</span>
                  Unsure
                </button>

                <button
                  type="button"
                  onClick={() => setFeeling("Worried")}
                  className={feeling === "Worried" ? "selected" : ""}
                >
                  <span>😟</span>
                  Worried
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveFeeling}
                className="save-feeling-btn"
              >
                Save Feeling
              </button>
            </section>

            <section className="game-money-card">
              <h2>Recent Game Money Activity</h2>

              <div className="recent-game-list">
                {summary.items.map((item) => (
                  <div key={item.id} className="recent-game-entry">
                    <div>
                      <strong>{item.category}</strong>
                      <span>{item.note}</span>
                    </div>

                    <strong>${item.amount.toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="money-app-footer">
        <div className="money-app-footer-inner">
          <Link to="/" className="money-app-footer-brand">
            <img
              src="/MCFL.png"
              alt="Money Confidence for Life"
              className="money-app-footer-logo"
            />

            <div>
              <h3>Money Confidence for Life</h3>
              <p>Build confidence with money</p>
            </div>
          </Link>

          <nav className="money-app-footer-nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/game-money">Game Money</Link>
            <Link to="/real-money">Real Money</Link>
            <Link to="/feedback">Share Feedback</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function getHighestCategory(
  items: Array<{ label: GameMoneyCategory; amount: number }>
) {
  const highest = items.reduce((currentHighest, item) => {
    return item.amount > currentHighest.amount ? item : currentHighest;
  }, items[0]);

  return highest.label;
}

function CategoryRow({
  label,
  amount,
}: {
  label: GameMoneyCategory;
  amount: number;
}) {
  return (
    <div className="category-row">
      <div>
        <span
          className="category-dot"
          style={{ background: categoryColors[label] }}
        />
        <strong>{label}</strong>
      </div>

      <strong>${amount.toFixed(2)}</strong>
    </div>
  );
}

function CategoryBar({
  label,
  amount,
  maxAmount,
}: {
  label: GameMoneyCategory;
  amount: number;
  maxAmount: number;
}) {
  const safeHeight = Math.max(8, Math.round((amount / maxAmount) * 100));

  return (
    <div className="bar-item">
      <span className="bar-amount">${amount.toFixed(0)}</span>

      <div className="bar-area">
        <div
          className="bar-fill"
          style={{
            height: `${safeHeight}%`,
            background: categoryColors[label],
          }}
        />
      </div>

      <span>{label}</span>
    </div>
  );
}