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
  experience?: string
  useCases?: string[]
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
  },
  {
    title: 'Apache Kafka',
    icon: Workflow,
    description: 'Event streaming platform for building real-time data pipelines. Experience with Kafka Streams, Connect, and Schema Registry.',
    experience: '3+ years',
    useCases: ['Event sourcing', 'Real-time analytics', 'Microservices communication'],
  },
  {
    title: 'Apache Airflow',
    icon: Workflow,
    description: 'Workflow orchestration platform for scheduling and monitoring data pipelines. Building DAGs, custom operators, and integrations.',
    experience: '3+ years',
    useCases: ['ETL orchestration', 'Data quality checks', 'Scheduled reporting'],
  },
  {
    title: 'dbt',
    icon: Database,
    description: 'Data transformation tool for analytics engineering. Writing modular SQL models, tests, and documentation.',
    experience: '2+ years',
    useCases: ['Data modeling', 'Analytics transformations', 'Data documentation'],
  },
  {
    title: 'Snowflake',
    icon: Database,
    description: 'Cloud data warehouse with separation of storage and compute. Query optimization, data sharing, and Snowpipe.',
    experience: '3+ years',
    useCases: ['Data warehousing', 'Analytics', 'Data sharing'],
  },
  {
    title: 'BigQuery',
    icon: Table,
    description: 'Google Cloud serverless data warehouse. Expertise in SQL optimization, partitioning, and cost management.',
    experience: '3+ years',
    useCases: ['Large-scale analytics', 'ML integration', 'BI reporting'],
  },
  {
    title: 'Databricks',
    icon: Sparkles,
    description: 'Unified analytics platform combining data engineering, science, and analytics. Delta Lake, MLflow integration.',
    experience: '2+ years',
    useCases: ['Lakehouse architecture', 'Collaborative notebooks', 'ML workflows'],
  },
  {
    title: 'ETL Pipelines',
    icon: Workflow,
    description: 'Designing and implementing Extract, Transform, Load processes for data integration across systems.',
    experience: '5+ years',
    useCases: ['Data integration', 'Data migration', 'Warehouse loading'],
  },
  {
    title: 'Data Warehousing',
    icon: HardDrive,
    description: 'Designing dimensional models, star schemas, and data vault architectures for analytical workloads.',
    experience: '4+ years',
    useCases: ['Business intelligence', 'Historical analysis', 'Reporting'],
  },
  {
    title: 'Stream Processing',
    icon: Zap,
    description: 'Building real-time data pipelines with sub-second latency using Kafka Streams, Flink, and Spark Streaming.',
    experience: '3+ years',
    useCases: ['Real-time dashboards', 'Fraud detection', 'IoT data processing'],
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
  },
  {
    title: 'SQL',
    icon: Database,
    description: 'Advanced SQL for analytics, optimization, and database design. Window functions, CTEs, and query tuning.',
    experience: '6+ years',
    useCases: ['Data analysis', 'ETL logic', 'Database design'],
  },
  {
    title: 'Scala',
    icon: Code2,
    description: 'Functional programming for Spark applications. Type-safe data transformations and library development.',
    experience: '2+ years',
    useCases: ['Spark jobs', 'Functional ETL', 'Type-safe pipelines'],
  },
  {
    title: 'TypeScript',
    icon: FileCode,
    description: 'Type-safe JavaScript for frontend and Node.js applications. React, Next.js, and API development.',
    experience: '3+ years',
    useCases: ['Web applications', 'API services', 'Tooling'],
  },
  {
    title: 'Go',
    icon: Code2,
    description: 'High-performance systems programming. Building CLI tools, microservices, and data utilities.',
    experience: '2+ years',
    useCases: ['Microservices', 'CLI tools', 'High-throughput services'],
  },
  {
    title: 'Rust',
    icon: Code2,
    description: 'Systems programming for performance-critical data tools. Memory-safe and concurrent applications.',
    experience: '1+ year',
    useCases: ['Data processing tools', 'Performance optimization', 'WASM'],
  },
  {
    title: 'Git',
    icon: GitBranch,
    description: 'Version control workflows, branching strategies, and collaborative development practices.',
    experience: '6+ years',
    useCases: ['Code versioning', 'Team collaboration', 'CI/CD integration'],
  },
  {
    title: 'REST APIs',
    icon: Network,
    description: 'Designing and implementing RESTful services. OpenAPI specifications, authentication, and rate limiting.',
    experience: '5+ years',
    useCases: ['Service integration', 'Data endpoints', 'Microservices'],
  },
  {
    title: 'GraphQL',
    icon: Network,
    description: 'Query language for APIs with efficient data fetching. Schema design and resolver implementation.',
    experience: '2+ years',
    useCases: ['Flexible APIs', 'Frontend integration', 'Data aggregation'],
  },
  {
    title: 'Shell/Bash',
    icon: Terminal,
    description: 'Scripting for automation, deployment, and system administration tasks.',
    experience: '5+ years',
    useCases: ['Automation', 'DevOps scripts', 'System administration'],
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
  },
  {
    title: 'GCP',
    icon: Cloud,
    description: 'Google Cloud Platform services. BigQuery, Dataflow, Cloud Functions, and data engineering tools.',
    experience: '3+ years',
    useCases: ['Analytics workloads', 'ML pipelines', 'Data processing'],
  },
  {
    title: 'Azure',
    icon: Cloud,
    description: 'Microsoft cloud services. Synapse Analytics, Data Factory, and Azure ML integration.',
    experience: '2+ years',
    useCases: ['Enterprise data', 'Hybrid cloud', 'BI integration'],
  },
  {
    title: 'Kubernetes',
    icon: Container,
    description: 'Container orchestration for scalable data applications. Helm charts, operators, and cluster management.',
    experience: '3+ years',
    useCases: ['Scalable deployments', 'Data platform infrastructure', 'Auto-scaling'],
  },
  {
    title: 'Docker',
    icon: Boxes,
    description: 'Containerization for reproducible environments. Multi-stage builds and optimization.',
    experience: '4+ years',
    useCases: ['Dev environments', 'CI/CD', 'Microservices'],
  },
  {
    title: 'Terraform',
    icon: Layers,
    description: 'Infrastructure as Code for cloud resource management. Modules, state management, and best practices.',
    experience: '3+ years',
    useCases: ['Cloud provisioning', 'Infrastructure automation', 'Multi-cloud'],
  },
  {
    title: 'CI/CD',
    icon: Workflow,
    description: 'Continuous integration and deployment pipelines. GitHub Actions, GitLab CI, and Jenkins.',
    experience: '4+ years',
    useCases: ['Automated testing', 'Deployment automation', 'Quality gates'],
  },
  {
    title: 'Linux',
    icon: Terminal,
    description: 'System administration and server management. Performance tuning and troubleshooting.',
    experience: '5+ years',
    useCases: ['Server management', 'Performance tuning', 'Scripting'],
  },
  {
    title: 'Monitoring',
    icon: Gauge,
    description: 'Observability and alerting with Prometheus, Grafana, and Datadog. Pipeline health monitoring.',
    experience: '3+ years',
    useCases: ['System observability', 'Alerting', 'Performance dashboards'],
  },
  {
    title: 'Security',
    icon: Lock,
    description: 'Data security best practices. Encryption, access control, and compliance requirements.',
    experience: '3+ years',
    useCases: ['Data protection', 'Access management', 'Compliance'],
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
  },
  {
    title: 'PyTorch',
    icon: Brain,
    description: 'Dynamic deep learning framework. Research-oriented model development and experimentation.',
    experience: '2+ years',
    useCases: ['Model prototyping', 'Research', 'Custom architectures'],
  },
  {
    title: 'Scikit-learn',
    icon: Cpu,
    description: 'Machine learning library for classical algorithms. Feature engineering and model evaluation.',
    experience: '4+ years',
    useCases: ['Classification', 'Regression', 'Clustering'],
  },
  {
    title: 'MLOps',
    icon: Workflow,
    description: 'Machine learning operations for model lifecycle. MLflow, model versioning, and A/B testing.',
    experience: '2+ years',
    useCases: ['Model deployment', 'Experiment tracking', 'Model monitoring'],
  },
  {
    title: 'Feature Engineering',
    icon: Sparkles,
    description: 'Creating predictive features from raw data. Feature stores and automated feature pipelines.',
    experience: '3+ years',
    useCases: ['ML pipelines', 'Data transformation', 'Feature stores'],
  },
  {
    title: 'PostgreSQL',
    icon: Server,
    description: 'Advanced relational database. Extensions, partitioning, and performance optimization.',
    experience: '5+ years',
    useCases: ['Application databases', 'Analytics', 'Data storage'],
  },
  {
    title: 'MongoDB',
    icon: Database,
    description: 'Document database for flexible data models. Aggregation pipelines and indexing strategies.',
    experience: '3+ years',
    useCases: ['Document storage', 'Flexible schemas', 'Real-time apps'],
  },
  {
    title: 'Redis',
    icon: Zap,
    description: 'In-memory data store for caching and real-time applications. Pub/sub and data structures.',
    experience: '3+ years',
    useCases: ['Caching', 'Session storage', 'Real-time features'],
  },
  {
    title: 'Elasticsearch',
    icon: FileJson,
    description: 'Search and analytics engine. Full-text search, log analysis, and aggregations.',
    experience: '3+ years',
    useCases: ['Search', 'Log analytics', 'Metrics'],
  },
  {
    title: 'Data Visualization',
    icon: LineChart,
    description: 'Creating insightful dashboards and reports. Tableau, Looker, and custom visualizations.',
    experience: '4+ years',
    useCases: ['Dashboards', 'Reporting', 'Data storytelling'],
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
