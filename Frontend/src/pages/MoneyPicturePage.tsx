import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Frown, Meh, Smile } from "lucide-react";
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "../MoneyPicturePage.css";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getGameMoneySummary,
  getMoneyFeelings,
  saveGameMoneyFeeling,
} from "../services/gameMoneyApi";
import type { GameMoneyCategory, GameMoneySummary } from "../types/gameMoney";

const feelingIcons: Record<string, React.ReactNode> = {
  Good: <Smile size={28} strokeWidth={2} />,
  Unsure: <Meh size={28} strokeWidth={2} />,
  Worried: <Frown size={28} strokeWidth={2} />,
};

const feelingFeedback: Record<string, { title: string; message: string }> = {
  Good: {
    title: "Great job!",
    message: "Congratulations! You are moving on to the next level 🎉",
  },
  Unsure: {
    title: "That is okay",
    message: "You are still learning, and every step helps you understand your money better.",
  },
  Worried: {
    title: "Take one small step",
    message: "That is okay. Take a breath, review your money picture, and choose one small next step.",
  },
};

const categoryColors: Record<GameMoneyCategory, string> = {
  Want: "#1f7f5c",
  Need: "#172d67",
  Fun: "#754cf2",
  Save: "#29c69b",
};

const IN_THE_RED_COLOR = "#dc2626";
const HAVE_COLOR = "#0ea77d";

const emptyGameMoneySummary: GameMoneySummary = {
  items: [],
  totals: {
    have: 0,
    want: 0,
    need: 0,
    fun: 0,
    save: 0,
    total: 0,
  },
};

