'use client'

import { useEffect, useRef, useState } from 'react'
import { ACCENT, BORDER_LIGHT } from '@/config/colors'

interface TimelinePathProps {
    progress: number // 0 to 1
}

export function TimelinePath({ progress }: TimelinePathProps) {
    const pathRef = useRef<SVGPathElement>(null)
    const [pathLength, setPathLength] = useState(0)

    useEffect(() => {
        const path = pathRef.current
        if (!path) return

        const length = path.getTotalLength()
        setPathLength(length)
    }, [])

    useEffect(() => {
        const path = pathRef.current
        if (!path || pathLength === 0) return

        path.style.strokeDasharray = `${pathLength}`
        path.style.strokeDashoffset = `${pathLength * (1 - progress)}`
    }, [progress, pathLength])

    // Square wave path with rounded 90-degree corners using quadratic beziers
    // ViewBox: 750 wide x 5000 tall (for 500vh scroll)
    // Left edge at x=80, right edge at x=670
    const r = 12 // Corner radius

    const pathD = `
        M 80 0
        L 80 790
        Q 80 800, 90 800
        L 660 800
        Q 670 800, 670 810
        L 670 1790
        Q 670 1800, 660 1800
        L 90 1800
        Q 80 1800, 80 1810
        L 80 2790
        Q 80 2800, 90 2800
        L 660 2800
        Q 670 2800, 670 2810
        L 670 3790
        Q 670 3800, 660 3800
        L 90 3800
        Q 80 3800, 80 3810
        L 80 5000
    `

    return (
        <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 750 5000"
            preserveAspectRatio="xMidYMin slice"
            fill="none"
        >
            {/* Background path (track) */}
            <path
                d={pathD}
                stroke={BORDER_LIGHT}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.4"
            />

            {/* Animated path (progress) */}
            <path
                ref={pathRef}
                d={pathD}
                stroke={ACCENT}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    )
}
