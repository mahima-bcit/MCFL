import Button from '../ui/Button'
import Badge from '../ui/Badge'
import FeatureCard from '../ui/FeatureCard'

const SpinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
  </svg>
)

const AwardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
)

const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
)

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">

        {/* ── Left: Text content ── */}
        <div className="animate-fade-up text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <Badge icon={<UserIcon />}>Level Up Your Future</Badge>
          </div>

          {/* Heading: smaller on mobile, larger on desktop */}
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-nav leading-[1.1] mt-5 mb-4">
            Learn money skills<br />
            that actually stick
          </h1>

          <p className="text-nav/60 text-base md:text-lg leading-relaxed mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
            A fun, judgment-free way to explore financial decisions and build the
            confidence you need for real life. Made for teens and young adults in Canada.
          </p>

          {/* CTAs — stacked on mobile, side-by-side on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <Button variant="primary" className="w-full sm:w-auto text-base px-7 py-3">
              Get Started <ArrowRightIcon />
            </Button>
            <Button variant="outline" className="w-full sm:w-auto text-base px-7 py-3">
              How it works
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center md:justify-start gap-3 mt-8">
            <div className="flex -space-x-2">
              {['#1D9E75', '#0F6E56', '#D4A017', '#1A3C2E'].map((c, i) => (
                <div key={i} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-mint" style={{ background: c }} />
              ))}
            </div>
            <p className="text-nav/50 text-xs md:text-sm">
              <span className="text-nav font-semibold">2,400+</span> young Canadians building confidence
            </p>
          </div>
        </div>

        {/* ── Right: Feature cards ── */}
        <div id="features" className="flex flex-col gap-3 md:gap-4">
          <FeatureCard icon={<SpinIcon />} title="Spin & Learn"
            description="Play real-world money scenarios through our interactive wheel game" delay="100ms" />
          <FeatureCard icon={<AwardIcon />} title="Track Progress"
            description="See your money confidence grow with every decision you make" delay="200ms" />
          <FeatureCard icon={<TrendUpIcon />} title="Build Your Picture"
            description="Create a simple money plan with Have, Need, Fun, and Save" delay="300ms" />
        </div>

      </div>
    </section>
  )
}