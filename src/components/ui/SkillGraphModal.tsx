'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
    allSkills,
    getSkillCategory,
    getSkillByTitle,
    SkillConfig,
    graphHubs,
    categoryToHub
} from '@/config/skills'
import {
    BACKGROUND,
    SURFACE,
    TEXT_PRIMARY,
    TEXT_SECONDARY,
    TEXT_MUTED,
    PRIMARY,
    ACCENT,
    BORDER,
    BORDER_LIGHT
} from '@/config/colors'

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface SkillGraphModalProps {
    isOpen: boolean
    onClose: () => void
    onSkillClick: (skill: SkillConfig) => void
}

// Category colors for nodes (matching the existing config)
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
    val: number
    color: string
    isHub?: boolean
    hubType?: 'main' | 'category'
    // Force-graph runtime properties
    x?: number
    y?: number
    vx?: number
    vy?: number
}

interface GraphLink {
    source: string | GraphNode
    target: string | GraphNode
    linkType?: 'hub-to-hub' | 'hub-to-skill' | 'skill-to-skill'
}

interface GraphData {
    nodes: GraphNode[]
    links: GraphLink[]
}

// Consistent panel styling matching website design system
const panelClass = "bg-surface/80 backdrop-blur-md border border-border rounded-xl"

/**
 * SkillGraphModal
 * 
 * Full-screen modal displaying a hierarchical force-directed graph
 * of skills with hub nodes for categories.
 */
