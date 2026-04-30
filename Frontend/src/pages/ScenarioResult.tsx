import MoneyScenarioHeader from "../components/layout/MoneyScenarioHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

// temporary mock result (replace with backend later)
const mockResult = {
  description: "You invested wisely and saw a strong return over time.",
  moneyChange: 250,
  confidenceChange: 10,
};

export default function ScenarioResultPage() {
  const result = mockResult;

  const isMoneyPositive = result.moneyChange >= 0;
  const isConfidencePositive = result.confidenceChange >= 0;

  return (
    <main className="min-h-screen bg-linear-to-br from-mint via-white to-mint font-body">
      <MoneyScenarioHeader />

      <section className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-10">
        {/* 🎯 Result Header Card */}
        <div
          className="
            w-full max-w-2xl text-center

            bg-[var(--color-primary)]/10
            backdrop-blur-md
            rounded-2xl shadow-2xl

            border-2 border-primary/40

            px-6 py-8
          "
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-body font-bold text-nav mb-4">
            Here's what happened
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-nav/70 leading-relaxed">
            {result.description}
          </p>
        </div>

        {/* 💰 Results Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Money */}
          <div
            className="
    rounded-2xl border border-nav/20
    bg-white/90 shadow-lg
    p-6
  "
          >
            <h2 className="text-lg md:text-xl font-semibold text-nav mb-3 text-center">
              Money
            </h2>

            <div className="flex items-center justify-between">
              <p
                className={`
        text-2xl md:text-3xl font-bold
        ${isMoneyPositive ? "text-green-600" : "text-red-500"}
      `}
              >
                {isMoneyPositive ? "+" : ""}${result.moneyChange}
              </p>

              <Badge
                className={`
    flex items-center justify-center
    w-8 h-8 rounded-full

    ${
      isMoneyPositive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }
  `}
              >
                $
              </Badge>
            </div>
          </div>

          {/* Confidence Result*/}
          <div
            className="
    rounded-2xl border border-nav/20
    bg-white/90 shadow-lg
    p-6
  "
          >
            <h2 className="text-lg md:text-xl font-semibold text-nav mb-3 text-center">
              Confidence
            </h2>

            <div className="flex items-center justify-between">
              <p
                className={`
        text-2xl md:text-3xl font-bold
        ${isConfidencePositive ? "text-green-600" : "text-red-500"}
      `}
              >
                {isConfidencePositive ? "+" : ""}
                {result.confidenceChange}%
              </p>

              <Badge
                className={`
    flex items-center justify-center
    w-8 h-8 rounded-full

    ${
      isConfidencePositive
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    }
  `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.84 4.61c-1.54-1.34-3.77-1.21-5.18.3L12 8.09l-3.66-3.18c-1.41-1.51-3.64-1.64-5.18-.3-1.6 1.4-1.69 3.88-.2 5.39L12 21l9.04-10.99c1.49-1.51 1.4-3.99-.2-5.39z"
                  />
                </svg>
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          <Button
            className="w-full sm:w-auto px-8 py-4"
            variant="primary"
            onClick={() => {}}
          >
            Play Again
          </Button>

          <Button
            className="w-full sm:w-auto px-8 py-4"
            variant="primary"
            onClick={() => {}}
          >
            Back to Dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}
