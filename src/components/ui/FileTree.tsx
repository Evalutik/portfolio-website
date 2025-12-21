'use client'

import { useState } from 'react'
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
        <div className="font-mono text-sm select-none">
            {/* Tree header */}
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted uppercase tracking-wide mb-3 pb-2 border-b border-border/50">
                <span className="text-text-secondary">workspace</span>
            </div>

            {/* Root path */}
            <div className="text-[11px] text-text-muted mb-2 flex items-center gap-1">
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
                                        className="overflow-hidden"
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

    return (
        <div className="relative">
            <button
                onClick={() => onSelect(project)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left transition-all duration-150 ${isSelected
                    ? 'bg-accent/5 backdrop-blur-sm border border-accent/30 text-accent'
                    : 'border border-transparent text-text-muted hover:text-text-primary'
                    }`}
            >
                <FileText className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
                <span className="truncate text-[13px]">{project.fileName}</span>
            </button>

            {/* Properties tooltip on hover */}
            <AnimatePresence>
                {showTooltip && !isSelected && (
                    <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full top-0 ml-3 z-20 w-56 p-3 bg-surface/95 backdrop-blur-md border border-border rounded-lg shadow-xl"
                    >
                        <div className="text-[10px] text-text-muted uppercase tracking-widest mb-1.5 font-mono">
                            properties
                        </div>
                        <div className="text-xs text-text-secondary leading-relaxed mb-2.5">
                            {project.summary}
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {project.tech.slice(0, 3).map(t => (
                                <span
                                    key={t}
                                    className="px-1.5 py-0.5 text-[10px] bg-surface-light border border-border rounded text-text-muted font-mono"
                                >
                                    {t}
                                </span>
                            ))}
                            {project.tech.length > 3 && (
                                <span className="px-1.5 py-0.5 text-[10px] text-text-muted">
                                    +{project.tech.length - 3}
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
