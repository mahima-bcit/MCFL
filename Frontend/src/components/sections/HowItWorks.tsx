type Step = {
  number: string
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Create your profile',
    description:
      'Tell us a bit about yourself so we can tailor scenarios to your life stage — whether you\'re a student, working, or just getting started.',
  },
  {
    number: '02',
    title: 'Play money scenarios',
    description:
      'Spin the wheel and face real decisions: rent, groceries, unexpected costs. No wrong answers — just learning through experience.',
  },
  {
    number: '03',
    title: 'Watch your confidence grow',
    description:
      'Track your progress over time, earn badges, and build a money plan that fits your actual life.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 id="how-it-works-heading" className="font-display text-4xl font-bold text-nav mb-4">
            How it works
          </h2>
          <p className="text-nav/55 text-lg max-w-md mx-auto">
            Three simple steps to start building your financial confidence
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-primary/20 z-0" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center text-center animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Step number circle */}
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-md hover:bg-gold transition-colors duration-300">
                <span className="font-display font-bold text-white text-lg">{step.number}</span>
              </div>

              <h3 className="font-display font-semibold text-nav text-xl mb-3">
                {step.title}
              </h3>
              <p className="text-nav/55 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#how-it-works-heading"
            className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:text-gold transition-colors duration-200"
          >
            Ready to start?
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}