import type { ReactNode } from 'react'

type FeatureCardProps = {
  icon: ReactNode
  title: string
  description: string
  delay?: string
}

export default function FeatureCard({ icon, title, description, delay = '0ms' }: FeatureCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex items-start gap-4 md:block animate-slide-in"
      style={{ animationDelay: delay }}
    >
      {/* Icon — side-by-side on mobile, stacked on desktop */}
      <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center border border-primary/15 flex-shrink-0 md:mb-3">
        {icon}
      </div>
      <div>
        <h3 className="font-display font-semibold text-nav text-[15px] mb-1">{title}</h3>
        <p className="text-nav/55 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}