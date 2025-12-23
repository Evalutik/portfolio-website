'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { SkillsMarquee3D } from '@/components/ui/skills/SkillsMarquee3D'
import { SkillTag } from '@/components/ui/skills/SkillTag'
import { SkillDetailModal } from '@/components/ui/skills/SkillDetailModal'
import { SkillGraphModal } from '@/components/ui/skills/SkillGraphModal'
import { skillRows, getSkillByTitle, SkillConfig, topSkillsGraph } from '@/config/skills'


export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)
  const [showGraph, setShowGraph] = useState(false)
  const [preloadGraph, setPreloadGraph] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Preload graph when Skills section comes into view
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !preloadGraph) {
          setPreloadGraph(true)
        }
      },
      { threshold: 0.1 } // Trigger when 10% of section is visible
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [preloadGraph])

  const handleSkillClick = (title: string) => {
    const skillData = getSkillByTitle(title)
    if (skillData) {
      setSelectedSkill(skillData)
    }
  }

  const handleGraphSkillClick = (skill: SkillConfig) => {
    setSelectedSkill(skill)
  }

  // Handle skill change from related skills - close then reopen with animation
  const handleSkillChange = useCallback((newSkill: SkillConfig) => {
    // Close current modal
    setSelectedSkill(null)
    // Wait for close animation to complete, then open new skill
    setTimeout(() => {
      setSelectedSkill(newSkill)
    }, 300)
  }, [])

  const rows = skillRows.map(row => ({
    skills: row.skills.map((s, i) => (
      <SkillTag
        key={i}
        title={s.title}
        icon={s.icon}
        onClick={() => handleSkillClick(s.title)}
      />
    )),
    direction: row.direction,
  }))

  return (
    <section id="skills" className="py-16 overflow-visible" ref={sectionRef}>
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <SectionHeading title="Skills & Technologies" />

        {/* Explore the Skill Galaxy - inline text with button */}
        <div className="-mt-10 mb-8 flex items-center gap-1.5 text-text-muted text-sm">
          {/* "Explore the" text */}
          <span>Visit the</span>

          {/* "Skill Galaxy" button - styled like Close button in galaxy view */}
          <span className="btn-purple-glow-wrapper">
            <button
              onClick={() => setShowGraph(true)}
              className="bg-surface/80 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 flex items-center hover:bg-surface-light hover:border-border-light transition-all duration-200 btn-secondary-shine"
            >
              <span className="text-xs text-text-primary">Skill Galaxy</span>
            </button>
          </span>
          <span>to explore all skills!</span>
        </div>
      </div>

      <SkillsMarquee3D rows={rows} />

      {/* Expertise - Most experienced areas */}
      <div className="max-w-3xl mx-auto px-4 mt-32">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-4">
          {'// '}most experienced areas
        </span>
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {topSkillsGraph.map((item, index) => (
            <div key={index} className="group">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-text-secondary text-sm">{item.label}</span>
                <span className="text-text-muted text-xs font-mono">{item.level}%</span>
              </div>
              <div className="w-full bg-surface border border-border rounded h-1.5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-dark to-accent rounded"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.level}%` }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onSkillChange={handleSkillChange}
      />

      {/* Skill Graph Modal - single instance, preloads when section visible */}
      {(preloadGraph || showGraph) && (
        <SkillGraphModal
          isOpen={preloadGraph || showGraph}
          onClose={() => setShowGraph(false)}
          onSkillClick={handleGraphSkillClick}
          preloadMode={preloadGraph && !showGraph}
        />
      )}
    </section>
  )
}
