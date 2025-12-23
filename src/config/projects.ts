import { LucideIcon, Brain, Server, Zap, Cpu, Workflow } from 'lucide-react'

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
    // ========================================
    // LLM ENGINEERING (3 projects)
    // ========================================
    {
        id: 'workflow-rag',
        title: 'Workflow Assistant RAG',
        fileName: 'workflow-assistant.md',
        folder: 'llm-engineering',
        summary: 'Natural language to JSON workflow converter using RAG',
        description: `Built a system to solve the pain of manually writing complex JSON configurations for workflow automation tools. The friction of looking up schema definitions and debugging missing commas made me realize we needed a natural language interface: just say "send an email when task duration exceeds 2 hours" and get valid, ready-to-use JSON.

The architecture intentionally avoids heavy vector databases in favor of a lightweight TF-IDF retriever using scikit-learn. For code generation, I found that exact keyword matching for field names and enum values often yields better context than semantic similarity. The retriever identifies the three most relevant reference configs, which surround the user's prompt. Reliability is enforced by passing the LLM's output through a strict \`jsonschema\` validator. If the generated JSON fails validation (missing required fields or wrong types), the system catches it immediately rather than shipping broken config to production.

This project taught me that for specialized code tasks, a rigid validation loop is far more important than a smarter model. Grounding the LLM in valid examples and constraining it with a schema turned a localized problem into a reliable utility.`,
        tech: ['Python', 'Flask', 'RAG Systems', 'Scikit-learn', 'Prompt Engineering'],
        isPrivate: false,
        github: 'https://github.com/Evalutik/workflow-assistant-rag',
    },
    {
        id: 'agent-reviewer',
        title: 'Multi-Agent Code Reviewer',
        fileName: 'agent-reviewer.md',
        folder: 'llm-engineering',
        summary: 'Autonomous LLM agents collaborating on code analysis',
        description: `Built a multi-agent system where specialized LLM agents review code from different perspectives: security vulnerabilities, performance bottlenecks, and code style issues. Each agent has access to static analysis tools and can query databases for known vulnerability patterns. The orchestrator aggregates findings and applies deduplication logic.

The key challenge was preventing agents from producing hallucinated tool calls. By enforcing strict Pydantic schemas on all tool inputs and outputs, malformed calls get rejected before execution. LangChain's agent framework handles the conversation flow, while Redis provides state checkpointing for long-running reviews.

Deduplication was trickier than expected. Multiple agents often flag the same code issue from different angles. The system tags each finding with category, severity, and affected line range, then applies merging rules to keep only the most specific finding when duplicates exist.`,
        tech: ['Python', 'LangChain', 'Prompt Engineering', 'Git', 'Redis', 'Docker'],
        isPrivate: true,
        github: '#',
    },
    {
        id: 'llm-eval',
        title: 'LLM Evaluation Framework',
        fileName: 'llm-eval.md',
        folder: 'llm-engineering',
        summary: 'Systematic evaluation with LLM-as-judge and drift detection',
        description: `Created an evaluation framework for LLM applications that goes beyond manual testing. The system supports three evaluation modes: golden dataset tests with ground truth labels, LLM-as-judge for subjective quality assessment, and regression tests comparing new model versions against production baselines.

For LLM-as-judge consistency, I developed rubrics with specific criteria for each score level and require the evaluator to explain reasoning before scoring. Weights & Biases tracks all experiment runs, enabling easy comparison across prompt iterations and model versions.

Production monitoring samples a percentage of live requests and runs them through lightweight evaluators. Prometheus metrics track quality scores over time, with Grafana dashboards showing drift alerts. The whole pipeline integrates with CI/CD so prompt changes automatically trigger evaluation runs.`,
        tech: ['Python', 'Weights & Biases', 'Prometheus', 'PostgreSQL', 'CI/CD', 'Grafana'],
        isPrivate: true,
        github: '#',
    },

    // ========================================
    // ML INFRASTRUCTURE (3 projects)
    // ========================================
    {
        id: 'feature-store',
        title: 'Feature Store Implementation',
        fileName: 'feature-store.md',
        folder: 'ml-infrastructure',
        summary: 'Online/offline feature serving with point-in-time correctness',
        description: `Implemented a feature store to eliminate training-serving skew that was silently degrading model performance. The offline path uses Apache Spark for computing historical features with point-in-time joins, ensuring models only see data that was available at prediction time.

The online serving layer uses Redis for sub-millisecond feature lookups. Batch features get pushed to Redis on schedule via Apache Airflow, while real-time features stream through Apache Kafka. Feature definitions live in a registry with metadata about source tables, transformation logic, and freshness SLAs.

Teams can discover and reuse features instead of rebuilding them from scratch. Lineage tracking records which upstream tables feed which features, so data quality issues can be traced to affected model predictions.`,
        tech: ['Python', 'Feature Stores', 'Redis', 'PostgreSQL', 'Apache Spark', 'Apache Airflow'],
        isPrivate: true,
    },
    {
        id: 'model-serving',
        title: 'Model Serving Platform',
        fileName: 'model-serving.md',
        folder: 'ml-infrastructure',
        summary: 'Canary deployments, shadow testing, and automatic rollback',
        description: `Built a model serving platform that treats ML deployments as first-class citizens. Canary releases gradually shift traffic to new models, automatically rolling back if error rates or latency spike. Shadow mode runs new models on production traffic without serving predictions for safe offline comparison.

The inference layer uses FastAPI with GPU batching to maximize throughput. Requests accumulate in a short buffer window before processing together, significantly improving GPU utilization over sequential processing. Kubernetes handles scaling and failover.

Prometheus and Grafana power the observability stack, tracking p50/p95/p99 latency, prediction distribution shifts, and data drift metrics. A/B tests use sticky user assignments to ensure consistent model behavior throughout user sessions.`,
        tech: ['Python', 'FastAPI', 'Kubernetes', 'Model Serving', 'Prometheus', 'Grafana'],
        isPrivate: true,
        github: '#',
    },
    {
        id: 'ml-cicd',
        title: 'ML CI/CD Pipeline',
        fileName: 'ml-cicd.md',
        folder: 'ml-infrastructure',
        summary: 'Automated testing, validation, and model promotion',
        description: `Designed a CI/CD pipeline specifically for machine learning workflows. The pipeline has four stages: data validation with Great Expectations catches drift before it corrupts training, model training runs in Docker containers with DVC-tracked datasets, evaluation compares metrics against production baselines, and promotion pushes passing models to the MLflow registry.

Tests are split into unit tests for feature transformation functions, integration tests on sample data, and model quality tests checking that key metrics don't regress. Making tests deterministic required careful seeding of random generators and testing metric ranges rather than exact values.

The pipeline runs on every PR that touches model code or training configs. GitHub Actions orchestrates the workflow, with clear pass/fail signals and metric diffs posted directly to PR comments.`,
        tech: ['Python', 'CI/CD', 'DVC', 'MLflow', 'Great Expectations', 'Docker'],
        isPrivate: true,
        github: '#',
    },

    // ========================================
    // REAL-TIME SYSTEMS (2 projects)
    // ========================================
    {
        id: 'fraud-detection',
        title: 'Real-Time Fraud Detection',
        fileName: 'fraud-detection.md',
        folder: 'real-time-systems',
        summary: 'Sub-100ms inference with streaming feature aggregation',
        description: `Built a fraud detection system that scores transactions within 100ms end-to-end. Apache Kafka handles event ingestion, while Apache Flink computes streaming features like transaction velocity and deviation from user spending patterns. Static features live in Redis for fast lookups.

The model uses gradient boosting (trained with Scikit-learn) because tree models are fast at inference and handle tabular data well. Features capture transaction velocity, merchant risk signals, and behavioral anomalies compared to user history.

Late-arriving events are handled with Flink watermarks that allow a 30-second tolerance window. The biggest lesson was that real-time ML is primarily an engineering challenge. Getting Kafka partitioning, Flink parallelism, and Redis connection pooling right mattered more than model architecture choices.`,
        tech: ['Python', 'Apache Kafka', 'Apache Flink', 'Redis', 'Scikit-learn', 'Docker'],
        isPrivate: true,
    },
    {
        id: 'realtime-recsys',
        title: 'Event-Driven Recommendations',
        fileName: 'realtime-recsys.md',
        folder: 'real-time-systems',
        summary: 'Personalized rankings updating instantly with user signals',
        description: `Created a recommendation system that responds to user behavior in real-time. Batch-trained embeddings from a two-tower TensorFlow model get indexed in FAISS for fast approximate nearest-neighbor retrieval. Real-time personalization happens in the re-ranking layer.

User interaction events stream through Apache Kafka to update short-term preference profiles stored in Redis. When serving recommendations, candidates come from FAISS, then scores adjust based on recent clicks and category interactions. The re-ranker is intentionally simple to stay within latency budget.

Cold-start users get popularity-based results filtered by context signals. The FastAPI serving layer handles request routing and A/B test assignment. Balancing exploration vs exploitation required constant tuning—showing only high-confidence items leads to filter bubbles.`,
        tech: ['Python', 'TensorFlow', 'FAISS', 'Apache Kafka', 'Redis', 'FastAPI'],
        isPrivate: true,
        github: '#',
    },

    // ========================================
    // SYSTEMS ENGINEERING (3 projects)
    // ========================================
    {
        id: 'distributed-kv',
        title: 'Distributed Key-Value Store',
        fileName: 'distributed-kv.md',
        folder: 'systems-engineering',
        summary: 'Consistent hashing, replication, and failure handling',
        description: `Built a distributed key-value store from scratch to deeply understand systems like DynamoDB and Cassandra. Consistent hashing with virtual nodes partitions data across the cluster. Each key hashes to a ring position, and walking clockwise identifies responsible nodes.

Writes replicate to N nodes (configurable, default 3). Quorum configuration ensures consistency at the cost of availability during network partitions. Vector clocks track causality for conflict resolution when replicas diverge. A gossip protocol handles failure detection through random peer pinging.

The implementation uses Go for its excellent concurrency primitives and gRPC for inter-node communication. Docker Compose enables local multi-node testing. This project gave me real appreciation for CAP theorem tradeoffs in practice.`,
        tech: ['Go', 'REST APIs', 'Docker', 'Linux', 'Data Structures'],
        isPrivate: true,
        github: '#',
    },
    {
        id: 'query-engine',
        title: 'Custom Query Engine',
        fileName: 'query-engine.md',
        folder: 'systems-engineering',
        summary: 'SQL parser, optimizer, and columnar execution',
        description: `Built a query engine that parses SQL, optimizes query plans, and executes against columnar Parquet files. The parser uses recursive descent to build an abstract syntax tree supporting SELECT, WHERE, JOINs, GROUP BY, and ORDER BY clauses.

Query optimization applies rewrite rules to the logical plan: predicate pushdown moves filters closer to data sources, projection pruning eliminates unused columns, and join reordering uses cost-based heuristics. The physical plan uses the volcano execution model where each operator implements open/next/close.

Written in Rust for performance and memory safety. Apache Arrow provides the in-memory columnar format, enabling vectorized processing of 1024-row batches instead of row-at-a-time execution. This project demystified how databases turn SQL text into efficient data retrieval.`,
        tech: ['Rust', 'SQL', 'Data Structures', 'Design Patterns', 'Linux'],
        isPrivate: true,
        github: '#',
    },
    {
        id: 'mini-k8s',
        title: 'Container Orchestrator',
        fileName: 'mini-k8s.md',
        folder: 'systems-engineering',
        summary: 'Scheduling, health checks, and service discovery',
        description: `Created a mini container orchestrator to understand what happens when you run kubectl apply. The scheduler assigns containers to nodes based on available CPU and memory, using bin-packing heuristics to optimize resource utilization.

Health checking implements liveness probes (restart crashed containers) and readiness probes (remove unhealthy pods from load balancing). HTTP, TCP, and exec probe types are all supported. Service discovery uses DNS—each service gets a name that resolves to healthy pod IPs, with records updating automatically as pods scale.

Built in Go using the Docker API for container lifecycle management. State synchronization follows a controller pattern that continuously reconciles desired vs actual state. This turned Kubernetes from a black box into an understandable system I can reason about.`,
        tech: ['Go', 'Docker', 'Kubernetes', 'REST APIs', 'Linux'],
        isPrivate: true,
        github: '#',
    },
]

/**
 * Folder icons mapping - customize icons per folder
 */
export const folderIcons: Record<string, LucideIcon> = {
    'llm-engineering': Brain,
    'ml-infrastructure': Server,
    'real-time-systems': Zap,
    'systems-engineering': Cpu,
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
