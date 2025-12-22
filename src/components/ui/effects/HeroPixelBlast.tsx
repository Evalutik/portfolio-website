'use client'

import dynamic from 'next/dynamic'

// Dynamically import PixelBlast with no SSR
const PixelBlast = dynamic(() => import('./PixelBlast'), {
    ssr: false,
    loading: () => null
})

/**
 * HeroPixelBlast
 * 
 * Pixel pattern for the hero section only.
 * - Right-aligned (right half of screen)
 * - Scrollable with content
 * - Normal density purple pattern
 */
export function HeroPixelBlast() {
    return (
        <div
            className="absolute top-0 right-0 w-1/2 h-screen pointer-events-none"
            style={{ zIndex: -5 }}
        >
            <PixelBlast
                variant="square"
                pixelSize={5}
                color="#8b5cf6"
                patternScale={2.5}
                patternDensity={0.9}
                pixelSizeJitter={0.3}
                enableRipples={true}
                speed={0.15}
                edgeFade={0.3}
                transparent
                antialias={false}
            />
        </div>
    )
}
