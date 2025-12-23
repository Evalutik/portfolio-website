'use client'

import type { EducationItem } from '@/config/education'

interface EducationStackCardProps {
    item: EducationItem
    onReadMore?: (item: EducationItem) => void
}

/**
 * Mobile-friendly education card for the scroll stack view.
 * Complements EducationTimelineCard which is used for desktop timeline view.
 */
export function EducationStackCard({ item, onReadMore }: EducationStackCardProps) {
    const hasMoreContent = item.content.length > 1

    return (
        <div className="bg-surface border border-border rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-text-primary">
                    {item.title}
                </h3>
                <span className="px-2 py-0.5 text-[12px] font-mono rounded-full bg-surface-light text-text-muted border border-border-light">
                    {item.year}
                </span>
            </div>
            <p className="text-sm text-accent mb-3">{item.subtitle}</p>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                {item.content[0]}
            </p>

            {/* Keep reading footer - matches TimelineCard style */}
            {hasMoreContent && onReadMore && (
                <div className="mt-4 pt-3 border-t border-border">
                    <button
                        onClick={() => onReadMore(item)}
                        className="text-xs text-text-muted hover:text-text-primary transition-colors duration-200 flex items-center gap-1"
                    >
                        <span>Keep reading</span>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    )
}
