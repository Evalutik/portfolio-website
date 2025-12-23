'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useCallback } from 'react'
import { SkillConfig, getSkillCategory, getSkillByTitle, CATEGORY_COLORS } from '@/config/skills'
import { SKILL_WAVE } from '@/config/colors'

interface SkillDetailModalProps {
  skill: SkillConfig | null
  onClose: () => void
  onSkillChange?: (skill: SkillConfig) => void
}

/**
 * SkillDetailModal
 * 
 * Full-screen immersive view that simulates "camera moving into the card".
 * Uses perspective and translateZ for depth effect.
 * Matches the dark theme with accent glows.
 */
export function SkillDetailModal({ skill, onClose, onSkillChange }: SkillDetailModalProps) {
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (!skill) return

    // Prevent scroll events
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      return false
    }

    // Prevent keyboard scroll
    const preventKeyScroll = (e: KeyboardEvent) => {
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'PageUp', 'PageDown', 'Home', 'End']
      if (scrollKeys.includes(e.code)) {
        e.preventDefault()
      }
    }

    // Add event listeners
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('keydown', preventKeyScroll, { capture: true })
    window.addEventListener('keydown', handleKeyDown)

    // Also set styles to hide scrollbar
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      window.removeEventListener('wheel', preventScroll, { capture: true })
      window.removeEventListener('touchmove', preventScroll, { capture: true })
      window.removeEventListener('scroll', preventScroll, { capture: true })
      window.removeEventListener('keydown', preventKeyScroll, { capture: true })
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.overflow = ''
    }
  }, [skill, handleKeyDown])

  const Icon = skill?.icon
  const category = skill ? getSkillCategory(skill.title) : undefined
  const categoryColor = category ? CATEGORY_COLORS[category] : undefined

  // Handle related skill click
  const handleRelatedClick = useCallback((relatedTitle: string) => {
    const relatedSkill = getSkillByTitle(relatedTitle)
    if (relatedSkill && onSkillChange) {
      onSkillChange(relatedSkill)
    }
  }, [onSkillChange])

  return (
    <AnimatePresence>
      {skill && (
        <motion.div
          className="fixed inset-0 z-50"
          style={{ perspective: '1200px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.21 }}
        >
          {/* Dark backdrop with fade */}
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.175 }}
          />

          {/* Content container - camera zooms INTO this */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
            initial={{
              scale: 0.5,
              rotateX: 15,
              z: -800,
              opacity: 0,
              filter: 'blur(10px)',
            }}
            animate={{
              scale: 1,
              rotateX: 0,
              z: 0,
              opacity: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              scale: 0.5,
              rotateX: -10,
              z: -600,
              opacity: 0,
              filter: 'blur(8px)',
            }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 234,
              mass: 0.8,
            }}
          >
            {/* Main content area - centered with left-aligned text */}
            <div className="w-full h-full flex items-center justify-center px-6">
              <div className="w-full max-w-xl">

                {/* Icon */}
                <motion.div
                  className="mb-4"
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-border">
                    {Icon && <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="text-2xl md:text-3xl font-semibold text-text mb-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3, ease: 'easeOut' }}
                >
                  {skill.title}
                </motion.h1>

                {/* Experience */}
                {skill.experience && (
                  <motion.span
                    className="inline-block text-xs font-mono text-text-muted mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    {skill.experience} experience
                  </motion.span>
                )}

                {/* Category with colored dot */}
                {category && categoryColor && (
                  <motion.div
                    className="flex items-center gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.22, duration: 0.3 }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="text-xs text-text-muted">
                      {category}
                    </span>
                  </motion.div>
                )}

                {/* Description */}
                <motion.p
                  className="text-sm text-text-secondary leading-relaxed mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3, ease: 'easeOut' }}
                >
                  {skill.description}
                </motion.p>

                {/* Use cases - non-interactive styling */}
                {skill.useCases && skill.useCases.length > 0 && (
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
                  >
                    <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
                      {'// '}use cases
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.useCases.map((useCase, index) => (
                        <motion.span
                          key={useCase}
                          className="px-2 py-0.5 text-xs bg-surface-light border border-border rounded text-text-secondary font-mono"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 + index * 0.03, duration: 0.2 }}
                        >
                          {useCase}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Related skills - clickable */}
                {skill.relatedTo && skill.relatedTo.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3, ease: 'easeOut' }}
                  >
                    <h3 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-2">
                      {'// '}related
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.relatedTo.slice(0, 6).map((related, index) => (
                        <motion.span
                          key={related}
                          onClick={() => handleRelatedClick(related)}
                          className="px-2 py-0.5 text-xs bg-surface-light border border-border rounded text-text-secondary font-mono hover:border-accent hover:text-text-primary cursor-pointer transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.45 + index * 0.03, duration: 0.2 }}
                        >
                          {related}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Return button with diagonal shine wave */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.3 }}
                >
                  <button
                    onClick={onClose}
                    className="group font-mono text-xs text-text-muted hover:text-accent transition-colors relative"
                  >
                    {/* Base gray text */}
                    <span>return();</span>

                    {/* Bright purple overlay text with animated clip-path for diagonal sweep */}
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        color: SKILL_WAVE,
                        textShadow: `0 0 8px ${SKILL_WAVE}cc, 0 0 16px ${SKILL_WAVE}80`
                      }}
                      initial={{
                        clipPath: 'polygon(-40% 0%, -20% 0%, -60% 100%, -80% 100%)'
                      }}
                      animate={{
                        clipPath: [
                          'polygon(-40% 0%, -20% 0%, -60% 100%, -80% 100%)',
                          'polygon(100% 0%, 140% 0%, 100% 100%, 60% 100%)',
                          'polygon(160% 0%, 180% 0%, 140% 100%, 120% 100%)'
                        ]
                      }}
                      transition={{
                        delay: 2,
                        duration: 0.6,
                        ease: 'easeInOut',
                        times: [0, 0.7, 1],
                        repeat: Infinity,
                        repeatDelay: 7.4
                      }}
                    >
                      return();
                    </motion.span>
                  </button>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
