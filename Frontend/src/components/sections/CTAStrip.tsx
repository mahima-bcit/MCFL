import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTAStrip() {
  return (
    <section className="bg-nav px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display mb-4 text-3xl font-bold text-white md:text-4xl">
          Ready to build your<br className="hidden sm:block" /> money confidence?
        </h2>
        <p className="mx-auto mb-8 max-w-sm text-base text-white/60">
          Free to use. No judgment. Start in 2 minutes.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-full bg-[#1d9e75] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#17875f] hover:shadow-xl"
        >
          Get Started Free <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}