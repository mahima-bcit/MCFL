import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

import Badge from "../ui/Badge";

type Props = {
  money: number;
  confidence: number;
};

export default function MoneyScenarioHeader({ money, confidence }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button
          className="w-full sm:w-auto px-8 py-4"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          <IoArrowBack />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-base text-gray-900 font-body font-semibold text-sm md:text-lg tracking-tight">
            Money <span className="hidden sm:inline"> Scenario</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="animate-fade-up text-center md:text-left">
            <div className="flex justify-center md:justify-start">
              <Badge>
                <p>${money}</p>
              </Badge>
              <Badge>
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
                <p>{confidence}%</p>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-nav border-t border-white/10 overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          <div className="pt-2 border-t border-white/10 mt-1">
            <div className="flex items-center gap-3">
              <div className="animate-fade-up text-center md:text-left">
                <div className="flex justify-center md:justify-start">
                  <Badge>$</Badge>
                  <Badge>*</Badge>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
