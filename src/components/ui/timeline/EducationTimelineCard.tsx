'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EducationTimelineCardProps {
    id: number
    title: string
    subtitle: string
    year: string
    content: string[]
    position: 'left' | 'right'
    isVisible: boolean
    opacity: number
}

export function EducationTimelineCard({
    id,
    title,
    subtitle,
    year,
    content,
    position,
    isVisible,
    opacity,
}: EducationTimelineCardProps) {
    // Track how many paragraphs are revealed (0 = collapsed, 1+ = that many extra paragraphs shown)
    const [revealedCount, setRevealedCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [showTexts, setShowTexts] = useState<boolean[]>([])
    const mountedIdRef = useRef<number>(id)

    const isLeft = position === 'left'
    const totalExtraParagraphs = content.length - 1
    const isFullyExpanded = revealedCount >= totalExtraParagraphs
    const isExpanded = revealedCount > 0

    // Animation positions: slide in from the side toward center
    const startX = isLeft ? -200 : 200
    const finalX = isLeft ? -60 : 60

    // Reset animation when card ID changes
    useEffect(() => {
        if (mountedIdRef.current !== id) {
            mountedIdRef.current = id
            setIsAnimating(false)
            setRevealedCount(0)
            setShowTexts([])
        }
    }, [id])

    // Trigger animation after component renders at start position
    useEffect(() => {
        if (!isAnimating) {
            const raf1 = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true)
                })
            })
            return () => cancelAnimationFrame(raf1)
        }
    }, [isAnimating, id])

    // Reset expansion when hidden
    useEffect(() => {
        if (!isVisible && revealedCount > 0) {
            setRevealedCount(0)
            setShowTexts([])
        }
    }, [isVisible, revealedCount])

    // Sequence: when a paragraph is revealed, wait then show its text
    useEffect(() => {
        if (revealedCount > 0) {
            const timer = setTimeout(() => {
                setShowTexts(prev => {
                    const next = [...prev]
                    // Mark all revealed paragraphs as showing text
                    for (let i = 0; i < revealedCount; i++) {
                        next[i] = true
                    }
                    return next
                })
            }, 350)
            return () => clearTimeout(timer)
        } else {
            setShowTexts([])
        }
    }, [revealedCount])

    const handleKeepReading = () => {
        if (revealedCount < totalExtraParagraphs) {
            setRevealedCount(prev => prev + 1)
        }
    }

    const handleMinimize = () => {
        setRevealedCount(0)
        setShowTexts([])
    }

    const showFinal = isAnimating && isVisible
    const translateX = showFinal ? finalX : startX

    return (
        <div
            className="fixed left-1/2 w-[420px] max-w-[90vw] z-30"
            style={{
                bottom: 'calc(50% - 100px)',
                transform: `translateX(-50%) translateX(${translateX}px) scale(${showFinal ? 1 : 0.9})`,
                opacity: isAnimating ? Math.max(0, Math.min(1, opacity)) : 0,
                // REMOVED: filter: blur() - this was breaking backdrop-filter on descendants
                transition: isAnimating ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                pointerEvents: isVisible ? 'auto' : 'none',
                visibility: opacity > 0.05 ? 'visible' : 'hidden',
            }}
        >
            {/* Using .card class directly like project section, no GlassCard wrapper */}
            <div className="card overflow-hidden">
                <div className="p-5">
                    {/* Header with inline-flex for proper badge alignment */}
                    <h3 className="text-lg font-semibold text-text-primary mb-1 flex items-center flex-wrap gap-2">
                        <span>{title}</span>
                        <span className="inline-flex items-center px-2 py-0.5 text-[12px] font-mono rounded-full bg-surface-light/50 text-text-muted border border-border-light leading-none">
                            {year}
                        </span>
                    </h3>

                    <p className="text-sm text-accent mb-3">{subtitle}</p>

                    {/* First paragraph - always visible, unclamped when any expansion happens */}
                    <p
                        className={`text-sm text-text-secondary leading-relaxed break-words ${!isExpanded ? 'line-clamp-3' : ''}`}
                    >
                        {content[0]}
                    </p>

                    {/* Additional paragraphs - reveal one at a time */}
                    <AnimatePresence>
                        {content.slice(1, revealedCount + 1).map((paragraph, index) => (
                            <motion.div
                                key={index}
                                initial={{ height: 0, opacity: 0, filter: 'blur(8px)' }}
                                animate={{
                                    height: 'auto',
                                    opacity: showTexts[index] ? 1 : 0,
                                    filter: showTexts[index] ? 'blur(0px)' : 'blur(8px)',
                                }}
                                exit={{ height: 0, opacity: 0, filter: 'blur(8px)' }}
                                transition={{
                                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                    opacity: { duration: 0.28 },
                                    filter: { duration: 0.28 }
                                }}
                                style={{ overflow: 'hidden' }}
                            >
                                <p className="text-sm text-text-secondary leading-relaxed break-words mt-3">
                                    {paragraph}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {totalExtraParagraphs > 0 && (
                        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                            <button
                                onClick={handleKeepReading}
                                className={`text-xs flex items-center gap-1 transition-colors duration-200 ${isFullyExpanded
                                    ? 'text-text-muted/50 cursor-default'
                                    : 'text-text-muted hover:text-text-primary cursor-pointer'
                                    }`}
                                disabled={isFullyExpanded}
                            >
                                <span>Keep reading</span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Minimize button with fade animation */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={handleMinimize}
                                        className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 flex items-center gap-1"
                                    >
                                        <span>Minimize</span>
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
