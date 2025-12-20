'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { allSkills, getSkillCategory, getSkillByTitle, SkillConfig } from '@/config/skills'
import { BACKGROUND, SURFACE, TEXT_PRIMARY, TEXT_MUTED, PRIMARY, ACCENT, BORDER } from '@/config/colors'

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface SkillGraphModalProps {
    isOpen: boolean
    onClose: () => void
    onSkillClick: (skill: SkillConfig) => void
}

// Category colors for nodes
const CATEGORY_COLORS: Record<string, string> = {
    'Data Engineering': '#6366f1', // Indigo
    'Programming': '#8b5cf6',      // Violet/Purple
    'Cloud': '#06b6d4',            // Cyan
    'ML & Analytics': '#f97316',   // Orange
}

// Extended node type that includes force-graph's runtime properties
interface GraphNode {
    id: string
    name: string
    category: string
    val: number // Node size based on connections
    color: string
    // These are added by force-graph at runtime
    x?: number
    y?: number
    vx?: number
    vy?: number
}

interface GraphLink {
    source: string | GraphNode
    target: string | GraphNode
}

interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

/**
 * SkillGraphModal
 * 
 * Full-screen modal displaying an Obsidian-style force-directed graph
 * of all skills and their relationships.
 */
export function SkillGraphModal({ isOpen, onClose, onSkillClick }: SkillGraphModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const containerRef = useRef<HTMLDivElement>(null)

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }, [onClose])

    // Build graph data from skills
    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = []
        const links: GraphLink[] = []
        const addedLinks = new Set<string>()

        allSkills.forEach(skill => {
            const category = getSkillCategory(skill.title) || 'Other'
            const connectionCount = skill.relatedTo?.length || 0

            nodes.push({
                id: skill.title,
                name: skill.title,
                category,
                val: Math.max(2, connectionCount * 0.8), // Size based on connections
                color: CATEGORY_COLORS[category] || PRIMARY,
            })

            // Add links for relationships
            skill.relatedTo?.forEach(relatedTitle => {
                // Only add link if the related skill exists
                if (allSkills.some(s => s.title === relatedTitle)) {
                    // Create unique key for link (sorted to avoid duplicates)
                    const linkKey = [skill.title, relatedTitle].sort().join('---')
                    if (!addedLinks.has(linkKey)) {
                        addedLinks.add(linkKey)
                        links.push({
                            source: skill.title,
                            target: relatedTitle,
                        })
                    }
                }
            })
        })

        return { nodes, links }
    }, [])

    // Filter nodes based on search
    const filteredData = useMemo<GraphData>(() => {
        if (!searchQuery.trim()) {
            return graphData
        }

        const query = searchQuery.toLowerCase()
        const matchingNodeIds = new Set(
            graphData.nodes
                .filter(node => node.name.toLowerCase().includes(query))
                .map(node => node.id)
        )

        // Keep matching nodes fully visible, dim others
        const nodes = graphData.nodes.map(node => ({
            ...node,
            color: matchingNodeIds.has(node.id)
                ? CATEGORY_COLORS[node.category] || PRIMARY
                : `${CATEGORY_COLORS[node.category] || PRIMARY}30` // 30% opacity for non-matches
        }))

        // Only show links between matching nodes
        const links = graphData.links.filter(
            link => matchingNodeIds.has(link.source as string) && matchingNodeIds.has(link.target as string)
        )

        return { nodes, links }
    }, [graphData, searchQuery])

    // Handle node click
    const handleNodeClick = useCallback((node: any) => {
        const skill = getSkillByTitle(node.id)
        if (skill) {
            onClose()
            // Small delay to let close animation start
            setTimeout(() => onSkillClick(skill), 150)
        }
    }, [onClose, onSkillClick])

    // Update dimensions on mount and resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                })
            }
        }

        if (isOpen) {
            updateDimensions()
            window.addEventListener('resize', updateDimensions)
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('resize', updateDimensions)
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, handleKeyDown])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.21 }}
                >
                    {/* Dark backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: BACKGROUND }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.175 }}
                    />

                    {/* Content */}
                    <motion.div
                        className="absolute inset-0 flex flex-col"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header with search */}
                        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER }}>
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold" style={{ color: TEXT_PRIMARY }}>
                                    Skill Graph
                                </h2>
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-3 py-1.5 text-sm rounded-md bg-surface border border-border focus:border-primary focus:outline-none transition-colors"
                                    style={{
                                        backgroundColor: SURFACE,
                                        borderColor: BORDER,
                                        color: TEXT_PRIMARY,
                                    }}
                                />
                            </div>

                            {/* Legend */}
                            <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: TEXT_MUTED }}>
                                {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                                    <div key={category} className="flex items-center gap-1.5">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                        <span>{category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Graph container */}
                        <div ref={containerRef} className="flex-1 relative">
                            {dimensions.width > 0 && (
                                <ForceGraph2D
                                    graphData={filteredData}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    backgroundColor={BACKGROUND}
                                    nodeLabel="name"
                                    nodeColor={(node: any) => node.color}
                                    nodeRelSize={6}
                                    nodeVal={(node: any) => node.val}
                                    linkColor={() => `${ACCENT}40`}
                                    linkWidth={1}
                                    onNodeClick={(node: any) => handleNodeClick(node)}
                                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                        const label = node.name
                                        const fontSize = Math.max(10 / globalScale, 2)
                                        const nodeSize = Math.sqrt(node.val) * 6

                                        // Draw node circle
                                        ctx.beginPath()
                                        ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI)
                                        ctx.fillStyle = node.color
                                        ctx.fill()

                                        // Draw label if zoomed in enough
                                        if (globalScale > 0.5) {
                                            ctx.font = `${fontSize}px Inter, sans-serif`
                                            ctx.textAlign = 'center'
                                            ctx.textBaseline = 'middle'
                                            ctx.fillStyle = TEXT_PRIMARY
                                            ctx.fillText(label, node.x!, node.y! + nodeSize + fontSize)
                                        }
                                    }}
                                    nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                                        const nodeSize = Math.sqrt(node.val) * 6
                                        ctx.beginPath()
                                        ctx.arc(node.x!, node.y!, nodeSize + 5, 0, 2 * Math.PI)
                                        ctx.fillStyle = color
                                        ctx.fill()
                                    }}
                                    cooldownTicks={100}
                                    d3AlphaDecay={0.02}
                                    d3VelocityDecay={0.3}
                                />
                            )}
                        </div>

                        {/* Return button */}
                        <div className="px-6 py-4 border-t" style={{ borderColor: BORDER }}>
                            <button
                                onClick={onClose}
                                className="font-mono text-xs hover:text-primary transition-colors"
                                style={{ color: TEXT_MUTED }}
                            >
                                return();
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
