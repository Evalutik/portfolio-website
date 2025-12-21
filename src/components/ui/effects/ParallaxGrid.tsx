'use client'

import { useEffect, useRef } from 'react'

/**
 * ParallaxGrid
 * 
 * A full-page background grid that scrolls at a slower rate than the page content,
 * creating a parallax depth effect. The grid moves at 50% of normal scroll speed.
 */
export function ParallaxGrid() {
    const gridRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let rafId: number

        const animate = () => {
            // Read scroll position directly each frame to track browser's native inertia
            // 5% scroll speed = nearly sticky, strong parallax effect
            const parallaxOffset = window.scrollY * 0.05

            if (gridRef.current) {
                gridRef.current.style.transform = `translateY(${-parallaxOffset}px)`
            }

            rafId = requestAnimationFrame(animate)
        }

        rafId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(rafId)
        }
    }, [])

    return (
        <div
            ref={gridRef}
            className="fixed inset-0 bg-grid opacity-20 pointer-events-none"
            style={{
                zIndex: -10,
                // Extend the grid height to cover parallax movement
                height: '200vh',
                willChange: 'transform',
            }}
        />
    )
}
