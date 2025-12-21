'use client'

import { useState, useEffect } from 'react'
import { GlowCard } from '@/components/ui/common/GlowCard'

interface TimelineCardProps {
    id: number
    title: string
    subtitle: string
    year: string
    content: string[]
    position: 'left' | 'right'
    isVisible: boolean
    cardProgress: number // 0-1
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
    cardProgress,
    opacity,
}: TimelineCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [hasMounted, setHasMounted] = useState(false)
    const isLeft = position === 'left'

    // Delay applying visible state until after mount so CSS transitions work
    useEffect(() => {
        const timer = requestAnimationFrame(() => {
            setHasMounted(true)
        })
        return () => cancelAnimationFrame(timer)
    }, [])

    // Reset mounted state when card ID or position changes (new card appearing)
    useEffect(() => {
        setHasMounted(false)
        const timer = requestAnimationFrame(() => {
            setHasMounted(true)
        })
        return () => cancelAnimationFrame(timer)
    }, [id, position])

    // Only apply visible styles after mount
    const effectivelyVisible = hasMounted && isVisible

    // Cards slide from their side to center of screen
    const startX = isLeft ? -100 : 100
    const translateX = effectivelyVisible ? 0 : startX
    const scale = effectivelyVisible ? 1 : 0.9

    // Parallax: card moves up slightly as you scroll past it
    const yOffset = cardProgress > 0.6 ? (cardProgress - 0.6) * -80 : 0

    // Reset expansion when card becomes invisible
    useEffect(() => {
        if (!isVisible && isExpanded) {
            setIsExpanded(false)
        }
    }, [isVisible, isExpanded])

    const hasMoreContent = content.length > 1

    return (
        <div
            className="fixed left-1/2 top-1/2 w-[420px] max-w-[90vw] z-30"
            style={{
                transform: `translate(-50%, -50%) translateX(${translateX + (effectivelyVisible ? (isLeft ? -60 : 60) : 0)}px) translateY(${yOffset}px) scale(${scale})`,
                opacity: Math.max(0, Math.min(1, opacity)),
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
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
                        {/* Title with inline year */}
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {title}
                            <span className="inline-block ml-2 px-2 py-0.5 text-[10px] font-mono rounded-full bg-surface-light text-text-muted border border-border-light">
                                {year}
                            </span>
                        </h3>

                        {/* Subtitle */}
                        <p className="text-sm text-accent mb-3">
                            {subtitle}
                        </p>

                        {/* Content paragraphs */}
                        <div
                            className="overflow-hidden transition-all duration-500 ease-out"
                            style={{
                                maxHeight: isExpanded ? '500px' : '80px',
                            }}
                        >
                            {content.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className="text-sm text-text-secondary leading-relaxed mb-3 last:mb-0"
                                    style={{
                                        opacity: index === 0 || isExpanded ? 1 : 0,
                                        transition: 'opacity 0.3s ease-out',
                                        transitionDelay: isExpanded ? `${index * 100}ms` : '0ms',
                                    }}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Keep reading / Minimize buttons */}
                        {hasMoreContent && (
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
                                        <button
                                            className="text-xs text-text-muted/50 cursor-default flex items-center gap-1"
                                            disabled
                                        >
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
