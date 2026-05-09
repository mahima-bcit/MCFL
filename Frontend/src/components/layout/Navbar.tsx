import { Link, useLocation } from 'react-router-dom'
import { Home, LogIn } from 'lucide-react'

export default function Navbar() {
  const { pathname } = useLocation()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  return (
    <header className="bg-nav sticky top-0 z-50">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 md:gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center">
            <img
              src="/MCFL.png"
              alt="MCFL"
              className="h-full w-full object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>
          <div>
            <span className="block font-display text-sm font-bold leading-tight tracking-tight text-white md:text-base">
              Money Confidence<span className="hidden sm:inline"> for Life</span>
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-white/70">
              Level Up Your Future
            </span>
          </div>
        </Link>

        {isAuthPage ? (
          <Link
            to="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-[14px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 md:px-4"
            aria-label="Home"
          >
            <Home size={15} strokeWidth={2.2} />
            <span className="hidden md:inline">Home</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 text-[14px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 md:px-4"
            aria-label="Log in"
          >
            <LogIn size={15} strokeWidth={2.2} />
            <span className="hidden md:inline">Log in</span>
          </Link>
        )}

      </div>

      {/* Gradient border line */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/25 to-transparent" />
    </header>
  )
}
