'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * CursorGlow
 * 
 * A subtle glow effect that follows the mouse cursor.
 * Dimmer by default, brighter when cursor is moving.
 * Hidden on touch devices.
 */
export function CursorGlow() {
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
    let currentX = mouseX
    let currentY = mouseY
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
    
    // Smooth animation loop
    const animate = () => {
      // Ease towards mouse position
      const ease = 0.15
      currentX += (mouseX - currentX) * ease
      currentY += (mouseY - currentY) * ease
      
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`
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
  }, [isTouchDevice, isVisible])
  
  // Don't render on touch devices
  if (isTouchDevice) return null

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)',
        borderRadius: '50%',
        opacity: isVisible ? (isMoving ? 1 : 0.5) : 0,
        // Fast fade in (0.2s), slow fade out (3s)
        transition: isMoving ? 'opacity 0.2s ease' : 'opacity 3s ease',
        willChange: 'transform',
        zIndex: 0,
      }}
    />
  )
}
