'use client'

interface MobileTimelineCardProps {
    id: number
    title: string
    subtitle: string
    year: string
    description: string
    position: 'left' | 'right'
    isVisible: boolean
    cardProgress: number
    opacity: number
    markerIndex: number  // Which marker this card belongs to
}

export function MobileTimelineCard({
    title,
    subtitle,
    year,
    description,
    isVisible,
    opacity,
    markerIndex,
}: MobileTimelineCardProps) {
    const scale = isVisible ? 1 : 0.95

    // Position cards in a staggered layout based on marker index
    // Each card positioned slightly different to show stacking effect
    // Cards are positioned above the center where markers appear
    const topPosition = `${20 + (markerIndex * 2)}%`

    return (
        <div
            className="fixed left-1/2 w-[300px] max-w-[85vw] z-30"
            style={{
                top: topPosition,
                transform: `translateX(-50%) scale(${scale})`,
                opacity: Math.max(0, Math.min(1, opacity)),
                transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: opacity > 0.05 ? 'visible' : 'hidden',
            }}
        >
            {/* Using .card class directly from globals.css */}
            <div className="card">
                <div className="p-4">
                    {/* Year badge */}
                    <div className="inline-block px-3 py-1 mb-2 text-xs font-mono rounded-full bg-accent/10 text-accent border border-accent/20">
                        {year}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                        {title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm text-accent mb-2">
                        {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-text-secondary leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}
