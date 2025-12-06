'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  href: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  external?: boolean
}

export function Button({
  href,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center text-sm px-4 py-2'

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-surface border border-border text-text-primary hover:bg-surface-light hover:border-border-light',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={combinedClassName}>
      {children}
    </Link>
  )
}
