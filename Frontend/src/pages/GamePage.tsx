import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, LogOut, ThumbsDown, ThumbsUp, TrendingDown, TrendingUp, X, Zap } from "lucide-react";

import type { Scenario, ScenarioChoice } from "../types/game";
import MoneyScenarioHeader from "../components/layout/MoneyScenarioHeader";
import "../styles/SpinTheWheel.css";
import { addUserSelection, getScenarios, getUserGameStats } from "../services/gameApi";

type StepDefinition = {
  key: "spin-the-wheel" | "scenario-selection" | "scenario-result";
};

const setupSteps: StepDefinition[] = [
  { key: "spin-the-wheel" },
  { key: "scenario-selection" },
  { key: "scenario-result" },
];

export default function GamePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const currentStepDefinition = setupSteps[step] ?? setupSteps[0];

  const [allScenarios, setAllScenarios] = useState<Scenario[]>([]);
  const [playedScenarioIds, setPlayedScenarioIds] = useState<number[]>([]);
  const initialLoadDone = useRef(false);
  const availableScenarios = allScenarios.filter((s) => !playedScenarioIds.includes(s.id));
  const visibleScenarios = availableScenarios.slice(0, 6);

  const [spun, setSpun] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedScenarioChoice, setSelectedScenarioChoice] = useState<ScenarioChoice | null>(null);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [userStats, setUserStats] = useState({ money: 0, confidence: 0 });
  const [isConfirming, setIsConfirming] = useState(false);

  function handleQuitRequest() {
    if (currentStepDefinition.key === "scenario-result") {
      navigate("/dashboard");
    } else {
      setShowQuitModal(true);
    }
  }

  function renderCurrentStep() {
    switch (currentStepDefinition.key) {
      case "spin-the-wheel":     return renderSpinTheWheelStep();
      case "scenario-selection": return renderScenarioSelectionStep();
      case "scenario-result":    return renderScenarioResultStep();
      default:                   return null;
    }
  }

  function renderSpinTheWheelStep() {
    function handleSpin() {
      if (visibleScenarios.length === 0) return;
      const node = document.querySelector(".wheel-of-scenarios")!;
      const wheel = node.querySelector("ul")!;
      const previousEndDegree = 0;
      if (spun) return;
      setSpun(true);

      const spinDegrees = Math.random() * 360 + 1800;
      const selectedScenarioIndex = Math.floor(
        (spinDegrees % 360) / (360 / visibleScenarios.length),
      );
      const selected = visibleScenarios[selectedScenarioIndex];
      setSelectedScenario(selected);
      setPlayedScenarioIds((prev) => [...prev, selected.id]);

      const animation = wheel.animate(
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

        for (let i = 0; i < 120; i++) {
          const piece = document.createElement("div");
          piece.className = "confetti";
          piece.style.left = Math.random() * 100 + "vw";
          piece.style.animationDelay = Math.random() * 0.8 + "s";
          piece.style.transform = `rotate(${Math.random() * 360}deg)`;
          if (Math.random() > 0.5) {
            piece.style.borderRadius = "50%";
            piece.style.width = "10px";
            piece.style.height = "10px";
          }
          container.appendChild(piece);
        }

        setTimeout(() => {
          container.remove();
          setStep((current) => current + 1);
        }, 2000);
      };
    }

    return (
      <div className="game-page h-dvh flex flex-col overflow-hidden">
        <MoneyScenarioHeader
          money={userStats.money}
          confidence={userStats.confidence}
          onBack={handleQuitRequest}
          onInfo={() => setShowHowToPlay(true)}
        />

        <div className="flex flex-col flex-1 px-4 sm:px-6 py-2 sm:py-8 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sparkle sparkle1" />
            <div className="sparkle sparkle2" />
            <div className="sparkle sparkle3" />
            <div className="sparkle sparkle4" />
            <div className="sparkle sparkle5" />
            <div className="sparkle sparkle6" />
            <div className="sparkle sparkle7" />
            <div className="sparkle sparkle8" />
            <div className="sparkle sparkle9" />
            <div className="floaty floaty1" />
            <div className="floaty floaty2" />
            <div className="floaty floaty3" />
            <div className="floaty floaty4" />
            <div className="floaty floaty5" />
            <div className="floaty floaty6" />
            <div className="floaty floaty7" />
            <div className="floaty floaty8" />
            <div className="pulse-ring ring1" />
            <div className="pulse-ring ring2" />
            <div className="pulse-ring ring3" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center gap-7 lg:flex-row lg:items-center lg:justify-center lg:gap-14">

            {/* Wheel — first in DOM = top on mobile, left on desktop via lg:order-1 */}
            <div className="lg:order-1 flex items-center justify-center w-full lg:w-auto lg:shrink-0">
              <div className="w-full max-w-[min(340px,44dvh)] sm:max-w-[min(420px,50dvh)] lg:w-130 lg:max-w-[min(520px,70vh)]">
                <div className="wheel-ring-wrapper">
                  <div className="wheel-ring-inner">
                    <div className="wheel-of-scenarios w-full aspect-square relative">
                      <ul className="w-full">
                        {visibleScenarios.map((scenario, i) => (
                          <li key={scenario.id} className={i === 1 || i === 2 ? "flip-text" : ""}>
                            <span>{scenario.title}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="wheel-center-hub" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title + button — below wheel on mobile, right column on desktop via lg:order-2 */}
            <div className="lg:order-2 lg:w-95 lg:shrink-0 flex flex-col items-center lg:items-start gap-1 lg:gap-3 text-center lg:text-left shrink-0">
              <h1 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold game-text animate-bounce-slow leading-tight">
                Ready to{" "}
                <span className="text-gradient-green">level up</span>{" "}
                your money game?
              </h1>
              <p className="hidden lg:block game-text-muted max-w-md text-base">
                Spin the wheel to land on a real-life money scenario — then make your choice!
              </p>
              <button type="button" className="spin-btn-neon mt-1 lg:mt-2" onClick={handleSpin}>
                <Zap size={16} /> SPIN NOW
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  function renderScenarioSelectionStep() {
    return (
      <div className="game-page h-dvh flex flex-col overflow-hidden">
        <MoneyScenarioHeader
          money={userStats.money}
          confidence={userStats.confidence}
          onBack={handleQuitRequest}
        />

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sparkle sparkle1" />
            <div className="sparkle sparkle2" />
            <div className="sparkle sparkle3" />
            <div className="sparkle sparkle4" />
            <div className="sparkle sparkle5" />
            <div className="sparkle sparkle6" />
            <div className="sparkle sparkle7" />
            <div className="sparkle sparkle8" />
            <div className="sparkle sparkle9" />
            <div className="floaty floaty1" />
            <div className="floaty floaty2" />
            <div className="floaty floaty3" />
            <div className="floaty floaty4" />
            <div className="floaty floaty5" />
            <div className="floaty floaty6" />
            <div className="floaty floaty7" />
            <div className="floaty floaty8" />
            <div className="pulse-ring ring1" />
            <div className="pulse-ring ring2" />
            <div className="pulse-ring ring3" />
          </div>

          <div className="flex flex-col flex-1 px-4 sm:px-8 py-3 sm:py-8 max-w-2xl mx-auto w-full gap-3 sm:gap-6 overflow-hidden relative z-10">
            <div className="game-glass w-full shrink-0 overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-[#00d68f] via-[#00a8e8] to-[#a855f7]" />
              <div className="px-4 sm:px-8 py-3 sm:py-6 text-center">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest game-text-muted mb-1 sm:mb-2">
                  You landed on
                </p>
                <h1 className="text-base sm:text-2xl font-bold game-text mb-1 sm:mb-3 leading-snug">
                  {selectedScenario?.title}
                </h1>
                <p className="game-text text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {selectedScenario?.description}
                </p>
              </div>
            </div>

            <p className="game-text text-xs sm:text-base font-semibold shrink-0">What would you do?</p>

            <div className="game-choices-list flex flex-col gap-2 sm:gap-4 flex-1 overflow-y-auto min-h-0">
              {[...(selectedScenario?.choices ?? [])].sort((a, b) => a.id - b.id).map((choice, index) => {
                const isSelected = selectedScenarioChoice?.id === choice.id;
                return (
                  <div
                    key={choice.id}
                    onClick={() => setSelectedScenarioChoice(choice)}
                    className={`game-choice-card scenario-choice-animated${isSelected ? " selected" : ""}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span
                        className={`shrink-0 w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-200 ${
                          isSelected
                            ? "border-[#00d68f] bg-[#00d68f] text-white scale-110"
                            : "border-[#00d68f]/40 game-text-faint"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <p className="game-text text-xs sm:text-base leading-relaxed">
                        {choice.optionText}
                      </p>
                      {isSelected && (
                        <span className="ml-auto shrink-0 text-[#00d68f]">
                          <CheckCircle size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-1.5 shrink-0 -mt-1">
              <button
                type="button"
                className="spin-btn-neon"
                onClick={handleConfirm}
                disabled={!selectedScenarioChoice || isConfirming}
                style={
                  !selectedScenarioChoice || isConfirming
                    ? { opacity: 0.4, cursor: "not-allowed", animation: "none" }
                    : {}
                }
              >
                {isConfirming ? "Submitting..." : "Confirm Choice"}
              </button>
              <p className={`game-text text-xs animate-pulse ${selectedScenarioChoice ? "invisible" : ""}`}>
                Select an option above to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderScenarioResultStep() {
    const money = selectedScenarioChoice?.moneyImpact ?? 0;
    const confidence = selectedScenarioChoice?.confidenceImpact ?? 0;
    const moneyPositive = money > 0;
    const confidencePositive = confidence > 0;

    return (
      <div className="game-page h-dvh flex flex-col overflow-hidden">
        <MoneyScenarioHeader
          money={userStats.money}
          confidence={userStats.confidence}
          onBack={handleQuitRequest}
        />

        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="sparkle sparkle1" />
            <div className="sparkle sparkle2" />
            <div className="sparkle sparkle3" />
            <div className="sparkle sparkle4" />
            <div className="sparkle sparkle5" />
            <div className="sparkle sparkle6" />
            <div className="sparkle sparkle7" />
            <div className="sparkle sparkle8" />
            <div className="sparkle sparkle9" />
            <div className="floaty floaty1" />
            <div className="floaty floaty2" />
            <div className="floaty floaty3" />
            <div className="floaty floaty4" />
            <div className="floaty floaty5" />
            <div className="floaty floaty6" />
            <div className="floaty floaty7" />
            <div className="floaty floaty8" />
            <div className="pulse-ring ring1" />
            <div className="pulse-ring ring2" />
            <div className="pulse-ring ring3" />
          </div>

          <div className="flex flex-col flex-1 items-center justify-center px-4 sm:px-8 py-4 sm:py-8 relative z-10">
            <div className="flex flex-col max-w-2xl w-full gap-3 sm:gap-5">

              {/* Result card */}
              <div className="game-glass w-full shrink-0 overflow-hidden">
                <div className="h-1 w-full bg-linear-to-r from-[#00d68f] via-[#00a8e8] to-[#a855f7]" />
                <div className="px-5 sm:px-12 py-5 sm:py-12 text-center">
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest game-text-muted mb-2 sm:mb-4">
                    Here's what happened
                  </p>
                  <p className="game-text text-xs sm:text-base leading-relaxed mb-2 sm:mb-4">
                    {selectedScenarioChoice?.resultText}
                  </p>
                  <p className="game-text text-xs sm:text-base leading-relaxed">
                    {selectedScenarioChoice?.lessonText}
                  </p>
                </div>
              </div>

              {/* Stat cards */}
              <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
                <div className={`game-stat-card ${moneyPositive ? "positive" : "negative"}`}>
                  <p className="game-text-muted text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-4">
                    Money
                  </p>
                  <div className="flex items-end justify-between">
                    <p className={`text-xl sm:text-4xl font-black ${moneyPositive ? "text-[#00d68f]" : "text-[#ff4757]"}`}>
                      {moneyPositive ? "+" : "-"}${Math.abs(money)}
                    </p>
                    <span className={moneyPositive ? "text-[#00d68f]" : "text-[#ff4757]"}>
                      {moneyPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </span>
                  </div>
                </div>

                <div className={`game-stat-card ${confidencePositive ? "positive" : "negative"}`}>
                  <p className="game-text-muted text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-4">
                    Confidence
                  </p>
                  <div className="flex items-end justify-between">
                    <p className={`text-xl sm:text-4xl font-black ${confidencePositive ? "text-[#00d68f]" : "text-[#ff4757]"}`}>
                      {confidencePositive ? "+" : "-"}{Math.abs(confidence)}%
                    </p>
                    <span className={confidencePositive ? "text-[#00d68f]" : "text-[#ff4757]"}>
                      {confidencePositive ? <ThumbsUp size={18} /> : <ThumbsDown size={18} />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full justify-center shrink-0">
                <button
                  type="button"
                  className="game-action-btn primary"
                  onClick={() => {
                    setStep(0);
                    setSelectedScenario(null);
                    setSelectedScenarioChoice(null);
                    setSpun(false);
                    setIsConfirming(false);
                  }}
                >
                  <Zap size={15} /> Play Again
                </button>
                <button
                  type="button"
                  className="game-action-btn outline"
                  onClick={() => navigate("/game-zone")}
                >
                  Back to Game Zone
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!selectedScenarioChoice || isConfirming) return;
    setIsConfirming(true);
    try {
      const response = await addUserSelection(selectedScenarioChoice.id);
      setUserStats({
        money: response.currentGameMoney,
        confidence: response.currentConfidenceScore,
      });
      setIsConfirming(false);
      setStep((current) => current + 1);
    } catch (err) {
      console.error("Error applying choice", err);
      setIsConfirming(false);
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

    const fetchScenarios = async () => {
      try {
        const data = await getScenarios();
        setAllScenarios((prev) => [...new Map([...prev, ...data].map(s => [s.id, s])).values()]);
      } catch (err) {
        console.error("Failed to load scenarios", err);
      }
    };

    void fetchStats();
    void fetchScenarios().then(() => { initialLoadDone.current = true; });
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (availableScenarios.length < 6) {
      const fetchScenarios = async () => {
        try {
          const data = await getScenarios();
          setAllScenarios((prev) => [...new Map([...prev, ...data].map(s => [s.id, s])).values()]);
        } catch (err) {
          console.error("Failed to load scenarios", err);
        }
      };
      void fetchScenarios();
    }
  }, [availableScenarios.length]);

  return (
    <main>
      <section>{renderCurrentStep()}</section>

      {showHowToPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="game-glass w-full max-w-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="game-text text-lg font-bold">How to play</h2>
              <button onClick={() => setShowHowToPlay(false)} className="game-text-muted hover:opacity-70 transition-opacity">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { step: "1", icon: <Zap size={18} className="text-[#00d68f]" />, title: "Spin the wheel", desc: "Spin to land on a real-life money scenario — rent, impulse buys, unexpected bills and more." },
                { step: "2", icon: <CheckCircle size={18} className="text-[#00a8e8]" />, title: "Make your choice", desc: "Read the scenario and pick how you'd handle it. There's no single right answer!" },
                { step: "3", icon: <TrendingUp size={18} className="text-[#a855f7]" />, title: "See the result", desc: "Find out the outcome and how your choice affects your money and confidence score." },
              ].map(({ step, icon, title, desc }) => (
                <div key={step} className="flex gap-3 items-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#00d68f]/10 border border-[#00d68f]/30 flex items-center justify-center">
                    {icon}
                  </div>
                  <div>
                    <p className="game-text text-sm font-semibold mb-0.5">{title}</p>
                    <p className="game-text-muted text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="game-action-btn primary w-full" onClick={() => setShowHowToPlay(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {showQuitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="game-glass w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center">
            <div className="game-text-muted">
              <LogOut size={40} strokeWidth={1.5} />
            </div>
            <h2 className="game-text text-xl font-bold">Quit the game?</h2>
            <p className="game-text-muted text-sm leading-relaxed">
              Your progress on this scenario will be lost. You can always start a new spin when you come back.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
              <button
                type="button"
                className="game-action-btn outline flex-1"
                onClick={() => setShowQuitModal(false)}
              >
                Keep Playing
              </button>
              <button
                type="button"
                className="game-action-btn primary flex-1"
                style={{ background: "linear-gradient(135deg,#ff4757,#ff6b81)" }}
                onClick={() => navigate("/game-zone")}
              >
                Quit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
