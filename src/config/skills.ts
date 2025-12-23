import {
  Database, Brain, Cloud, Server, Code2,
  GitBranch, Terminal, Cpu, HardDrive, Network, Lock,
  Workflow, FileCode, Container, Layers, Boxes, Gauge,
  LineChart, Table, FileJson, Sparkles, Zap,
  Bot, Eye, MessageSquare, Settings, Cog, Binary,
  Globe, Shield, Rocket, Search, Activity, Radio,
  Cable, Blocks, FolderGit2, TestTube, Users, RefreshCw,
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
  startDate?: string  // YYYY-MM format, e.g., "2019-01"
  useCases?: string[]
  relatedTo?: string[]
}

// Computed interface with calculated experience
export interface SkillConfigWithExperience extends SkillConfig {
  experience: string  // Computed human-readable string like "5 years"
}

/**
 * Calculate experience duration from start date to current date
 * This runs once on module load - minimal performance impact
 */
function calculateExperience(startDate?: string): string {
  if (!startDate) return ''

  const [year, month] = startDate.split('-').map(Number)
  const start = new Date(year, month - 1)
  const now = new Date()

  const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) {
    return months <= 1 ? '1 month' : `${months} months`
  } else {
    return years === 1 ? '1+ year' : `${years}+ years`
  }
}

/**
 * Add computed experience to skill configs
 */
function enrichSkillsWithExperience(skills: SkillConfig[]): SkillConfigWithExperience[] {
  return skills.map(skill => ({
    ...skill,
    experience: calculateExperience(skill.startDate)
  }))
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
    description: 'Central hub connecting all technical competencies and expertise areas. This graph visualizes the relationships between technologies, frameworks, and methodologies across the full stack. Click on any node to explore skills and their connections.',
    shortDescription: 'Core technical competencies',
  },

  // Category sub-hubs (all linked to the main hub)
  {
    id: 'hub-ai-ml',
    name: 'AI & Machine Learning',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Deep learning frameworks, large language models, and the complete MLOps lifecycle. This includes neural network architectures, transformer models, RAG systems, and experiment tracking tools. From research prototypes to production-scale AI systems.',
    shortDescription: 'AI, ML & MLOps',
  },
  {
    id: 'hub-cloud',
    name: 'Cloud & Infrastructure',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Cloud platforms, container orchestration, and database systems for scalable applications. Expertise spans AWS, GCP, Azure, along with Docker, Kubernetes, and infrastructure as code. Includes relational, NoSQL, and vector databases for diverse workloads.',
    shortDescription: 'Cloud & infrastructure',
  },
  {
    id: 'hub-programming',
    name: 'Programming',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Multi-language proficiency spanning systems programming to web development. Strong foundation in Python, Java, TypeScript, and modern frameworks like FastAPI and Spring Boot. Includes software engineering principles, testing, and architectural patterns.',
    shortDescription: 'Languages & frameworks',
  },
  {
    id: 'hub-data-engineering',
    name: 'Data Engineering',
    type: 'category',
    parentHub: 'hub-skills',
    description: 'Building robust data pipelines and real-time processing systems at scale. Experience with Apache Spark, Kafka, Airflow, and modern data transformation tools. From ETL workflows to streaming architectures and data warehouse design.',
    shortDescription: 'Pipelines & data systems',
  },
]

/**
 * Maps category names to their hub IDs
 */
export const categoryToHub: Record<string, string> = {
  'AI & Machine Learning': 'hub-ai-ml',
  'Cloud & Infrastructure': 'hub-cloud',
  'Programming': 'hub-programming',
  'Data Engineering': 'hub-data-engineering',
}

