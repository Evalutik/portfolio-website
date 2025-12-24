'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, AlertTriangle } from 'lucide-react'
import { PRIMARY, SKILL_WAVE } from '@/config/colors'

interface CVDownloadModalProps {
    isOpen: boolean
    onClose: () => void
}

const HOLD_DURATION = 2000 // 2 seconds in milliseconds
const MIN_HOLD_TIME = 100 // Minimum ms to count as a "hold attempt"
const QUICK_CLICK_WINDOW = 2000 // Time window for counting quick clicks

export function CVDownloadModal({ isOpen, onClose }: CVDownloadModalProps) {
    const [holdProgress, setHoldProgress] = useState(0)
    const [isHolding, setIsHolding] = useState(false)
    const [showRipple, setShowRipple] = useState(false)
    const [downloadTriggered, setDownloadTriggered] = useState(false)
    const [showHintWave, setShowHintWave] = useState(false)

    const holdStartTime = useRef<number | null>(null)
    const animationFrame = useRef<number | null>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const quickClickCount = useRef(0)
    const lastClickTime = useRef(0)

    // Lock/unlock body scroll when modal opens/closes
    useEffect(() => {
        if (!isOpen) return

        // Prevent scroll events
        const preventScroll = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            return false
        }

        // Prevent keyboard scroll
        const preventKeyScroll = (e: KeyboardEvent) => {
            const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
            if (scrollKeys.includes(e.code)) {
                e.preventDefault()
            }
        }

        // Add event listeners
        window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
        window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
        window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
        window.addEventListener('keydown', preventKeyScroll, { capture: true })

        // Also set styles to hide scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollbarWidth}px`

        return () => {
            window.removeEventListener('wheel', preventScroll, { capture: true })
            window.removeEventListener('touchmove', preventScroll, { capture: true })
            window.removeEventListener('scroll', preventScroll, { capture: true })
            window.removeEventListener('keydown', preventKeyScroll, { capture: true })
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
        }
    }, [isOpen])

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setHoldProgress(0)
            setIsHolding(false)
            setShowRipple(false)
            setDownloadTriggered(false)
            setShowHintWave(false)
            holdStartTime.current = null
            quickClickCount.current = 0
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current)
            }
        }
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    const updateProgress = useCallback(() => {
        if (!holdStartTime.current) return

        const elapsed = Date.now() - holdStartTime.current
        const progress = Math.min(elapsed / HOLD_DURATION, 1)
        setHoldProgress(progress)

        if (progress < 1) {
            animationFrame.current = requestAnimationFrame(updateProgress)
        } else {
            // Hold complete - trigger ripple and download
            setShowRipple(true)
            setDownloadTriggered(true)

            // Trigger download
            const link = document.createElement('a')
            link.href = '/andrei-fedyna-cv-trimmed.pdf'
            link.download = 'andrei-fedyna-cv-trimmed.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Close modal after ripple animation
            setTimeout(() => {
                onClose()
            }, 1600)
        }
    }, [onClose])

    const handleMouseDown = useCallback(() => {
        if (downloadTriggered) return

        setIsHolding(true)
        holdStartTime.current = Date.now()
        animationFrame.current = requestAnimationFrame(updateProgress)
    }, [updateProgress, downloadTriggered])

    const handleMouseUp = useCallback(() => {
        if (downloadTriggered) return

        setIsHolding(false)
        holdStartTime.current = null

        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current)
        }

        if (holdProgress < 1) {
            setHoldProgress(0)
        }

        // Count EVERY click (user is trying to click instead of hold)
        // Counter resets on modal close or when hovering > 0.5s
        quickClickCount.current += 1

        // Trigger wave hint on 3rd click to show user they need to HOLD
        if (quickClickCount.current >= 3) {
            setShowHintWave(true)
            quickClickCount.current = 0 // Reset after wave plays

            // Reset wave after animation
            setTimeout(() => {
                setShowHintWave(false)
            }, 800)
        }
    }, [holdProgress, downloadTriggered])

    // Reset click counter when hovering for > 0.5 seconds (user noticed the instruction)
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleMouseEnter = useCallback(() => {
        hoverTimerRef.current = setTimeout(() => {
            quickClickCount.current = 0
        }, 500)
    }, [])

    const handleMouseLeave = useCallback(() => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current)
            hoverTimerRef.current = null
        }
        handleMouseUp()
    }, [handleMouseUp])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault()
        handleMouseDown()
    }, [handleMouseDown])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault()
        handleMouseUp()
    }, [handleMouseUp])

    // Button dimensions for SVG border
    const buttonWidth = 180
    const buttonHeight = 40
    const borderRadius = 8
    const strokeWidth = 2
    const perimeter = 2 * (buttonWidth + buttonHeight - 4 * borderRadius) + 2 * Math.PI * borderRadius

    // Supernova ripple configuration - staggered for wave effect
    const rippleCircles = [
        { delay: 0, opacity: 0.68 },      // Inner - first, most visible (was 0.85)
        { delay: 0.12, opacity: 0.52 },   // Middle - follows (was 0.65)
        { delay: 0.24, opacity: 0.36 },   // Outer - trails behind (was 0.45)
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Supernova Ripple Effect - Full screen overlay */}
                    <AnimatePresence>
                        {showRipple && (
                            <motion.div
                                className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Circles - styled with border and transparent purple glass fill */}
                                {rippleCircles.map((circle, index) => (
                                    <motion.div
                                        key={index}
                                        className="absolute rounded-full"
                                        style={{
                                            backgroundColor: 'rgba(111, 62, 246, 0.35)', // Transparent purple glass
                                            border: '2px solid rgba(111, 62, 246, 0.8)', // Strong border
                                            backdropFilter: 'blur(8px)',
                                        }}
                                        initial={{
                                            width: '300vmax',
                                            height: '300vmax',
                                            opacity: 0,
                                        }}
                                        animate={{
                                            // Compress slowly → hold → explode fast
                                            width: ['300vmax', '96px', '96px', '300vmax'],
                                            height: ['300vmax', '96px', '96px', '300vmax'],
                                            opacity: [0, circle.opacity, circle.opacity * 1.1, 0],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            delay: circle.delay,
                                            // Time distribution: 40% compress, 20% hold, 40% explode (faster)
                                            times: [0, 0.40, 0.60, 1],
                                            // Easing: slow start for anticipation, fast end for power
                                            ease: ['easeOut', 'linear', 'easeIn'],
                                        }}
                                    />
                                ))}

                                {/* Download icon in center */}
                                <motion.div
                                    className="absolute flex items-center justify-center"
                                    style={{ zIndex: 10 }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{
                                        opacity: [0, 1, 1, 1, 0],
                                        scale: [0.5, 1, 1, 1.2, 1.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        // Icon appears early, stays visible, then fades AFTER circles
                                        times: [0, 0.2, 0.5, 0.85, 1],
                                        ease: 'easeOut',
                                    }}
                                >
                                    <Download
                                        className="w-12 h-12 text-white"
                                        strokeWidth={1.5}
                                        style={{
                                            filter: `drop-shadow(0 0 20px ${PRIMARY}) drop-shadow(0 0 40px ${PRIMARY}80)`
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Modal - scale animation (as before), no card hover effect */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showRipple ? 0 : 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="bg-surface/80 backdrop-blur-2xl border border-border rounded-xl p-5 max-w-md w-full pointer-events-auto relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button - matching galaxy popup style with hover */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-0.5 hover:bg-surface-light rounded transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-text-muted" />
                            </button>

                            {/* Icon - circular container with accent-colored icon */}
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-accent" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-text-primary text-center mb-3">
                                Privacy Notice
                            </h3>

                            {/* Legal notice content */}
                            <div className="text-sm text-text-secondary space-y-3 mb-6">
                                <p>
                                    This CV contains personal data protected under the General Data Protection Regulation (GDPR)
                                    and applicable data protection laws.
                                </p>
                                <p>
                                    By downloading this document, you agree to:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-text-muted">
                                    <li>Use it solely for recruitment or professional networking purposes</li>
                                    <li>Not share, distribute, or forward it to third parties without prior written consent</li>
                                    <li>Delete it upon request or after the purpose has been fulfilled</li>
                                </ul>
                                <p className="text-text-muted text-xs">
                                    Any unauthorized distribution or processing may result in legal action under GDPR and
                                    applicable privacy laws.
                                </p>
                            </div>

                            {/* Hold-to-confirm button */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onMouseDown={handleMouseDown}
                                        onMouseUp={handleMouseUp}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onTouchStart={handleTouchStart}
                                        onTouchEnd={handleTouchEnd}
                                        disabled={downloadTriggered}
                                        className="font-medium rounded-lg px-4 py-2 bg-surface border border-border text-text-primary text-sm disabled:opacity-50 hover:bg-surface-light hover:border-border-light transition-colors whitespace-nowrap"
                                        style={{ width: buttonWidth, height: buttonHeight }}
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4 flex-shrink-0" />
                                            {isHolding ? 'Hold...' : 'I Understand'}
                                        </span>
                                    </button>

                                    {/* SVG border fill animation */}
                                    <svg
                                        className="absolute inset-0 pointer-events-none"
                                        style={{
                                            width: buttonWidth + strokeWidth * 2,
                                            height: buttonHeight + strokeWidth * 2,
                                            left: -strokeWidth,
                                            top: -strokeWidth,
                                        }}
                                    >
                                        <rect
                                            x={strokeWidth}
                                            y={strokeWidth}
                                            width={buttonWidth}
                                            height={buttonHeight}
                                            rx={borderRadius}
                                            ry={borderRadius}
                                            fill="none"
                                            stroke={PRIMARY}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={perimeter}
                                            strokeDashoffset={perimeter * (1 - holdProgress)}
                                            style={{
                                                transition: isHolding ? 'none' : 'stroke-dashoffset 0.2s ease-out',
                                            }}
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Helper text with wave hint effect */}
                            <div className="relative mt-4">
                                <p className="text-xs text-text-muted text-center relative">
                                    <span>Click and hold for 2 seconds to confirm</span>

                                    {/* Wave overlay - triggered on 3 quick clicks */}
                                    <AnimatePresence>
                                        {showHintWave && (
                                            <motion.span
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    color: SKILL_WAVE,
                                                    textShadow: `0 0 12px ${SKILL_WAVE}, 0 0 24px ${SKILL_WAVE}99`
                                                }}
                                                initial={{
                                                    clipPath: 'polygon(-15% 0%, 5% 0%, 0% 100%, -20% 100%)'
                                                }}
                                                animate={{
                                                    clipPath: [
                                                        'polygon(-15% 0%, 5% 0%, 0% 100%, -20% 100%)',
                                                        'polygon(95% 0%, 115% 0%, 110% 100%, 90% 100%)',
                                                        'polygon(115% 0%, 135% 0%, 130% 100%, 110% 100%)'
                                                    ]
                                                }}
                                                exit={{ opacity: 0 }}
                                                transition={{
                                                    duration: 0.45,
                                                    ease: [0.25, 0.46, 0.45, 0.94], // Custom smooth ease
                                                    times: [0, 0.8, 1],
                                                }}
                                            >
                                                Click and hold for 2 seconds to confirm
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
