import { Link } from 'react-router-dom'
import { ArrowRight, Target, TrendingUp, Wallet } from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Spin & Learn',
    description: 'Spin the wheel, pick your move - rent, groceries, first job, unexpected bills',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-400/15',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Your confidence score updates after every scenario and watch it climb',
    iconColor: 'text-sky-400',
    iconBg: 'bg-sky-400/15',
  },
  {
    icon: Wallet,
    title: 'Build Your Picture',
    description: 'Map out where your money goes - no spreadsheets, no jargon',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-400/15',
  },
]

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-5rem)] flex-col bg-nav px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto flex w-full flex-1 flex-col" style={{ maxWidth: '72rem' }}>
        <div className="grid flex-1 grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">

          {/* Left: text */}
          <div className="animate-fade-up flex flex-col text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 self-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 md:self-start">
              Made for young Canadians
            </span>

            <h1 className="font-display mb-3 mt-4 text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-[48px] lg:text-[56px]">
              Learn money skills<br />
              <span className="text-emerald-400">that actually stick</span>
            </h1>

            <p className="mx-auto mb-2 max-w-md text-base leading-relaxed text-white/65 md:mx-0">
              A fun, judgment-free way to explore financial decisions and build the
              confidence you need for real life.
            </p>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-white/45 md:mx-0">
              Learn by doing, not reading. Pick a scenario, make a call, see what happens.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#17875f] hover:shadow-xl sm:w-auto"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 sm:w-auto"
              >
                How it works
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex flex-col items-center gap-2 md:items-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#1D9E75', '#0F6E56', '#34d399', '#1A3C2E'].map((c, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-nav"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/50">
                  <span className="font-semibold text-white/80">2,400+</span> young Canadians building confidence
                </p>
              </div>
              <p className="text-xs text-white/30">
                No credit card. No financial experience needed.
              </p>
            </div>
          </div>

          {/* Right: feature cards */}
          <div id="features" className="flex flex-col gap-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="animate-slide-in flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-white/10 md:p-5"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${f.iconBg}`}>
                    <Icon size={20} className={f.iconColor} />
                  </div>
                  <div>
                    <h3 className="font-display mb-1 text-[15px] font-semibold text-white">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-white/55">{f.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}