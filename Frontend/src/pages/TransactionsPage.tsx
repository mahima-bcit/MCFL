import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../TransactionPage.css";
import { getRealMoneyEntries } from "../services/realMoneyApi";
import type { RealMoneyEntry } from "../types/realMoney";

export default function TransactionsPage() {
  const [entries, setEntries] = useState<RealMoneyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getRealMoneyEntries();
      setEntries(data);
    } catch (error) {
      console.error("Could not load transactions.", error);
      setErrorMessage("Could not load transactions. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }

  const totals = useMemo(() => {
    const totalCashIn = entries
      .filter((entry) => entry.type === "cashIn")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCashOut = entries
      .filter((entry) => entry.type === "cashOut")
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      totalCashIn,
      totalCashOut,
      net: totalCashIn - totalCashOut,
    };
  }, [entries]);

  return (
    <div className="transactions-layout">
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

              <Link to="/game-money" onClick={() => setMobileMenuOpen(false)}>
                Game Money
              </Link>

              <Link
                to="/real-money"
                className="active"
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

      <main className="transactions-page">
        <section className="transactions-header">
          <div>
            <p className="transactions-kicker">Real Money</p>
            <h1>All Transactions</h1>
            <p>Review every cash in and cash out entry.</p>
          </div>

          <Link to="/real-money" className="transactions-back-link">
            Back to Real Money
          </Link>
        </section>

        <section className="transactions-summary-grid">
          <article className="transactions-card">
            <p>Total Cash In</p>
            <strong className="cash-in">+${totals.totalCashIn.toFixed(2)}</strong>
          </article>

          <article className="transactions-card">
            <p>Total Cash Out</p>
            <strong className="cash-out">-${totals.totalCashOut.toFixed(2)}</strong>
          </article>

          <article className="transactions-card">
            <p>Net</p>
            <strong className={totals.net >= 0 ? "cash-in" : "cash-out"}>
              ${totals.net.toFixed(2)}
            </strong>
          </article>
        </section>

        {isLoading && (
          <section className="transactions-card">
            <p>Loading transactions...</p>
          </section>
        )}

        {errorMessage && (
          <section className="transactions-card">
            <p>{errorMessage}</p>
          </section>
        )}

        {!isLoading && !errorMessage && (
          <section className="transactions-card transactions-list-card">
            <div className="transactions-list-header">
              <h2>Transaction History</h2>
              <span>{entries.length} entries</span>
            </div>

            <div className="transactions-list">
              {entries.map((entry) => (
                <article key={entry.id} className="transaction-row">
                  <div className="transaction-left">
                    <span
                      className={
                        entry.type === "cashIn"
                          ? "transaction-type cash-in-bg"
                          : "transaction-type cash-out-bg"
                      }
                    >
                      {entry.type === "cashIn" ? "Cash In" : "Cash Out"}
                    </span>

                    <div>
                      <h3>{displayCategory(entry.category)}</h3>
                      <p>
                        {entry.comment ? entry.comment : "No comment"} ·{" "}
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>

                  <strong
                    className={entry.type === "cashIn" ? "cash-in" : "cash-out"}
                  >
                    {entry.type === "cashIn" ? "+" : "-"}$
                    {entry.amount.toFixed(2)}
                  </strong>
                </article>
              ))}
            </div>
          </section>
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

function displayCategory(category: string) {
  if (category === "Have") {
    return "Want";
  }

  if (category === "Allowance/Parents") {
    return "Allowance / Parents";
  }

  return category;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}