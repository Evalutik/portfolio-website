'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface TextRevealProps {
    text: string
    /** Delay before animation starts (ms) */
    delay?: number
    /** Duration per word (seconds) */
    wordDuration?: number
    /** Stagger between words (seconds) */
    stagger?: number
    /** Whether the effect should be triggered */
    trigger?: boolean
    /** Called when animation completes */
    onComplete?: () => void
    className?: string
}

/**
 * Word-by-word text reveal with blur effect
 * Modern, clean animation where each word fades in and de-blurs
 */
export function TextReveal({
    text,
    delay = 0,
    wordDuration = 0.4,
    stagger = 0.03,
    trigger = true,
    onComplete,
    className = '',
}: TextRevealProps) {
    const [shouldAnimate, setShouldAnimate] = useState(false)
    const words = text.split(' ')
    const onCompleteRef = useRef(onComplete)

    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        if (!trigger) return

        const timer = setTimeout(() => {
            setShouldAnimate(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [trigger, delay])

    // Calculate total animation duration for onComplete
    useEffect(() => {
        if (!shouldAnimate) return

        const totalDuration = (words.length * stagger + wordDuration) * 1000
        const timer = setTimeout(() => {
            onCompleteRef.current?.()
        }, totalDuration)

        return () => clearTimeout(timer)
    }, [shouldAnimate, words.length, stagger, wordDuration])

    return (
        <span className={className}>
            {words.map((word, index) => (
                <span key={index} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                    <motion.span
                        style={{ display: 'inline-block' }}
                        initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
                        animate={shouldAnimate ? {
                            opacity: 1,
                            filter: 'blur(0px)',
                            y: 0,
                        } : {
                            opacity: 0,
                            filter: 'blur(8px)',
                            y: 4,
                        }}
                        transition={{
                            duration: wordDuration,
                            delay: index * stagger,
                            ease: [0.25, 0.1, 0.25, 1], // Smooth ease
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    )
}
