import { useState } from 'react'
import Button from '../ui/Button'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-nav sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary flex items-center justify-center">
            <img src="/logo.png" alt="logo" />
          </div>
          <span className="text-white font-display font-semibold text-sm md:text-lg tracking-tight">
            Money Confidence<span className="hidden sm:inline"> for Life</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-white/70 hover:text-gold text-sm font-medium transition-colors duration-200">How it works</a>
          <a href="#features" className="text-white/70 hover:text-gold text-sm font-medium transition-colors duration-200">Features</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden md:inline-flex">Log In</Button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`md:hidden bg-nav border-t border-white/10 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col px-4 py-3 gap-1">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}
            className="text-white/70 hover:text-gold hover:bg-white/5 text-sm font-medium py-2.5 px-3 rounded-lg transition-all">
            How it works
          </a>
          <a href="#features" onClick={() => setMenuOpen(false)}
            className="text-white/70 hover:text-gold hover:bg-white/5 text-sm font-medium py-2.5 px-3 rounded-lg transition-all">
            Features
          </a>
          <div className="pt-2 border-t border-white/10 mt-1">
            <Button variant="ghost" className="w-full justify-center">Log In</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}