export default function MoneyPicturePage() {
  const [feeling, setFeeling] = useState<string | null>(null);
  const [feelings, setFeelings] = useState<string[]>([]);
  const [summary, setSummary] = useState<GameMoneySummary>(
    emptyGameMoneySummary,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [feelingModalOpen, setFeelingModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        const [data, fetchedFeelings] = await Promise.all([
          getGameMoneySummary(),
          getMoneyFeelings(),
        ]);

        if (!isCurrent) return;

        setSummary({
          ...emptyGameMoneySummary,
          ...data,
          totals: { ...emptyGameMoneySummary.totals, ...data.totals },
        });
        setFeelings(fetchedFeelings);
        setErrorMessage("");
      } catch (error) {
        console.error("Could not load game money data.", error);
        if (isCurrent) {
          setErrorMessage("Could not load game money data. Please log in again.");
        }
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    void loadData();

    return () => { isCurrent = false; };
  }, []);


  const categoryItems = useMemo(
    () => [
      { label: "Want" as const, amount: summary.totals.want },
      { label: "Need" as const, amount: summary.totals.need },
      { label: "Fun" as const, amount: summary.totals.fun },
      { label: "Save" as const, amount: summary.totals.save },
    ],
    [summary],
  );

  const maxAmount = Math.max(
    summary.totals.want,
    summary.totals.need,
    summary.totals.fun,
    summary.totals.save,
    1,
  );

  async function handleSaveFeeling() {
    if (!feeling) {
      setFeedbackModal({
        title: "Choose a feeling",
        message: "Please choose how you feel first.",
      });
      return;
    }

    try {
      await saveGameMoneyFeeling({ feeling });
      setFeelingModalOpen(false);

      const fb = feelingFeedback[feeling] ?? {
        title: "Thanks!",
        message: "Your feeling has been recorded.",
      };
      setFeedbackModal(fb);
      setFeeling(null);
    } catch (error) {
      console.error("Could not save feeling.", error);
      setFeedbackModal({
        title: "Could not save",
        message: "Could not save feeling. Please try again.",
      });
    }
  }

  return (
    <DashboardLayout>
      <main className="game-money-page">
        <section className="game-money-header">
          <div className="game-money-header-title">
            <h1>Money Picture</h1>
          </div>
          <div className="game-money-header-actions">
            {!isLoading && (
              <button
                type="button"
                className="game-total-feeling-trigger"
                onClick={() => setFeelingModalOpen(true)}
              >
                <div className="feeling-trigger-icons">
                  <Smile size={20} strokeWidth={2} />
                  <Meh size={20} strokeWidth={2} />
                  <Frown size={20} strokeWidth={2} />
                </div>
                <span>Share how you feel about your money picture today</span>
                <ChevronRight size={18} strokeWidth={2} className="feeling-trigger-arrow" />
              </button>
            )}
            <Link to="/real-money" className="transactions-back-link">
              Back to Real Money
            </Link>
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

            {(() => {
              const have = summary.totals.have;
              const overage = summary.totals.need - have;
              const inTheRed = overage > 0;
              const maxBar = Math.max(have, summary.totals.need, 1);
              return (
                <section className="game-money-card money-overview-card">
                  <div className="money-overview-grid">
                    <div className="total-money-section">
                      <h2>Total Money</h2>
                      <div className="total-money-bars">
                        <HorizontalBar
                          label="Have"
                          amount={have}
                          maxAmount={maxBar}
                          color={HAVE_COLOR}
                        />
                        <HorizontalBar
                          label="Need"
                          amount={summary.totals.need}
                          maxAmount={maxBar}
                          color={inTheRed ? IN_THE_RED_COLOR : categoryColors["Need"]}
                        />
                        {inTheRed && (
                          <div className="h-bar-balance h-bar-balance--red">
                            <span className="h-bar-balance-label">
                              Needs exceed Have by
                            </span>
                            <span className="h-bar-balance-amount">
                              -${overage.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="money-allocation-section">
                      <h2>Money Allocation</h2>
                      {summary.totals.total > 0 ? (
                        <div className="donut-chart-row">
                          <div className="donut-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={categoryItems.map((i) => ({
                                    name: i.label,
                                    value: i.amount,
                                    fill:
                                      i.label === "Need" && inTheRed
                                        ? IN_THE_RED_COLOR
                                        : categoryColors[i.label],
                                  }))}
                                  dataKey="value"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius="45%"
                                  outerRadius="68%"
                                  paddingAngle={3}
                                />
                                <Tooltip
                                  formatter={(value, name) => [
                                    `$${Number(value).toFixed(2)}`,
                                    String(name),
                                  ]}
                                  wrapperStyle={{ zIndex: 50 }}
                                  contentStyle={{
                                    borderRadius: 10,
                                    border: "1px solid #d1ece2",
                                    background: "#f0faf5",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    padding: "8px 14px",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            {inTheRed && (
                              <div className="donut-center-label">
                                <span>In the</span>
                                <span>Red</span>
                              </div>
                            )}
                          </div>
                          <div className="donut-legend">
                            {categoryItems.map((item) => {
                              const pct =
                                summary.totals.total > 0
                                  ? (
                                      (item.amount / summary.totals.total) *
                                      100
                                    ).toFixed(0)
                                  : "0";
                              const color =
                                item.label === "Need" && inTheRed
                                  ? IN_THE_RED_COLOR
                                  : categoryColors[item.label];
                              return (
                                <div
                                  key={item.label}
                                  className="donut-legend-item"
                                >
                                  <span
                                    className="donut-legend-dot"
                                    style={{ background: color }}
                                  />
                                  <span className="donut-legend-text">
                                    {item.label} ${item.amount.toFixed(2)}{" "}
                                    {pct}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="no-data-note">No spending data yet.</p>
                      )}
                    </div>
                  </div>
                </section>
              );
            })()}


          </>
        )}
      </main>

      {feelingModalOpen && (
        <div className="money-modal-backdrop" role="dialog" aria-modal="true">
          <div className="money-modal">
            <h2>How do you feel?</h2>
            <p className="feeling-modal-subtitle">Share how you feel about your money picture today</p>

            <div className="feeling-grid">
              {feelings.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFeeling(f)}
                  className={feeling === f ? "selected" : ""}
                >
                  {feelingIcons[f] ?? <Smile size={28} strokeWidth={2} />}
                  {f}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveFeeling}
              className="save-feeling-btn"
            >
              Save Feeling
            </button>

            <button
              type="button"
              className="money-modal-cancel"
              onClick={() => { setFeelingModalOpen(false); setFeeling(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {feedbackModal && (
        <div className="money-modal-backdrop" role="dialog" aria-modal="true">
          <div className="money-modal">
            <h2>{feedbackModal.title}</h2>
            <p>{feedbackModal.message}</p>

            <button
              type="button"
              className="money-modal-button"
              onClick={() => setFeedbackModal(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
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

function HorizontalBar({
  label,
  amount,
  maxAmount,
  color,
}: {
  label: string;
  amount: number;
  maxAmount: number;
  color: string;
}) {
  const pct = maxAmount > 0 ? Math.max(4, Math.round((amount / maxAmount) * 100)) : 4;
  return (
    <div className="h-bar-row">
      <span className="h-bar-label">{label}</span>
      <div className="h-bar-track">
        <div className="h-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="h-bar-amount">${amount.toFixed(2)}</span>
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