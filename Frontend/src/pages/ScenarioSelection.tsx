import { useState } from "react";
import MoneyScenarioHeader from "../components/layout/MoneyScenarioHeader";
import Button from "../components/ui/Button";

// 🔹 Types (match these to your backend later)
export type ScenarioChoice = {
  id: number;
  title: string;
  description: string;
};

export type Scenario = {
  id: number;
  title: string;
  description: string;
  choices: ScenarioChoice[];
};

// 🔹 TEMP placeholder (replace with API later)
const mockScenario: Scenario = {
  id: 1,
  title: "Scenario Title",
  description:
    "This is where the scenario description will go from the backend.",
  choices: [
    { id: 1, title: "Choice One", description: "Description for option one." },
    { id: 2, title: "Choice Two", description: "Description for option two." },
    {
      id: 3,
      title: "Choice Three",
      description: "Description for option three.",
    },
  ],
};

export default function MoneyScenarioPage() {
  const [selectedChoiceId, setSelectedChoiceId] = useState<number | null>(null);

  const scenario = mockScenario;

  const handleConfirm = () => {
    if (!selectedChoiceId) return;
    console.log("Confirmed choice:", selectedChoiceId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-mint via-white to-mint font-body">
      <MoneyScenarioHeader />

      <section className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-10">
        {/* 🎯 Scenario Card */}
        <div
          className="
    w-full max-w-2xl text-center

    bg-[var(--color-primary)]/10
    backdrop-blur-md
    rounded-2xl shadow-2xl

    border-2 border-[var(--color-primary)]/40

    px-6 py-8
    transition hover:scale-[1.01]
  "
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-body font-bold text-nav mb-4">
            {scenario.title}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-nav/70 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* 🧩 Choices */}
        <div className="w-full grid gap-4 md:gap-6">
          {scenario.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;

            return (
              <div
                key={choice.id}
                onClick={() => setSelectedChoiceId(choice.id)}
                className={`
          cursor-pointer
          rounded-2xl border-2
          px-5 py-5 md:px-6 md:py-6

          transition-all duration-200

          hover:bg-[var(--color-mint)]
          hover:border-[var(--color-primary)]
          hover:shadow-xl hover:-translate-y-1

          ${
            isSelected
              ? "border-[var(--color-primary)] bg-[var(--color-mint)] shadow-lg scale-[1.02]"
              : "border-nav/20 bg-white/90"
          }
        `}
              >
                <h3 className="text-base md:text-lg font-semibold text-nav mb-2">
                  {choice.title}
                </h3>

                <p className="text-sm text-nav/60 leading-relaxed">
                  {choice.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ✅ Confirm */}
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={handleConfirm}
            variant="primary"
            disabled={!selectedChoiceId}
            className="
              px-10 py-4 text-base font-semibold

              shadow-lg
              transition

              hover:scale-105 active:scale-95
            "
          >
            Confirm Choice
          </Button>

          {!selectedChoiceId && (
            <p className="text-sm text-nav/50 animate-pulse">
              Please select an option to continue
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
