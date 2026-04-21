type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Create your profile',
    description: 'Tell us about yourself so we can tailor scenarios to your life stage — student, working, or just getting started.',
  },
  {
    number: '02',
    title: 'Play money scenarios',
    description: 'Spin the wheel and face real decisions: rent, groceries, unexpected costs. No wrong answers — just learning.',
  },
  {
    number: '03',
    title: 'Watch confidence grow',
    description: 'Track your progress, earn badges, and build a money plan that actually fits your life.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 md:px-6">

        {/* Heading */}
        <div className="text-center mb-10 md:mb-16 animate-fade-up">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-nav mb-3 md:mb-4">
            How it works
          </h2>
          <p className="text-nav/55 text-base md:text-lg max-w-md mx-auto">
            Three simple steps to start building your financial confidence
          </p>
        </div>

        {/* Steps: vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-6 relative">

          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-primary/20 z-0" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative z-10 flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Number + vertical connector for mobile */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-gold transition-colors duration-300 md:mb-6">
                  <span className="font-display font-bold text-white text-base md:text-lg">{step.number}</span>
                </div>
                {/* Vertical line between steps on mobile */}
                {i < steps.length - 1 && (
                  <div className="md:hidden w-px h-8 bg-primary/20 mt-2" />
                )}
              </div>

              <div className="pb-2 md:pb-0">
                <h3 className="font-display font-semibold text-nav text-lg md:text-xl mb-2">{step.title}</h3>
                <p className="text-nav/55 text-sm leading-relaxed max-w-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-16">
          <a href="#" className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-gold transition-colors duration-200">
            Ready to start?
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}