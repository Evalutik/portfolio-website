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
  const baseStyles = 'font-medium rounded-lg inline-flex items-center justify-center text-sm px-4 py-2'

  const variantStyles = {
    // Primary uses btn-primary-animated for diagonal fill effect
    primary: 'btn-primary-animated text-white',
    // Secondary uses original Tailwind styling + btn-secondary-shine for one-time shine sweep on hover
    secondary: 'btn-secondary-shine bg-surface border border-border text-text-primary transition-all duration-200 hover:bg-surface-light hover:border-border-light',
  }

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`

  // Wrap children in span for z-index to work with ::before pseudo-element
  const content = <span>{children}</span>

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={combinedClassName}>
      {content}
    </Link>
  )
}
