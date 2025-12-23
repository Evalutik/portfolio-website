'use client'

import { useRef, useEffect, useState, createContext, useContext } from 'react'
import { useAnimationFrame } from 'framer-motion'

// Context to communicate hover state between rows
// hoveredRow = instant highlight, pausedRow = delayed pause (after 200ms)
const MarqueeContext = createContext<{
  hoveredRow: number | null
  pausedRow: number | null
  setHoveredRow: (row: number | null) => void
}>({ hoveredRow: null, pausedRow: null, setHoveredRow: () => { } })

interface SkillMarqueeProps {
  children: React.ReactNode[]
  direction?: 'left' | 'right'
  baseSpeed?: number
  rowIndex: number
}

/**
 * SkillMarquee
 * 
 * A single row of infinitely scrolling skill cards.
 * Uses pixel-based animation for truly seamless infinite loop.
 * Pauses when hovered, speeds up instantly on scroll.
 */
function SkillMarquee({ children, direction = 'left', baseSpeed = 0.055, rowIndex }: SkillMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [contentWidth, setContentWidth] = useState(0)
  const xPosRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const lastScrollTimeRef = useRef(0)
  const currentSpeedMultiplierRef = useRef(1)
  const { pausedRow, setHoveredRow } = useContext(MarqueeContext)

  const isPaused = pausedRow === rowIndex

  // Measure content width
  useEffect(() => {
    const measure = () => {
      if (innerRef.current) {
        const firstSet = innerRef.current.querySelector('[data-set="first"]') as HTMLElement
        if (firstSet) {
          const newWidth = firstSet.offsetWidth
          // Only update if width actually changed to avoid re-renders
          setContentWidth(prev => prev !== newWidth ? newWidth : prev)
        }
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  // Track scroll velocity (how fast the page is actually moving)
  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now()
      const currentY = window.scrollY
      const deltaTime = now - lastScrollTimeRef.current

      if (deltaTime > 0 && lastScrollTimeRef.current > 0) {
        // Calculate velocity in pixels per millisecond
        const deltaY = Math.abs(currentY - lastScrollYRef.current)
        const velocity = deltaY / deltaTime
        // Smooth the velocity a bit to avoid jitter
        scrollVelocityRef.current = scrollVelocityRef.current * 0.3 + velocity * 0.7
      }

      lastScrollYRef.current = currentY
      lastScrollTimeRef.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Animate position using pixel values for seamless loop
  useAnimationFrame((time, delta) => {
    if (isPaused || contentWidth === 0) return

    // Decay velocity over time when not scrolling
    const timeSinceScroll = performance.now() - lastScrollTimeRef.current
    if (timeSinceScroll > 16) {
      // Decay velocity when no scroll events are coming
      scrollVelocityRef.current *= 0.92
    }

    // Map scroll velocity to speed multiplier
    // Even tiny scroll movements should trigger a boost
    // velocity ~0.05+ px/ms = noticeable scroll
    const velocity = scrollVelocityRef.current
    const targetMultiplier = 1 + Math.min(velocity * 35, 4.06) // faster scroll response, max ~5x speed

    // Smoothly interpolate current speed towards target
    const lerpFactor = 0.15
    currentSpeedMultiplierRef.current += (targetMultiplier - currentSpeedMultiplierRef.current) * lerpFactor

    const speed = baseSpeed * currentSpeedMultiplierRef.current
    // Delta-based for frame-rate independence
    const movement = (delta / 16) * speed * contentWidth * 0.001

    if (direction === 'left') {
      xPosRef.current -= movement
      if (xPosRef.current <= -contentWidth) {
        xPosRef.current += contentWidth
      }
    } else {
      xPosRef.current += movement
      if (xPosRef.current >= 0) {
        xPosRef.current -= contentWidth
      }
    }

    if (innerRef.current) {
      innerRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`
    }
  })

  // Initialize position for right-moving rows
  useEffect(() => {
    if (direction === 'right' && contentWidth > 0) {
      xPosRef.current = -contentWidth
    }
  }, [direction, contentWidth])

  const handleMouseEnter = () => {
    setHoveredRow(rowIndex)
  }

  const handleMouseLeave = () => {
    setHoveredRow(null)
  }

  return (
    <div
      ref={containerRef}
      className="select-none py-1.5 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ zIndex: 10 }}
    >
      <div
        ref={innerRef}
        className="flex gap-2"
        style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        {/* First set */}
        <div data-set="first" className="flex shrink-0 gap-2">
          {children}
        </div>
        {/* Second set */}
        <div data-set="second" className="flex shrink-0 gap-2">
          {children}
        </div>
        {/* Third set */}
        <div data-set="third" className="flex shrink-0 gap-2">
          {children}
        </div>
        {/* Fourth set - for ultra-wide screens */}
        <div data-set="fourth" className="flex shrink-0 gap-2">
          {children}
        </div>
        {/* Fifth set - for ultra-wide screens */}
        <div data-set="fifth" className="flex shrink-0 gap-2">
          {children}
        </div>
      </div>
    </div>
  )
}

interface SkillsMarquee3DProps {
  rows: {
    skills: React.ReactNode[]
    direction: 'left' | 'right'
  }[]
}

/**
 * SkillsMarquee3D
 * 
 * Isometric 3D container with multiple rows of scrolling skills.
 * Uses orthographic-like projection (no perspective) for uniform card sizes.
 * Cards are tilted on X and Z axes only.
 * Vertical overflow allowed, horizontal clipped.
 */
export function SkillsMarquee3D({ rows }: SkillsMarquee3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [pausedRow, setPausedRow] = useState<number | null>(null)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle delayed pause: hoveredRow triggers instantly, pausedRow after 200ms
  useEffect(() => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = null
    }

    if (hoveredRow !== null) {
      // Delay before pausing the row
      pauseTimeoutRef.current = setTimeout(() => {
        setPausedRow(hoveredRow)
      }, 200)
    } else {
      // Unhover is instant
      setPausedRow(null)
    }

    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current)
      }
    }
  }, [hoveredRow])

  return (
    <MarqueeContext.Provider value={{ hoveredRow, pausedRow, setHoveredRow }}>
      <div
        ref={containerRef}
        className="relative py-16 select-none"
        style={{
          // Clip only horizontal, allow vertical overflow
          overflowX: 'clip',
          overflowY: 'visible',
        }}
      >
        <div
          className="relative"
          style={{
            // Orthographic isometric: no perspective, just transforms
            // X = top-down tilt (reduced for better card visibility)
            // Z = rotation (like a diamond)
            transform: 'rotateX(45deg) rotateZ(-25deg) scale(1.42)',
            transformStyle: 'flat',
            transformOrigin: 'center center',
          }}
        >
          {/* Rows container */}
          <div>
            {rows.map((row, index) => (
              <SkillMarquee
                key={index}
                direction={row.direction}
                baseSpeed={0.055}
                rowIndex={index}
              >
                {row.skills}
              </SkillMarquee>
            ))}
          </div>
        </div>
      </div>
    </MarqueeContext.Provider>
  )
}
