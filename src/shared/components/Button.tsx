import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md'
}

const base =
  'inline-flex items-center justify-center font-medium transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-api-blue text-white hover:bg-blue-500',
  outline: 'border border-black/20 hover:bg-black hover:text-white',
}

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-6 py-2.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}
