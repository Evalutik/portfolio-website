'use client'

import { motion } from 'framer-motion'
import { GlowCard } from './GlowCard'

interface EducationCardProps {
  school: string
  degree: string
  field: string
  year: string
  details: string
}

export function EducationCard({
  school,
  degree,
  field,
  year,
  details,
}: EducationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <GlowCard>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-base font-medium text-text-primary">{degree}</h3>
              <p className="text-primary text-sm">{school}</p>
            </div>
            <span className="text-text-muted text-xs font-mono">{year}</span>
          </div>
          <p className="text-text-secondary text-sm mb-2">{field}</p>
          <p className="text-text-muted text-sm leading-relaxed">{details}</p>
        </div>
      </GlowCard>
    </motion.div>
  )
}
