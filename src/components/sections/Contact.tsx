'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { Button } from '@/components/ui/common/Button'
import { Github, Linkedin, Download, Mail } from 'lucide-react'
import { CVDownloadModal } from '@/components/ui/modals/CVDownloadModal'

export function Contact() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="contact" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading
        title="Contact"
        subtitle="Let's build something great together."
      />

      <motion.div
        className="card p-5"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex flex-col gap-5">
          {/* About collaboration paragraph */}
          <p className="text-text-secondary text-sm leading-relaxed">
            I enjoy working on interesting projects and teaming up with people who care about
            what they build. Whether it&apos;s diving into a complex technical challenge, prototyping
            a new product idea, or improving an existing system, I like being part of teams where
            everyone brings something to the table. If you&apos;re looking for someone who communicates
            well and enjoys solving problems together, I&apos;d be happy to chat.
          </p>

          {/* CV download info */}
          <p className="text-text-muted text-sm">
            You can download a trimmed version of my CV (without sensitive personal details).
            For the full version, feel free to <a href="mailto:andreyfedyna@gmail.com" className="text-accent hover:underline">contact me directly</a>.
          </p>

          {/* Download CV button with shine effect */}
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-secondary-shine w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border text-text-primary text-sm font-medium transition-all hover:bg-surface-light hover:border-border-light"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download CV
              </span>
            </button>
          </div>

          {/* Card footer: contact info and Get in touch button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
            {/* Get in touch button - First on mobile, right side on desktop */}
            <div className="order-first sm:order-last sm:flex-shrink-0">
              <Button href="mailto:andreyfedyna@gmail.com" variant="primary" className="w-full sm:w-auto" external>
                Get in touch
              </Button>
            </div>

            {/* Contact info - left side on desktop, below button on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="mailto:andreyfedyna@gmail.com"
                className="group inline-flex items-center gap-2 text-sm transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
                <span className="text-text-primary group-hover:text-accent transition-colors">andreyfedyna@gmail.com</span>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/andrei-fedyna/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
                <a
                  href="https://github.com/Evalutik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CV Download Modal */}
      <CVDownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-border">
        <p className="text-text-muted text-xs">© {new Date().getFullYear()} Andrei Fedyna. All rights reserved.</p>
      </div>
    </section>
  )
}

