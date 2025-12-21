'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TimelineCard } from '@/components/ui/timeline/TimelineCard'
import { PRIMARY, BORDER_LIGHT, TEXT_MUTED, SURFACE } from '@/config/colors'
import { EducationItem } from '@/config/education'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface MobileTimelineProps {
    educationData: EducationItem[]
}

// Mobile timeline - simpler vertical line with cards outside SVG
const MOBILE_VIEWPORT_HEIGHT = 600
const MOBILE_PATH_D = `M 375 0 L 375 2000`
const MOBILE_MARKER_Y_POSITIONS = [300, 600, 950, 1350, 1800]
const MOBILE_MARKER_X = 375
const PATH_TOTAL_LENGTH = 2000

export function MobileEducation({ educationData }: MobileTimelineProps) {
    const timelineContainerRef = useRef<HTMLDivElement>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [pathLength, setPathLength] = useState(0)

    useEffect(() => {
        const path = pathRef.current
        if (!path) return
        setPathLength(path.getTotalLength())
    }, [])

    useEffect(() => {
        const container = timelineContainerRef.current
        if (!container) return

        const scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1,
            onUpdate: (self) => setScrollProgress(self.progress),
        })

        return () => scrollTrigger.kill()
    }, [])

    const drawProgress = Math.min(1, scrollProgress * 1.05)

    useEffect(() => {
        const path = pathRef.current
        if (!path || pathLength === 0) return
        path.style.strokeDasharray = `${pathLength}`
        path.style.strokeDashoffset = `${pathLength * (1 - drawProgress)}`
    }, [drawProgress, pathLength])

    const currentDrawY = drawProgress * PATH_TOTAL_LENGTH

    const viewportCenter = MOBILE_VIEWPORT_HEIGHT / 2
    const viewportOffset = currentDrawY > viewportCenter
        ? viewportCenter - currentDrawY
        : 0

    const viewBoxY = -viewportOffset

    // Calculate which cards should be visible
    const getCardOpacity = (markerIndex: number): number => {
        const markerY = MOBILE_MARKER_Y_POSITIONS[markerIndex]
        const nextMarkerY = MOBILE_MARKER_Y_POSITIONS[markerIndex + 1] || PATH_TOTAL_LENGTH

        const distanceToMarker = currentDrawY - markerY

        if (distanceToMarker < -20) {
            return 0
        } else if (distanceToMarker < 0) {
            return (distanceToMarker + 20) / 20
        } else if (distanceToMarker < 100) {
            return 1
        } else {
            const fadeDistance = nextMarkerY - markerY - 100
            const fadeProgress = (distanceToMarker - 100) / fadeDistance
            return Math.max(0, 1 - fadeProgress)
        }
    }

    return (
        <div ref={timelineContainerRef} className="relative" style={{ height: '800vh' }}>
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* SVG Timeline */}
                <div className="h-full flex justify-center">
                    <div className="w-full h-full relative">
                        <svg
                            className="w-full h-full"
                            viewBox={`0 ${viewBoxY} 750 ${MOBILE_VIEWPORT_HEIGHT}`}
                            preserveAspectRatio="xMidYMid meet"
                            fill="none"
                            style={{ overflow: 'visible' }}
                        >
                            <path d={MOBILE_PATH_D} stroke={BORDER_LIGHT} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4" />
                            <path ref={pathRef} d={MOBILE_PATH_D} stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" fill="none" />

                            {MOBILE_MARKER_Y_POSITIONS.map((y, index) => {
                                const isActive = currentDrawY >= y
                                return (
                                    <circle
                                        key={index}
                                        cx={MOBILE_MARKER_X}
                                        cy={y}
                                        r="10"
                                        fill={isActive ? PRIMARY : SURFACE}
                                        stroke={isActive ? PRIMARY : TEXT_MUTED}
                                        strokeWidth="2"
                                    />
                                )
                            })}

                            <circle cx={MOBILE_MARKER_X} cy={currentDrawY} r="6" fill={PRIMARY} />
                        </svg>
                    </div>
                </div>

                {/* Cards - rendered outside SVG, using the SAME TimelineCard as desktop */}
                {educationData.map((item, index) => {
                    const opacity = getCardOpacity(index)
                    if (opacity <= 0.02) return null

                    return (
                        <TimelineCard
                            key={item.id}
                            {...item}
                            isVisible={opacity > 0.5}
                            opacity={opacity}
                        />
                    )
                })}
            </div>
        </div>
    )
}
