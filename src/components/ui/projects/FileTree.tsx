'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, FileText, FolderOpen, Folder } from 'lucide-react'
import { FolderConfig, ProjectConfig } from '@/config/projects'

interface FileTreeProps {
    folders: FolderConfig[]
    selectedId: string | null
    onSelect: (project: ProjectConfig) => void
}

/**
 * FileTree Component
 * 
 * VS Code style file tree with collapsible folders.
 * Realistic styling with vertical guide lines and proper selection states.
 */
export function FileTree({ folders, selectedId, onSelect }: FileTreeProps) {
    // Track which folders are expanded
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
        new Set(folders.map(f => f.name)) // All expanded by default
    )

    const toggleFolder = (folderName: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev)
            if (next.has(folderName)) {
                next.delete(folderName)
            } else {
                next.add(folderName)
            }
            return next
        })
    }

    return (
        <div className="font-mono text-sm select-none max-w-[224px]">
            {/* Tree header */}
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted uppercase tracking-wide mb-3 pb-2 border-b border-border/50">
                <span className="text-text-secondary">workspace</span>
            </div>

            {/* Root path - not navigable */}
            <div
                className="text-[11px] text-text-muted mb-2 flex items-center gap-1 cursor-not-allowed"
                title="Cannot navigate above this directory"
            >
                <span className="text-accent">~</span>
                <span>/</span>
                <span>src</span>
                <span>/</span>
                <span className="text-text-secondary">projects</span>
            </div>

            {/* Folders */}
            <div className="space-y-0.5">
                {folders.map(folder => {
                    const isExpanded = expandedFolders.has(folder.name)
                    const FolderIcon = folder.icon

                    return (
                        <div key={folder.name}>
                            {/* Folder row */}
                            <button
                                onClick={() => toggleFolder(folder.name)}
                                className="w-full flex items-center gap-2 py-1 text-left group"
                            >
                                <motion.span
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-text-muted group-hover:text-text-secondary transition-colors"
                                >
                                    <ChevronRight className="w-3 h-3" />
                                </motion.span>
                                {isExpanded ? (
                                    <FolderOpen className="w-4 h-4 text-accent" />
                                ) : (
                                    <Folder className="w-4 h-4 text-accent/70" />
                                )}
                                <span className="text-text-muted group-hover:text-text-primary transition-colors">
                                    {folder.name}
                                </span>
                            </button>

                            {/* Files in folder with vertical guide line */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        {/* Container with vertical line from folder icon */}
                                        <div className="relative ml-[7px] pl-5">
                                            {/* Vertical guide line */}
                                            <div className="absolute left-0 top-0 bottom-1 w-px bg-border/60" />

                                            <div className="space-y-0.5 py-1">
                                                {folder.projects.map((project, idx) => (
                                                    <div key={project.id} className="relative">
                                                        {/* Horizontal connector line */}
                                                        <div className="absolute -left-5 top-1/2 w-4 h-px bg-border/60" />
                                                        <FileItem
                                                            project={project}
                                                            isSelected={selectedId === project.id}
                                                            onSelect={onSelect}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

/**
 * Individual file item with hover tooltip
 */
interface FileItemProps {
    project: ProjectConfig
    isSelected: boolean
    onSelect: (project: ProjectConfig) => void
}

function FileItem({ project, isSelected, onSelect }: FileItemProps) {
    const [showTooltip, setShowTooltip] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleMouseEnter = () => {
        // 2 second delay before showing tooltip
        hoverTimeoutRef.current = setTimeout(() => {
            setShowTooltip(true)
        }, 2000)
    }

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setShowTooltip(false)
    }

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current)
            }
        }
    }, [])

    return (
        <div className="relative">
            <button
                onClick={() => onSelect(project)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all duration-150 ${isSelected
                    ? 'bg-accent/5 backdrop-blur-sm border border-accent/30 text-accent'
                    : 'border border-transparent text-text-muted hover:text-text-primary'
                    }`}
            >
                <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
                <span className="truncate text-[13px]">{project.fileName}</span>
            </button>

            {/* Properties tooltip on hover - overlaps tree at 2/3 width */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-[120px] top-1/2 -translate-y-1/2 z-50 w-60 p-3 bg-surface/95 backdrop-blur-md border border-border rounded-lg shadow-xl"
                        style={{ pointerEvents: 'none' }}
                    >
                        <div className="text-[11px] font-medium text-text-primary mb-1">
                            {project.title}
                        </div>
                        <div className="text-xs text-text-muted leading-relaxed mb-3 hyphens-auto" style={{ wordBreak: 'break-word' }}>
                            {project.summary}
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                            {(() => {
                                // Calculate how many badges fit
                                // Available width: ~200px (w-60 minus padding)
                                // Each char ~6px, padding ~20px per badge, gap 8px, +X takes ~30px
                                const availableWidth = 200
                                const counterWidth = 30
                                const gap = 8
                                let usedWidth = 0
                                let visibleCount = 0

                                for (let i = 0; i < project.tech.length; i++) {
                                    const badgeWidth = project.tech[i].length * 6 + 20 // chars + padding
                                    const needsCounter = i < project.tech.length - 1
                                    const spaceNeeded = badgeWidth + (visibleCount > 0 ? gap : 0) + (needsCounter ? counterWidth : 0)

                                    if (usedWidth + spaceNeeded <= availableWidth) {
                                        usedWidth += badgeWidth + (visibleCount > 0 ? gap : 0)
                                        visibleCount++
                                    } else {
                                        break
                                    }
                                }

                                // Ensure at least 1 badge shows
                                visibleCount = Math.max(1, visibleCount)
                                const remaining = project.tech.length - visibleCount

                                return (
                                    <>
                                        {project.tech.slice(0, visibleCount).map(t => (
                                            <span
                                                key={t}
                                                className="px-2 py-0.5 text-xs bg-surface-light border border-border rounded text-text-secondary font-mono whitespace-nowrap flex-shrink-0"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                        {remaining > 0 && (
                                            <span className="text-xs text-text-muted whitespace-nowrap flex-shrink-0">
                                                +{remaining}
                                            </span>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
