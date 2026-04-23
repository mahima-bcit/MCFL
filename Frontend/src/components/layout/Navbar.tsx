import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = window.location.pathname === "/";
  const howItWorksHref = isHomePage ? "#how-it-works" : "/#how-it-works";
  const featuresHref = isHomePage ? "#features" : "/#features";

  const closeMenu = () => setMenuOpen(false);

  const navLinkClasses =
    "text-white/70 hover:text-gold text-sm font-medium transition-colors duration-200";

  const mobileLinkClasses =
    "text-white/70 hover:text-gold hover:bg-white/5 text-sm font-medium py-2.5 px-3 rounded-lg transition-all";

  return (
    <header className="bg-nav sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="logo" />
          </div>
          <span className="text-white font-display font-semibold text-sm md:text-lg tracking-tight">
            Money Confidence<span className="hidden sm:inline"> for Life</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href={howItWorksHref} className={navLinkClasses}>
            How it works
          </a>
          <a href={featuresHref} className={navLinkClasses}>
            Features
          </a>
          <a href="/parent-feedback" className={navLinkClasses}>
            Parent Feedback
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm text-white/80 hover:text-gold hover:bg-white/10 border border-transparent transition-all duration-200"
          >
            Log In
          </a>

          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-nav border-t border-white/10 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          <a href={howItWorksHref} onClick={closeMenu} className={mobileLinkClasses}>
            How it works
          </a>
          <a href={featuresHref} onClick={closeMenu} className={mobileLinkClasses}>
            Features
          </a>
          <a href="/parent-feedback" onClick={closeMenu} className={mobileLinkClasses}>
            Parent Feedback
          </a>

          <div className="pt-2 border-t border-white/10 mt-1">
            <a
              href="/login"
              onClick={closeMenu}
              className="inline-flex w-full justify-center items-center gap-2 px-5 py-2.5 rounded-full font-body font-medium text-sm text-white/80 hover:text-gold hover:bg-white/10 border border-transparent transition-all duration-200"
            >
              Log In
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}