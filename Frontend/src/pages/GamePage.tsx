import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { Scenario, ScenarioChoice } from "../types/game";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import MoneyScenarioHeader from "../components/layout/MoneyScenarioHeader";

import "../styles/SpinTheWheel.css";
import {
  addUserSelection,
  getScenarios,
  getUserGameStats,
} from "../services/gameApi";

type StepDefinition = {
  key: "spin-the-wheel" | "scenario-selection" | "scenario-result";
};

function StepCard({
  children,
  className = "",
  userStats,
}: {
  children: React.ReactNode;
  className?: string;
  userStats: {
    money: number;
    confidence: number;
  };
}) {
  return (
    <div
      className={`rounded-[28px] border border-[#edf1f6] bg-white p-5 shadow-[0_14px_34px_rgba(23,42,79,0.07)] md:p-7 ${className}`}
    >
      <MoneyScenarioHeader
        money={userStats.money}
        confidence={userStats.confidence}
      />
      {children}
    </div>
  );
}

const setupSteps: StepDefinition[] = [
  {
    key: "spin-the-wheel",
  },
  {
    key: "scenario-selection",
  },
  {
    key: "scenario-result",
  },
];

export default function GamePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const currentStepDefinition = setupSteps[step] ?? setupSteps[0];

  const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);
  const [playedScenarioIds, setPlayedScenarioIds] = useState<number[]>([]);

  const availableScenarios = allScenarios.filter(
    (s) => !playedScenarioIds.includes(s.id),
  );

  const visibleScenarios = availableScenarios.slice(0, 6);

  const [spun, setSpun] = useState(false);

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null,
  );
  const [selectedScenarioChoice, setSelectedScenarioChoice] =
    useState<ScenarioChoice | null>(null);

  const [userStats, setUserStats] = useState({
    money: 0,
    confidence: 0,
  });

  function renderCurrentStep() {
    switch (currentStepDefinition.key) {
      case "spin-the-wheel":
        return renderSpinTheWheelStep();
      case "scenario-selection":
        return renderScenarioSelectionStep();
      case "scenario-result":
        return renderScenarioResultStep();
      default:
        return null;
    }
  }

  function renderSpinTheWheelStep() {
    return (
      <StepCard userStats={userStats}>
        <div className="flex flex-col items-center px-4 py-10 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="sparkle sparkle1"></div>
            <div className="sparkle sparkle2"></div>
            <div className="sparkle sparkle3"></div>
          </div>

          <div className="wheel-of-scenarios flex flex-col items-center gap-8 w-full max-w-md md:max-w-lg lg:max-w-xl m-4">
            <ul className="w-full aspect-square max-w-xs md:max-w-sm lg:max-w-md z-20 rounded-full border-4 border-primary shadow-2xl flex items-center justify-center text-center text-nav font-semibold">
              {visibleScenarios.map((scenario) => (
                <li key={scenario.id} className="text-nav/70 text-base">
                  {scenario.title}
                </li>
              ))}
            </ul>
            <div className="circle-shadow"></div>
          </div>

          <div className="text-center mt-10 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-body text-nav animate-bounce-slow">
              🎉 Ready to make learning fun? 🎉
            </h1>

            <p className="mt-4 text-base text-gray-9000 animate-fade-in">
              Step right up & try your luck to see what financial scenario you
              get to choose from!
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="mt-8 px-10 py-4 text-base font-semibold
             animate-pulse-slow
             hover:scale-105 active:scale-95"
            onClick={() => {
              if (visibleScenarios.length === 0) return;
              const node = document.querySelector(".wheel-of-scenarios")!;
              const wheel = node.querySelector("ul")!;
              let animation: Animation;
              let previousEndDegree = 0;
              if (spun) return;
              setSpun(true);

              const spinDegrees = Math.random() * 360 + 1800;
              let selectedScenarioIndex = Math.floor(
                (spinDegrees % 360) / (360 / visibleScenarios.length),
              );
              const selected = visibleScenarios[selectedScenarioIndex];

              setSelectedScenario(selected);
              setPlayedScenarioIds((prev) => [...prev, selected.id]);

              animation = wheel.animate(
                [
                  { transform: `rotate(${previousEndDegree}deg)` },
                  { transform: `rotate(${-spinDegrees}deg)` },
                ],
                {
                  duration: 4000,
                  easing: "cubic-bezier(0.440, -0.205, 0.000, 1.130)",
                  fill: "forwards",
                },
              );
              animation.onfinish = () => {
                const container = document.createElement("div");
                container.className = "confetti-container";
                document.body.appendChild(container);

                for (let i = 0; i < 80; i++) {
                  const piece = document.createElement("div");
                  piece.className = "confetti";

                  piece.style.left = Math.random() * 100 + "vw";
                  piece.style.animationDelay = Math.random() * 0.5 + "s";
                  piece.style.transform = `rotate(${Math.random() * 360}deg)`;

                  container.appendChild(piece);
                }

                // cleanup after animation
                setTimeout(() => {
                  container.remove();

                  // Move to next step after confetti
                  setStep((current) => current + 1);
                }, 2000);
              };
            }}
          >
            SPIN NOW
          </Button>
        </div>
      </StepCard>
    );
  }

  function renderScenarioSelectionStep() {
    return (
      <StepCard userStats={userStats}>
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-10">
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
              {selectedScenario?.title}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-nav/70 leading-relaxed">
              {selectedScenario?.description}
            </p>
          </div>

          <div className="w-full grid gap-4 md:gap-6">
            {selectedScenario?.choices.map((choice) => {
              const isSelected = selectedScenarioChoice?.id === choice.id;

              return (
                <div
                  key={choice.id}
                  onClick={() => setSelectedScenarioChoice(choice)}
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
                  <p className="text-sm text-nav/60 leading-relaxed">
                    {choice.optionText}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleConfirm}
              variant="primary"
              disabled={!selectedScenarioChoice}
              className="
                    px-10 py-4 text-base font-semibold
      
                    shadow-lg
                    transition
      
                    hover:scale-105 active:scale-95
                  "
            >
              Confirm Choice
            </Button>

            {!selectedScenarioChoice && (
              <p className="text-sm text-nav/50 animate-pulse">
                Please select an option to continue
              </p>
            )}
          </div>
        </div>
      </StepCard>
    );
  }

  function renderScenarioResultStep() {
    return (
      <StepCard userStats={userStats}>
        <div className="min-h-screen bg-linear-to-br from-mint via-white to-mint font-body">
          <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col items-center gap-10">
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
                {selectedScenarioChoice?.resultText}
              </p>

              <p className="text-sm sm:text-base md:text-lg text-nav/70 leading-relaxed">
                {selectedScenarioChoice?.lessonText}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
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
        ${(selectedScenarioChoice?.moneyImpact ?? 0) > 0 ? "text-green-600" : "text-red-500"}
      `}
                  >
                    {(selectedScenarioChoice?.moneyImpact ?? 0) > 0 ? "+" : "-"}
                    ${Math.abs(selectedScenarioChoice?.moneyImpact ?? 0)}
                  </p>

                  <Badge
                    className={`
    flex items-center justify-center
    w-8 h-8 rounded-full

    ${
      (selectedScenarioChoice?.moneyImpact ?? 0) > 0
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
        ${(selectedScenarioChoice?.confidenceImpact ?? 0) > 0 ? "text-green-600" : "text-red-500"}
      `}
                  >
                    {(selectedScenarioChoice?.confidenceImpact ?? 0) > 0
                      ? "+"
                      : "-"}
                    {Math.abs(selectedScenarioChoice?.confidenceImpact ?? 0)}%
                  </p>

                  <Badge
                    className={`
    flex items-center justify-center
    w-8 h-8 rounded-full

    ${
      (selectedScenarioChoice?.confidenceImpact ?? 0) > 0
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
                onClick={() => {
                  setStep(0);
                  setSpun(false);
                }}
              >
                Play Again
              </Button>
              <Button
                className="w-full sm:w-auto px-8 py-4"
                variant="primary"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </StepCard>
    );
  }

  const handleConfirm = async () => {
    if (!selectedScenarioChoice) return;

    try {
      const response = await addUserSelection(selectedScenarioChoice.id);

      // updates the header stats w new values
      setUserStats({
        money: response.currentGameMoney,
        confidence: response.currentConfidenceScore,
      });

      setStep((current) => current + 1);
    } catch (err) {
      console.error("Error applying choice", err);
    }
  };

  const fetchScenarios = async () => {
    try {
      const data = await getScenarios();

      setAllScenarios((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Failed to load scenarios", err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserGameStats();
        setUserStats({
          money: data.currentGameMoney,
          confidence: data.currentConfidenceScore,
        });
      } catch (err) {
        console.error("Failed to load user stats", err);
      }
    };

    fetchStats();
    fetchScenarios();
  }, []);

  useEffect(() => {
    if (availableScenarios.length < 6) {
      fetchScenarios();
    }
  }, [availableScenarios.length]);

  return (
    <main>
      <section>{renderCurrentStep()}</section>
    </main>
  );
}
