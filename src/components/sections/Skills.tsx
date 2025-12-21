'use client'

import { useState, useCallback } from 'react'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { SkillsMarquee3D } from '@/components/ui/skills/SkillsMarquee3D'
import { SkillTag } from '@/components/ui/skills/SkillTag'
import { SkillDetailModal } from '@/components/ui/skills/SkillDetailModal'
import { SkillGraphModal } from '@/components/ui/skills/SkillGraphModal'
import { skillRows, getSkillByTitle, SkillConfig } from '@/config/skills'

export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)
  const [showGraph, setShowGraph] = useState(false)

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
    <section id="skills" className="py-16 overflow-visible">
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <SectionHeading title="Skills & Technologies" />

        {/* Explore the Skill Galaxy - inline text with button */}
        <div className="-mt-10 mb-8 flex items-center gap-1.5 text-text-muted text-sm">
          {/* "Explore the" text */}
          <span>Visit the</span>

          {/* "Skill Galaxy" button - styled like Close button in galaxy view */}
          <button
            onClick={() => setShowGraph(true)}
            className="bg-surface/80 backdrop-blur-md border border-border rounded-lg px-3 py-1.5 flex items-center hover:bg-surface-light hover:border-border-light transition-all duration-200 btn-secondary-shine"
          >
            <span className="text-xs text-text-primary">Skill Galaxy</span>
          </button>
          <span>to explore all skills!</span>
        </div>
      </div>

      <SkillsMarquee3D rows={rows} />

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onSkillChange={handleSkillChange}
      />

      {/* Skill Graph Modal */}
      <SkillGraphModal
        isOpen={showGraph}
        onClose={() => setShowGraph(false)}
        onSkillClick={handleGraphSkillClick}
      />
    </section>
  )
}

