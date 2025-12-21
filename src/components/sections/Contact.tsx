'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/common/SectionHeading'
import { Button } from '@/components/ui/common/Button'
import { Github, Linkedin } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading
        title="Contact"
        subtitle="Open to new opportunities and collaborations."
      />

      <motion.div
        className="card p-5 relative"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {/* Button: top right on desktop, below on mobile */}
        <div className="hidden sm:block">
          <div className="absolute top-4 right-4">
            <Button href="mailto:andreyfedyna@gmail.com" variant="primary" external>
              Get in touch
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-3">
            <a
              href="mailto:andreyfedyna@gmail.com"
              className="group inline-flex items-center gap-2 text-sm transition-colors"
            >
              <span className="text-text-muted">Email</span>
              <span className="text-text-primary group-hover:text-accent transition-colors">andreyfedyna@gmail.com</span>
            </a>
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 rounded-md bg-surface border border-border text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>
          {/* Button: below content on mobile, full width */}
          <div className="sm:hidden mt-4">
            <Button href="mailto:andreyfedyna@gmail.com" variant="primary" className="w-full" external>
              Get in touch
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-border">
        <p className="text-text-muted text-xs">© {new Date().getFullYear()} Andrei Fedyna. All rights reserved.</p>
      </div>
    </section>
  )
}
