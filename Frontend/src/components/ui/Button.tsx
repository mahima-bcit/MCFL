import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const styles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-gold hover:shadow-md active:scale-95',
  outline:
    'border-2 border-nav text-nav hover:border-gold hover:text-gold bg-transparent',
  ghost:
    'text-white/80 hover:text-gold hover:bg-white/10 border border-transparent',
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 rounded-full
        font-body font-medium text-sm
        transition-all duration-200 cursor-pointer
        ${styles[variant]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  )
}