/**
 * Category colors for visual distinction
 * Used in Skill Galaxy graph and skill detail modals
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'AI & Machine Learning': '#f59e0b',        // Amber - intelligent, innovative
  'Cloud & Infrastructure': '#10b981',       // Green - operational, reliable
  'Programming': '#a855f7',                  // Purple - creative, logical
  'Data Engineering': '#3b82f6',             // Blue - structured, technical
}

// =============================================================================
// Category 1: AI & Machine Learning (26 skills - LARGEST, AI/ML/MLOps expertise)
// =============================================================================

export const aiMlSkills: SkillConfig[] = [
  {
    title: 'PyTorch',
    icon: Brain,
    description: 'Dynamic deep learning framework by Meta. PyTorch offers flexible tensor computations and automatic differentiation for building neural networks. Its eager execution model makes debugging intuitive and is widely adopted in research and production.',
    shortDescription: '',
    startDate: '2021-01',
    useCases: ['Custom model training', 'Research prototyping', 'GPU acceleration', 'Computer vision models'],
    relatedTo: ['TensorFlow', 'Hugging Face', 'ONNX', 'NumPy', 'Keras'],
  },
  {
    title: 'TensorFlow',
    icon: Brain,
    description: 'End-to-end machine learning platform by Google. TensorFlow provides comprehensive tools for building, training, and deploying ML models at scale. It powers production systems from mobile devices to large distributed clusters.',
    shortDescription: '',
    startDate: '2021-01',
    useCases: ['Production ML pipelines', 'Mobile model deployment', 'Distributed training', 'TensorFlow Serving'],
    relatedTo: ['PyTorch', 'Keras', 'ONNX', 'Model Serving', 'Kubeflow'],
  },
  {
    title: 'Hugging Face',
    icon: Sparkles,
    description: 'The leading platform for transformer models and NLP. Hugging Face provides thousands of pre-trained models through its Transformers library for text, vision, and audio tasks. It has become the central hub for sharing and deploying state-of-the-art AI models.',
    shortDescription: '',
    startDate: '2022-06',
    useCases: ['Pre-trained transformers', 'Text classification', 'Model fine-tuning', 'Tokenizer pipelines'],
    relatedTo: ['PyTorch', 'LangChain', 'Fine-tuning', 'Prompt Engineering'],
  },
  {
    title: 'LangChain',
    icon: Cable,
    description: 'Framework for building LLM-powered applications. LangChain provides abstractions for chaining language models with external data sources and tools. It simplifies creating conversational AI agents, chatbots, and complex reasoning pipelines.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['AI chatbots', 'Document Q&A', 'Agent workflows', 'Tool integration'],
    relatedTo: ['RAG Systems', 'Hugging Face', 'Vector Databases', 'Prompt Engineering'],
  },
  {
    title: 'RAG Systems',
    icon: Search,
    description: 'Retrieval-Augmented Generation architecture pattern. RAG combines large language models with external knowledge retrieval to produce accurate, grounded responses. This approach reduces hallucinations and enables LLMs to access up-to-date or proprietary information.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Knowledge base search', 'Enterprise chatbots', 'Document retrieval', 'Semantic search'],
    relatedTo: ['LangChain', 'Vector Databases', 'FAISS', 'Pinecone', 'Elasticsearch'],
  },
  {
    title: 'Scikit-learn',
    icon: Settings,
    description: 'Python library for classical machine learning. Scikit-learn provides efficient implementations of algorithms for classification, regression, clustering, and dimensionality reduction. Its consistent API and excellent documentation make it the standard for traditional ML workflows.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Classification models', 'Feature engineering', 'Model evaluation', 'Clustering analysis'],
    relatedTo: ['NumPy', 'Pandas', 'Optuna', 'Feature Stores'],
  },
  {
    title: 'OpenCV',
    icon: Eye,
    description: 'Open-source computer vision library. OpenCV offers over 2500 optimized algorithms for image and video processing, object detection, and facial recognition. It is the industry standard for real-time vision applications.',
    shortDescription: '',
    startDate: '2021-06',
    useCases: ['Object detection', 'Image preprocessing', 'Video analytics', 'Real-time tracking'],
    relatedTo: ['PyTorch', 'TensorFlow', 'NumPy'],
  },
  {
    title: 'spaCy',
    icon: MessageSquare,
    description: 'Industrial-strength NLP library for Python. spaCy excels at production-ready natural language processing with fast tokenization, named entity recognition, and dependency parsing. It is designed for real-world applications rather than research experimentation.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Named entity recognition', 'Text preprocessing', 'Sentiment analysis', 'Information extraction'],
    relatedTo: ['Hugging Face', 'Python', 'Scikit-learn'],
  },
  {
    title: 'JAX',
    icon: Rocket,
    description: 'High-performance numerical computing library by Google. JAX combines NumPy-like syntax with automatic differentiation and XLA compilation for GPU and TPU acceleration. It enables writing highly optimized machine learning research code.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['High-performance ML', 'TPU acceleration', 'Autodiff research', 'Numerical optimization'],
    relatedTo: ['PyTorch', 'NumPy', 'TensorFlow'],
  },
  {
    title: 'ONNX',
    icon: RefreshCw,
    description: 'Open Neural Network Exchange format. ONNX provides an open standard for representing machine learning models, enabling portability between frameworks. Models trained in PyTorch or TensorFlow can be exported and deployed anywhere.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Model portability', 'Framework conversion', 'Edge deployment', 'Model optimization'],
    relatedTo: ['PyTorch', 'TensorFlow', 'Model Serving'],
  },
  {
    title: 'Optuna',
    icon: Settings,
    description: 'Automatic hyperparameter optimization framework. Optuna uses efficient sampling and pruning algorithms to find optimal model configurations. It integrates seamlessly with major ML frameworks and scales to distributed environments.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Hyperparameter tuning', 'AutoML pipelines', 'Model selection', 'Neural architecture search'],
    relatedTo: ['Scikit-learn', 'PyTorch', 'MLflow', 'Weights & Biases'],
  },
  {
    title: 'NumPy',
    icon: Binary,
    description: 'Fundamental package for numerical computing in Python. NumPy provides efficient multi-dimensional array operations and mathematical functions that form the foundation of the scientific Python ecosystem. Nearly every data science and ML library builds upon NumPy.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Data manipulation', 'Matrix operations', 'Scientific computing', 'Array broadcasting'],
    relatedTo: ['Pandas', 'Scikit-learn', 'PyTorch', 'Python'],
  },
  {
    title: 'MLflow',
    icon: Activity,
    description: 'Open-source platform for the ML lifecycle. MLflow tracks experiments, packages code into reproducible runs, and manages model deployment. It provides a unified interface for logging parameters, metrics, and artifacts across any ML library.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Experiment tracking', 'Model registry', 'Artifact management', 'Reproducible ML'],
    relatedTo: ['DVC', 'Weights & Biases', 'Model Serving', 'Python', 'Databricks', 'Apache Airflow'],
  },
  {
    title: 'Kubeflow',
    icon: Container,
    description: 'Kubernetes-native ML workflow platform. Kubeflow orchestrates end-to-end machine learning pipelines from data preparation through model serving. It brings scalability and portability of Kubernetes to ML workloads.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['ML pipelines on K8s', 'Workflow orchestration', 'Model serving', 'Multi-step training'],
    relatedTo: ['Kubernetes', 'TensorFlow', 'MLflow', 'Docker', 'Apache Airflow'],
  },
  {
    title: 'Ray',
    icon: Rocket,
    description: 'Unified framework for scaling AI applications. Ray simplifies distributed computing for ML training, hyperparameter tuning, and model serving. It can scale from a laptop to a cluster of thousands of nodes.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Distributed training', 'Parallel processing', 'Large-scale inference', 'Cluster computing'],
    relatedTo: ['Python', 'PyTorch', 'Kubernetes', 'Apache Spark', 'Databricks'],
  },
  {
    title: 'DVC',
    icon: FolderGit2,
    description: 'Data Version Control for ML projects. DVC tracks datasets, models, and experiments alongside code using Git-like commands. It enables reproducible machine learning by versioning data and pipeline stages.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Dataset versioning', 'Pipeline reproducibility', 'Model checkpoints', 'Team collaboration'],
    relatedTo: ['Git', 'MLflow', 'Python'],
  },
  {
    title: 'Feature Stores',
    icon: Database,
    description: 'Centralized repository for ML features. Feature stores manage the storage, serving, and discovery of features used in machine learning models. They ensure consistency between training and inference while enabling feature reuse across teams.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Online feature serving', 'Training-serving skew', 'Feature discovery', 'Real-time features'],
    relatedTo: ['Scikit-learn', 'MLflow', 'Model Serving', 'Redis', 'Apache Spark', 'Databricks'],
  },
  {
    title: 'Model Serving',
    icon: Server,
    description: 'Infrastructure for deploying ML models in production. Model serving systems handle prediction requests with low latency, automatic scaling, and versioning. Tools like TensorFlow Serving, Triton, and BentoML power real-time inference.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['REST/gRPC endpoints', 'Model versioning', 'Canary deployments', 'Inference optimization'],
    relatedTo: ['ONNX', 'TensorFlow', 'Docker', 'Kubernetes', 'FastAPI'],
  },
  {
    title: 'A/B Testing',
    icon: TestTube,
    description: 'Statistical method for comparing model variants. A/B testing enables data-driven decisions by measuring the impact of model changes on real users. It is essential for validating ML improvements before full deployment.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Model comparison', 'Feature experiments', 'Statistical significance', 'Conversion optimization'],
    relatedTo: ['Model Serving', 'MLflow', 'Feature Stores'],
  },
  {
    title: 'Vector Databases',
    icon: Search,
    description: 'Databases optimized for similarity search. Vector databases store and query high-dimensional embeddings generated by ML models. They are the backbone of semantic search, recommendation systems, and RAG applications.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Embedding storage', 'Semantic search', 'Recommendation engines', 'Similarity matching'],
    relatedTo: ['RAG Systems', 'FAISS', 'Pinecone', 'Milvus', 'LangChain'],
  },
  {
    title: 'Keras',
    icon: Layers,
    description: 'High-level neural network API for Python. Keras provides an intuitive interface for building deep learning models with minimal code. It runs on top of TensorFlow and is ideal for rapid prototyping and experimentation.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Rapid prototyping', 'Neural networks', 'Transfer learning', 'Model experimentation'],
    relatedTo: ['TensorFlow', 'PyTorch', 'Python'],
  },
  {
    title: 'Weights & Biases',
    icon: Activity,
    description: 'MLOps platform for experiment tracking. Weights and Biases logs metrics, hyperparameters, and outputs to create interactive visualizations and comparisons. It has become an industry standard for collaborative ML development.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Team dashboards', 'Hyperparameter sweeps', 'Model comparison', 'Training visualization'],
    relatedTo: ['MLflow', 'Optuna', 'PyTorch', 'TensorFlow'],
  },
  {
    title: 'Prompt Engineering',
    icon: MessageSquare,
    description: 'Art of crafting effective LLM instructions. Prompt engineering involves designing inputs that elicit accurate, relevant, and safe responses from language models. It is a critical skill for building production LLM applications.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Few-shot prompting', 'Chain-of-thought', 'System instructions', 'Output formatting'],
    relatedTo: ['LangChain', 'Hugging Face', 'Fine-tuning', 'RAG Systems'],
  },
  {
    title: 'Fine-tuning',
    icon: Settings,
    description: 'Adapting pre-trained models to specific tasks. Fine-tuning adjusts model weights on domain-specific data to improve performance for particular use cases. Techniques like LoRA and QLoRA enable efficient fine-tuning of large language models.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Domain adaptation', 'LoRA training', 'Custom LLMs', 'Task-specific models'],
    relatedTo: ['Hugging Face', 'PyTorch', 'Prompt Engineering'],
  },
  {
    title: 'FAISS',
    icon: Search,
    description: 'Facebook AI Similarity Search library. FAISS provides highly optimized algorithms for searching through billions of vectors in milliseconds. It powers similarity search at scale for recommendation and retrieval systems.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Billion-scale search', 'Index optimization', 'GPU acceleration', 'Approximate nearest neighbor'],
    relatedTo: ['Vector Databases', 'RAG Systems', 'NumPy', 'Python'],
  },
  {
    title: 'Pinecone',
    icon: Search,
    description: 'Managed vector database service. Pinecone handles the infrastructure complexity of vector search with automatic scaling and low-latency queries. It simplifies building production semantic search and RAG applications.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Managed vector DB', 'Semantic search', 'RAG backend', 'Real-time updates'],
    relatedTo: ['Vector Databases', 'RAG Systems', 'LangChain'],
  },
]

// =============================================================================
// Category 2: Cloud & Infrastructure (15 skills - cloud platforms & databases)
// =============================================================================

export const cloudSkills: SkillConfig[] = [
  {
    title: 'AWS',
    icon: Cloud,
    description: 'Amazon Web Services cloud computing platform. AWS offers over 200 services including compute, storage, databases, and machine learning. It is the market leader powering millions of applications from startups to enterprises worldwide.',
    shortDescription: '',
    startDate: '2021-01',
    useCases: ['EC2 instances', 'S3 storage', 'Lambda serverless', 'SageMaker ML'],
    relatedTo: ['GCP', 'Azure', 'Terraform', 'Docker', 'Kubernetes'],
  },
  {
    title: 'GCP',
    icon: Cloud,
    description: 'Google Cloud Platform for cloud computing. GCP provides world-class infrastructure with strengths in data analytics, machine learning with Vertex AI, and BigQuery. It powers Google-scale applications with global reach.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['BigQuery analytics', 'Vertex AI', 'Cloud Run', 'GKE clusters'],
    relatedTo: ['AWS', 'Azure', 'BigQuery', 'Kubernetes', 'Terraform'],
  },
  {
    title: 'Azure',
    icon: Cloud,
    description: 'Microsoft cloud computing platform. Azure integrates seamlessly with enterprise tools and offers comprehensive AI and data services. It is particularly strong for hybrid cloud deployments and enterprise workloads.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Azure OpenAI', 'Cosmos DB', 'AKS clusters', 'Azure DevOps'],
    relatedTo: ['AWS', 'GCP', 'Kubernetes', 'Terraform'],
  },
  {
    title: 'Docker',
    icon: Container,
    description: 'Platform for containerizing applications. Docker packages applications with their dependencies into portable containers that run consistently across environments. It has revolutionized software deployment and microservices architecture.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Containerization', 'Dev environments', 'CI/CD builds', 'Microservices packaging'],
    relatedTo: ['Kubernetes', 'CI/CD', 'Linux', 'Microservices'],
  },
  {
    title: 'Kubernetes',
    icon: Container,
    description: 'Container orchestration system for production workloads. Kubernetes automates deployment, scaling, and management of containerized applications across clusters. It has become the industry standard for running containers at scale.',
    shortDescription: '',
    startDate: '2021-01',
    useCases: ['Container orchestration', 'Auto-scaling', 'Service mesh', 'Rolling deployments'],
    relatedTo: ['Docker', 'Terraform', 'AWS', 'GCP', 'Prometheus'],
  },
  {
    title: 'Terraform',
    icon: Blocks,
    description: 'Infrastructure as Code tool by HashiCorp. Terraform enables declarative provisioning of cloud resources across multiple providers using a consistent workflow. It brings version control and collaboration to infrastructure management.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Infrastructure as Code', 'Multi-cloud setup', 'State management', 'Module reuse'],
    relatedTo: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'CI/CD'],
  },
  {
    title: 'CI/CD',
    icon: RefreshCw,
    description: 'Continuous Integration and Continuous Deployment practices. CI/CD automates building, testing, and deploying code changes to production environments. Tools like GitHub Actions, GitLab CI, and Jenkins enable rapid, reliable software delivery.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Automated testing', 'GitHub Actions', 'GitLab pipelines', 'Deployment automation'],
    relatedTo: ['Git', 'Docker', 'Terraform', 'Testing'],
  },
  {
    title: 'Linux',
    icon: Terminal,
    description: 'Open-source operating system powering most servers. Linux expertise includes shell scripting, system administration, and performance tuning. It is the foundation of cloud computing and container runtimes.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Server administration', 'Shell scripting', 'Process management', 'Performance tuning'],
    relatedTo: ['Docker', 'Kubernetes', 'Python', 'Git'],
  },
  {
    title: 'Grafana',
    icon: LineChart,
    description: 'Open-source analytics and monitoring platform. Grafana creates interactive dashboards for visualizing metrics from multiple data sources. It is the standard tool for observability and operational monitoring.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Metrics dashboards', 'Log visualization', 'Alerting rules', 'System monitoring'],
    relatedTo: ['Prometheus', 'Kubernetes', 'Elasticsearch'],
  },
  {
    title: 'Prometheus',
    icon: Activity,
    description: 'Open-source monitoring and alerting toolkit. Prometheus collects time-series metrics with a powerful query language and integrates with Grafana for visualization. It is designed for reliability and works well in dynamic cloud environments.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Metrics collection', 'Alert manager', 'PromQL queries', 'Service discovery'],
    relatedTo: ['Grafana', 'Kubernetes', 'Docker'],
  },
  {
    title: 'PostgreSQL',
    icon: Database,
    description: 'Advanced open-source relational database. PostgreSQL offers robust SQL support, ACID compliance, and extensibility with features like JSON support and full-text search. It is trusted for mission-critical applications requiring data integrity.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Relational data', 'ACID transactions', 'Complex queries', 'JSON columns'],
    relatedTo: ['MySQL', 'SQL', 'Python', 'Docker'],
  },
  {
    title: 'MySQL',
    icon: Database,
    description: 'Popular open-source relational database. MySQL powers countless web applications with its reliability, ease of use, and strong community support. It excels at read-heavy workloads and integrates with most programming languages.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Web backends', 'Read replicas', 'User data', 'Content management'],
    relatedTo: ['PostgreSQL', 'SQL', 'PHP', 'Python'],
  },
  {
    title: 'MongoDB',
    icon: FileJson,
    description: 'Leading NoSQL document database. MongoDB stores data in flexible JSON-like documents, making it ideal for applications with evolving schemas. It scales horizontally and is popular for modern web applications.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Document storage', 'Flexible schemas', 'User profiles', 'Content catalogs'],
    relatedTo: ['Node.js', 'Python', 'Redis', 'Docker'],
  },
  {
    title: 'Redis',
    icon: Zap,
    description: 'In-memory data store for caching and messaging. Redis delivers sub-millisecond response times for caching, session management, and real-time features. It supports rich data structures like lists, sets, and sorted sets.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Session caching', 'Rate limiting', 'Pub/Sub messaging', 'Leaderboards'],
    relatedTo: ['PostgreSQL', 'MongoDB', 'Python', 'Docker'],
  },
  {
    title: 'Milvus',
    icon: Search,
    description: 'Open-source vector database built for AI. Milvus provides scalable similarity search for billions of vectors with high performance. It is designed for production machine learning applications requiring embedding storage.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Vector storage', 'Similarity search', 'Multi-tenant RAG', 'Self-hosted vectors'],
    relatedTo: ['Vector Databases', 'RAG Systems', 'LangChain', 'Python'],
  },
  {
    title: 'Weaviate',
    icon: Search,
    description: 'Open-source vector search engine. Weaviate combines vector search with structured filtering and supports hybrid search combining keywords with semantic similarity. It integrates natively with ML models for automatic vectorization.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Hybrid search', 'GraphQL API', 'Multi-modal vectors', 'Auto-vectorization'],
    relatedTo: ['Vector Databases', 'RAG Systems', 'LangChain'],
  },
  {
    title: 'Qdrant',
    icon: Search,
    description: 'High-performance vector similarity search engine. Qdrant offers advanced filtering capabilities and a Rust-based architecture for speed and efficiency. It is optimized for production AI applications with strict latency requirements.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['High-performance vectors', 'Payload filtering', 'Geo-search', 'Sparse vectors'],
    relatedTo: ['Vector Databases', 'RAG Systems', 'Rust'],
  },
  {
    title: 'Elasticsearch',
    icon: Search,
    description: 'Distributed search and analytics engine. Elasticsearch provides fast full-text search, log analysis, and real-time analytics at scale. It powers search functionality for many of the world largest websites.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Full-text search', 'Log aggregation', 'Analytics engine', 'Autocomplete'],
    relatedTo: ['Grafana', 'MongoDB', 'Python', 'RAG Systems'],
  },
]


// =============================================================================
// Category 3: Programming (25 skills - comprehensive SWE & development expertise)
// =============================================================================

export const programmingSkills: SkillConfig[] = [
  {
    title: 'Python',
    icon: FileCode,
    description: 'Versatile programming language for everything from scripts to AI. Python dominates data science, machine learning, and backend development with its clean syntax and rich ecosystem. It is the most popular language for AI and automation.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['ML/AI development', 'Backend services', 'Data analysis', 'Automation scripts'],
    relatedTo: ['NumPy', 'Pandas', 'FastAPI', 'Flask', 'PyTorch'],
  },
  {
    title: 'Java',
    icon: Code2,
    description: 'Enterprise-grade programming language. Java powers mission-critical systems with its strong typing, mature ecosystem, and excellent performance. It remains a top choice for large-scale backend systems and Android development.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Enterprise backends', 'Android apps', 'Microservices', 'High-performance systems'],
    relatedTo: ['Spring Boot', 'Scala', 'Microservices', 'Kubernetes'],
  },
  {
    title: 'JavaScript',
    icon: Globe,
    description: 'The language of the web. JavaScript runs in every browser and powers interactive frontends, server-side applications with Node.js, and mobile apps. It is essential for full-stack development.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['React/Vue frontends', 'Node.js backends', 'Browser automation', 'Full-stack apps'],
    relatedTo: ['TypeScript', 'Node.js', 'Vue.js', 'REST APIs'],
  },
  {
    title: 'TypeScript',
    icon: Shield,
    description: 'Typed superset of JavaScript by Microsoft. TypeScript adds static types to JavaScript, catching errors at compile time and improving code quality. It has become the standard for large-scale frontend and Node.js projects.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Type-safe frontends', 'API contracts', 'Large codebases', 'Refactoring safety'],
    relatedTo: ['JavaScript', 'Node.js', 'Vue.js', 'REST APIs'],
  },
  {
    title: 'C/C++',
    icon: Cpu,
    description: 'Low-level languages for systems programming. C and C++ provide direct hardware control and maximum performance for operating systems, embedded systems, and performance-critical applications. They are foundational to modern computing.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Systems programming', 'Performance-critical code', 'Embedded systems', 'Game engines'],
    relatedTo: ['Rust', 'Linux', 'Python'],
  },
  {
    title: 'SQL',
    icon: Table,
    description: 'Standard language for database operations. SQL enables querying, manipulating, and managing relational data with powerful operations like joins, aggregations, and window functions. It is essential for any data-related work.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Data querying', 'ETL transformations', 'Analytics reports', 'Database design'],
    relatedTo: ['PostgreSQL', 'MySQL', 'Pandas', 'dbt'],
  },
  {
    title: 'Flask',
    icon: Server,
    description: 'Lightweight Python web framework. Flask provides simplicity and flexibility for building APIs and web applications without unnecessary complexity. It is ideal for microservices and ML model serving endpoints.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Simple APIs', 'Prototyping', 'ML model endpoints', 'Internal tools'],
    relatedTo: ['FastAPI', 'Python', 'REST APIs', 'Docker'],
  },
  {
    title: 'FastAPI',
    icon: Rocket,
    description: 'Modern Python framework for building APIs. FastAPI delivers automatic documentation, validation, and async support with exceptional performance. It is the preferred choice for Python microservices and ML API endpoints.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['High-performance APIs', 'Async endpoints', 'OpenAPI docs', 'Pydantic validation'],
    relatedTo: ['Flask', 'Python', 'Docker', 'REST APIs', 'Model Serving'],
  },
  {
    title: 'Spring Boot',
    icon: Cog,
    description: 'Java framework for enterprise applications. Spring Boot simplifies building production-ready applications with auto-configuration, embedded servers, and extensive integrations. It is the standard for Java backend development.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Enterprise Java apps', 'REST APIs', 'Batch processing', 'Dependency injection'],
    relatedTo: ['Java', 'Microservices', 'Kubernetes', 'PostgreSQL'],
  },
  {
    title: 'Node.js',
    icon: Server,
    description: 'JavaScript runtime for server-side development. Node.js enables building scalable network applications with non-blocking I/O and an event-driven architecture. It powers real-time applications and API backends.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Express servers', 'Real-time apps', 'API gateways', 'SSR applications'],
    relatedTo: ['JavaScript', 'TypeScript', 'MongoDB', 'REST APIs'],
  },
  {
    title: 'Vue.js',
    icon: Layers,
    description: 'Progressive JavaScript framework for building UIs. Vue.js offers an approachable, versatile, and performant approach to frontend development. Its component-based architecture makes building interactive interfaces intuitive.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Interactive UIs', 'SPA development', 'Component libraries', 'Dashboard apps'],
    relatedTo: ['JavaScript', 'TypeScript', 'Node.js'],
  },
  {
    title: 'Git',
    icon: GitBranch,
    description: 'Distributed version control system. Git tracks code changes, enables collaboration, and maintains project history across teams of any size. It is the foundation of modern software development workflows.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Version control', 'Branch strategies', 'Code review', 'Team collaboration'],
    relatedTo: ['CI/CD', 'DVC', 'Linux'],
  },
  {
    title: 'REST APIs',
    icon: Globe,
    description: 'Architectural style for web services. REST APIs use standard HTTP methods to enable communication between systems with stateless, cacheable requests. They are the backbone of modern web and mobile applications.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['API design', 'Third-party integrations', 'Mobile backends', 'Webhooks'],
    relatedTo: ['FastAPI', 'Flask', 'Node.js', 'gRPC'],
  },
  {
    title: 'gRPC',
    icon: Radio,
    description: 'High-performance RPC framework by Google. gRPC uses Protocol Buffers for efficient serialization and supports bidirectional streaming. It excels in microservices communication where performance and type safety matter.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Low-latency APIs', 'Service-to-service', 'Streaming data', 'Type-safe contracts'],
    relatedTo: ['REST APIs', 'Microservices', 'Python', 'Go'],
  },
  {
    title: 'System Design',
    icon: Blocks,
    description: 'Designing scalable and reliable systems. System design involves architecting distributed systems that handle millions of users with high availability. It covers load balancing, caching, databases, and service decomposition.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Scalability planning', 'Database sharding', 'Caching strategies', 'Load balancing'],
    relatedTo: ['Microservices', 'Kubernetes', 'Redis', 'PostgreSQL'],
  },
  {
    title: 'Microservices',
    icon: Boxes,
    description: 'Architectural pattern for distributed applications. Microservices decompose applications into small, independent services that can be deployed and scaled separately. This approach enables team autonomy and technology flexibility.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Service decomposition', 'API gateways', 'Event-driven design', 'Independent deployment'],
    relatedTo: ['Docker', 'Kubernetes', 'System Design', 'gRPC'],
  },
  {
    title: 'Design Patterns',
    icon: Layers,
    description: 'Reusable solutions to common software problems. Design patterns like Factory, Observer, and Strategy provide proven approaches to recurring challenges. They improve code maintainability and communication between developers.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Factory patterns', 'Dependency injection', 'Observer pattern', 'Clean architecture'],
    relatedTo: ['Java', 'Python', 'System Design', 'Testing'],
  },
  {
    title: 'Data Structures',
    icon: Binary,
    description: 'Organizing and storing data efficiently. Mastery of arrays, trees, graphs, and hash tables is fundamental to writing performant code. Understanding data structures enables solving complex algorithmic problems.',
    shortDescription: '',
    startDate: '2019-01',
    useCases: ['Algorithm optimization', 'Interview prep', 'Graph algorithms', 'Tree traversals'],
    relatedTo: ['Python', 'Java', 'Design Patterns'],
  },
  {
    title: 'Testing',
    icon: TestTube,
    description: 'Ensuring code quality through automated tests. Testing spans unit tests, integration tests, and end-to-end tests to catch bugs before production. It is essential for maintaining reliable, maintainable software.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Unit testing', 'TDD workflow', 'Integration tests', 'Mocking frameworks'],
    relatedTo: ['CI/CD', 'Python', 'Design Patterns'],
  },
  {
    title: 'Agile/Scrum',
    icon: Users,
    description: 'Iterative software development methodology. Agile and Scrum organize work into sprints with daily standups, retrospectives, and continuous delivery. They enable teams to adapt quickly to changing requirements.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Sprint planning', 'Story points', 'Retrospectives', 'Kanban boards'],
    relatedTo: ['Git', 'CI/CD', 'Testing'],
  },
  {
    title: 'WebSocket',
    icon: Radio,
    description: 'Protocol for real-time bidirectional communication. WebSocket maintains persistent connections between client and server for instant data exchange. It powers chat applications, live updates, and collaborative tools.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Live notifications', 'Chat applications', 'Collaborative editing', 'Real-time dashboards'],
    relatedTo: ['Node.js', 'JavaScript', 'Redis'],
  },
  {
    title: 'Go',
    icon: Code2,
    description: 'Fast, simple language by Google. Go compiles to efficient binaries with built-in concurrency and garbage collection. It is ideal for cloud infrastructure, CLI tools, and high-performance services.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['CLI tools', 'Cloud infrastructure', 'Concurrent services', 'Container runtimes'],
    relatedTo: ['Kubernetes', 'Docker', 'gRPC', 'Rust'],
  },
  {
    title: 'Rust',
    icon: Shield,
    description: 'Systems language focused on safety and performance. Rust prevents memory errors at compile time without a garbage collector. It is used for operating systems, browsers, and performance-critical infrastructure.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Memory-safe systems', 'WebAssembly', 'High-performance tools', 'Security-critical code'],
    relatedTo: ['C/C++', 'Go', 'Linux', 'Qdrant'],
  },
  {
    title: 'Scala',
    icon: Code2,
    description: 'Functional and object-oriented JVM language. Scala combines the best of both paradigms with powerful type inference and runs on the Java platform. It is the language behind Apache Spark.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Spark applications', 'Functional pipelines', 'Big data processing', 'Type-safe data'],
    relatedTo: ['Java', 'Apache Spark', 'Databricks'],
  },
  {
    title: 'PHP',
    icon: Globe,
    description: 'Server-side scripting language for web development. PHP powers a significant portion of the web including WordPress and Laravel applications. It offers rapid development for dynamic websites.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['WordPress development', 'Laravel apps', 'Web backends', 'CMS systems'],
    relatedTo: ['MySQL', 'JavaScript', 'REST APIs'],
  },
  {
    title: 'Haskell',
    icon: Binary,
    description: 'Purely functional programming language. Haskell emphasizes immutability, strong typing, and mathematical elegance. Learning it deepens understanding of functional programming concepts.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Functional paradigms', 'Type theory', 'Pure functions', 'Compiler design'],
    relatedTo: ['Scala', 'Design Patterns'],
  },
]

// =============================================================================
// Category 4: Data Engineering (11 skills - data infrastructure & pipelines)
// =============================================================================

export const dataEngineeringSkills: SkillConfig[] = [
  {
    title: 'Apache Spark',
    icon: Rocket,
    description: 'Distributed computing engine for big data processing. Spark processes massive datasets across clusters with in-memory computing for speed. It supports batch processing, streaming, SQL, machine learning, and graph processing.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Large-scale ETL', 'Data lake processing', 'ML feature pipelines', 'Batch analytics'],
    relatedTo: ['Scala', 'Databricks', 'Pandas', 'Python', 'PyTorch', 'Scikit-learn', 'Feature Stores'],
  },
  {
    title: 'Apache Kafka',
    icon: Radio,
    description: 'Distributed event streaming platform. Kafka handles trillions of events per day with high throughput and low latency. It is the backbone of real-time data pipelines and event-driven architectures.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Event streaming', 'Message queues', 'Change data capture', 'Real-time analytics'],
    relatedTo: ['Apache Spark', 'Stream Processing', 'Apache Airflow', 'Feature Stores'],
  },
  {
    title: 'Apache Airflow',
    icon: RefreshCw,
    description: 'Workflow orchestration platform for data pipelines. Airflow uses Python to define, schedule, and monitor complex data workflows as directed acyclic graphs. It is the industry standard for ETL orchestration.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['DAG orchestration', 'Scheduled jobs', 'Data dependencies', 'Pipeline monitoring'],
    relatedTo: ['ETL Pipelines', 'Python', 'dbt', 'Apache Spark', 'MLflow', 'Kubeflow'],
  },
  {
    title: 'Pandas',
    icon: Table,
    description: 'Python library for data manipulation and analysis. Pandas provides DataFrames for working with structured data, enabling filtering, aggregation, and transformation. It is essential for data preprocessing and exploration.',
    shortDescription: '',
    startDate: '2020-01',
    useCases: ['Data wrangling', 'CSV processing', 'Time series', 'Exploratory analysis'],
    relatedTo: ['NumPy', 'Python', 'Apache Spark', 'SQL', 'Scikit-learn'],
  },
  {
    title: 'dbt',
    icon: Layers,
    description: 'Data transformation tool for analytics engineering. dbt enables writing modular SQL transformations with version control, testing, and documentation. It has revolutionized how analysts build data models.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['SQL transformations', 'Data modeling', 'Analytics engineering', 'Data testing'],
    relatedTo: ['SQL', 'Snowflake', 'BigQuery', 'Apache Airflow'],
  },
  {
    title: 'Databricks',
    icon: Sparkles,
    description: 'Unified analytics platform for data and AI. Databricks combines data engineering, data science, and machine learning on a lakehouse architecture. It provides collaborative notebooks and managed Spark infrastructure.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Lakehouse architecture', 'Collaborative notebooks', 'Delta Lake', 'Unity Catalog'],
    relatedTo: ['Apache Spark', 'Scala', 'Python', 'Snowflake', 'MLflow', 'PyTorch', 'Feature Stores'],
  },
  {
    title: 'ETL Pipelines',
    icon: Cable,
    description: 'Extract, Transform, Load data integration process. ETL pipelines move data from source systems, apply transformations, and load it into target destinations. They are fundamental to data warehousing and analytics.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Data ingestion', 'Schema validation', 'Incremental loading', 'Data quality checks'],
    relatedTo: ['Apache Airflow', 'Apache Spark', 'dbt', 'Data Warehousing'],
  },
  {
    title: 'Snowflake',
    icon: Database,
    description: 'Cloud-native data warehouse platform. Snowflake separates storage and compute for elastic scaling and offers unique features like data sharing and zero-copy cloning. It handles structured and semi-structured data.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Cloud data warehouse', 'Data sharing', 'Semi-structured data', 'Zero-copy clones'],
    relatedTo: ['BigQuery', 'dbt', 'Data Warehousing', 'SQL', 'MLflow'],
  },
  {
    title: 'BigQuery',
    icon: Database,
    description: 'Serverless data warehouse by Google Cloud. BigQuery enables SQL queries on petabytes of data with no infrastructure management. It offers built-in machine learning and real-time analytics capabilities.',
    shortDescription: '',
    startDate: '2024-01',
    useCases: ['Petabyte queries', 'ML in SQL', 'Serverless analytics', 'Real-time tables'],
    relatedTo: ['Snowflake', 'GCP', 'dbt', 'Data Warehousing', 'TensorFlow'],
  },
  {
    title: 'Stream Processing',
    icon: Activity,
    description: 'Processing data in real-time as it arrives. Stream processing enables immediate insights and actions on continuous data flows. Technologies like Kafka Streams, Flink, and Spark Streaming power real-time analytics.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Real-time pipelines', 'Event processing', 'Low-latency analytics', 'Windowed aggregations'],
    relatedTo: ['Apache Kafka', 'Apache Spark', 'Redis', 'Feature Stores'],
  },
  {
    title: 'Data Warehousing',
    icon: Database,
    description: 'Centralized repository for analytical data. Data warehouses use dimensional modeling with star and snowflake schemas to optimize query performance. They enable business intelligence and historical analysis.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Star schema', 'Dimensional modeling', 'BI reporting', 'Historical analytics'],
    relatedTo: ['Snowflake', 'BigQuery', 'dbt', 'SQL'],
  },
  {
    title: 'Apache Flink',
    icon: Rocket,
    description: 'Distributed stream processing framework for stateful computations. Flink provides low-latency, high-throughput streaming with exactly-once semantics. It excels at complex event processing and real-time analytics at scale.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['Stateful streaming', 'CEP patterns', 'Real-time ML', 'Event-time processing'],
    relatedTo: ['Apache Kafka', 'Stream Processing', 'Apache Spark', 'PyTorch'],
  },
  {
    title: 'Delta Lake',
    icon: Database,
    description: 'Open-source storage layer for data lakes. Delta Lake brings ACID transactions, schema enforcement, and time travel to Apache Spark. It bridges the gap between data lakes and data warehouses.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['ACID on data lake', 'Time travel queries', 'Schema evolution', 'Upserts/merges'],
    relatedTo: ['Databricks', 'Apache Spark', 'Data Lakehouse'],
  },
  {
    title: 'Data Governance',
    icon: Shield,
    description: 'Framework for managing data quality, security, and compliance. Data governance ensures data is accurate, consistent, and used appropriately across the organization. It encompasses policies, procedures, and standards for data management.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Data lineage', 'Access control', 'Compliance reporting', 'Data quality rules'],
    relatedTo: ['Data Catalog', 'Data Warehousing', 'ETL Pipelines'],
  },
  {
    title: 'Data Catalog',
    icon: Search,
    description: 'Centralized metadata repository for data discovery. Data catalogs enable users to find, understand, and trust data assets across the organization. They provide searchable inventories with lineage, quality metrics, and documentation.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['Data discovery', 'Metadata management', 'Business glossary', 'Impact analysis'],
    relatedTo: ['Data Governance', 'Databricks', 'Snowflake'],
  },
  {
    title: 'Great Expectations',
    icon: TestTube,
    description: 'Python library for data validation and documentation. Great Expectations helps teams define expectations about data quality and automatically validate datasets. It integrates into data pipelines to catch issues before they cause problems.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['Data validation', 'Pipeline testing', 'Data docs', 'Quality monitoring'],
    relatedTo: ['Apache Airflow', 'ETL Pipelines', 'dbt', 'Python'],
  },
  {
    title: 'Apache Hive',
    icon: Table,
    description: 'Data warehouse infrastructure built on Hadoop. Hive provides SQL-like interface for querying large datasets stored in distributed storage. It translates queries into MapReduce or Tez jobs for processing.',
    shortDescription: '',
    startDate: '2022-01',
    useCases: ['Data lake SQL', 'Batch analytics', 'Schema-on-read', 'Partitioned tables'],
    relatedTo: ['Apache Spark', 'Databricks', 'Data Warehousing'],
  },
  {
    title: 'AWS Glue',
    icon: Cloud,
    description: 'Serverless data integration service from AWS. Glue provides ETL capabilities, data catalog, and crawlers for automatic schema discovery. It simplifies data preparation for analytics and machine learning.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['Serverless ETL', 'Schema crawling', 'Data catalog', 'Spark jobs'],
    relatedTo: ['AWS', 'Apache Spark', 'ETL Pipelines', 'Data Catalog'],
  },
  {
    title: 'Data Lakehouse',
    icon: Database,
    description: 'Architecture combining data lake and data warehouse benefits. Data lakehouses provide lake flexibility with warehouse reliability using open formats like Delta Lake, Iceberg, and Hudi. They support both BI and ML workloads.',
    shortDescription: '',
    startDate: '2023-01',
    useCases: ['Unified analytics', 'Open table formats', 'BI and ML combined', 'Cost optimization'],
    relatedTo: ['Delta Lake', 'Databricks', 'Apache Spark', 'Data Warehousing'],
  },
]

// =============================================================================
// ALL SKILLS (for lookup by title) - Computed on module load
// =============================================================================

// Raw skill arrays (with startDate)
const rawAllSkills: SkillConfig[] = [
  ...aiMlSkills,
  ...cloudSkills,
  ...programmingSkills,
  ...dataEngineeringSkills,
]

// Enriched with computed experience - runs once on load
export const allSkills: SkillConfigWithExperience[] = enrichSkillsWithExperience(rawAllSkills)

/**
 * Skill categories for graph node coloring
 * Note: These still use raw configs, experience is computed via allSkills lookup
 */
