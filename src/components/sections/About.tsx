'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { TextReveal } from '@/components/ui/effects/TextReveal'

const PARAGRAPHS = [
  "I build robust data pipelines and intelligent systems that transform raw data into actionable insights. With experience across machine learning, distributed systems, and cloud infrastructure, I focus on creating solutions that are both scalable and maintainable.",
  "My background spans academia and industry, where I've developed expertise in ETL processes, real-time analytics, and deploying ML models to production. I believe in writing clean, well-documented code and designing systems that can evolve with business needs.",
  "Currently focused on building data platforms that enable organizations to make data-driven decisions with confidence.",
]

export function About() {
  const [currentParagraph, setCurrentParagraph] = useState(-1)

  const handleViewportEnter = () => {
    if (currentParagraph === -1) {
      setCurrentParagraph(0)
    }
  }

  return (
    <section id="about" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading
        title="About"
        subtitle="Data engineer specializing in scalable data infrastructure and ML systems."
      />

      <motion.div
        className="space-y-4 text-sm text-text-secondary leading-relaxed"
        initial={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        onViewportEnter={handleViewportEnter}
      >
        {PARAGRAPHS.map((text, index) => (
          <p key={index}>
            <TextReveal
              text={text}
              trigger={currentParagraph >= index}
              delay={0}
              stagger={0.05}
              wordDuration={0.4}
              onComplete={() => {
                if (index < PARAGRAPHS.length - 1) {
                  setCurrentParagraph(index + 1)
                }
              }}
            />
          </p>
        ))}
      </motion.div>
    </section>
  )
}
