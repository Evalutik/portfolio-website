import { LucideIcon, Database, Brain, BarChart3, Workflow } from 'lucide-react'

/**
 * Project configuration
 */
export interface ProjectConfig {
    id: string
    title: string
    fileName: string        // Display name in tree (e.g., "pipeline.md")
    folder: string          // Folder to group under (flexible - just a string)
    summary: string         // Short one-liner for hover tooltip
    description: string     // Full description for preview panel
    tech: string[]
    github: string
    live: string
    icon?: LucideIcon       // Optional icon for the folder
}

/**
 * Folder configuration - derived from projects
 * Each unique folder gets its own section in the tree
 */
export interface FolderConfig {
    name: string
    icon: LucideIcon
    projects: ProjectConfig[]
}

/**
 * All projects - grouped by folder
 * Just set the `folder` property to any string to create/join a folder
 */
export const allProjects: ProjectConfig[] = [
    {
        id: 'pipeline',
        title: 'Real-Time Data Pipeline',
        fileName: 'pipeline.md',
        folder: 'data-engineering',
        summary: 'Streaming pipeline processing 10M+ events/day',
        description: 'Scalable streaming pipeline processing 10M+ events/day with sub-second latency using Kafka and Flink. Features auto-scaling, dead-letter queues, and comprehensive monitoring.',
        tech: ['Apache Kafka', 'Flink', 'Python', 'AWS'],
        github: '#',
        live: '#',
    },
    {
        id: 'quality',
        title: 'Data Quality Framework',
        fileName: 'quality.md',
        folder: 'data-engineering',
        summary: 'Automated data validation and monitoring',
        description: 'Automated data validation and monitoring system with alerting for production data pipelines. Includes custom rule engine, Slack notifications, and historical trend analysis.',
        tech: ['Great Expectations', 'Airflow', 'Grafana'],
        github: '#',
        live: '#',
    },
    {
        id: 'features',
        title: 'ML Feature Store',
        fileName: 'features.md',
        folder: 'machine-learning',
        summary: 'Centralized feature management platform',
        description: 'Centralized feature management platform enabling consistent feature serving across training and inference. Supports real-time and batch features with versioning.',
        tech: ['Python', 'Redis', 'PostgreSQL', 'Docker'],
        github: '#',
        live: '#',
    },
    {
        id: 'dashboard',
        title: 'Analytics Dashboard',
        fileName: 'dashboard.md',
        folder: 'visualization',
        summary: 'Interactive BI dashboard with drill-down',
        description: 'Interactive BI dashboard for real-time business metrics with drill-down capabilities. Features custom chart components, data caching, and export functionality.',
        tech: ['React', 'D3.js', 'FastAPI', 'ClickHouse'],
        github: '#',
        live: '#',
    },
]

/**
 * Folder icons mapping - customize icons per folder
 */
export const folderIcons: Record<string, LucideIcon> = {
    'data-engineering': Database,
    'machine-learning': Brain,
    'visualization': BarChart3,
    'default': Workflow,
}

/**
 * Get folder icon
 */
export function getFolderIcon(folderName: string): LucideIcon {
    return folderIcons[folderName] || folderIcons['default']
}

/**
 * Get projects grouped by folder
 */
export function getProjectsByFolder(): FolderConfig[] {
    const folderMap = new Map<string, ProjectConfig[]>()

    // Group projects by folder
    allProjects.forEach(project => {
        const existing = folderMap.get(project.folder) || []
        folderMap.set(project.folder, [...existing, project])
    })

    // Convert to FolderConfig array
    return Array.from(folderMap.entries()).map(([name, projects]) => ({
        name,
        icon: getFolderIcon(name),
        projects,
    }))
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): ProjectConfig | undefined {
    return allProjects.find(p => p.id === id)
}
