'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'

export function Contact() {
  return (
    <section id="contact" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading 
        title="Contact" 
        subtitle="Open to new opportunities and collaborations."
      />

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <a 
              href="mailto:your.email@example.com" 
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm"
            >
              <span className="text-text-muted">Email</span>
              <span className="text-text-primary">your.email@example.com</span>
            </a>
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-muted hover:text-primary transition-colors text-sm"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-text-muted hover:text-primary transition-colors text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
          <Button href="mailto:your.email@example.com" variant="primary">
            Get in touch
          </Button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="text-center mt-16 pt-8 border-t border-border">
        <p className="text-text-muted text-xs">© 2024 Andrey Evalutik. All rights reserved.</p>
      </div>
    </section>
  )
}
