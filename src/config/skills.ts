import {
  Database, Brain, Cloud, Server, Code2,
  GitBranch, Terminal, Cpu, HardDrive, Network, Lock,
  Workflow, FileCode, Container, Layers, Boxes, Gauge,
  LineChart, Table, FileJson, Sparkles, Zap,
  LucideIcon
} from 'lucide-react'

/**
 * Skills Configuration
 * 
 * Central configuration for all skills displayed in the portfolio.
 * Each skill has: title, icon, description, experience, and use cases.
 * Skills are organized into rows for the marquee display.
 */

export interface SkillConfig {
  title: string
  icon: LucideIcon
  description: string
  shortDescription?: string  // 3-10 words for graph hover tooltip
  experience?: string
  useCases?: string[]
  relatedTo?: string[]
}

// =============================================================================
// GRAPH HUB CONFIGURATION
// Defines the hierarchical structure for the Skill Galaxy graph
// =============================================================================

export interface GraphHub {
  id: string
  name: string
  type: 'main' | 'category'
  parentHub?: string  // For category hubs, references the parent hub id
  description?: string
  shortDescription?: string
}

/**
 * Hub nodes for the Skill Galaxy graph
 * Structure: Main Hub -> Category Hubs -> Individual Skills
 */
export const graphHubs: GraphHub[] = [
  // Main hub
  {
    id: 'hub-skills',
    name: 'Skills',
    type: 'main',
    description: 'Technical skills and competencies spanning data engineering, programming, cloud infrastructure, and machine learning. Each category represents a core area of expertise with interconnected technologies.',
    shortDescription: 'Core technical competencies',
  },

  // Category sub-hubs (all linked to the main hub)
  {
    id: 'hub-data-engineering',
    name: 'Data Engineering',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Building robust data pipelines, ETL processes, and data infrastructure. Expertise in batch and stream processing, data warehousing, and orchestration tools.',
    shortDescription: 'Pipelines & data infrastructure',
  },
  {
    id: 'hub-programming',
    name: 'Programming',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Software development across multiple languages and paradigms. From Python for data work to Go for systems, with strong API design and version control practices.',
    shortDescription: 'Languages & development',
  },
  {
    id: 'hub-cloud',
    name: 'Cloud',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Cloud platform expertise across AWS, GCP, and Azure. Infrastructure as code, container orchestration, CI/CD pipelines, and observability.',
    shortDescription: 'Cloud & infrastructure',
  },
  {
    id: 'hub-ml-analytics',
    name: 'ML & Analytics',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Machine learning frameworks, MLOps practices, and data visualization. From model development to production deployment and analytics dashboards.',
    shortDescription: 'ML & data analytics',
  },
]

/**
 * Maps category names to their hub IDs
 */
export const categoryToHub: Record<string, string> = {
  'Data Engineering': 'hub-data-engineering',
  'Programming': 'hub-programming',
  'Cloud': 'hub-cloud',
  'ML & Analytics': 'hub-ml-analytics',
}

