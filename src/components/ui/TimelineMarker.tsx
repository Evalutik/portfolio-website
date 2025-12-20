'use client'

import { ACCENT, TEXT_MUTED, SURFACE } from '@/config/colors'

interface TimelineMarkerProps {
    progressPosition: number // 0-1, position along total scroll
    isActive: boolean
    index: number
}

// Marker Y positions as percentage of 5000 viewBox height
// Positioned in middle of each vertical segment
// Segments: 0-800, 808-1800, 1808-2800, 2808-3800, 3808-5000
// Markers at: 400, 1300, 2300, 3300, 4400
const markerCoords = [
    { x: 80, y: 400 },    // Middle of first vertical (left)
    { x: 678, y: 1300 },  // Middle of second vertical (right)
    { x: 80, y: 2300 },   // Middle of third vertical (left)
    { x: 678, y: 3300 },  // Middle of fourth vertical (right)
    { x: 80, y: 4400 },   // Middle of fifth vertical (left)
]

export function TimelineMarker({ isActive, index }: TimelineMarkerProps) {
    const coords = markerCoords[index] || { x: 80, y: 500 }

    // Convert from viewBox coordinates (750x5000) to percentages
    const xPercent = (coords.x / 750) * 100
    const yPercent = (coords.y / 5000) * 100

    return (
        <div
            className="absolute transition-all duration-300 ease-out z-10"
            style={{
                left: `${xPercent}%`,
                top: `${yPercent}%`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {/* Marker dot */}
            <div
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                    backgroundColor: isActive ? ACCENT : SURFACE,
                    border: `2px solid ${isActive ? ACCENT : TEXT_MUTED}`,
                }}
            />
        </div>
    )
}