export const skillCategories: Record<string, SkillConfig[]> = {
  'AI & Machine Learning': aiMlSkills,
  'Cloud & Infrastructure': cloudSkills,
  'Programming': programmingSkills,
  'Data Engineering': dataEngineeringSkills,
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
 * Get skill by title (with computed experience)
 */
export function getSkillByTitle(title: string): SkillConfigWithExperience | undefined {
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
  { skills: aiMlSkills, direction: 'right' },
  { skills: cloudSkills, direction: 'left' },
  { skills: programmingSkills, direction: 'right' },
  { skills: dataEngineeringSkills, direction: 'left' },
]

// =============================================================================
// TOP SKILLS GRAPH CONFIGURATION
// Displayed in the Skills section with percentage bars
// =============================================================================

export interface TopSkillConfig {
  label: string
  level: number  // 0-100 percentage
}

/**
 * Top expertise areas with proficiency levels
 * These are displayed as progress bars in the Skills section
 */
export const topSkillsGraph: TopSkillConfig[] = [
  { label: 'Python', level: 95 },
  { label: 'Docker', level: 94 },
  { label: 'SQL', level: 92 },
  { label: 'AWS/Cloud', level: 90 },
  { label: 'Linux', level: 89 },
  { label: 'Git/CI/CD', level: 88 },
]
