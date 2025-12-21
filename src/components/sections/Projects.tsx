'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FileTree } from '@/components/ui/FileTree'
import { Button } from '@/components/ui/Button'
import { SkillDetailModal } from '@/components/ui/SkillDetailModal'
import { getProjectsByFolder, allProjects, ProjectConfig } from '@/config/projects'
import { getSkillByTitle, SkillConfig } from '@/config/skills'

export function Projects() {
  const folders = useMemo(() => getProjectsByFolder(), [])
  const [selectedProject, setSelectedProject] = useState<ProjectConfig>(allProjects[0])
  const [selectedSkill, setSelectedSkill] = useState<SkillConfig | null>(null)

  const handleSelect = (project: ProjectConfig) => {
    setSelectedProject(project)
  }

  const handleTechClick = (techName: string) => {
    const skill = getSkillByTitle(techName)
    if (skill) {
      setSelectedSkill(skill)
    }
  }

  return (
    <section id="projects" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading title="Projects" />

      <motion.div
        className="flex gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* File Tree - Left Side */}
        <div className="w-56 flex-shrink-0">
          <FileTree
            folders={folders}
            selectedId={selectedProject?.id || null}
            onSelect={handleSelect}
          />
        </div>

        {/* Preview Panel - Right Side - Mac OS Window Style */}
        <div className="flex-1 min-w-0">
          <div className="card overflow-hidden">
            {/* Window Title Bar - Mac OS Style */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/50">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              {/* File path in title bar */}
              <div className="flex-1 text-center">
                <span className="text-[11px] font-mono text-text-muted">
                  ~/src/projects/{selectedProject.folder}/{selectedProject.fileName}
                </span>
              </div>

              {/* Spacer to balance traffic lights */}
              <div className="w-[54px]" />
            </div>

            {/* Content area - matching Contact card padding (p-5) */}
            <div className="p-5 flex flex-col">
              {/* Title */}
              <h3 className="text-lg font-medium text-text-primary mb-3">
                {selectedProject.title}
              </h3>

              {/* Description */}
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Tech stack */}
              <div className="mb-6">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-2">
                  {'// '}technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTechClick(t)}
                      className="px-2 py-0.5 text-xs bg-surface-light border border-border rounded text-text-secondary font-mono hover:border-accent hover:text-text-primary cursor-pointer transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  href={selectedProject.github}
                  variant="secondary"
                  external
                  className="text-xs px-3 py-1.5"
                >
                  GitHub →
                </Button>
                <Button
                  href={selectedProject.live}
                  variant="secondary"
                  external
                  className="text-xs px-3 py-1.5"
                >
                  Demo →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </section>
  )
}
