'use client'

import { motion } from 'framer-motion'
import { Button } from './Button'
import { GlowCard } from './GlowCard'

interface ProjectCardProps {
  title: string
  description: string
  tech: string[]
  github: string
  live: string
}

export function ProjectCard({
  title,
  description,
  tech,
  github,
  live,
}: ProjectCardProps) {
  return (
    <motion.div
      className="h-full"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <GlowCard className="h-full flex">
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-4">
            <h3 className="text-base font-medium text-text-primary mb-2">
              {title}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mb-4 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {tech.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-surface-light border border-border rounded text-xs text-text-secondary font-mono"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border mt-auto">
            <Button
              href={github}
              variant="secondary"
              external
              className="text-xs px-3 py-1.5"
            >
              GitHub →
            </Button>
            <Button
              href={live}
              variant="secondary"
              external
              className="text-xs px-3 py-1.5"
            >
              Demo →
            </Button>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  )
}