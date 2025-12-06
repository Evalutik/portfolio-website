'use client'

import { useEffect, useRef } from 'react'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      // Check if mouse is near the card (within 100px)
      const isNear = 
        e.clientX >= rect.left - 100 &&
        e.clientX <= rect.right + 100 &&
        e.clientY >= rect.top - 100 &&
        e.clientY <= rect.bottom + 100

      if (isNear) {
        glow.style.opacity = '1'
        glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(139, 92, 246, 0.15), transparent 40%)`
      } else {
        glow.style.opacity = '0'
      }
    }

    const handleMouseLeave = () => {
      glow.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className={`relative group ${className}`}
    >
      {/* Glow effect layer */}
      <div
        ref={glowRef}
        className="absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      {/* Card content - frosted glass with backdrop blur */}
      <div className={`relative bg-surface/80 backdrop-blur-md border border-border group-hover:border-border-light group-hover:bg-surface-light/80 rounded-xl transition-colors duration-200 ${className.includes('h-full') ? 'h-full' : ''} ${className.includes('flex') ? 'flex flex-col' : ''}`}>
        {children}
      </div>
    </div>
  )
}
