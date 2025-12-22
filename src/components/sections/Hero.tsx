'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/common/Button'

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-primary/30 -top-[200px] -left-[200px]" />
      <div className="gradient-orb w-[500px] h-[500px] bg-accent/20 bottom-[10%] -right-[150px]" />

      {/* Container with proper max-width matching site layout */}
      <div className="max-w-3xl mx-auto px-4 w-full">
        <motion.div
          className="relative z-10 max-w-xl text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-text-secondary mb-6"
            variants={itemVariants}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Open to offers
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-text-primary"
            variants={itemVariants}
          >
            Andrei Fedyna
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-lg md:text-xl text-text-secondary mb-6 font-normal"
            variants={itemVariants}
          >
            <span className="text-gradient font-medium">Data Engineer</span>
            {' '}&{' '}
            <span className="text-gradient font-medium">AI Specialist</span>
          </motion.h2>

          {/* Tagline */}
          <motion.p
            className="text-base text-text-muted mb-10 max-w-lg mr-auto leading-relaxed"
            variants={itemVariants}
          >
            Building data pipelines and intelligent systems that transform complex data into actionable insights.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-row gap-3 justify-start"
            variants={itemVariants}
          >
            <Button href="#projects" variant="primary">
              View Work
            </Button>
            <Button href="#contact" variant="secondary">
              Contact
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
