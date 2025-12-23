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
    description: string     // Full description for preview panel (supports \n\n for paragraphs)
    tech: string[]
    isPrivate?: boolean     // If true, project is private/confidential (no links shown)
    github?: string         // Optional - only shown if defined and not private
    live?: string           // Optional - only shown if defined and not private
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
        description: `A production-grade streaming data pipeline designed to handle high-throughput event ingestion with sub-second latency. Built with Apache Kafka for message queuing and Apache Flink for stream processing, the system processes over 10 million events daily.

The architecture implements exactly-once semantics, automatic schema evolution, and comprehensive dead-letter queue handling for failed messages. Custom monitoring dashboards provide real-time visibility into throughput, latency percentiles, and consumer lag.

Key challenges solved include handling backpressure during traffic spikes, implementing efficient state management for windowed aggregations, and ensuring data consistency across distributed consumers.`,
        tech: ['Apache Kafka', 'Flink', 'Python', 'AWS'],
        isPrivate: false,
        github: '#',
        live: '#',
    },
    {
        id: 'quality',
        title: 'Data Quality Framework',
        fileName: 'quality.md',
        folder: 'data-engineering',
        summary: 'Automated data validation and monitoring',
        description: `An enterprise-grade data quality framework that automates validation, profiling, and anomaly detection across all production data pipelines. Integrates seamlessly with existing ETL workflows to catch issues before they impact downstream consumers.

The system features a declarative rule engine supporting custom SQL-based checks, statistical profiling, and ML-powered anomaly detection. Real-time alerts are delivered via Slack, PagerDuty, and email with contextual information to accelerate debugging.

Historical trend analysis enables teams to track data quality metrics over time, identify recurring issues, and measure the impact of schema changes or upstream modifications.`,
        tech: ['Great Expectations', 'Airflow', 'Grafana'],
        isPrivate: false,
        github: '#',
        live: '#',
    },
    {
        id: 'features',
        title: 'ML Feature Store',
        fileName: 'features.md',
        folder: 'machine-learning',
        summary: 'Centralized feature management platform',
        description: `A centralized feature management platform that bridges the gap between data engineering and machine learning teams. Provides consistent feature computation, storage, and serving across both training and inference environments.

Features include point-in-time correct historical feature retrieval for training, low-latency online serving via Redis, and automatic feature freshness monitoring. The lineage tracking system captures the full provenance of each feature from raw data to model input.

The platform reduced feature development time by 60% and eliminated training-serving skew that previously caused model performance degradation in production.`,
        tech: ['Python', 'Redis', 'PostgreSQL', 'Docker'],
        isPrivate: true,
    },
    {
        id: 'dashboard',
        title: 'Analytics Dashboard',
        fileName: 'dashboard.md',
        folder: 'visualization',
        summary: 'Interactive BI dashboard with drill-down',
        description: `An interactive business intelligence dashboard providing real-time visibility into key performance metrics. Built with React and D3.js, it features responsive visualizations, cross-filtering, and intuitive drill-down capabilities.

The backend leverages ClickHouse for sub-second query performance on billions of rows, with FastAPI providing a clean REST interface. Intelligent caching and query optimization ensure consistent performance even during peak usage.

Custom chart components include time-series with anomaly highlighting, cohort analysis views, and geographic heatmaps. The dashboard supports scheduled PDF exports and configurable alerting thresholds.`,
        tech: ['React', 'D3.js', 'FastAPI', 'ClickHouse'],
        isPrivate: false,
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
