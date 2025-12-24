'use client'

import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotatingText } from '@/components/ui/effects/RotatingText'
import { Keypad } from '@/components/ui/effects/Keypad'
import { HERO_ROTATING_WORDS, HERO_ROTATION_INTERVAL } from '@/config/hero'

export function Hero() {
  const [gradientPosition, setGradientPosition] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const gradientRef = useRef<HTMLSpanElement>(null)

  const handleMagicClick = useCallback(() => {
    setGradientPosition((prev) => (prev + 50) % 150)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  const actualGradientPosition = isHovered ? 100 : gradientPosition

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
    <section className="relative min-h-screen flex flex-col justify-center py-20 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="gradient-orb w-[600px] h-[600px] bg-primary/20 -top-[200px] -left-[200px] opacity-50" />
      <div className="gradient-orb w-[500px] h-[500px] bg-accent/20 bottom-[10%] -right-[150px] opacity-50" />

      {/* Container - responsive layout */}
      <div className="max-w-3xl mx-auto px-4 w-full relative z-10 md:-mt-20">
        {/* Text content - moved up slightly on mobile */}
        <motion.div
          className="text-center md:text-left -mt-12 md:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main headline - bigger on mobile */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-text-primary"
            variants={itemVariants}
          >
            Hi, I&apos;m{' '}
            <span
              ref={gradientRef}
              className="text-gradient-animated cursor-default"
              style={{ backgroundPosition: `${actualGradientPosition}% 50%` }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Andrei
            </span>
          </motion.h1>

          {/* Rotating tagline - wrapper centers on mobile, text expands from left */}
          <motion.div
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-text-secondary flex justify-center md:justify-start"
            variants={itemVariants}
          >
            <span className="text-left">
              I build{' '}
              <RotatingText
                words={HERO_ROTATING_WORDS}
                interval={HERO_ROTATION_INTERVAL}
                className="min-w-[140px] sm:min-w-[180px] md:min-w-[220px] lg:min-w-[280px]"
              />
            </span>
          </motion.div>
        </motion.div>

        {/* Keypad - Desktop & Tablet: right side overlapping (same layout) */}
        <motion.div
          className="absolute right-0 top-1/2 translate-x-1/2 translate-y-[-20%] hidden md:block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Keypad onMagicClick={handleMagicClick} />
        </motion.div>
      </div>

      {/* Mobile: Two CTA buttons instead of Keypad */}
      <motion.div
        className="md:hidden flex justify-center items-center gap-3 mt-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <a
          href="#projects"
          className="btn-primary-animated text-center px-4 py-2 rounded-lg text-white font-medium text-sm"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span>View Work</span>
        </a>
        <a
          href="#contact"
          className="btn-secondary-shine text-center px-4 py-2 rounded-lg bg-surface border border-border text-text-primary font-medium text-sm transition-all hover:bg-surface-light hover:border-border-light"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <span>Contact</span>
        </a>
      </motion.div>
    </section>
  )
}
