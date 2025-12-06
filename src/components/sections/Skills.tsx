'use client'

import { useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillsMarquee3D } from '@/components/ui/SkillsMarquee3D'
import { SkillTag } from '@/components/ui/SkillTag'
import { SkillDetailModal } from '@/components/ui/SkillDetailModal'
import { skillRows, getSkillByTitle, SkillConfig } from '@/config/skills'

export function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)

  const handleSkillClick = (title: string) => {
    const skillData = getSkillByTitle(title)
    if (skillData) {
      setSelectedSkill(skillData)
    }
  }

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
      </div>
      
      <SkillsMarquee3D rows={rows} />
      
      {/* Skill Detail Modal */}
      <SkillDetailModal 
        skill={selectedSkill} 
        onClose={() => setSelectedSkill(null)} 
      />
    </section>
  )
}