/**
 * Category colors for visual distinction
 * Used in Skill Galaxy graph and skill detail modals
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Data Engineering': '#3b82f6',  // Blue - reliable, technical
  'Programming': '#a855f7',        // Purple - creative, logical 
  'Cloud': '#06b6d4',              // Cyan - modern, scalable
  'ML & Analytics': '#f59e0b',     // Amber - intelligent, warm
}

// =============================================================================
// ROW 1: Data Engineering & ETL
// =============================================================================

export const dataEngineeringSkills: SkillConfig[] = [
  {
    title: 'Apache Spark',
    icon: Zap,
    description: 'Distributed data processing framework for large-scale analytics and ETL workloads. Expertise in PySpark, Spark SQL, and optimizing cluster performance.',
    experience: '4+ years',
    useCases: ['Batch processing', 'Data lake pipelines', 'ML feature engineering'],
    relatedTo: ['Python', 'Scala', 'Databricks', 'ETL Pipelines', 'AWS', 'Data Warehousing'],
  },
  {
    title: 'Apache Kafka',
    icon: Workflow,
    description: 'Event streaming platform for building real-time data pipelines. Experience with Kafka Streams, Connect, and Schema Registry.',
    experience: '3+ years',
    useCases: ['Event sourcing', 'Real-time analytics', 'Microservices communication'],
    relatedTo: ['Stream Processing', 'Python', 'Kubernetes', 'Docker', 'REST APIs'],
  },
  {
    title: 'Apache Airflow',
    icon: Workflow,
    description: 'Workflow orchestration platform for scheduling and monitoring data pipelines. Building DAGs, custom operators, and integrations.',
    experience: '3+ years',
    useCases: ['ETL orchestration', 'Data quality checks', 'Scheduled reporting'],
    relatedTo: ['Python', 'ETL Pipelines', 'Docker', 'AWS', 'GCP', 'Kubernetes'],
  },
  {
    title: 'dbt',
    icon: Database,
    description: 'Data transformation tool for analytics engineering. Writing modular SQL models, tests, and documentation.',
    experience: '2+ years',
    useCases: ['Data modeling', 'Analytics transformations', 'Data documentation'],
    relatedTo: ['SQL', 'Snowflake', 'BigQuery', 'Data Warehousing', 'Git'],
  },
  {
    title: 'Snowflake',
    icon: Database,
    description: 'Cloud data warehouse with separation of storage and compute. Query optimization, data sharing, and Snowpipe.',
    experience: '3+ years',
    useCases: ['Data warehousing', 'Analytics', 'Data sharing'],
    relatedTo: ['SQL', 'dbt', 'Data Warehousing', 'AWS', 'Python', 'ETL Pipelines'],
  },
  {
    title: 'BigQuery',
    icon: Table,
    description: 'Google Cloud serverless data warehouse. Expertise in SQL optimization, partitioning, and cost management.',
    experience: '3+ years',
    useCases: ['Large-scale analytics', 'ML integration', 'BI reporting'],
    relatedTo: ['SQL', 'GCP', 'dbt', 'Data Warehousing', 'Data Visualization'],
  },
  {
    title: 'Databricks',
    icon: Sparkles,
    description: 'Unified analytics platform combining data engineering, science, and analytics. Delta Lake, MLflow integration.',
    experience: '2+ years',
    useCases: ['Lakehouse architecture', 'Collaborative notebooks', 'ML workflows'],
    relatedTo: ['Apache Spark', 'Python', 'SQL', 'MLOps', 'AWS', 'Azure'],
  },
  {
    title: 'ETL Pipelines',
    icon: Workflow,
    description: 'Designing and implementing Extract, Transform, Load processes for data integration across systems.',
    experience: '5+ years',
    useCases: ['Data integration', 'Data migration', 'Warehouse loading'],
    relatedTo: ['Apache Spark', 'Apache Airflow', 'Python', 'SQL', 'Data Warehousing'],
  },
  {
    title: 'Data Warehousing',
    icon: HardDrive,
    description: 'Designing dimensional models, star schemas, and data vault architectures for analytical workloads.',
    experience: '4+ years',
    useCases: ['Business intelligence', 'Historical analysis', 'Reporting'],
    relatedTo: ['Snowflake', 'BigQuery', 'SQL', 'ETL Pipelines', 'Data Visualization'],
  },
  {
    title: 'Stream Processing',
    icon: Zap,
    description: 'Building real-time data pipelines with sub-second latency using Kafka Streams, Flink, and Spark Streaming.',
    experience: '3+ years',
    useCases: ['Real-time dashboards', 'Fraud detection', 'IoT data processing'],
    relatedTo: ['Apache Kafka', 'Apache Spark', 'Python', 'Redis', 'Kubernetes'],
  },
]

// =============================================================================
// ROW 2: Programming & Development
// =============================================================================

export const programmingSkills: SkillConfig[] = [
  {
    title: 'Python',
    icon: Code2,
    description: 'Primary language for data engineering and ML. Expertise in pandas, numpy, and async programming.',
    experience: '6+ years',
    useCases: ['Data pipelines', 'API development', 'Automation scripts'],
    relatedTo: ['Apache Spark', 'TensorFlow', 'PyTorch', 'REST APIs', 'SQL', 'Apache Airflow'],
  },
  {
    title: 'SQL',
    icon: Database,
    description: 'Advanced SQL for analytics, optimization, and database design. Window functions, CTEs, and query tuning.',
    experience: '6+ years',
    useCases: ['Data analysis', 'ETL logic', 'Database design'],
    relatedTo: ['PostgreSQL', 'Snowflake', 'BigQuery', 'dbt', 'Data Warehousing'],
  },
  {
    title: 'Scala',
    icon: Code2,
    description: 'Functional programming for Spark applications. Type-safe data transformations and library development.',
    experience: '2+ years',
    useCases: ['Spark jobs', 'Functional ETL', 'Type-safe pipelines'],
    relatedTo: ['Apache Spark', 'Apache Kafka', 'ETL Pipelines'],
  },
  {
    title: 'TypeScript',
    icon: FileCode,
    description: 'Type-safe JavaScript for frontend and Node.js applications. React, Next.js, and API development.',
    experience: '3+ years',
    useCases: ['Web applications', 'API services', 'Tooling'],
    relatedTo: ['REST APIs', 'GraphQL', 'Git', 'Docker'],
  },
  {
    title: 'Go',
    icon: Code2,
    description: 'High-performance systems programming. Building CLI tools, microservices, and data utilities.',
    experience: '2+ years',
    useCases: ['Microservices', 'CLI tools', 'High-throughput services'],
    relatedTo: ['Kubernetes', 'Docker', 'REST APIs', 'CI/CD'],
  },
  {
    title: 'Rust',
    icon: Code2,
    description: 'Systems programming for performance-critical data tools. Memory-safe and concurrent applications.',
    experience: '1+ year',
    useCases: ['Data processing tools', 'Performance optimization', 'WASM'],
    relatedTo: ['Go', 'Linux', 'Docker'],
  },
  {
    title: 'Git',
    icon: GitBranch,
    description: 'Version control workflows, branching strategies, and collaborative development practices.',
    experience: '6+ years',
    useCases: ['Code versioning', 'Team collaboration', 'CI/CD integration'],
    relatedTo: ['CI/CD', 'Shell/Bash', 'dbt'],
  },
  {
    title: 'REST APIs',
    icon: Network,
    description: 'Designing and implementing RESTful services. OpenAPI specifications, authentication, and rate limiting.',
    experience: '5+ years',
    useCases: ['Service integration', 'Data endpoints', 'Microservices'],
    relatedTo: ['Python', 'TypeScript', 'Go', 'GraphQL', 'Security'],
  },
  {
    title: 'GraphQL',
    icon: Network,
    description: 'Query language for APIs with efficient data fetching. Schema design and resolver implementation.',
    experience: '2+ years',
    useCases: ['Flexible APIs', 'Frontend integration', 'Data aggregation'],
    relatedTo: ['TypeScript', 'REST APIs', 'PostgreSQL'],
  },
  {
    title: 'Shell/Bash',
    icon: Terminal,
    description: 'Scripting for automation, deployment, and system administration tasks.',
    experience: '5+ years',
    useCases: ['Automation', 'DevOps scripts', 'System administration'],
    relatedTo: ['Linux', 'Docker', 'Git', 'CI/CD'],
  },
]

// =============================================================================
// ROW 3: Cloud & Infrastructure
// =============================================================================

export const cloudSkills: SkillConfig[] = [
  {
    title: 'AWS',
    icon: Cloud,
    description: 'Cloud platform expertise. S3, Redshift, Lambda, Glue, EMR, and data-focused services.',
    experience: '4+ years',
    useCases: ['Data lakes', 'Serverless ETL', 'Cloud architecture'],
    relatedTo: ['Terraform', 'Kubernetes', 'Apache Spark', 'Snowflake', 'Docker'],
  },
  {
    title: 'GCP',
    icon: Cloud,
    description: 'Google Cloud Platform services. BigQuery, Dataflow, Cloud Functions, and data engineering tools.',
    experience: '3+ years',
    useCases: ['Analytics workloads', 'ML pipelines', 'Data processing'],
    relatedTo: ['BigQuery', 'Terraform', 'Kubernetes', 'TensorFlow', 'Apache Airflow'],
  },
  {
    title: 'Azure',
    icon: Cloud,
    description: 'Microsoft cloud services. Synapse Analytics, Data Factory, and Azure ML integration.',
    experience: '2+ years',
    useCases: ['Enterprise data', 'Hybrid cloud', 'BI integration'],
    relatedTo: ['Terraform', 'Databricks', 'Kubernetes', 'Docker'],
  },
  {
    title: 'Kubernetes',
    icon: Container,
    description: 'Container orchestration for scalable data applications. Helm charts, operators, and cluster management.',
    experience: '3+ years',
    useCases: ['Scalable deployments', 'Data platform infrastructure', 'Auto-scaling'],
    relatedTo: ['Docker', 'AWS', 'GCP', 'Terraform', 'Go', 'Monitoring'],
  },
  {
    title: 'Docker',
    icon: Boxes,
    description: 'Containerization for reproducible environments. Multi-stage builds and optimization.',
    experience: '4+ years',
    useCases: ['Dev environments', 'CI/CD', 'Microservices'],
    relatedTo: ['Kubernetes', 'CI/CD', 'Linux', 'Python', 'Go'],
  },
  {
    title: 'Terraform',
    icon: Layers,
    description: 'Infrastructure as Code for cloud resource management. Modules, state management, and best practices.',
    experience: '3+ years',
    useCases: ['Cloud provisioning', 'Infrastructure automation', 'Multi-cloud'],
    relatedTo: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Git'],
  },
  {
    title: 'CI/CD',
    icon: Workflow,
    description: 'Continuous integration and deployment pipelines. GitHub Actions, GitLab CI, and Jenkins.',
    experience: '4+ years',
    useCases: ['Automated testing', 'Deployment automation', 'Quality gates'],
    relatedTo: ['Git', 'Docker', 'Kubernetes', 'Shell/Bash', 'Terraform'],
  },
  {
    title: 'Linux',
    icon: Terminal,
    description: 'System administration and server management. Performance tuning and troubleshooting.',
    experience: '5+ years',
    useCases: ['Server management', 'Performance tuning', 'Scripting'],
    relatedTo: ['Shell/Bash', 'Docker', 'Rust', 'Go', 'Monitoring'],
  },
  {
    title: 'Monitoring',
    icon: Gauge,
    description: 'Observability and alerting with Prometheus, Grafana, and Datadog. Pipeline health monitoring.',
    experience: '3+ years',
    useCases: ['System observability', 'Alerting', 'Performance dashboards'],
    relatedTo: ['Kubernetes', 'Linux', 'Data Visualization', 'Docker'],
  },
  {
    title: 'Security',
    icon: Lock,
    description: 'Data security best practices. Encryption, access control, and compliance requirements.',
    experience: '3+ years',
    useCases: ['Data protection', 'Access management', 'Compliance'],
    relatedTo: ['AWS', 'Kubernetes', 'REST APIs', 'Linux'],
  },
]

// =============================================================================
// ROW 4: ML/AI & Analytics
// =============================================================================

export const mlAnalyticsSkills: SkillConfig[] = [
  {
    title: 'TensorFlow',
    icon: Brain,
    description: 'Deep learning framework for building and deploying ML models. TensorFlow Extended for production.',
    experience: '3+ years',
    useCases: ['Neural networks', 'Model deployment', 'Transfer learning'],
    relatedTo: ['Python', 'PyTorch', 'GCP', 'MLOps', 'Feature Engineering'],
  },
  {
    title: 'PyTorch',
    icon: Brain,
    description: 'Dynamic deep learning framework. Research-oriented model development and experimentation.',
    experience: '2+ years',
    useCases: ['Model prototyping', 'Research', 'Custom architectures'],
    relatedTo: ['Python', 'TensorFlow', 'Scikit-learn', 'MLOps'],
  },
  {
    title: 'Scikit-learn',
    icon: Cpu,
    description: 'Machine learning library for classical algorithms. Feature engineering and model evaluation.',
    experience: '4+ years',
    useCases: ['Classification', 'Regression', 'Clustering'],
    relatedTo: ['Python', 'Feature Engineering', 'PyTorch', 'Data Visualization'],
  },
  {
    title: 'MLOps',
    icon: Workflow,
    description: 'Machine learning operations for model lifecycle. MLflow, model versioning, and A/B testing.',
    experience: '2+ years',
    useCases: ['Model deployment', 'Experiment tracking', 'Model monitoring'],
    relatedTo: ['Databricks', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes'],
  },
  {
    title: 'Feature Engineering',
    icon: Sparkles,
    description: 'Creating predictive features from raw data. Feature stores and automated feature pipelines.',
    experience: '3+ years',
    useCases: ['ML pipelines', 'Data transformation', 'Feature stores'],
    relatedTo: ['Python', 'Apache Spark', 'Scikit-learn', 'SQL'],
  },
  {
    title: 'PostgreSQL',
    icon: Server,
    description: 'Advanced relational database. Extensions, partitioning, and performance optimization.',
    experience: '5+ years',
    useCases: ['Application databases', 'Analytics', 'Data storage'],
    relatedTo: ['SQL', 'Python', 'GraphQL', 'REST APIs'],
  },
  {
    title: 'MongoDB',
    icon: Database,
    description: 'Document database for flexible data models. Aggregation pipelines and indexing strategies.',
    experience: '3+ years',
    useCases: ['Document storage', 'Flexible schemas', 'Real-time apps'],
    relatedTo: ['Python', 'REST APIs', 'Elasticsearch', 'Redis'],
  },
  {
    title: 'Redis',
    icon: Zap,
    description: 'In-memory data store for caching and real-time applications. Pub/sub and data structures.',
    experience: '3+ years',
    useCases: ['Caching', 'Session storage', 'Real-time features'],
    relatedTo: ['Stream Processing', 'Python', 'Docker', 'MongoDB'],
  },
  {
    title: 'Elasticsearch',
    icon: FileJson,
    description: 'Search and analytics engine. Full-text search, log analysis, and aggregations.',
    experience: '3+ years',
    useCases: ['Search', 'Log analytics', 'Metrics'],
    relatedTo: ['Monitoring', 'MongoDB', 'Python', 'Kubernetes'],
  },
  {
    title: 'Data Visualization',
    icon: LineChart,
    description: 'Creating insightful dashboards and reports. Tableau, Looker, and custom visualizations.',
    experience: '4+ years',
    useCases: ['Dashboards', 'Reporting', 'Data storytelling'],
    relatedTo: ['BigQuery', 'Data Warehousing', 'SQL', 'Monitoring'],
  },
]

// =============================================================================
// ALL SKILLS (for lookup by title)
// =============================================================================

export const allSkills: SkillConfig[] = [
  ...dataEngineeringSkills,
  ...programmingSkills,
  ...cloudSkills,
  ...mlAnalyticsSkills,
]

/**
 * Skill categories for graph node coloring
 */
export const skillCategories: Record<string, SkillConfig[]> = {
  'Data Engineering': dataEngineeringSkills,
  'Programming': programmingSkills,
  'Cloud': cloudSkills,
  'ML & Analytics': mlAnalyticsSkills,
}

/**
 * Get skill category by title
 */
export function getSkillCategory(title: string): string | undefined {
  for (const [category, skills] of Object.entries(skillCategories)) {
    if (skills.some(s => s.title === title)) {
      return category
    }
  }
  return undefined
}

/**
 * Get skill by title
 */
export function getSkillByTitle(title: string): SkillConfig | undefined {
  return allSkills.find(skill => skill.title === title)
}

// =============================================================================
// SKILL ROWS CONFIGURATION
// =============================================================================

export interface SkillRow {
  skills: SkillConfig[]
  direction: 'left' | 'right'
}

export const skillRows: SkillRow[] = [
  { skills: dataEngineeringSkills, direction: 'right' },
  { skills: programmingSkills, direction: 'left' },
  { skills: cloudSkills, direction: 'right' },
  { skills: mlAnalyticsSkills, direction: 'left' },
]
