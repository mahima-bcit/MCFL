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
      className="bg-white rounded-2xl p-5 shadow-sm border border-primary/10 hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-slide-in"
      style={{ animationDelay: delay }}
    >
      <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center mb-3 border border-primary/15">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-nav text-[15px] mb-1">{title}</h3>
      <p className="text-nav/55 text-sm leading-relaxed">{description}</p>
    </div>
  )
}