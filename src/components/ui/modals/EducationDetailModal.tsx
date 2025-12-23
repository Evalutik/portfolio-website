'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { EducationItem } from '@/config/education'

interface EducationDetailModalProps {
    isOpen: boolean
    onClose: () => void
    item: EducationItem | null
}

export function EducationDetailModal({ isOpen, onClose, item }: EducationDetailModalProps) {
    // Lock body scroll when modal opens
    useEffect(() => {
        if (!isOpen) return

        const preventScroll = (e: Event) => {
            e.preventDefault()
            e.stopPropagation()
            return false
        }

        const preventKeyScroll = (e: KeyboardEvent) => {
            const scrollKeys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
            if (scrollKeys.includes(e.code)) {
                e.preventDefault()
            }
        }

        window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
        window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
        window.addEventListener('keydown', preventKeyScroll, { capture: true })

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.overflow = 'hidden'
        document.body.style.paddingRight = `${scrollbarWidth}px`

        return () => {
            window.removeEventListener('wheel', preventScroll, { capture: true })
            window.removeEventListener('touchmove', preventScroll, { capture: true })
            window.removeEventListener('keydown', preventKeyScroll, { capture: true })
            document.body.style.overflow = ''
            document.body.style.paddingRight = ''
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

    if (!item) return null

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

                    {/* Modal container - centered with padding */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Modal content - fixed max height, scrollable inside */}
                        <motion.div
                            className="bg-surface/80 backdrop-blur-2xl border border-border rounded-xl max-w-md w-full max-h-[80vh] flex flex-col pointer-events-auto relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header - fixed at top */}
                            <div className="flex-shrink-0 p-5 pb-0">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-3 right-3 p-0.5 hover:bg-surface-light rounded transition-colors"
                                >
                                    <X className="w-3.5 h-3.5 text-text-muted" />
                                </button>

                                {/* Title + Year */}
                                <div className="flex items-center gap-2 mb-1 pr-6">
                                    <h3 className="text-lg font-semibold text-text-primary">
                                        {item.title}
                                    </h3>
                                    <span className="px-2 py-0.5 text-[12px] font-mono rounded-full bg-surface-light text-text-muted border border-border-light">
                                        {item.year}
                                    </span>
                                </div>
                                <p className="text-sm text-accent mb-4">{item.subtitle}</p>
                            </div>

                            {/* Scrollable content area */}
                            <div
                                className="flex-1 overflow-y-auto px-5 pb-5"
                                onTouchMove={(e) => e.stopPropagation()}
                                onWheel={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-4">
                                    {item.content.map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="text-sm text-text-secondary leading-relaxed"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
