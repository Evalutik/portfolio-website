'use client'

import { useRef, useEffect, useState, createContext, useContext } from 'react'
import { useAnimationFrame } from 'framer-motion'

// Context to communicate hover state between rows
const MarqueeContext = createContext<{
  pausedRow: number | null
  setPausedRow: (row: number | null) => void
}>({ pausedRow: null, setPausedRow: () => {} })

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
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { pausedRow, setPausedRow } = useContext(MarqueeContext)
  
  const isPaused = pausedRow === rowIndex

  // Measure content width
  useEffect(() => {
    const measure = () => {
      if (innerRef.current) {
        const firstSet = innerRef.current.querySelector('[data-set="first"]') as HTMLElement
        if (firstSet) {
          setContentWidth(firstSet.offsetWidth)
        }
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  // Detect scrolling for speed boost - instant response, short timeout
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 80) // Short timeout for quick response
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  // Animate position using pixel values for seamless loop
  useAnimationFrame((time, delta) => {
    if (isPaused || contentWidth === 0) return
    
    // Speed up 3x when scrolling (instant boost)
    const speed = isScrollingRef.current ? baseSpeed * 3 : baseSpeed
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
    setPausedRow(rowIndex)
  }
  
  const handleMouseLeave = () => {
    setPausedRow(null)
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
  const [pausedRow, setPausedRow] = useState<number | null>(null)

  return (
    <MarqueeContext.Provider value={{ pausedRow, setPausedRow }}>
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
