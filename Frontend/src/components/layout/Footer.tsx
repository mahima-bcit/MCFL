export default function Footer() {
  return (
    <footer className="bg-nav text-white/50 py-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>© 2026 Money Confidence for Life. All rights reserved.</p>
        <nav className="flex gap-6" aria-label="Footer">
          <span className="hover:text-gold transition-colors">Privacy</span>
          <span className="hover:text-gold transition-colors">Terms</span>
          <span className="hover:text-gold transition-colors">Contact</span>
        </nav>
      </div>
    </footer>
  )
}