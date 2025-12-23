'use client'

import React, { ReactNode } from 'react'

export interface ScrollStackItemProps {
    children: ReactNode
    className?: string
    /** Sticky top position - defaults to '15%' */
    stickyTop?: string
    /** z-index for stacking order */
    zIndex?: number
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
    children,
    className = '',
    stickyTop = '15%',
    zIndex = 1,
}) => (
    <div
        className={`scroll-stack-card ${className}`.trim()}
        style={{
            position: 'sticky',
            top: stickyTop,
            zIndex: zIndex,
        }}
    >
        {children}
    </div>
)

interface ScrollStackProps {
    children: ReactNode
    className?: string
    /** Base sticky position from top (default: '15%') */
    stackPosition?: string
    /** Offset between each stacked card (default: 15) */
    stackOffset?: number
    /** Gap between cards before they stack (default: 30) */
    cardGap?: number
}

export function ScrollStack({
    children,
    className = '',
    stackPosition = '15%',
    stackOffset = 15,
    cardGap = 30,
}: ScrollStackProps) {
    // Clone children and add progressive sticky top + z-index
    const childrenArray = React.Children.toArray(children)

    const stackedChildren = childrenArray.map((child, index) => {
        if (React.isValidElement(child) && child.type === ScrollStackItem) {
            // Calculate sticky top: base position + offset for each card
            const basePercent = parseFloat(stackPosition)
            const stickyTop = `calc(${basePercent}% + ${index * stackOffset}px)`

            return React.cloneElement(child as React.ReactElement<ScrollStackItemProps>, {
                stickyTop,
                zIndex: index + 1, // Higher index = higher z-index (new cards on top)
            })
        }
        return child
    })

    return (
        <div
            className={`scroll-stack-container ${className}`.trim()}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: `${cardGap}px`,
            }}
        >
            {stackedChildren}
        </div>
    )
}
