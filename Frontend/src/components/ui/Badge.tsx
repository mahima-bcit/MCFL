import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  icon?: ReactNode
}

export default function Badge({ children, icon }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary-dark text-xs font-medium border border-primary/20">
      {icon && <span className="text-primary">{icon}</span>}
      {children}
    </span>
  )
}