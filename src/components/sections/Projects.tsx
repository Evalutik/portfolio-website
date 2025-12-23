'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { FileTree } from '@/components/ui/projects/FileTree'
import { Button } from '@/components/ui/common/Button'
import { SkillDetailModal } from '@/components/ui/skills/SkillDetailModal'
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
      <SectionHeading
        title="Projects"
        subtitle="Browse the directory tree and select a project to inspect its details."
      />

      <motion.div
        className="flex flex-col md:flex-row gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* File Tree - Top on mobile, Left side on desktop */}
        <div className="w-full md:w-56 md:flex-shrink-0">
          <FileTree
            folders={folders}
            selectedId={selectedProject?.id || null}
            onSelect={handleSelect}
          />
        </div>

        {/* Preview Panel - Right Side - Mac OS Window Style */}
        <div className="flex-1 min-w-0">
          <div className="card overflow-hidden">
            {/* Compact Window Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface/30">
              {/* Traffic lights - smaller */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>

              {/* File path - right aligned */}
              <span className="text-[10px] font-mono text-text-muted">
                {selectedProject.folder}/{selectedProject.fileName}
              </span>
            </div>

            {/* Content area */}
            <div className="p-5">
              {/* Title with subtle animation on change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-text-primary mb-3">
                    {selectedProject.title}
                  </h3>

                  {/* Description - supports multiple paragraphs */}
                  <div className="text-text-muted text-sm leading-relaxed mb-6 space-y-3">
                    {selectedProject.description.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Tech stack */}
              <div className="mb-6">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-2">
                  {'// '}technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((t, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleTechClick(t)}
                      className="px-2 py-0.5 text-xs bg-surface-light border border-border rounded text-text-secondary font-mono hover:border-accent hover:text-text-primary cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Action buttons - no arrows */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  href={selectedProject.github}
                  variant="secondary"
                  external
                  className="text-xs px-3 py-1.5"
                >
                  GitHub
                </Button>
                <Button
                  href={selectedProject.live}
                  variant="secondary"
                  external
                  className="text-xs px-3 py-1.5"
                >
                  Live Demo
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
    </section >
  )
}
