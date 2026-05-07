import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const styles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-gold hover:shadow-md active:scale-95',
  outline: 'border-2 border-nav text-nav hover:border-gold hover:text-gold bg-transparent',
  ghost:   'text-white/80 hover:text-gold hover:bg-white/10 border border-transparent',
}

export default function Button({ children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2
        px-5 py-2.5
        rounded-full font-body font-medium text-sm
        transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${disabled ? '' : 'cursor-pointer'}
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}