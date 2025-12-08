'use client'

import { useEffect, useRef, useState } from 'react'
import { CURSOR_GLOW } from '@/config/colors'

/**
 * CursorGlow
 * 
 * A subtle glow effect that follows the mouse cursor.
 * Dimmer by default, brighter when cursor is moving.
 * Hidden on touch devices.
 */
export function CursorGlow() {
  const gridRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    checkTouch()

    if (isTouchDevice) return

    // Initialize at center bottom of screen
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight
    // Single shared position for both lights
    let currentX = mouseX
    let currentY = mouseY
    // Velocity for spring physics (overshoot effect)
    let velocityX = 0
    let velocityY = 0
    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)

      // Set moving state - stays bright for 1 second after movement stops
      setIsMoving(true)
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
      moveTimeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 1000)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    // Spring physics animation - both lights share same position
    const animate = () => {
      // Spring constants - one subtle overshoot then settle
      const stiffness = 0.035  // Pull strength toward cursor
      const damping = 0.82     // Higher = fewer bounces

      // Calculate spring force toward mouse position
      const forceX = (mouseX - currentX) * stiffness
      const forceY = (mouseY - currentY) * stiffness

      // Apply force to velocity (velocity accumulates momentum)
      velocityX += forceX
      velocityY += forceY

      // Apply damping to velocity
      velocityX *= damping
      velocityY *= damping

      // Update position
      currentX += velocityX
      currentY += velocityY

      // Update grid mask position
      if (gridRef.current) {
        const maskGradient = `radial-gradient(circle 168px at ${currentX}px ${currentY}px, black 0%, transparent 70%)`
        gridRef.current.style.maskImage = maskGradient
        gridRef.current.style.webkitMaskImage = maskGradient
      }

      // Update glow position - same as grid
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.body.addEventListener('mouseleave', handleMouseLeave)
    document.body.addEventListener('mouseenter', handleMouseEnter)

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
      document.body.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafId)
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    }
  }, [isTouchDevice])

  // Don't render on touch devices
  if (isTouchDevice) return null

  return (
    <>
      {/* Illuminated grid layer - brighter grid visible only near cursor */}
      <div
        ref={gridRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${CURSOR_GLOW}99 1px, transparent 1px),
            linear-gradient(90deg, ${CURSOR_GLOW}99 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          opacity: isVisible ? (isMoving ? 0.8 : 0.4) : 0,
          transition: isMoving ? 'opacity 0.2s ease' : 'opacity 5s ease',
          zIndex: -9,
          // Mask will be set via JS
          maskImage: 'radial-gradient(circle 168px at 50% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle 168px at 50% 50%, black 0%, transparent 70%)',
        }}
      />
      {/* Normal cursor glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          willChange: 'transform',
          zIndex: -8,
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            width: '224px',
            height: '224px',
            left: '-112px',
            top: '-112px',
            background: `radial-gradient(circle, ${CURSOR_GLOW}14 0%, ${CURSOR_GLOW}08 35%, transparent 55%)`,
            borderRadius: '50%',
            opacity: isVisible ? (isMoving ? 1 : 0.4) : 0,
            transition: isMoving ? 'opacity 0.2s ease' : 'opacity 3s ease',
            filter: 'blur(12px)',
          }}
        />
      </div>
    </>
  )
}
