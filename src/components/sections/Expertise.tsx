'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'

const expertise = [
  { label: 'Data Engineering', level: 95 },
  { label: 'Python / SQL', level: 92 },
  { label: 'Cloud Platforms', level: 88 },
  { label: 'Machine Learning', level: 85 },
  { label: 'System Design', level: 82 },
]

export function Expertise() {
  return (
    <section id="expertise" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading title="Expertise" />

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {expertise.map((item, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-text-secondary text-sm">{item.label}</span>
              <span className="text-text-muted text-xs font-mono">{item.level}%</span>
            </div>
            <div className="w-full bg-surface border border-border rounded h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent rounded"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.level}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
