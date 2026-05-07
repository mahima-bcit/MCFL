import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Info, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

type Props = {
  money: number;
  confidence: number;
  onBack?: () => void;
  onInfo?: () => void;
};

export default function MoneyScenarioHeader({ money, confidence, onBack, onInfo }: Props) {
  const navigate = useNavigate();
  const { isDark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-3 md:px-6 h-12 sm:h-16 flex items-center justify-between">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
          onClick={() => { if (onBack) { onBack(); } else { navigate("/dashboard"); } }}
          aria-label="Go back"
        >
          <IoArrowBack size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            {/* Money pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#00d68f]/40 bg-[#00d68f]/10 text-[#009e68] font-semibold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span>{money}</span>
            </div>

            {/* Confidence pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#f472b6]/40 bg-[#f472b6]/10 text-[#db2777] font-semibold text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61c-1.54-1.34-3.77-1.21-5.18.3L12 8.09l-3.66-3.18c-1.41-1.51-3.64-1.64-5.18-.3-1.6 1.4-1.69 3.88-.2 5.39L12 21l9.04-10.99c1.49-1.51 1.4-3.99-.2-5.39z" />
              </svg>
              <span>{Math.min(100, confidence)}%</span>
            </div>
          </div>

          <button
            onClick={toggle}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {onInfo && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 transition-colors game-text-muted"
              onClick={onInfo}
              aria-label="How to play"
            >
              <Info size={17} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
