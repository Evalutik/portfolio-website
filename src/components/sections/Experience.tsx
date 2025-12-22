'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { experienceData, ExperienceItem } from '@/config/experience'

type TerminalState = 'initial' | 'loading-list' | 'list' | 'loading-detail' | 'detail'

interface HistoryEntry {
    type: 'command' | 'output' | 'list-item' | 'description' | 'empty'
    content: string
    isSelected?: boolean
    isAccent?: boolean
}

const MAX_HISTORY = 15
const SPINNER_CHARS = ['|', '/', '-', '\\']

export function Experience() {
    const [state, setState] = useState<TerminalState>('initial')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
    const [showCursor, setShowCursor] = useState(true)
    const [history, setHistory] = useState<HistoryEntry[]>([])
    const [spinnerIndex, setSpinnerIndex] = useState(0)
    const terminalRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const addToHistory = (entries: HistoryEntry[]) => {
        setHistory(prev => {
            const newHistory = [...prev, ...entries]
            if (newHistory.length > MAX_HISTORY) {
                return newHistory.slice(-MAX_HISTORY)
            }
            return newHistory
        })
    }

    // Spinner animation
    useEffect(() => {
        if (state === 'loading-list' || state === 'loading-detail') {
            const interval = setInterval(() => {
                setSpinnerIndex(prev => (prev + 1) % SPINNER_CHARS.length)
            }, 100)
            return () => clearInterval(interval)
        }
    }, [state])

    // Loading timers
    useEffect(() => {
        if (state === 'loading-list') {
            const timer = setTimeout(() => {
                setState('list')
            }, 2000)
            return () => clearTimeout(timer)
        }
        if (state === 'loading-detail') {
            const timer = setTimeout(() => {
                setState('detail')
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [state])

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight
        }
    }, [history, state])

    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev)
        }, 530)
        return () => clearInterval(interval)
    }, [])

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (state === 'initial') {
            if (e.key === 'Enter') {
                e.preventDefault()
                addToHistory([
                    { type: 'command', content: 'experience --list' },
                ])
                setState('loading-list')
            }
        } else if (state === 'list') {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                setSelectedIndex(prev => Math.min(prev + 1, experienceData.length - 1))
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setSelectedIndex(prev => Math.max(prev - 1, 0))
            } else if (e.key === 'Enter') {
                e.preventDefault()
                const exp = experienceData[selectedIndex]
                setSelectedExperience(exp)
                // Only add command to history, keep list live to avoid visual jump
                addToHistory([
                    { type: 'command', content: `experience --show "${exp.company}"` },
                ])
                setState('loading-detail')
            }
        } else if (state === 'detail') {
            if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Escape') {
                e.preventDefault()
                if (selectedExperience) {
                    // Add detail content and cd .. to history (no results - list view shows it)
                    addToHistory([
                        { type: 'output', content: `${selectedExperience.role} @ ${selectedExperience.company}` },
                        { type: 'empty', content: '' },
                        ...selectedExperience.description.map(d => ({
                            type: 'description' as const,
                            content: d,
                        })),
                        { type: 'empty', content: '' },
                        { type: 'command', content: 'cd ..' },
                    ])
                }
                setState('list')
                setSelectedExperience(null)
            }
        }
    }, [state, selectedIndex, selectedExperience])

    useEffect(() => {
        const terminal = terminalRef.current
        if (terminal) {
            terminal.focus()
        }
    }, [state])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const handleItemClick = (index: number) => {
        if (state === 'list') {
            const exp = experienceData[index]
            setSelectedIndex(index)
            setSelectedExperience(exp)
            // Only add command to history, keep list live to avoid visual jump
            addToHistory([
                { type: 'command', content: `experience --show "${exp.company}"` },
            ])
            setState('loading-detail')
        }
    }

    const handleBackClick = () => {
        if (selectedExperience) {
            addToHistory([
                { type: 'output', content: `${selectedExperience.role} @ ${selectedExperience.company}` },
                { type: 'empty', content: '' },
                ...selectedExperience.description.map(d => ({
                    type: 'description' as const,
                    content: d,
                })),
                { type: 'empty', content: '' },
                { type: 'command', content: 'cd ..' },
            ])
        }
        setState('list')
        setSelectedExperience(null)
    }

    const handleInitialClick = () => {
        if (state === 'initial') {
            addToHistory([
                { type: 'command', content: 'experience --list' },
            ])
            setState('loading-list')
        }
    }

    const renderHistoryEntry = (entry: HistoryEntry, idx: number) => {
        const baseClass = 'opacity-50'

        if (entry.type === 'empty') {
            return <div key={idx} className="h-4" />
        }
        if (entry.type === 'command') {
            return (
                <div key={idx} className={`${baseClass} flex`}>
                    <span className="text-accent/70 w-4 flex-shrink-0">$</span>
                    <span className="text-text-primary/70">{entry.content}</span>
                </div>
            )
        }
        if (entry.type === 'output') {
            return (
                <div key={idx} className={`${baseClass} flex`}>
                    <span className="w-4 flex-shrink-0" />
                    <span className="text-text-secondary/70">{entry.content}</span>
                </div>
            )
        }
        if (entry.type === 'list-item') {
            return (
                <div key={idx} className={`${baseClass} flex`}>
                    <span className="w-4 flex-shrink-0 text-accent/50">{entry.isSelected ? '>' : ' '}</span>
                    <span className={entry.isAccent ? 'text-accent/70' : 'text-text-secondary/70'}>{entry.content}</span>
                </div>
            )
        }
        if (entry.type === 'description') {
            return (
                <div key={idx} className={`${baseClass} flex`}>
                    <span className="w-4 flex-shrink-0" />
                    <span className="text-text-secondary/60">{entry.content}</span>
                </div>
            )
        }
        return null
    }

    return (
        <section id="experience" className="py-16 px-4 max-w-3xl mx-auto">
            <SectionHeading title="Experience" />

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
            >
                <div
                    ref={terminalRef}
                    tabIndex={0}
                    className="bg-surface/80 backdrop-blur-md border border-border rounded-xl overflow-hidden outline-none"
                >
                    {/* macOS Title Bar */}
                    <div className="flex items-center justify-center px-3 py-2 border-b border-border bg-surface/30 relative">
                        <div className="absolute left-3 flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="text-[10px] font-mono text-text-muted">
                            ~/career/experience
                        </span>
                    </div>

                    {/* Terminal Body - flex container for scroll area + footer */}
                    <div className="flex flex-col h-[400px]">
                        {/* Scrollable content area */}
                        <div
                            ref={contentRef}
                            className="terminal-scroll flex-1 px-3 py-2 font-mono text-sm overflow-y-scroll"
                        >
                            <style jsx global>{`
                              .terminal-scroll::-webkit-scrollbar {
                                display: none;
                              }
                              .terminal-scroll {
                                scrollbar-width: none;
                                -ms-overflow-style: none;
                              }
                            `}</style>

                            {/* Command history */}
                            <div className="space-y-0.5">
                                {history.map((entry, idx) => renderHistoryEntry(entry, idx))}
                            </div>

                            {/* Current state content */}
                            {state === 'initial' && (
                                <div onClick={handleInitialClick} className="cursor-pointer">
                                    <div className="flex items-center">
                                        <span className="text-accent w-4 flex-shrink-0">$</span>
                                        <span className="text-text-primary">experience --list</span>
                                        <span className={`w-2 h-4 bg-text-primary ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                                        <span className="text-text-secondary/60 ml-3">press ⏎</span>
                                    </div>
                                </div>
                            )}

                            {state === 'loading-list' && (
                                <div className="flex items-center">
                                    <span className="w-4 flex-shrink-0" />
                                    <span className="text-accent">{SPINNER_CHARS[spinnerIndex]}</span>
                                    <span className="text-text-secondary ml-2">Loading experiences...</span>
                                </div>
                            )}

                            {state === 'loading-detail' && (
                                <div className="flex items-center">
                                    <span className="w-4 flex-shrink-0" />
                                    <span className="text-accent">{SPINNER_CHARS[spinnerIndex]}</span>
                                    <span className="text-text-secondary ml-2">Fetching details...</span>
                                </div>
                            )}

                            {state === 'list' && (
                                <div>
                                    {/* Results count */}
                                    <div className="flex mb-1">
                                        <span className="w-4 flex-shrink-0" />
                                        <span className="text-text-secondary/70">{experienceData.length} result(s)</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {experienceData.map((exp, index) => (
                                            <div
                                                key={exp.id}
                                                onClick={() => handleItemClick(index)}
                                                className={`flex items-center cursor-pointer font-mono -mx-3 px-3 ${selectedIndex === index
                                                    ? 'text-text-primary bg-primary/25'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light/30'
                                                    }`}
                                            >
                                                <span className={`w-4 flex-shrink-0 ${selectedIndex === index ? 'text-accent' : 'text-transparent'}`}>
                                                    {'>'}
                                                </span>
                                                <span>{exp.role}</span>
                                                <span className="mx-2 text-text-secondary/70">@</span>
                                                <span className={selectedIndex === index ? 'text-accent' : ''}>{exp.company}</span>
                                                <span className="ml-auto text-text-secondary/60">{exp.period}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {state === 'detail' && selectedExperience && (
                                <div
                                    onClick={handleBackClick}
                                    className="cursor-pointer"
                                >
                                    {/* Job info */}
                                    <div className="flex">
                                        <span className="w-4 flex-shrink-0" />
                                        <span>
                                            <span className="text-text-primary">{selectedExperience.role}</span>
                                            <span className="text-text-secondary/70 mx-2">@</span>
                                            <span className="text-accent">{selectedExperience.company}</span>
                                            <span className="text-text-secondary/60 ml-2">{selectedExperience.period}</span>
                                        </span>
                                    </div>
                                    <div className="h-4" />

                                    {/* Description */}
                                    <div className="space-y-0.5">
                                        {selectedExperience.description.map((paragraph, idx) => (
                                            <div key={idx} className="flex">
                                                <span className="w-4 flex-shrink-0" />
                                                <span className="text-text-secondary leading-relaxed">{paragraph}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-4" />

                                    {/* cd .. inline command */}
                                    <div className="flex items-center">
                                        <span className="text-accent w-4 flex-shrink-0">$</span>
                                        <span className="text-text-primary">cd ..</span>
                                        <span className={`w-2 h-4 bg-text-primary ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
                                        <span className="text-text-secondary/60 ml-3">press ⏎ to go back</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fixed footer - only show in list state */}
                        {state === 'list' && (
                            <div className="px-3 py-2 text-text-secondary/50 text-[10px] font-mono">
                                ↑↓ navigate • ⏎ select
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