export function SkillGraphModal({ isOpen, onClose, onSkillClick }: SkillGraphModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [nodeVisibility, setNodeVisibility] = useState<Record<string, number>>({})
    const [isFirstOpen, setIsFirstOpen] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const fgRef = useRef<any>(null)

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }, [onClose])

    // Build graph data from skills and hubs - MEMOIZED ONCE
    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = []
        const links: GraphLink[] = []
        const addedLinks = new Set<string>()

        // 1. Add main hub nodes
        graphHubs.filter(h => h.type === 'main').forEach(hub => {
            nodes.push({
                id: hub.id,
                name: hub.name,
                category: 'hub',
                val: 12,
                color: TEXT_MUTED,
                isHub: true,
                hubType: 'main',
            })
        })

        // 2. Add category hub nodes and link to main hubs
        graphHubs.filter(h => h.type === 'category').forEach(hub => {
            nodes.push({
                id: hub.id,
                name: hub.name,
                category: 'hub',
                val: 8,
                color: CATEGORY_COLORS[hub.name] || TEXT_MUTED,
                isHub: true,
                hubType: 'category',
            })

            // Link category hub to main hub
            if (hub.parentHub) {
                links.push({
                    source: hub.parentHub,
                    target: hub.id,
                    linkType: 'hub-to-hub'
                })
            }
        })

        // 3. Add skill nodes and link to their category hub
        allSkills.forEach(skill => {
            const category = getSkillCategory(skill.title) || 'Other'
            const hubId = categoryToHub[category]
            const connectionCount = skill.relatedTo?.length || 0

            nodes.push({
                id: skill.title,
                name: skill.title,
                category,
                val: Math.max(2, connectionCount * 0.8),
                color: CATEGORY_COLORS[category] || PRIMARY,
                isHub: false,
            })

            // Link skill to its category hub
            if (hubId) {
                links.push({
                    source: hubId,
                    target: skill.title,
                    linkType: 'hub-to-skill'
                })
            }

            // 4. Add skill-to-skill relationships (from relatedTo config)
            skill.relatedTo?.forEach(relatedTitle => {
                if (allSkills.some(s => s.title === relatedTitle)) {
                    const linkKey = [skill.title, relatedTitle].sort().join('---')
                    if (!addedLinks.has(linkKey)) {
                        addedLinks.add(linkKey)
                        links.push({
                            source: skill.title,
                            target: relatedTitle,
                            linkType: 'skill-to-skill'
                        })
                    }
                }
            })
        })

        return { nodes, links }
    }, [])

    // Initialize node visibility when graph data is ready
    useEffect(() => {
        const initialVisibility: Record<string, number> = {}
        graphData.nodes.forEach(node => {
            initialVisibility[node.id] = 1
        })
        setNodeVisibility(initialVisibility)
    }, [graphData])

    // Update visibility based on search (smooth filtering without re-render)
    useEffect(() => {
        const query = searchQuery.toLowerCase().trim()
        const newVisibility: Record<string, number> = {}

        if (!query) {
            // No search - all nodes visible
            graphData.nodes.forEach(node => {
                newVisibility[node.id] = 1
            })
        } else {
            // Find matching nodes
            const matchingNodeIds = new Set(
                graphData.nodes
                    .filter(node => node.name.toLowerCase().includes(query))
                    .map(node => node.id)
            )

            // Find nodes connected to matching nodes
            const connectedNodeIds = new Set<string>()
            graphData.links.forEach(link => {
                const sourceId = typeof link.source === 'string' ? link.source : link.source.id
                const targetId = typeof link.target === 'string' ? link.target : link.target.id

                if (matchingNodeIds.has(sourceId)) {
                    connectedNodeIds.add(targetId)
                }
                if (matchingNodeIds.has(targetId)) {
                    connectedNodeIds.add(sourceId)
                }
            })

            // Set visibility levels
            graphData.nodes.forEach(node => {
                if (matchingNodeIds.has(node.id)) {
                    newVisibility[node.id] = 1 // Full visibility for matches
                } else if (connectedNodeIds.has(node.id)) {
                    newVisibility[node.id] = 0.5 // Dimmed for connected nodes
                } else {
                    newVisibility[node.id] = 0.1 // Very dim for unrelated nodes
                }
            })
        }

        setNodeVisibility(newVisibility)
    }, [searchQuery, graphData])

    // Handle node click
    const handleNodeClick = useCallback((node: any) => {
        // Don't process clicks on hub nodes
        if (node.isHub) return

        const skill = getSkillByTitle(node.id)
        if (skill) {
            onClose()
            setTimeout(() => onSkillClick(skill), 150)
        }
    }, [onClose, onSkillClick])

    // Configure graph forces
    const configureForces = useCallback(() => {
        if (!fgRef.current) return

        // Configure link distances based on type
        // Hub-to-hub: longest, Hub-to-skill: medium, Skill-to-skill: shortest
        fgRef.current.d3Force('link')
            .distance((link: any) => {
                if (link.linkType === 'hub-to-hub') return 150  // Long distance between main hub and sub-hubs
                if (link.linkType === 'hub-to-skill') return 80 // Medium distance from sub-hub to skills
                return 50 // Shorter for skill-to-skill
            })
            .strength((link: any) => {
                // Make skill-to-skill links much weaker so they don't pull nodes away from their hubs
                if (link.linkType === 'skill-to-skill') return 0.05 // Very weak - just for visual, not structural
                if (link.linkType === 'hub-to-skill') return 0.8    // Strong - keeps skills near their hub
                return 1 // Full strength for hub-to-hub
            })

        // Stronger charge to spread nodes more
        fgRef.current.d3Force('charge').strength(-200)

        // Add center force to keep graph centered
        fgRef.current.d3Force('center', null) // Remove default center force

        fgRef.current.d3ReheatSimulation()
    }, [])

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
            // Lock body scroll
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollbarWidth}px`
            document.body.style.overscrollBehavior = 'none'

            updateDimensions()
            window.addEventListener('resize', updateDimensions)
            window.addEventListener('keydown', handleKeyDown)

            // Configure forces and zoom when graph opens
            const configureGraph = () => {
                if (fgRef.current) {
                    configureForces()

                    // Consistent zoom: always zoom to fit with same padding
                    // Use smaller padding (10) to make graph appear larger
                    setTimeout(() => {
                        if (fgRef.current) {
                            fgRef.current.zoomToFit(400, 10)
                        }
                    }, 100)
                }
            }

            // Wait for graph to initialize
            setTimeout(configureGraph, 300)
            // Also configure after simulation settles
            setTimeout(configureGraph, 1000)

            return () => {
                document.body.style.overflow = ''
                document.body.style.paddingRight = ''
                document.body.style.overscrollBehavior = ''
                window.removeEventListener('resize', updateDimensions)
                window.removeEventListener('keydown', handleKeyDown)
            }
        }
    }, [isOpen, handleKeyDown, configureForces])

    // Get link visibility based on connected nodes
    const getLinkVisibility = useCallback((link: any) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        const sourceVis = nodeVisibility[sourceId] ?? 1
        const targetVis = nodeVisibility[targetId] ?? 1
        return Math.min(sourceVis, targetVis)
    }, [nodeVisibility])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center touch-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onWheel={(e) => e.stopPropagation()}
                >
                    {/* Dark backdrop */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: BACKGROUND }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    />

                    {/* Content */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Search Panel (Top Center) */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
                            <div className={`${panelClass} px-3 py-2`}>
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="bg-transparent text-sm text-text-primary focus:outline-none placeholder:text-text-muted w-36"
                                />
                            </div>
                        </div>

                        {/* Close Button (Top Right) - Primary button style */}
                        <div className="absolute top-5 right-5 z-10">
                            <button
                                onClick={onClose}
                                className="btn-primary-animated text-white font-medium rounded-lg text-sm px-4 py-2"
                            >
                                <span>Close</span>
                            </button>
                        </div>

                        {/* Legend Panel (Right Center - Vertically Centered) */}
                        <div className={`absolute right-5 top-1/2 -translate-y-1/2 z-10 ${panelClass} p-4 hidden md:block`}>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-3 block">
                                {'// '}categories
                            </span>
                            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                                <div key={category} className="flex items-center gap-2 mb-2 last:mb-0">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-text-secondary">{category}</span>
                                </div>
                            ))}
                        </div>

                        {/* Graph container */}
                        <div ref={containerRef} className="absolute inset-0 z-0">
                            {dimensions.width > 0 && (
                                <ForceGraph2D
                                    ref={fgRef}
                                    graphData={graphData}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    backgroundColor={BACKGROUND}

                                    minZoom={0.3}
                                    maxZoom={6}

                                    nodeLabel=""
                                    nodeRelSize={2}
                                    nodeVal={(node: any) => node.val}

                                    linkWidth={(link: any) => {
                                        const visibility = getLinkVisibility(link)
                                        if (visibility < 0.2) return 0
                                        if (link.linkType === 'hub-to-hub') return 2
                                        if (link.linkType === 'hub-to-skill') return 1.5
                                        return 1
                                    }}

                                    linkColor={(link: any) => {
                                        const visibility = getLinkVisibility(link)
                                        if (visibility < 0.2) return 'transparent'

                                        // Hub connections: more visible
                                        if (link.linkType === 'hub-to-hub' || link.linkType === 'hub-to-skill') {
                                            const alpha = Math.round(visibility * 0.3 * 255).toString(16).padStart(2, '0')
                                            return `${TEXT_MUTED}${alpha}`
                                        }
                                        // Skill-to-skill: subtle
                                        const alpha = Math.round(visibility * 0.15 * 255).toString(16).padStart(2, '0')
                                        return `${ACCENT}${alpha}`
                                    }}

                                    onNodeClick={handleNodeClick}

                                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                        const visibility = nodeVisibility[node.id] ?? 1
                                        if (visibility < 0.05) return

                                        const label = node.name
                                        const isHub = node.isHub
                                        const isMainHub = node.hubType === 'main'
                                        const isCategoryHub = node.hubType === 'category'

                                        // Node size based on type
                                        let nodeSize: number
                                        if (isMainHub) {
                                            nodeSize = 10
                                        } else if (isCategoryHub) {
                                            nodeSize = 7
                                        } else {
                                            nodeSize = Math.sqrt(node.val) * 2
                                        }

                                        ctx.globalAlpha = visibility

                                        // Draw node circle
                                        ctx.beginPath()
                                        ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI)
                                        ctx.fillStyle = node.color
                                        ctx.fill()

                                        // Add subtle border for hubs
                                        if (isHub) {
                                            ctx.strokeStyle = BORDER_LIGHT
                                            ctx.lineWidth = 1
                                            ctx.stroke()
                                        }

                                        // Draw label
                                        const fontSize = isHub
                                            ? Math.max(12 / globalScale, 3)
                                            : Math.max(10 / globalScale, 2)

                                        if (globalScale > 0.4 || isHub) {
                                            ctx.font = `${isHub ? '500 ' : ''}${fontSize}px Inter, sans-serif`
                                            ctx.textAlign = 'center'
                                            ctx.textBaseline = 'middle'
                                            ctx.fillStyle = isHub ? TEXT_PRIMARY : TEXT_SECONDARY
                                            ctx.fillText(label, node.x!, node.y! + nodeSize + fontSize * 0.8)
                                        }

                                        ctx.globalAlpha = 1
                                    }}

                                    nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                                        const isMainHub = node.hubType === 'main'
                                        const isCategoryHub = node.hubType === 'category'
                                        let nodeSize: number
                                        if (isMainHub) {
                                            nodeSize = 10
                                        } else if (isCategoryHub) {
                                            nodeSize = 7
                                        } else {
                                            nodeSize = Math.sqrt(node.val) * 2
                                        }
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
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
