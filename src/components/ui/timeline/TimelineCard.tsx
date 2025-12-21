'use client'

import { useState, useEffect, useRef } from 'react'
import { GlowCard } from '@/components/ui/common/GlowCard'

interface TimelineCardProps {
    id: number
    title: string
    subtitle: string
    year: string
    content: string[]
    position: 'left' | 'right'
    isVisible: boolean
    opacity: number
}

export function TimelineCard({
    id,
    title,
    subtitle,
    year,
    content,
    position,
    isVisible,
    opacity,
}: TimelineCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const mountedIdRef = useRef<number>(id)

    const isLeft = position === 'left'

    // Animation positions: slide in from the side toward center
    const startX = isLeft ? -200 : 200
    const finalX = isLeft ? -60 : 60

    // Reset animation when card ID changes
    useEffect(() => {
        if (mountedIdRef.current !== id) {
            mountedIdRef.current = id
            setIsAnimating(false)
        }
    }, [id])

    // Trigger animation after component renders at start position
    useEffect(() => {
        if (!isAnimating) {
            // Double RAF ensures the browser paints at start position first
            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
                // Store raf2 for cleanup - but since we're in the RAF callback, 
                // we need to handle cleanup differently
            })
            return () => cancelAnimationFrame(raf1)
        }
    }, [isAnimating, id])

    // Reset expansion when hidden
    useEffect(() => {
        if (!isVisible && isExpanded) {
            setIsExpanded(false)
        }
    }, [isVisible, isExpanded])

    const showFinal = isAnimating && isVisible
    const translateX = showFinal ? finalX : startX
    // Blur effect: start blurred, become clear on appearance
    const blurAmount = showFinal ? 0 : 8

    return (
        <div
            className="fixed left-1/2 top-1/2 w-[420px] max-w-[90vw] z-30"
            style={{
                transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${showFinal ? 1 : 0.9})`,
                opacity: isAnimating ? Math.max(0, Math.min(1, opacity)) : 0,
                filter: `blur(${blurAmount}px)`,
                transition: isAnimating ? 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: opacity > 0.05 ? 'visible' : 'hidden',
            }}
        >
            <div
                className="rounded-xl overflow-hidden"
                style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
            >
                <GlowCard>
                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {title}
                            <span className="align-middle ml-2 px-2 py-0.5 text-[12px] font-mono rounded-full bg-surface-light/50 text-text-muted border border-border-light">
                                {year}
                            </span>
                        </h3>

                        <p className="text-sm text-accent mb-3">{subtitle}</p>

                        <div className="transition-all duration-500 ease-out">
                            {content.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className={`text-sm text-text-secondary leading-relaxed mb-3 last:mb-0 ${!isExpanded && index === 0 ? 'line-clamp-3' : ''
                                        } ${!isExpanded && index > 0 ? 'hidden' : ''}`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {content.length > 1 && (
                            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                                {!isExpanded ? (
                                    <button
                                        onClick={() => setIsExpanded(true)}
                                        className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 flex items-center gap-1"
                                    >
                                        <span>Keep reading</span>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                ) : (
                                    <>
                                        <button className="text-xs text-text-muted/50 cursor-default flex items-center gap-1" disabled>
                                            <span>Keep reading</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 flex items-center gap-1"
                                        >
                                            <span>Minimize</span>
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </GlowCard>
            </div>
        </div>
    )
}
