'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { TextReveal } from '@/components/ui/effects/TextReveal'

// Calculate age dynamically to show "20-year-old" etc.
const BIRTH_DATE = '2005-07'

function calculateAge(startDate: string): number {
  const [year, month] = startDate.split('-').map(Number)
  const start = new Date(year, month - 1)
  const now = new Date()

  const totalMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth())
  const years = Math.floor(totalMonths / 12)
  return years
}

const age = calculateAge(BIRTH_DATE)

const PARAGRAPHS = [
  `I'm Andrei, a ${age}-year-old AI Architect, MLOps Engineer, and Software Developer. This website is my interactive business card and I hope you will like staying here!`,
  "I combine deep mathematical foundations with rigorous systems engineering to build intelligent architectures that solve real-world problems. My expertise covers the full lifecycle, from designing custom neural networks to orchestrating distributed cloud infrastructure. I focus on creating resilient ecosystems where machine learning models integrate seamlessly with robust, scalable software.",
  "I am driven by a hunger for difficult problems and a constant desire to evolve. Whether designing a system or leading a technical initiative, I bring creativity and purpose to my work. I am ready to join teams that move fast and build something meaningful."
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
        subtitle="Bridging the gap between mathematical theory and rigorous systems engineering."
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
