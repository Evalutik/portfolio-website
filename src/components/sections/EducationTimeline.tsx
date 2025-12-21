'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { TimelineCard } from '@/components/ui/timeline/TimelineCard'
import { MobileEducationTimeline } from './MobileEducationTimeline'
import { PRIMARY, BORDER_LIGHT, TEXT_MUTED, SURFACE } from '@/config/colors'
import { educationData } from '@/config/education'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}


const VIEWPORT_HEIGHT = 500
const PATH_D = `
    M 60 0
    L 60 450
    Q 60 470, 80 470
    L 670 470
    Q 690 470, 690 490
    L 690 950
    Q 690 970, 670 970
    L 80 970
    Q 60 970, 60 990
    L 60 1450
    Q 60 1470, 80 1470
    L 670 1470
    Q 690 1470, 690 1490
    L 690 1950
    Q 690 1970, 670 1970
    L 80 1970
    Q 60 1970, 60 1990
    L 60 2250
`
const MARKER_Y_POSITIONS = [250, 720, 1220, 1720, 2250]
const MARKER_X_POSITIONS = [60, 690, 60, 690, 60]

export function EducationTimeline() {
    const sectionRef = useRef<HTMLElement>(null)
    const timelineContainerRef = useRef<HTMLDivElement>(null)
    const pathRef = useRef<SVGPathElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [pathLength, setPathLength] = useState(0)
    const [markerPathProgress, setMarkerPathProgress] = useState<number[]>([])
    const [isMobile, setIsMobile] = useState(false)

    // Responsive detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        // Only calculate path for desktop mode
        if (isMobile) return

        const path = pathRef.current
        if (!path) return

        const length = path.getTotalLength()
        setPathLength(length)

        const progressValues: number[] = []
        for (const markerY of MARKER_Y_POSITIONS) {
            let low = 0, high = 1
            for (let i = 0; i < 25; i++) {
                const mid = (low + high) / 2
                const point = path.getPointAtLength(length * mid)
                if (point.y < markerY) low = mid
                else high = mid
            }
            progressValues.push((low + high) / 2)
        }
        setMarkerPathProgress(progressValues)
    }, [isMobile])

    useEffect(() => {
        // Only setup scroll trigger for desktop mode
        if (isMobile) return

        const container = timelineContainerRef.current
        if (!container) return

        const scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: 'top center',
            end: 'bottom bottom',
            scrub: 1.5,
            onUpdate: (self) => setScrollProgress(self.progress),
        })

        return () => scrollTrigger.kill()
    }, [isMobile])

    const currentState = useMemo(() => {
        if (markerPathProgress.length === 0 || pathLength === 0) {
            // Start at top (offset 0)
            return { drawProgress: 0, viewportOffset: 0, activeMarker: -1, cardOpacity: 0, cardVisible: false }
        }

        const numMarkers = 5
        const FIRST_SEGMENT_END = 0.15

        if (scrollProgress < FIRST_SEGMENT_END) {
            const segmentProgress = scrollProgress / FIRST_SEGMENT_END
            const marker1Progress = markerPathProgress[0]
            const drawProgress = marker1Progress * segmentProgress

            // For first segment, keep camera fixed at top (offset 0)
            // Since Marker 1 is at 250, the line will draw exactly to the center of the viewport (500/2)
            const viewportOffset = 0

            // First card: trigger when line reaches the marker (at segmentProgress = 1.0)
            const triggered = segmentProgress >= 1.0
            const cardOpacity = triggered ? 1 : 0

            return {
                drawProgress,
                viewportOffset,
                activeMarker: triggered ? 0 : -1,
                cardOpacity,
                cardVisible: triggered,
            }
        }

        const remainingProgress = (scrollProgress - FIRST_SEGMENT_END) / (1 - FIRST_SEGMENT_END)
        const remainingSegments = numMarkers - 1
        const segmentSize = 1 / (remainingSegments + 1)

        const currentSegmentIndex = Math.min(Math.floor(remainingProgress / segmentSize), remainingSegments)
        const segmentProgress = (remainingProgress - (currentSegmentIndex * segmentSize)) / segmentSize

        const markerIndex = currentSegmentIndex
        const currentMarkerY = MARKER_Y_POSITIONS[markerIndex]
        const currentMarkerPathProg = markerPathProgress[markerIndex]
        const nextMarkerY = MARKER_Y_POSITIONS[markerIndex + 1]
        const nextMarkerPathProg = markerPathProgress[markerIndex + 1]

        const isLastMarker = markerIndex >= numMarkers - 1

        let drawProgress: number
        let viewportOffset: number
        let cardOpacity: number
        let activeMarker: number

        if (segmentProgress < 0.55) {
            const phaseProgress = segmentProgress / 0.55
            viewportOffset = (VIEWPORT_HEIGHT / 2) - currentMarkerY
            activeMarker = markerIndex
            cardOpacity = 1
            if (isLastMarker) {
                drawProgress = currentMarkerPathProg
            } else {
                const pathToNext = nextMarkerPathProg - currentMarkerPathProg
                drawProgress = currentMarkerPathProg + (pathToNext * 0.6 * phaseProgress)
            }
        } else if (segmentProgress < 0.70) {
            const phaseProgress = (segmentProgress - 0.55) / 0.15
            viewportOffset = (VIEWPORT_HEIGHT / 2) - currentMarkerY
            activeMarker = markerIndex
            cardOpacity = 1 - phaseProgress
            if (isLastMarker) {
                drawProgress = currentMarkerPathProg
            } else {
                const pathToNext = nextMarkerPathProg - currentMarkerPathProg
                drawProgress = currentMarkerPathProg + (pathToNext * 0.6) + (pathToNext * 0.1 * phaseProgress)
            }
        } else {
            const phaseProgress = (segmentProgress - 0.70) / 0.30
            activeMarker = markerIndex
            cardOpacity = 0
            if (isLastMarker) {
                drawProgress = currentMarkerPathProg
                viewportOffset = (VIEWPORT_HEIGHT / 2) - currentMarkerY
            } else {
                const pathToNext = nextMarkerPathProg - currentMarkerPathProg
                drawProgress = currentMarkerPathProg + (pathToNext * 0.7) + (pathToNext * 0.3 * phaseProgress)
                viewportOffset = (VIEWPORT_HEIGHT / 2) - currentMarkerY - ((nextMarkerY - currentMarkerY) * phaseProgress)
            }
        }

        return {
            drawProgress: Math.min(1, Math.max(0, drawProgress)),
            viewportOffset,
            activeMarker,
            cardOpacity: Math.max(0, Math.min(1, cardOpacity)),
            cardVisible: cardOpacity > 0.05,
        }
    }, [scrollProgress, markerPathProgress, pathLength])

    useEffect(() => {
        const path = pathRef.current
        if (!path || pathLength === 0) return
        path.style.strokeDasharray = `${pathLength}`
        path.style.strokeDashoffset = `${pathLength * (1 - currentState.drawProgress)}`
    }, [currentState.drawProgress, pathLength])

    const currentPoint = useMemo(() => {
        const path = pathRef.current
        if (!path || pathLength === 0) return { x: 60, y: 0 }
        return path.getPointAtLength(pathLength * currentState.drawProgress)
    }, [currentState.drawProgress, pathLength])

    // Calculate viewBox Y offset - this replaces translateY on g element
    const viewBoxY = -currentState.viewportOffset

    return (
        <section ref={sectionRef} id="education" className="relative">
            <div className="py-8 px-4 max-w-3xl mx-auto">
                <SectionHeading
                    title="Education"
                    subtitle="A glimpse into my journey and the milestones that shaped who I am today."
                />
            </div>

            {isMobile ? (
                <MobileEducationTimeline educationData={educationData} />
            ) : (
                <div ref={timelineContainerRef} className="relative" style={{ height: '1200vh' }}>
                    <div className="sticky top-0 h-screen overflow-hidden">
                        <div className="h-full flex justify-center">
                            <div className="w-full max-w-3xl h-full relative px-4">
                                <svg
                                    className="w-full h-full"
                                    viewBox={`0 ${viewBoxY} 750 ${VIEWPORT_HEIGHT}`}
                                    preserveAspectRatio="xMidYMid meet"
                                    fill="none"
                                    style={{ overflow: 'visible' }}
                                >
                                    <path d={PATH_D} stroke={BORDER_LIGHT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
                                    <path ref={pathRef} d={PATH_D} stroke={PRIMARY} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    {MARKER_Y_POSITIONS.map((y, index) => {
                                        const x = MARKER_X_POSITIONS[index]
                                        const isActive = markerPathProgress[index] !== undefined && currentState.drawProgress >= markerPathProgress[index]
                                        return (
                                            <circle key={index} cx={x} cy={y} r="8" fill={isActive ? PRIMARY : SURFACE} stroke={isActive ? PRIMARY : TEXT_MUTED} strokeWidth="2" />
                                        )
                                    })}
                                    <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill={PRIMARY} />
                                </svg>
                            </div>
                        </div>

                        {currentState.activeMarker >= 0 && currentState.activeMarker < educationData.length && (
                            <TimelineCard
                                {...educationData[currentState.activeMarker]}
                                isVisible={currentState.cardVisible}
                                cardProgress={0}
                                opacity={currentState.cardOpacity}
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
