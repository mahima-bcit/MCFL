export default function Footer() {
  return (
    <footer className="bg-nav text-white/50 py-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>© 2026 Money Confidence for Life. All rights reserved.</p>
        <nav className="flex gap-6">
          <a href="#" className="hover:text-gold transition-colors">Privacy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms</a>
          <a href="#" className="hover:text-gold transition-colors">Contact</a>
        </nav>
      </div>
    </footer>
  )
}