'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { X, Plus, Minus, Home, Search, Info, type LucideIcon } from 'lucide-react'
import {
    allSkills,
    getSkillCategory,
    getSkillByTitle,
    SkillConfig,
    graphHubs,
    categoryToHub,
    GraphHub,
    CATEGORY_COLORS
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
    preloadMode?: boolean // When true, renders graph hidden for preloading without UI effects
}

// CATEGORY_COLORS imported from '@/config/skills'

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

// Panel styling - matches .card background but with rounded-lg for smaller elements
const panelClass = "bg-surface/80 backdrop-blur-2xl border border-border rounded-lg"

// Zoom levels
const FOCUS_ZOOM = 1.8
const HOME_ZOOM_PADDING = 50

// Session storage key for welcome popup
let hasSeenWelcomeThisSession = false  // Simple variable - resets on page reload

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
export function SkillGraphModal({ isOpen, onClose, onSkillClick, preloadMode = false }: SkillGraphModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
    const [nodeVisibility, setNodeVisibility] = useState<Record<string, number>>({})
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
    const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)
    const [selectedHub, setSelectedHub] = useState<GraphHub | null>(null)
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
    const [showWelcome, setShowWelcome] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const fgRef = useRef<any>(null)
    const graphConfiguredRef = useRef(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const userInteractedRef = useRef(false)

    // Check if welcome popup should show on first ACTUAL open (not preload)
    useEffect(() => {
        if (isOpen && !preloadMode && !hasSeenWelcomeThisSession) {
            setShowWelcome(true)
        }
    }, [isOpen, preloadMode])

    // Close welcome popup
    const closeWelcome = useCallback(() => {
        setShowWelcome(false)
        hasSeenWelcomeThisSession = true
        // Focus search after welcome closes
        setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus()
            }
        }, 300)
    }, [])

    // Open welcome popup (from info button)
    const openWelcome = useCallback(() => {
        setShowWelcome(true)
    }, [])

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

    // Count skills connected to a hub
    const getHubSkillCount = useCallback((hubId: string) => {
        let count = 0
        graphData.links.forEach(l => {
            const sourceId = typeof l.source === 'string' ? l.source : l.source.id
            const targetId = typeof l.target === 'string' ? l.target : l.target.id
            if (l.linkType === 'hub-to-skill') {
                if (sourceId === hubId || targetId === hubId) count++
            }
        })
        if (hubId === 'hub-skills') {
            return allSkills.length
        }
        return count
    }, [graphData])

    // Check if search has results
    const hasSearchResults = useMemo(() => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase().trim()
        return graphData.nodes.some(node =>
            node.name.toLowerCase().includes(query) && !node.isHub
        )
    }, [searchQuery, graphData])

    // Apply visibility filter
    const applyFilter = useCallback((query: string, hubId?: string) => {
        const newVisibility: Record<string, number> = {}

        if (!query && !hubId) {
            graphData.nodes.forEach(node => {
                newVisibility[node.id] = 1
            })
        } else if (hubId) {
            graphData.nodes.forEach(node => {
                if (node.id === hubId || node.id === 'hub-skills') {
                    newVisibility[node.id] = 1
                } else {
                    newVisibility[node.id] = 0.15
                }
            })
            graphData.links.forEach(link => {
                const sourceId = typeof link.source === 'string' ? link.source : link.source.id
                const targetId = typeof link.target === 'string' ? link.target : link.target.id
                if (sourceId === hubId) newVisibility[targetId] = 1
                if (targetId === hubId) newVisibility[sourceId] = 1
            })
        } else {
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

    // Reset all state (used when modal opens)
    const resetState = useCallback(() => {
        setSearchQuery('')
        setSelectedNode(null)
        setSelectedSkill(null)
        setSelectedHub(null)
        userInteractedRef.current = false
        const initialVisibility: Record<string, number> = {}
        graphData.nodes.forEach(node => {
            initialVisibility[node.id] = 1
        })
        setNodeVisibility(initialVisibility)
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

    // Clear all
    const clearAll = useCallback(() => {
        setSearchQuery('')
        setSelectedNode(null)
        setSelectedSkill(null)
        setSelectedHub(null)
        applyFilter('')
        // Reheat simulation for visual feedback on deselection
        if (fgRef.current?.d3ReheatSimulation) {
            fgRef.current.d3ReheatSimulation()
        }
    }, [applyFilter])

    // Easing function for smooth camera movement
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

    // Zoom to a node with eased animation
    const zoomToNode = useCallback((node: GraphNode) => {
        if (fgRef.current && node.x !== undefined && node.y !== undefined) {
            userInteractedRef.current = true

            // Get current camera position
            const startX = fgRef.current.centerAt().x || 0
            const startY = fgRef.current.centerAt().y || 0
            const startZoom = fgRef.current.zoom() || 1

            const targetX = node.x
            const targetY = node.y
            const targetZoom = FOCUS_ZOOM
            const duration = 600
            const startTime = Date.now()

            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                const eased = easeOutCubic(progress)

                const currentX = startX + (targetX - startX) * eased
                const currentY = startY + (targetY - startY) * eased
                const currentZoom = startZoom + (targetZoom - startZoom) * eased

                if (fgRef.current) {
                    fgRef.current.centerAt(currentX, currentY)
                    fgRef.current.zoom(currentZoom)
                }

                if (progress < 1) {
                    requestAnimationFrame(animate)
                }
            }

            animate()

            // Reheat simulation slightly for visual feedback
            if (fgRef.current.d3ReheatSimulation) {
                fgRef.current.d3ReheatSimulation()
            }
        }
    }, [])

    // Blur search input
    const blurSearch = useCallback(() => {
        if (searchInputRef.current) {
            searchInputRef.current.blur()
        }
    }, [])

    // Handle node click
    const handleNodeClick = useCallback((node: any) => {
        blurSearch()

        const currentVisibility = nodeVisibility[node.id] ?? 1
        if (currentVisibility < 0.5) {
            setSearchQuery('')
            applyFilter('')
        }

        if (node.isHub) {
            setSelectedNode(node)
            setSelectedSkill(null)
            setSelectedHub(node.hubData || null)
            // Reheat simulation for visual feedback (no zoom for hubs)
            if (fgRef.current?.d3ReheatSimulation) {
                fgRef.current.d3ReheatSimulation()
            }
        } else {
            const skill = getSkillByTitle(node.id)
            if (skill) {
                setSelectedNode(node)
                setSelectedSkill(skill)
                setSelectedHub(null)
                // Only zoom for skill nodes
                zoomToNode(node)
            }
        }
    }, [nodeVisibility, applyFilter, zoomToNode, blurSearch])

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
                // Reheat simulation for visual feedback (no zoom)
                if (fgRef.current?.d3ReheatSimulation) {
                    fgRef.current.d3ReheatSimulation()
                }
            }
        }
    }, [graphData, applyFilter])

    // Handle background click
    const handleBackgroundClick = useCallback(() => {
        blurSearch()
        clearAll()
    }, [clearAll, blurSearch])

    // Close card
    const closeCard = useCallback(() => {
        clearAll()
    }, [clearAll])

    // Zoom controls
    const handleZoomIn = useCallback(() => {
        userInteractedRef.current = true
        if (fgRef.current) {
            const currentZoom = fgRef.current.zoom()
            fgRef.current.zoom(currentZoom * 1.3, 300)
        }
    }, [])

    const handleZoomOut = useCallback(() => {
        userInteractedRef.current = true
        if (fgRef.current) {
            const currentZoom = fgRef.current.zoom()
            fgRef.current.zoom(currentZoom / 1.3, 300)
        }
    }, [])

    const handleZoomReset = useCallback(() => {
        clearAll()
        userInteractedRef.current = true
        if (fgRef.current) {
            fgRef.current.zoomToFit(400, HOME_ZOOM_PADDING)
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

    // Handle escape key and hot typing
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Close welcome popup on escape
        if (e.key === 'Escape' && showWelcome) {
            closeWelcome()
            return
        }

        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' && target !== searchInputRef.current) return

        if (e.key === 'Escape') {
            // Only clear selection, never close the graph
            if (selectedNode) {
                clearAll()
            }
            // Don't close the graph on escape
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (searchInputRef.current && document.activeElement !== searchInputRef.current && !showWelcome) {
                searchInputRef.current.focus()
            }
        } else if (e.key === 'Backspace') {
            if (searchInputRef.current && document.activeElement !== searchInputRef.current && !showWelcome) {
                searchInputRef.current.focus()
            }
        }
    }, [selectedNode, clearAll, showWelcome, closeWelcome])

    // Setup - only run core setup when isOpen changes
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
            // Reset state only on initial open
            resetState()
            graphConfiguredRef.current = false

            // Skip body scroll lock in preload mode
            if (!preloadMode) {
                const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
                document.body.style.overflow = 'hidden'
                document.body.style.paddingRight = `${scrollbarWidth}px`
                document.body.style.overscrollBehavior = 'none'
                // Also hide on html element to prevent scrollbar during React re-renders
                document.documentElement.style.overflow = 'hidden'
                // Add class for other components to detect galaxy view
                document.body.classList.add('galaxy-open')
            }

            updateDimensions()
            window.addEventListener('resize', updateDimensions)

            const configureGraph = () => {
                // Ensure dimensions are up to date before configuring
                updateDimensions()

                // Only configure if we have valid dimensions and graph ref
                if (fgRef.current && !graphConfiguredRef.current && containerRef.current) {
                    const cw = containerRef.current.clientWidth
                    const ch = containerRef.current.clientHeight

                    // Wait for container to have reasonable dimensions
                    if (cw > 100 && ch > 100) {
                        configureForces()
                        graphConfiguredRef.current = true
                        // Retry zoomToFit multiple times to handle race conditions
                        const tryZoom = (delay: number) => {
                            setTimeout(() => {
                                if (fgRef.current && !userInteractedRef.current) {
                                    fgRef.current.zoomToFit(400, HOME_ZOOM_PADDING)
                                }
                            }, delay)
                        }
                        tryZoom(200)
                        tryZoom(500)
                        tryZoom(1000)
                        tryZoom(2000)
                    }
                }
            }

            // Multiple retries at different intervals
            setTimeout(configureGraph, 50)
            setTimeout(configureGraph, 200)
            setTimeout(configureGraph, 600)

            return () => {
                if (!preloadMode) {
                    document.body.style.overflow = ''
                    document.body.style.paddingRight = ''
                    document.body.style.overscrollBehavior = ''
                    document.documentElement.style.overflow = ''
                    document.body.classList.remove('galaxy-open')
                }
                window.removeEventListener('resize', updateDimensions)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, preloadMode])

    // Key handler effect - separate to avoid resetting state
    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
            return () => window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, handleKeyDown])

    // Focus search when welcome closes (not when it's open)
    useEffect(() => {
        if (isOpen && !showWelcome && searchInputRef.current) {
            // Only focus if welcome was previously shown and just closed
            setTimeout(() => {
                if (!showWelcome && searchInputRef.current) {
                    searchInputRef.current.focus()
                }
            }, 100)
        }
    }, [showWelcome]) // Only trigger when showWelcome changes, not on initial open

    // Get link visibility
    const getLinkVisibility = useCallback((link: any) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id
        const targetId = typeof link.target === 'string' ? link.target : link.target.id
        const sourceVis = nodeVisibility[sourceId] ?? 1
        const targetVis = nodeVisibility[targetId] ?? 1
        return Math.min(sourceVis, targetVis)
    }, [nodeVisibility])

    // Card data
    const showCard = selectedSkill || selectedHub
    const cardTitle = selectedSkill?.title || selectedHub?.name || ''
    const cardDescription = selectedSkill?.description || selectedHub?.description || ''
    const CardIcon: LucideIcon | undefined = selectedSkill?.icon
    const cardExperience = selectedSkill?.experience
    const cardUseCases = selectedSkill?.useCases
    const cardRelated = selectedSkill?.relatedTo
    // Category comes from the graph node, not skill config
    const cardCategory = selectedNode && !selectedNode.isHub ? selectedNode.category : undefined
    const cardCategoryColor = cardCategory ? CATEGORY_COLORS[cardCategory] : undefined

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center touch-none"
                    style={preloadMode ? {
                        opacity: 0,
                        visibility: 'hidden',
                        zIndex: -9999,
                        pointerEvents: 'none'
                    } : { zIndex: 50 }}
                    initial={preloadMode ? false : { opacity: 0 }}
                    animate={preloadMode ? false : { opacity: 1 }}
                    exit={preloadMode ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onWheel={(e) => e.stopPropagation()}
                >
                    {/* Dark backdrop with dots pattern */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ backgroundColor: BACKGROUND }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    />

                    {/* Content - blur when welcome is shown */}
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: showWelcome ? 'blur(4px)' : 'blur(0px)'
                        }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.2, delay: showWelcome ? 0.15 : 0 }}
                    >
                        {/* Search Panel (Top Center) */}
                        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10">
                            <div className={`${panelClass} px-2 py-1.5 flex items-center gap-1.5 w-36`}>
                                <Search className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-xs text-text-primary focus:outline-none placeholder:text-text-muted flex-1 min-w-0"
                                />
                                <button
                                    onClick={clearAll}
                                    className={`p-0.5 hover:bg-surface-light rounded transition-colors flex-shrink-0 ${searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                >
                                    <X className="w-3 h-3 text-text-muted" />
                                </button>
                            </div>
                        </div>

                        {/* Top Right Buttons */}
                        <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
                            {/* Info Button */}
                            <button
                                onClick={openWelcome}
                                className={`${panelClass} px-1.5 py-1.5 self-stretch flex items-center hover:bg-surface-light hover:border-border-light transition-all duration-200`}
                                title="About Skill Galaxy"
                            >
                                <Info className="w-3.5 h-3.5 text-text-muted" />
                            </button>
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`${panelClass} px-3 py-1.5 flex items-center self-stretch hover:bg-surface-light hover:border-border-light transition-all duration-200 btn-secondary-shine`}
                            >
                                <span className="text-xs text-text-muted">Close</span>
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
                                    className="flex items-center gap-2 mb-1.5 last:mb-0 w-full text-left group"
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors whitespace-nowrap">
                                        {category}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Zoom Controls (Bottom Right) */}
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

                        {/* No Results Message */}
                        {searchQuery.trim() && !hasSearchResults && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                                initial={{ opacity: 0, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="backdrop-blur-sm bg-background/30 px-4 py-2 rounded-lg">
                                    <span className="text-sm text-text-muted">No matching skills</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Info Card (Left, Vertically Centered) */}
                        <AnimatePresence>
                            {showCard && (
                                <motion.div
                                    className="absolute left-5 top-0 bottom-0 z-20 flex items-center pointer-events-none"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={`${panelClass} w-64 flex flex-col pointer-events-auto`} style={{ maxHeight: '55vh' }}>
                                        {/* Header */}
                                        <div className="flex items-start justify-between p-3 border-b border-border flex-shrink-0">
                                            <div className="flex items-stretch gap-2">
                                                {CardIcon && (
                                                    <div className="bg-surface rounded border border-border flex items-center justify-center aspect-square self-stretch">
                                                        <CardIcon className="w-4 h-4 text-accent mx-1.5" strokeWidth={1.5} />
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center">
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
                                            {/* Category for skills */}
                                            {cardCategory && cardCategoryColor && (
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: cardCategoryColor }}
                                                    />
                                                    <span className="text-[10px] text-text-muted">
                                                        {cardCategory}
                                                    </span>
                                                </div>
                                            )}

                                            <p className="text-[11px] text-text-secondary leading-relaxed mb-3">
                                                {cardDescription}
                                            </p>

                                            {cardUseCases && cardUseCases.length > 0 && (
                                                <div className="mb-3">
                                                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                        {'// '}use cases
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {cardUseCases.map((useCase) => (
                                                            <span
                                                                key={useCase}
                                                                className="px-1.5 py-0.5 text-[9px] bg-surface-light border border-border rounded text-text-secondary font-mono"
                                                            >
                                                                {useCase}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {cardRelated && cardRelated.length > 0 && (
                                                <div>
                                                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                        {'// '}related
                                                    </span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {cardRelated.slice(0, 6).map((related) => (
                                                            <span
                                                                key={related}
                                                                className="px-1.5 py-0.5 text-[9px] bg-surface-light border border-border rounded text-text-secondary font-mono hover:border-accent hover:text-text-primary cursor-pointer transition-colors"
                                                                onClick={() => {
                                                                    const skill = getSkillByTitle(related)
                                                                    if (skill) {
                                                                        const node = graphData.nodes.find(n => n.id === related)
                                                                        if (node) {
                                                                            setSelectedNode(node)
                                                                            setSelectedSkill(skill)
                                                                            setSelectedHub(null)
                                                                            zoomToNode(node)
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

                                            {selectedHub && (
                                                <div className="mt-2">
                                                    <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block mb-1.5">
                                                        {'// '}skills
                                                    </span>
                                                    <span className="text-[10px] text-text-secondary">
                                                        {getHubSkillCount(selectedHub.id)} skills in this category
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Graph container */}
                        <div ref={containerRef} className="absolute inset-0 z-0">
                            {/* Dots pattern overlay - above canvas */}
                            <div className="absolute inset-0 z-10 bg-dots opacity-40 pointer-events-none" />
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

                                        if (isSelected) {
                                            ctx.beginPath()
                                            ctx.arc(node.x!, node.y!, nodeSize + 4, 0, 2 * Math.PI)
                                            ctx.strokeStyle = ACCENT
                                            ctx.lineWidth = 2
                                            ctx.stroke()
                                        }

                                        ctx.beginPath()
                                        ctx.arc(node.x!, node.y!, nodeSize, 0, 2 * Math.PI)
                                        ctx.fillStyle = node.color
                                        ctx.fill()

                                        if (isHub) {
                                            ctx.strokeStyle = BORDER_LIGHT
                                            ctx.lineWidth = 1
                                            ctx.stroke()
                                        }

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

                                        // Hover tooltip - appears to the right of node
                                        if (isHovered && node.shortDescription && globalScale > 0.5) {
                                            const tooltipText = node.shortDescription
                                            const tooltipFontSize = Math.max(9 / globalScale, 2.5)
                                            const maxWidth = 180 / globalScale  // Wider tooltip
                                            ctx.font = `${tooltipFontSize}px Inter, sans-serif`

                                            const words = tooltipText.split(' ')
                                            const lines: string[] = []
                                            let currentLine = ''

                                            words.forEach((word: string) => {
                                                const testLine = currentLine ? `${currentLine} ${word}` : word
                                                const testWidth = ctx.measureText(testLine).width
                                                if (testWidth > maxWidth && currentLine) {
                                                    lines.push(currentLine)
                                                    currentLine = word
                                                } else {
                                                    currentLine = testLine
                                                }
                                            })
                                            if (currentLine) lines.push(currentLine)

                                            // Limit to max 2 lines
                                            if (lines.length > 2) {
                                                lines.length = 2
                                                lines[1] = lines[1].slice(0, -3) + '...'
                                            }

                                            const padding = 4 / globalScale
                                            const lineHeight = tooltipFontSize * 1.3
                                            const boxWidth = Math.min(maxWidth, Math.max(...lines.map(l => ctx.measureText(l).width))) + padding * 2
                                            const boxHeight = lines.length * lineHeight + padding * 2

                                            // Position to the right of node
                                            const tooltipX = node.x! + nodeSize + 8 / globalScale
                                            const tooltipY = node.y! - boxHeight / 2

                                            ctx.fillStyle = SURFACE
                                            ctx.fillRect(
                                                tooltipX,
                                                tooltipY,
                                                boxWidth,
                                                boxHeight
                                            )

                                            ctx.strokeStyle = BORDER
                                            ctx.lineWidth = 0.5 / globalScale
                                            ctx.strokeRect(
                                                tooltipX,
                                                tooltipY,
                                                boxWidth,
                                                boxHeight
                                            )

                                            ctx.fillStyle = TEXT_MUTED
                                            ctx.textAlign = 'left'
                                            ctx.textBaseline = 'top'
                                            lines.forEach((line, i) => {
                                                ctx.fillText(line, tooltipX + padding, tooltipY + padding + i * lineHeight)
                                            })
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

                    {/* Welcome Popup */}
                    <AnimatePresence>
                        {showWelcome && (
                            <motion.div
                                className="absolute inset-0 z-30 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={closeWelcome}
                            >
                                <motion.div
                                    className={`${panelClass} max-w-sm mx-4 p-4`}
                                    initial={{ opacity: 0, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, filter: 'blur(8px)' }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2 className="text-sm font-semibold text-text-primary mb-2">
                                        Welcome to the Skill Galaxy!
                                    </h2>
                                    <p className="text-xs text-text-secondary leading-relaxed mb-3 text-left">
                                        An interactive map of my technical skills. Explore connections
                                        between technologies and discover how they work together.
                                    </p>
                                    <ul className="text-xs text-text-secondary leading-relaxed mb-4 text-left space-y-1">
                                        <li className="flex gap-2">
                                            <span className="text-text-primary">•</span>
                                            <span>Click nodes to view skill details</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-text-primary">•</span>
                                            <span>Search or type to find skills instantly</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-text-primary">•</span>
                                            <span>Filter by category using the legend</span>
                                        </li>
                                    </ul>
                                    <button
                                        onClick={closeWelcome}
                                        className={`${panelClass} px-3 py-1.5 flex items-center hover:bg-surface-light hover:border-border-light transition-all duration-200 btn-secondary-shine`}
                                    >
                                        <span className="text-xs text-text-primary">Beautiful!</span>
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
