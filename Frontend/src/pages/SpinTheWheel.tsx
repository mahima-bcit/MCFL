import "../styles/SpinTheWheel.css";
import { useEffect } from "react";
import MoneyScenarioHeader from "../components/layout/MoneyScenarioHeader";
import Button from "../components/ui/Button";

const generateScenario = () => {
  let scenario = {
    id: 0,
    title: "Scenario Title",
  };
  return scenario;
};

const getScenarios = () => {
  const itemCount = 6;
  let scenarios = [];
  for (let i = 0; i < itemCount; i++) {
    let scenario = generateScenario();
    scenario.id = i;
    scenarios.push(scenario);
  }
  return scenarios;
};

export default function SpinTheWheel() {
  let scenarios = getScenarios();
  let spun = false;

  useEffect(() => {
    const node = document.querySelector(".wheel-of-scenarios")!;
    const spin = document.querySelector(".spin-btn")!;
    const wheel = node.querySelector("ul")!;
    let animation: Animation;
    let previousEndDegree = 0;

    const launchConfetti = () => {
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
      }, 2000);
    };

    spin.addEventListener(
      "click",
      () => {
        if (spun) return;
        spun = true;

        const spinDegrees = Math.random() * 360 + 1800;
        let selectedScenarioIndex = Math.floor(
          (spinDegrees % 360) / (360 / scenarios.length),
        );
        let selectedScenario = scenarios[selectedScenarioIndex];
        console.log(selectedScenario);

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
          launchConfetti();
        };
      },
      { once: true },
    );
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-mint via-white to-mint font-body overflow-hidden">
      <MoneyScenarioHeader />

      <div className="flex flex-col items-center px-4 py-10 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="sparkle sparkle1"></div>
          <div className="sparkle sparkle2"></div>
          <div className="sparkle sparkle3"></div>
        </div>

        <div className="wheel-of-scenarios flex flex-col items-center gap-8 w-full max-w-md md:max-w-lg lg:max-w-xl m-4">
          <ul className="w-full aspect-square max-w-xs md:max-w-sm lg:max-w-md z-20 rounded-full border-4 border-primary shadow-2xl flex items-center justify-center text-center text-nav font-semibold">
            {scenarios.map((scenario) => (
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
            Step right up & try your luck to see what financial scenario you get
            to choose from!
          </p>
        </div>

        <button
          id="spin-btn"
          type="submit"
          className="spin-btn mt-8 px-10 py-4 rounded-xl font-bold text-lg
        bg-primary text-white shadow-lg
        animate-pulse-slow
        hover:scale-105 transition"
        >
          SPIN NOW
        </button>
      </div>
    </main>
  );
}
