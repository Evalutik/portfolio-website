'use client'

import { useState, useEffect } from 'react'
import './LoadingScreen.css'

const MIN_DISPLAY_TIME = 1200

export function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        let resourcesReady = false
        let minTimeElapsed = false

        const tryHide = () => {
            if (resourcesReady && minTimeElapsed) {
                setIsFading(true)
                setTimeout(() => {
                    setIsVisible(false)
                    // Add class to body to enable scrolling
                    document.body.classList.add('page-loaded')
                }, 400)
            }
        }

        // Min display time
        const minTimer = setTimeout(() => {
            minTimeElapsed = true
            tryHide()
        }, MIN_DISPLAY_TIME)

        // Check resources
        const handleLoad = () => {
            resourcesReady = true
            tryHide()
        }

        if (document.readyState === 'complete') {
            resourcesReady = true
        }

        window.addEventListener('load', handleLoad)

        // Fallback max wait
        const fallback = setTimeout(() => {
            resourcesReady = true
            tryHide()
        }, 4000)

        return () => {
            clearTimeout(minTimer)
            clearTimeout(fallback)
            window.removeEventListener('load', handleLoad)
        }
    }, [])

    if (!isVisible) return null

    return (
        <div className={`loading-screen ${isFading ? 'loading-screen--fading' : ''}`}>
            <div className="loading-text">
                Loading <span className="loading-spinner"></span>
            </div>
        </div>
    )
}
