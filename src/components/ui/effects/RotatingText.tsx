'use client'

import { useState, useEffect } from 'react'

interface RotatingTextProps {
    words: string[]
    interval?: number
    className?: string
}

export function RotatingText({
    words,
    interval = 2500,
    className = '',
}: RotatingTextProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [typedText, setTypedText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [showCursor, setShowCursor] = useState(true)

    // Typing/deleting effect
    useEffect(() => {
        const currentWord = words[currentIndex]

        if (isDeleting) {
            // Deleting - fast
            if (typedText.length > 0) {
                const deleteTimer = setTimeout(() => {
                    setTypedText(typedText.slice(0, -1))
                }, 40)
                return () => clearTimeout(deleteTimer)
            } else {
                // Finished deleting, move to next word
                setCurrentIndex((prev) => (prev + 1) % words.length)
                setIsDeleting(false)
            }
        } else {
            // Typing
            if (typedText.length < currentWord.length) {
                const typeTimer = setTimeout(() => {
                    setTypedText(currentWord.slice(0, typedText.length + 1))
                }, 80)
                return () => clearTimeout(typeTimer)
            } else {
                // Finished typing, wait then start deleting
                const pauseTimer = setTimeout(() => {
                    setIsDeleting(true)
                }, interval * 2)
                return () => clearTimeout(pauseTimer)
            }
        }
    }, [currentIndex, words, interval, typedText, isDeleting])

    // Cursor blink
    useEffect(() => {
        const blinkTimer = setInterval(() => {
            setShowCursor((prev) => !prev)
        }, 530)

        return () => clearInterval(blinkTimer)
    }, [])

    return (
        <span className={`relative inline-block ${className}`}>
            <span className="inline-block text-gradient">
                {typedText}
                <span
                    className="inline-block w-[3px] h-[0.9em] bg-text-secondary ml-[2px] align-middle rounded-sm"
                    style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}
                />
            </span>
        </span>
    )
}
