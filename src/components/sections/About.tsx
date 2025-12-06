'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function About() {
  return (
    <section id="about" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading 
        title="About" 
        subtitle="Data engineer specializing in scalable data infrastructure and ML systems."
      />

      <motion.div
        className="space-y-4 text-sm text-text-secondary leading-relaxed"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <p>
          I build robust data pipelines and intelligent systems that transform raw data into actionable insights. With experience across machine learning, distributed systems, and cloud infrastructure, I focus on creating solutions that are both scalable and maintainable.
        </p>
        <p>
          My background spans academia and industry, where I've developed expertise in ETL processes, real-time analytics, and deploying ML models to production. I believe in writing clean, well-documented code and designing systems that can evolve with business needs.
        </p>
        <p>
          Currently focused on building data platforms that enable organizations to make data-driven decisions with confidence.
        </p>
      </motion.div>
    </section>
  )
}
