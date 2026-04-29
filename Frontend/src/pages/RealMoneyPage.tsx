import { useEffect, useMemo, useState, type FormEvent} from "react";
import { Link } from "react-router-dom";
import "../RealMoneyPage.css";
import {
  createRealMoneyEntry,
  getRealMoneySummary,
} from "../services/realMoneyApi";
import type {
  CashInCategory,
  CashOutCategory,
  EntryType,
  RealMoneyEntry,
  RealMoneySummary,
} from "../types/realMoney";

const cashInCategories: CashInCategory[] = [
  "Paycheck",
  "Gift",
  "Allowance / Parents",
  "Other",
];

const cashOutCategories: CashOutCategory[] = ["Want", "Need", "Fun", "Save"];

const emptyRealMoneySummary: RealMoneySummary = {
  totalCashIn: 0,
  totalCashOut: 0,
  net: 0,
  entries: [],
};

export default function RealMoneyPage() {
  const [entryType, setEntryType] = useState<EntryType>("cashIn");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CashInCategory | CashOutCategory>("Paycheck");
  const [comment, setComment] = useState("");
  const [summary, setSummary] = useState<RealMoneySummary>(
    emptyRealMoneySummary
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadRealMoneySummary();
  }, []);

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
    return entryType === "cashIn" ? cashInCategories : cashOutCategories;
  }, [entryType]);

  function handleTypeChange(type: EntryType) {
    setEntryType(type);

    if (type === "cashIn") {
      setSelectedCategory("Paycheck");
    } else {
      setSelectedCategory("Want");
    }
  }

  async function handleAddEntry(e: FormEvent) {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
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

      alert("You successfully added a new entry!");

      setAmount("");
      setComment("");

      await loadRealMoneySummary();
    } catch (error) {
      console.error("Could not save money entry.", error);
      alert("Could not save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="real-money-layout">
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

          <a href="#add-entry" className="real-money-add-top-btn">
            + Add Entry
          </a>
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
            <section className="real-money-card real-money-total-card">
              <div>
                <p>Total Cash In</p>
                <strong className="cash-in">
                  +${summary.totalCashIn.toFixed(2)}
                </strong>
              </div>

              <div>
                <p>Total Cash Out</p>
                <strong className="cash-out">
                  -${summary.totalCashOut.toFixed(2)}
                </strong>
              </div>

              <div>
                <p>Net</p>
                <strong className={summary.net >= 0 ? "cash-in" : "cash-out"}>
                  ${summary.net.toFixed(2)}
                </strong>
              </div>
            </section>

            <section id="add-entry" className="real-money-card">
              <h2>Add Entry</h2>

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
                    className={entryType === "cashOut" ? "active" : ""}
                  >
                    Cash Out
                  </button>
                </div>

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

                <div className="entry-category-section">
                  <h3>Category</h3>

                  <div className="category-chip-row">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={
                          selectedCategory === category ? "selected" : ""
                        }
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  className="comment-input"
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comment (optional)"
                />

                <button
                  type="submit"
                  className="save-entry-btn"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : entryType === "cashIn"
                      ? "Save Cash In"
                      : "Save Cash Out"}
                </button>
              </form>
            </section>

            <section className="real-money-card">
              <h2>Recent Entries</h2>

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

                    <strong
                      className={
                        entry.type === "cashIn" ? "cash-in" : "cash-out"
                      }
                    >
                      {entry.type === "cashIn" ? "+" : "-"}$
                      {entry.amount.toFixed(2)}
                    </strong>
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

function displayCategory(category: string) {
  if (category === "Have") {
    return "Want";
  }

  if (category === "Allowance/Parents") {
    return "Allowance / Parents";
  }

  return category;
}