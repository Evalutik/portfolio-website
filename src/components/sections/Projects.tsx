'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProjectCard } from '@/components/ui/ProjectCard'

const projects = [
  {
    title: 'Real-Time Data Pipeline',
    description: 'Scalable streaming pipeline processing 10M+ events/day with sub-second latency using Kafka and Flink.',
    tech: ['Apache Kafka', 'Flink', 'Python', 'AWS'],
    github: '#',
    live: '#',
  },
  {
    title: 'ML Feature Store',
    description: 'Centralized feature management platform enabling consistent feature serving across training and inference.',
    tech: ['Python', 'Redis', 'PostgreSQL', 'Docker'],
    github: '#',
    live: '#',
  },
  {
    title: 'Data Quality Framework',
    description: 'Automated data validation and monitoring system with alerting for production data pipelines.',
    tech: ['Great Expectations', 'Airflow', 'Grafana'],
    github: '#',
    live: '#',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Interactive BI dashboard for real-time business metrics with drill-down capabilities.',
    tech: ['React', 'D3.js', 'FastAPI', 'ClickHouse'],
    github: '#',
    live: '#',
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading title="Projects" />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </motion.div>
    </section>
  )
}
