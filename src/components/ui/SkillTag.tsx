'use client'

import { LucideIcon } from 'lucide-react'

interface SkillTagProps {
  title: string
  icon?: LucideIcon
  onClick?: () => void
}

/**
 * SkillTag
 * 
 * A compact skill tag for the marquee display.
 * Smaller than SkillCard, optimized for the 3D scrolling rows.
 * Unselectable. On hover: accent background with dark text/icon.
 * Clickable to open skill detail modal.
 */
export function SkillTag({ title, icon: Icon, onClick }: SkillTagProps) {
  return (
    <div 
      className="group relative shrink-0 pb-1"
      onClick={onClick}
    >
      {/* The actual visible card that moves on hover */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md whitespace-nowrap select-none cursor-pointer group-hover:bg-primary group-hover:border-primary group-hover:-translate-y-1 group-hover:scale-105 transition-all duration-150 group-hover:shadow-lg group-hover:shadow-primary/20">
        {Icon && <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors duration-100" strokeWidth={1.5} />}
        <span className="text-xs text-text-secondary group-hover:text-white transition-colors duration-100">{title}</span>
      </div>
    </div>
  )
}
