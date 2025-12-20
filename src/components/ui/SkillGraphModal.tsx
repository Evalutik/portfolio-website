'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { X, Plus, Minus, Home, Search } from 'lucide-react'
import {
    allSkills,
    getSkillCategory,
    getSkillByTitle,
    SkillConfig,
    graphHubs,
    categoryToHub,
    GraphHub
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

// Category colors for nodes
const CATEGORY_COLORS: Record<string, string> = {
    'Data Engineering': '#6366f1',
    'Programming': '#8b5cf6',
    'Cloud': '#06b6d4',
    'ML & Analytics': '#f97316',
}

// Extended node type
interface GraphNode {
    id: string
    name: string
    category: string
    val: number
    color: string
    isHub?: boolean
    hubType?: 'main' | 'category'
    shortDescription?: string
    description?: string
    hubData?: GraphHub
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

// Consistent styling - same rounded corners for all panels
const panelClass = "bg-surface/80 backdrop-blur-md border border-border rounded-lg"

// Get short description from skill
function getShortDescription(skill: SkillConfig): string {
    if (skill.shortDescription) return skill.shortDescription
    const firstSentence = skill.description.split('.')[0]
    if (firstSentence.length <= 50) return firstSentence
    return firstSentence.substring(0, 47) + '...'
}

/**
 * SkillGraphModal
 */
export function SkillGraphModal({ isOpen, onClose, onSkillClick }: SkillGraphModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [nodeVisibility, setNodeVisibility] = useState<Record<string, number>>({})
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
    const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)
    const [selectedHub, setSelectedHub] = useState<GraphHub | null>(null)
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const fgRef = useRef<any>(null)
    const graphConfiguredRef = useRef(false)

    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (selectedNode) {
                setSelectedNode(null)
                setSelectedSkill(null)
                setSelectedHub(null)
            } else {
                onClose()
            }
        }
    }, [onClose, selectedNode])

    // Build graph data
    const graphData = useMemo<GraphData>(() => {
        const nodes: GraphNode[] = []
        const links: GraphLink[] = []
        const addedLinks = new Set<string>()

        // Main hub nodes
        graphHubs.filter(h => h.type === 'main').forEach(hub => {
            nodes.push({
                id: hub.id,
                name: hub.name,
                category: 'hub',
                val: 12,
                color: TEXT_MUTED,
                isHub: true,
                hubType: 'main',
                shortDescription: hub.shortDescription,
                description: hub.description,
                hubData: hub,
            })
        })

        // Category hub nodes
        graphHubs.filter(h => h.type === 'category').forEach(hub => {
            nodes.push({
                id: hub.id,
                name: hub.name,
                category: 'hub',
                val: 8,
                color: CATEGORY_COLORS[hub.name] || TEXT_MUTED,
                isHub: true,
                hubType: 'category',
                shortDescription: hub.shortDescription,
                description: hub.description,
                hubData: hub,
            })

            if (hub.parentHub) {
                links.push({
                    source: hub.parentHub,
                    target: hub.id,
                    linkType: 'hub-to-hub'
                })
            }
        })

        // Skill nodes
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
                shortDescription: getShortDescription(skill),
            })

            if (hubId) {
                links.push({
                    source: hubId,
                    target: skill.title,
                    linkType: 'hub-to-skill'
                })
            }

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

    // Apply visibility filter based on search or selected hub
    const applyFilter = useCallback((query: string, hubId?: string) => {
        const newVisibility: Record<string, number> = {}

        if (!query && !hubId) {
            // No filter - all nodes visible
            graphData.nodes.forEach(node => {
                newVisibility[node.id] = 1
            })
        } else if (hubId) {
            // Hub filter - highlight hub and its connected skills
            graphData.nodes.forEach(node => {
                if (node.id === hubId || node.id === 'hub-skills') {
                    newVisibility[node.id] = 1
                } else {
                    newVisibility[node.id] = 0.15
                }
            })
            // Find skills connected to this hub
            graphData.links.forEach(link => {
                const sourceId = typeof link.source === 'string' ? link.source : link.source.id
                const targetId = typeof link.target === 'string' ? link.target : link.target.id
                if (sourceId === hubId) newVisibility[targetId] = 1
                if (targetId === hubId) newVisibility[sourceId] = 1
            })
        } else {
            // Search filter
            const matchingNodeIds = new Set(
                graphData.nodes
                    .filter(node => node.name.toLowerCase().includes(query.toLowerCase()))
                    .map(node => node.id)
            )

            const connectedNodeIds = new Set<string>()
            graphData.links.forEach(link => {
                const sourceId = typeof link.source === 'string' ? link.source : link.source.id
                const targetId = typeof link.target === 'string' ? link.target : link.target.id
                if (matchingNodeIds.has(sourceId)) connectedNodeIds.add(targetId)
                if (matchingNodeIds.has(targetId)) connectedNodeIds.add(sourceId)
            })

            graphData.nodes.forEach(node => {
                if (matchingNodeIds.has(node.id)) {
                    newVisibility[node.id] = 1
                } else if (connectedNodeIds.has(node.id)) {
                    newVisibility[node.id] = 0.5
                } else {
                    newVisibility[node.id] = 0.1
                }
            })
        }

        setNodeVisibility(newVisibility)
    }, [graphData])

    // Initialize visibility
    useEffect(() => {
        const initialVisibility: Record<string, number> = {}
        graphData.nodes.forEach(node => {
            initialVisibility[node.id] = 1
        })
        setNodeVisibility(initialVisibility)
    }, [graphData])

    // Search filtering
    useEffect(() => {
        if (searchQuery.trim()) {
            applyFilter(searchQuery.trim())
        } else {
            applyFilter('')
        }
    }, [searchQuery, applyFilter])

    // Clear all filters and selection
    const clearAll = useCallback(() => {
        setSearchQuery('')
        setSelectedNode(null)
        setSelectedSkill(null)
        setSelectedHub(null)
        applyFilter('')
    }, [applyFilter])

    // Handle node click
    const handleNodeClick = useCallback((node: any) => {
        // If node has low visibility, clear filter first
        const currentVisibility = nodeVisibility[node.id] ?? 1
        if (currentVisibility < 0.5) {
            clearAll()
        }

        if (node.isHub) {
            // Select hub and show hub info
            setSelectedNode(node)
            setSelectedSkill(null)
            setSelectedHub(node.hubData || null)
        } else {
            const skill = getSkillByTitle(node.id)
            if (skill) {
                setSelectedNode(node)
                setSelectedSkill(skill)
                setSelectedHub(null)
            }
        }
    }, [nodeVisibility, clearAll])

    // Handle legend category click
    const handleCategoryClick = useCallback((category: string) => {
        const hubId = categoryToHub[category]
        if (hubId) {
            const hubNode = graphData.nodes.find(n => n.id === hubId)
            const hub = graphHubs.find(h => h.id === hubId)
            if (hubNode && hub) {
                setSearchQuery('')
                setSelectedNode(hubNode)
                setSelectedSkill(null)
                setSelectedHub(hub)
                applyFilter('', hubId)
            }
        }
    }, [graphData, applyFilter])

    // Handle background click
    const handleBackgroundClick = useCallback(() => {
        setSelectedNode(null)
        setSelectedSkill(null)
        setSelectedHub(null)
    }, [])

    // Close card
    const closeCard = useCallback(() => {
        setSelectedNode(null)
        setSelectedSkill(null)
        setSelectedHub(null)
    }, [])

    // Zoom controls
    const handleZoomIn = useCallback(() => {
        if (fgRef.current) {
            const currentZoom = fgRef.current.zoom()
            fgRef.current.zoom(currentZoom * 1.3, 300)
        }
    }, [])

    const handleZoomOut = useCallback(() => {
        if (fgRef.current) {
            const currentZoom = fgRef.current.zoom()
            fgRef.current.zoom(currentZoom / 1.3, 300)
        }
    }, [])

    const handleZoomReset = useCallback(() => {
        clearAll()
        if (fgRef.current) {
            fgRef.current.zoomToFit(400, 50)
        }
    }, [clearAll])

    // Configure forces
    const configureForces = useCallback(() => {
        if (!fgRef.current) return

        fgRef.current.d3Force('link')
            .distance((link: any) => {
                if (link.linkType === 'hub-to-hub') return 150
                if (link.linkType === 'hub-to-skill') return 80
                return 50
            })
            .strength((link: any) => {
                if (link.linkType === 'skill-to-skill') return 0.05
                if (link.linkType === 'hub-to-skill') return 0.8
                return 1
            })

        fgRef.current.d3Force('charge').strength(-200)
        fgRef.current.d3ReheatSimulation()
    }, [])

    // Setup
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
            graphConfiguredRef.current = false
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${scrollbarWidth}px`
            document.body.style.overscrollBehavior = 'none'

            updateDimensions()
            window.addEventListener('resize', updateDimensions)
            window.addEventListener('keydown', handleKeyDown)

            const configureGraph = () => {
                if (fgRef.current && !graphConfiguredRef.current) {
                    configureForces()
                    setTimeout(() => {
                        if (fgRef.current) {
                            fgRef.current.zoomToFit(400, 50)
                            graphConfiguredRef.current = true
                        }
                    }, 500)
                }
            }

            setTimeout(configureGraph, 100)
            setTimeout(configureGraph, 800)

            return () => {
                document.body.style.overflow = ''
                document.body.style.paddingRight = ''
                document.body.style.overscrollBehavior = ''
                window.removeEventListener('resize', updateDimensions)
                window.removeEventListener('keydown', handleKeyDown)
            }
        } else {
            graphConfiguredRef.current = false
            setSelectedNode(null)
            setSelectedSkill(null)
            setSelectedHub(null)
            setSearchQuery('')
        }
    }, [isOpen, handleKeyDown, configureForces])

    // Get link visibility
    const getLinkVisibility = useCallback((link: any) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        const sourceVis = nodeVisibility[sourceId] ?? 1
        const targetVis = nodeVisibility[targetId] ?? 1
        return Math.min(sourceVis, targetVis)
    }, [nodeVisibility])

    // Determine what to show in card
    const showCard = selectedSkill || selectedHub
    const cardTitle = selectedSkill?.title || selectedHub?.name || ''
    const cardDescription = selectedSkill?.description || selectedHub?.description || ''
    const cardIcon = selectedSkill?.icon
    const cardExperience = selectedSkill?.experience
    const cardUseCases = selectedSkill?.useCases
    const cardRelated = selectedSkill?.relatedTo

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
                            <div className={`${panelClass} px-2 py-1.5 flex items-center gap-1.5`}>
                                <Search className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-muted w-24"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearAll}
                                        className="p-0.5 hover:bg-surface-light rounded transition-colors flex-shrink-0"
                                    >
                                        <X className="w-3 h-3 text-text-muted" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Close Button (Top Right) */}
                        <div className="absolute top-5 right-5 z-10">
                            <button
                                onClick={onClose}
                                className="btn-secondary-shine bg-surface border border-border text-text-primary hover:bg-surface-light hover:border-border-light font-medium rounded-lg text-sm px-4 py-2 transition-all duration-200"
                            >
                                <span>Close</span>
                            </button>
                        </div>

                        {/* Legend Panel (Right Center) */}
                        <div className={`absolute right-5 top-1/2 -translate-y-1/2 z-10 ${panelClass} p-3 hidden md:block`}>
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2 block">
                                {'// '}categories
                            </span>
                            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className="flex items-center gap-2 mb-1.5 last:mb-0 w-full text-left hover:bg-surface-light rounded px-1 py-0.5 -mx-1 transition-colors"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-text-secondary hover:text-text-primary transition-colors">{category}</span>
                                </button>
                            ))}
                        </div>

                        {/* Zoom Controls (Bottom Right) - Smaller, reordered: +, home, - */}
                        <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-1">
                            <button
                                onClick={handleZoomIn}
                                className={`${panelClass} p-1.5 hover:bg-surface-light hover:border-border-light transition-all duration-200`}
                                title="Zoom In"
                            >
                                <Plus className="w-3 h-3 text-text-muted" />
                            </button>
                            <button
                                onClick={handleZoomReset}
                                className={`${panelClass} p-1.5 hover:bg-surface-light hover:border-border-light transition-all duration-200`}
                                title="Reset View"
                            >
                                <Home className="w-3 h-3 text-text-muted" />
                            </button>
                            <button
                                onClick={handleZoomOut}
                                className={`${panelClass} p-1.5 hover:bg-surface-light hover:border-border-light transition-all duration-200`}
                                title="Zoom Out"
                            >
                                <Minus className="w-3 h-3 text-text-muted" />
                            </button>
                        </div>

                        {/* Info Card (Left Center) - Max 55% height */}
                        <AnimatePresence>
                            {showCard && (
                                <motion.div
                                    className={`absolute left-5 top-1/2 -translate-y-1/2 z-20 ${panelClass} w-64 flex flex-col`}
                                    style={{ maxHeight: '55vh' }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between p-3 border-b border-border flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            {cardIcon && (
                                                <div className="p-1.5 bg-surface rounded border border-border">
                                                    <cardIcon className="w-4 h-4 text-accent" strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xs font-medium text-text-primary">
                                                    {cardTitle}
                                                </h3>
                                                {cardExperience && (
                                                    <span className="text-[9px] font-mono text-text-muted">
                                                        {cardExperience}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeCard}
                                            className="p-0.5 hover:bg-surface-light rounded transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5 text-text-muted" />
                                        </button>
                                    </div>

                                    {/* Scrollable Content */}
                                    <div className="flex-1 overflow-y-auto p-3">
                                        {/* Description */}
                                        <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                                            {cardDescription}
                                        </p>

                                        {/* Use cases */}
                                        {cardUseCases && cardUseCases.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                    {'// '}use cases
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {cardUseCases.map((useCase) => (
                                                        <span
                                                            key={useCase}
                                                            className="px-1.5 py-0.5 text-[9px] bg-surface border border-border rounded text-text-muted"
                                                        >
                                                            {useCase}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Related skills */}
                                        {cardRelated && cardRelated.length > 0 && (
                                            <div>
                                                <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                    {'// '}related
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {cardRelated.slice(0, 6).map((related) => (
                                                        <span
                                                            key={related}
                                                            className="px-1.5 py-0.5 text-[9px] bg-surface border border-border rounded text-text-muted hover:border-accent hover:text-text-secondary cursor-pointer transition-colors"
                                                            onClick={() => {
                                                                const skill = getSkillByTitle(related)
                                                                if (skill) {
                                                                    const node = graphData.nodes.find(n => n.id === related)
                                                                    if (node) {
                                                                        setSelectedNode(node)
                                                                        setSelectedSkill(skill)
                                                                        setSelectedHub(null)
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {related}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hub info - show connected skills count */}
                                        {selectedHub && (
                                            <div className="mt-2">
                                                <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                    {'// '}skills
                                                </span>
                                                <span className="text-[10px] text-text-secondary">
                                                    {graphData.links.filter(l => {
                                                        const sourceId = typeof l.source === 'string' ? l.source : l.source.id
                                                        return sourceId === selectedHub.id && l.linkType === 'hub-to-skill'
                                                    }).length} skills in this category
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

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

                                        if (link.linkType === 'hub-to-hub' || link.linkType === 'hub-to-skill') {
                                            const alpha = Math.round(visibility * 0.3 * 255).toString(16).padStart(2, '0')
                                            return `${TEXT_MUTED}${alpha}`
                                        }
                                        const alpha = Math.round(visibility * 0.15 * 255).toString(16).padStart(2, '0')
                                        return `${ACCENT}${alpha}`
                                    }}

                                    onNodeClick={handleNodeClick}
                                    onBackgroundClick={handleBackgroundClick}
                                    onNodeHover={(node: any) => setHoveredNode(node || null)}

                                    nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                        const visibility = nodeVisibility[node.id] ?? 1
                                        if (visibility < 0.05) return

                                        const label = node.name
                                        const isHub = node.isHub
                                        const isMainHub = node.hubType === 'main'
                                        const isCategoryHub = node.hubType === 'category'
                                        const isSelected = selectedNode?.id === node.id
                                        const isHovered = hoveredNode?.id === node.id

                                        let nodeSize: number
                                        if (isMainHub) {
                                            nodeSize = 10
                                        } else if (isCategoryHub) {
                                            nodeSize = 7
                                        } else {
                                            nodeSize = Math.sqrt(node.val) * 2
                                        }

                                        ctx.globalAlpha = visibility

                                        // Draw selection ring
                                        if (isSelected) {
                                            ctx.beginPath()
                                            ctx.arc(node.x!, node.y!, nodeSize + 4, 0, 2 * Math.PI)
                                            ctx.strokeStyle = ACCENT
                                            ctx.lineWidth = 2
                                            ctx.stroke()
                                        }

                                        // Draw node circle
                                        ctx.beginPath()
                                        ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI)
                                        ctx.fillStyle = node.color
                                        ctx.fill()

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

                                        // Draw hover tooltip
                                        if (isHovered && node.shortDescription && globalScale > 0.5) {
                                            const tooltipText = node.shortDescription
                                            const tooltipFontSize = Math.max(9 / globalScale, 2.5)
                                            ctx.font = `${tooltipFontSize}px Inter, sans-serif`
                                            const textWidth = ctx.measureText(tooltipText).width
                                            const padding = 4 / globalScale
                                            const tooltipY = node.y! + nodeSize + fontSize * 1.8

                                            ctx.fillStyle = SURFACE
                                            ctx.fillRect(
                                                node.x! - textWidth / 2 - padding,
                                                tooltipY - tooltipFontSize / 2 - padding,
                                                textWidth + padding * 2,
                                                tooltipFontSize + padding * 2
                                            )

                                            ctx.strokeStyle = BORDER
                                            ctx.lineWidth = 0.5 / globalScale
                                            ctx.strokeRect(
                                                node.x! - textWidth / 2 - padding,
                                                tooltipY - tooltipFontSize / 2 - padding,
                                                textWidth + padding * 2,
                                                tooltipFontSize + padding * 2
                                            )

                                            ctx.fillStyle = TEXT_MUTED
                                            ctx.textAlign = 'center'
                                            ctx.textBaseline = 'middle'
                                            ctx.fillText(tooltipText, node.x!, tooltipY)
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
