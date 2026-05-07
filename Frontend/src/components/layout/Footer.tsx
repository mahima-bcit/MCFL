export default function Footer() {
  return (
    <footer className="bg-nav">
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/25 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          {/* Brand */}
          <div className="flex items-center gap-2.5 text-center md:text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
              <img
                src="/MCFL.png"
                alt="MCFL"
                className="h-full w-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Money Confidence for Life</p>
              <p className="text-[11px] text-white/50">© 2026 All rights reserved.</p>
            </div>
          </div>

          {/* Links */}
          <nav className="flex gap-6 text-sm">
            <a href="mailto:ssi.mcfl@gmail.com" className="text-white/50 transition-colors hover:text-white">Contact</a>
          </nav>

        </div>
      </div>
    </footer>
  )
}