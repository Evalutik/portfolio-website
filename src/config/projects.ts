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
        tech: ['Python', 'Flask', 'OpenAI API', 'Scikit-learn', 'JSON Schema'],
        isPrivate: false,
        github: 'https://github.com/Evalutik/workflow-assistant-rag',
    },
    {
        id: 'agent-reviewer',
        title: 'Multi-Agent Code Reviewer',
        fileName: 'agent-reviewer.md',
        folder: 'llm-engineering',
        summary: 'Autonomous LLM agents collaborating on code analysis',
        description: `Multiple LLM agents that review code from different angles: security, performance, and style. Each agent has access to tools like Semgrep for security patterns and explain-plan queries for SQL performance. The orchestrator collects findings and removes duplicates before presenting a unified review.

Tool calling required strict validation. GPT-4 sometimes invents parameters that don't exist, so every tool input goes through Pydantic schemas that reject malformed calls. State checkpoints in LangGraph let the system resume if an agent times out mid-review.

The tricky part was preventing agents from repeating each other. Each finding gets tagged with category and severity, then the orchestrator applies deduplication rules. If two agents flag the same line for related reasons, only the more specific finding survives.

I learned that agent reliability comes from structured outputs, not clever prompts. Switching from free-form text to enforced JSON schemas cut error rates dramatically.`,
        tech: ['Python', 'LangGraph', 'OpenAI API', 'GitHub API', 'Redis', 'Docker'],
        isPrivate: false,
        github: '#',
    },
    {
        id: 'llm-eval',
        title: 'LLM Evaluation Framework',
        fileName: 'llm-eval.md',
        folder: 'llm-engineering',
        summary: 'Systematic evaluation with LLM-as-judge and drift detection',
        description: `An evaluation framework for LLM applications that goes beyond "looks good to me" testing. Three evaluation types: golden dataset tests with ground truth labels, LLM-as-judge for subjective qualities like helpfulness, and regression tests comparing new versions against production baselines.

LLM-as-judge needs careful prompting. Asking "rate this 1-10" gives noisy scores. I improved consistency by providing rubrics with specific criteria for each score level and requiring the judge to explain its reasoning before scoring. Production monitoring samples 5% of requests, runs them through a lightweight evaluator, and alerts on Slack when quality drops.

The whole thing integrates with GitHub Actions. PRs that touch prompts run the eval suite automatically, and the PR comment shows metrics diff. This project taught me that eval-driven development works: define expected behavior first, then iterate until you pass.`,
        tech: ['Python', 'Weights & Biases', 'Prometheus', 'PostgreSQL', 'GitHub Actions'],
        isPrivate: false,
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
        description: `A feature store that solves training-serving skew. Models trained on batch-computed features but served with slightly different online values, causing silent performance degradation.

The offline path uses Spark for historical features with point-in-time joins. If you train a churn model for January 1st, it only sees data available before that date. The online path uses Redis for sub-millisecond lookups. Batch features get pushed to Redis on schedule; real-time features stream through Kafka.

Feature definitions live in a Feast registry with metadata about source, transformation logic, owner, and freshness SLA. Teams can discover and reuse features instead of rebuilding them. Lineage tracking records which tables feed which features, so upstream data issues can be traced to affected predictions.

This project showed me that feature engineering is still the highest-leverage ML work. A good feature store doesn't replace domain expertise; it makes experimentation faster.`,
        tech: ['Python', 'Feast', 'Redis', 'PostgreSQL', 'Apache Spark', 'Airflow'],
        isPrivate: true,
    },
    {
        id: 'model-serving',
        title: 'Model Serving Platform',
        fileName: 'model-serving.md',
        folder: 'ml-infrastructure',
        summary: 'Canary deployments, shadow testing, and automatic rollback',
        description: `A model serving platform because deploying ML is not like deploying regular software. Models degrade silently. The only way to know is monitoring production predictions.

Canary releases send 5% of traffic to the new model. If error rates or latency spike, automatically roll back. Shadow mode runs new models on production traffic without serving predictions, just logging for offline comparison. A/B tests use sticky user assignments so people don't see different model behavior mid-session.

Inference uses FastAPI with GPU batching. Requests accumulate in a 10ms buffer, then process together. This improves GPU utilization significantly over one-at-a-time processing. Prometheus tracks p50/p95/p99 latency, prediction distributions, and drift metrics.

I learned that model quality gets all the attention, but reliability and latency determine whether models create value.`,
        tech: ['Python', 'FastAPI', 'Kubernetes', 'Seldon Core', 'Prometheus', 'Grafana'],
        isPrivate: false,
        github: '#',
    },
    {
        id: 'ml-cicd',
        title: 'ML CI/CD Pipeline',
        fileName: 'ml-cicd.md',
        folder: 'ml-infrastructure',
        summary: 'Automated testing, validation, and model promotion',
        description: `CI/CD for machine learning. The team was stuck with manual deployments, broken notebooks, and "works on my machine" issues.

Four stages: data validation with Great Expectations catches drift before it pollutes training. Model training runs in Docker with pinned dependencies and DVC-tracked data. Evaluation compares new models against production baselines. Promotion pushes passing models to MLflow registry.

Tests split into unit tests for feature functions, integration tests on sample data, and model quality tests checking that AUC doesn't regress. Making tests deterministic was tricky since ML has inherent randomness. I seed random generators and test metric ranges rather than exact values.

This convinced me MLOps is not optional. It's the difference between a notebook demo and a system that creates business value.`,
        tech: ['Python', 'GitHub Actions', 'DVC', 'MLflow', 'Great Expectations', 'Docker'],
        isPrivate: false,
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
        description: `Fraud detection that scores transactions within 100ms. Beyond that, the payment gateway times out. This constraint eliminates fancy approaches and forces careful latency management.

Kafka handles event ingestion, Flink computes streaming features. Static features (account age, lifetime count) live in Redis. Dynamic features (transactions in last 5 minutes) use Flink windowed aggregations with RocksDB state. Late-arriving events get 30 seconds tolerance via watermarks.

The model is XGBoost trained on historical labeled transactions. Tree models are fast and handle tabular data well. Features capture velocity, deviation from user history, and merchant risk signals.

The biggest lesson: real-time ML is an engineering challenge first. Getting Kafka partitions, Flink parallelism, and Redis connection pooling right mattered more than model choice.`,
        tech: ['Python', 'Apache Kafka', 'Apache Flink', 'Redis', 'XGBoost', 'Docker'],
        isPrivate: true,
    },
    {
        id: 'realtime-recsys',
        title: 'Event-Driven Recommendations',
        fileName: 'realtime-recsys.md',
        folder: 'real-time-systems',
        summary: 'Personalized rankings updating instantly with user signals',
        description: `A recommendation system that responds to user behavior immediately. The problem with batch recommenders: you buy running shoes, and the site recommends running shoes for the next 24 hours.

Batch-trained embeddings from a two-tower model get indexed in Faiss for fast nearest-neighbor retrieval. Real-time personalization happens in re-ranking: user clicks stream through Kafka to update a short-term profile in Redis. When serving, candidates come from Faiss, then scores adjust based on recent interactions.

The re-ranker is intentionally simple (linear model) to stay within latency budget. Features: similarity to recent views, time since category interaction, inventory freshness. Cold-start users get popularity-based results filtered by context.

I learned that explore-exploit balance is a constant tuning problem. Showing only what users will definitely like leads to filter bubbles. Diversity often beats precision for long-term engagement.`,
        tech: ['Python', 'TensorFlow', 'Faiss', 'Kafka', 'Redis', 'FastAPI'],
        isPrivate: false,
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
        description: `A distributed key-value store to understand how DynamoDB and Cassandra work. Reading papers is one thing; building forces you to handle every edge case.

Consistent hashing with virtual nodes partitions data. Each key hashes to a position on the ring; walk clockwise to find responsible nodes. Writes go to N replicas (default 3). Quorum configuration (W + R > N) ensures consistency at availability cost during partitions.

Vector clocks track causality for conflict resolution. When replicas diverge, the clock shows whether one supersedes another or they're truly concurrent. Gossip protocol handles failure detection: nodes ping random peers and share health info. Failed nodes trigger rebalancing.

This gave me real appreciation for the CAP theorem. Every design trades off consistency, availability, and partition tolerance. Understanding these tradeoffs makes me a better user of distributed systems.`,
        tech: ['Go', 'gRPC', 'Protocol Buffers', 'Docker Compose', 'etcd'],
        isPrivate: false,
        github: '#',
    },
    {
        id: 'query-engine',
        title: 'Custom Query Engine',
        fileName: 'query-engine.md',
        folder: 'systems-engineering',
        summary: 'SQL parser, optimizer, and columnar execution',
        description: `Built a query engine that parses SQL, optimizes query plans, and executes against Parquet files. The motivation was curiosity: how does a database turn "SELECT * FROM users WHERE age > 25" into actual data?

The parser uses recursive descent to build an abstract syntax tree. I support a SQL subset: SELECT, WHERE, JOINs, GROUP BY, ORDER BY. Query optimization applies rewrite rules to the logical plan. Predicate pushdown moves filters earlier, projection pruning drops unused columns, and join reordering uses simple heuristics.

Execution follows the volcano model: each operator implements open/next/close. Scan reads Parquet row groups, filter drops non-matching rows, hash join builds a hash table on one side and probes with the other. Vectorized processing handles 1024 rows per batch instead of one at a time.

Building this demystified databases. They're not magic; they're carefully engineered systems with clean abstractions.`,
        tech: ['Rust', 'Apache Arrow', 'Parquet', 'sqlparser'],
        isPrivate: false,
        github: '#',
    },
    {
        id: 'mini-k8s',
        title: 'Container Orchestrator',
        fileName: 'mini-k8s.md',
        folder: 'systems-engineering',
        summary: 'Scheduling, health checks, and service discovery',
        description: `A mini container orchestrator to understand what happens when you run kubectl apply.

The scheduler assigns containers to nodes based on resources. Nodes report available CPU and memory. Requests get filtered to capable nodes, then scored by bin-packing fit. Health checks implement liveness probes (restart crashed containers) and readiness probes (remove from load balancing if not ready). HTTP, TCP, and exec probes all work.

Service discovery uses DNS. Each service gets a name that resolves to healthy pod IPs. Records update automatically as pods come and go. State lives in etcd with watch-based controllers that reconcile desired versus actual state.

This turned Kubernetes from black box to understandable system. I can't claim to fully know it, but I can reason about its behavior now.`,
        tech: ['Go', 'Docker API', 'etcd', 'gRPC', 'Linux networking'],
        isPrivate: false,
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
