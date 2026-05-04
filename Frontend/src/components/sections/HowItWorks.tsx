import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

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
    <section id="how-it-works" className="bg-mint py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">

        {/* Heading */}
        <div className="mb-10 animate-fade-up text-center md:mb-16">
          <h2 className="font-display mb-3 text-3xl font-bold text-nav md:mb-4 md:text-4xl">
            How it works
          </h2>
          <p className="mx-auto max-w-md text-base text-nav/55 md:text-lg">
            Three simple steps to start building your financial confidence
          </p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">

          {/* Connector line — desktop only */}
          <div className="absolute left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] top-8 z-0 hidden h-px bg-primary/20 md:block" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="animate-fade-up relative z-10"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Mobile: horizontal layout */}
              <div className="flex items-start gap-5 md:flex-col md:items-center md:gap-0 md:text-center">
                <div className="flex shrink-0 flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nav shadow-md transition-colors duration-300 hover:bg-primary md:mb-6 md:h-16 md:w-16">
                    <span className="font-display text-base font-bold text-white md:text-lg">{step.number}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 h-8 w-px bg-primary/20 md:hidden" />
                  )}
                </div>

                <div className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm md:mt-0 md:w-full md:p-5">
                  <h3 className="font-display mb-2 text-lg font-semibold text-nav md:text-xl">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-nav/55">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center md:mt-16">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-nav px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary hover:shadow-md"
          >
            Get started now <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}