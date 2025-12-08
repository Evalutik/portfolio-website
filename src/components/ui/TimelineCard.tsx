'use client'

import { GlowCard } from './GlowCard'

interface TimelineCardProps {
    id: number
    title: string
    subtitle: string
    year: string
    description: string
    position: 'left' | 'right'
    isVisible: boolean
    cardProgress: number // 0-1
    opacity: number
}

export function TimelineCard({
    title,
    subtitle,
    year,
    description,
    position,
    isVisible,
    cardProgress,
    opacity,
}: TimelineCardProps) {
    const isLeft = position === 'left'

    // Cards slide from their side to center of screen
    // Start position: off-screen on their side
    // End position: center of viewport
    const startX = isLeft ? -100 : 100
    const translateX = isVisible ? 0 : startX
    const scale = isVisible ? 1 : 0.9

    // Parallax: card moves up slightly as you scroll past it
    const yOffset = cardProgress > 0.6 ? (cardProgress - 0.6) * -80 : 0

    return (
        <div
            className="fixed left-1/2 top-1/2 w-[340px] max-w-[85vw] z-30"
            style={{
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${yOffset}px) scale(${scale})`,
                opacity: Math.max(0, Math.min(1, opacity)),
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: opacity > 0.05 ? 'visible' : 'hidden',
            }}
        >
            <GlowCard>
                <div className="p-5">
                    {/* Year badge */}
                    <div className="inline-block px-3 py-1 mb-3 text-xs font-mono rounded-full bg-primary/10 text-primary border border-primary/20">
                        {year}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm text-primary mb-2">
                        {subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed">
                        {description}
                    </p>
                </div>
            </GlowCard>
        </div>
    )
}
