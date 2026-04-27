import { useMemo, useState, type FormEvent } from "react";
import "../MoneyPicture.css";

type EntryType = "cashIn" | "cashOut";
type CashInCategory = "Paycheck" | "Gift" | "Allowance / Parents" | "Other";
type CashOutCategory = "Need" | "Fun" | "Save";
type Feeling = "Good" | "Unsure" | "Worried";

type MoneyEntry = {
  id: number;
  type: EntryType;
  amount: number;
  category: CashInCategory | CashOutCategory;
  comment: string;
};

const cashInCategories: CashInCategory[] = [
  "Paycheck",
  "Gift",
  "Allowance / Parents",
  "Other",
];

const cashOutCategories: CashOutCategory[] = ["Need", "Fun", "Save"];

const categoryColors: Record<string, string> = {
  Need: "#172d67",
  Fun: "#754cf2",
  Save: "#29c69b",
};

export default function MoneyPicture() {
  const [entryType, setEntryType] = useState<EntryType>("cashIn");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CashInCategory | CashOutCategory>("Paycheck");
  const [comment, setComment] = useState("");
  const [feeling, setFeeling] = useState<Feeling | null>(null);

  const [entries, setEntries] = useState<MoneyEntry[]>([
    {
      id: 1,
      type: "cashIn",
      amount: 10,
      category: "Gift",
      comment: "learning",
    },
  ]);

  const availableCategories =
    entryType === "cashIn" ? cashInCategories : cashOutCategories;

  const totals = useMemo(() => {
    const totalCashIn = entries
      .filter((entry) => entry.type === "cashIn")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCashOut = entries
      .filter((entry) => entry.type === "cashOut")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const need = entries
      .filter((entry) => entry.type === "cashOut" && entry.category === "Need")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const fun = entries
      .filter((entry) => entry.type === "cashOut" && entry.category === "Fun")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const save = entries
      .filter((entry) => entry.type === "cashOut" && entry.category === "Save")
      .reduce((sum, entry) => sum + entry.amount, 0);

    const have = Math.max(totalCashIn - totalCashOut, 0);
    const net = totalCashIn - totalCashOut;

    return {
      totalCashIn,
      totalCashOut,
      net,
      need,
      fun,
      save,
    };
  }, [entries]);

  const handleTypeChange = (type: EntryType) => {
    setEntryType(type);

    if (type === "cashIn") {
      setSelectedCategory("Paycheck");
    } else {
      setSelectedCategory("Need");
    }
  };

  const handleAddEntry = (e: FormEvent) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    const newEntry: MoneyEntry = {
      id: Date.now(),
      type: entryType,
      amount: numericAmount,
      category: selectedCategory,
      comment,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setAmount("");
    setComment("");
  };

  const handleSaveFeeling = () => {
    console.log("Saved feeling:", feeling);
  };

  return (
    <main className="money-page">
      <section className="money-header">
        <h1>Game Money Picture</h1>
        <a href="#add-entry" className="money-add-top-btn">
          + Add Entry
        </a>
      </section>

      <section className="money-top-grid">
        <div className="money-card breakdown-card">
          <h2>Breakdown</h2>

          <div className="bar-chart">
            <CategoryBar label="Need" amount={totals.need} />
            <CategoryBar label="Fun" amount={totals.fun} />
            <CategoryBar label="Save" amount={totals.save} />
          </div>
        </div>

        <div className="money-card">
          <h2>Categories</h2>

          <div className="category-list">
            
            <CategoryRow label="Need" amount={totals.need} />
            <CategoryRow label="Fun" amount={totals.fun} />
            <CategoryRow label="Save" amount={totals.save} />
          </div>
        </div>
      </section>

      <section className="money-card money-total-card">
        <div>
          <p>Total Cash In</p>
          <strong className="cash-in">+${totals.totalCashIn.toFixed(2)}</strong>
        </div>

        <div>
          <p>Total Cash Out</p>
          <strong className="cash-out">-${totals.totalCashOut.toFixed(2)}</strong>
        </div>

        <div>
          <p>Net</p>
          <strong>${totals.net.toFixed(2)}</strong>
        </div>
      </section>

      <section id="add-entry" className="money-card">
        <h2>Add Entry</h2>

        <form onSubmit={handleAddEntry}>
          <div className="entry-toggle">
            <button
              type="button"
              onClick={() => handleTypeChange("cashIn")}
              className={entryType === "cashIn" ? "active" : ""}
            >
              💵 Cash In
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("cashOut")}
              className={entryType === "cashOut" ? "active" : ""}
            >
              💸 Cash Out
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
                  className={selectedCategory === category ? "selected" : ""}
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

          <button type="submit" className="save-entry-btn">
            {entryType === "cashIn" ? "💵 Save Cash In" : "💸 Save Cash Out"}
          </button>
        </form>
      </section>

      <section className="money-card">
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
          className="save-entry-btn"
        >
          📊 Save Feeling
        </button>
      </section>

      <section className="money-card">
        <h2>Recent Entries</h2>

        <div className="recent-entry-list">
          {entries.map((entry) => (
            <div key={entry.id} className="recent-entry">
              <div>
                <strong>
                  {entry.type === "cashIn" ? "Cash In" : "Cash Out"}
                </strong>
                <span>
                  {entry.category}
                  {entry.comment ? ` · ${entry.comment}` : ""}
                </span>
              </div>

              <strong
                className={entry.type === "cashIn" ? "cash-in" : "cash-out"}
              >
                {entry.type === "cashIn" ? "+" : "-"}$
                {entry.amount.toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function CategoryRow({ label, amount }: { label: string; amount: number }) {
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

function CategoryBar({ label, amount }: { label: string; amount: number }) {
  const safeHeight = Math.min(100, Math.max(8, amount));

  return (
    <div className="bar-item">
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