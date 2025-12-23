'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Menu, Home } from 'lucide-react'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [galaxyOpen, setGalaxyOpen] = useState(false)

  // Track galaxy modal open state via body class
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setGalaxyOpen(document.body.classList.contains('galaxy-open'))
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // If at the very top, don't highlight any section
      if (window.scrollY < 100) {
        setActiveSection('')
        return
      }

      // Check if at the bottom of the page first
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50
      if (isAtBottom) {
        setActiveSection('contact')
        return
      }

      // Find active section - prioritize sections whose top has entered upper 40% of viewport
      const sections = navItems.map(item => item.href.replace('#', ''))
      const threshold = window.innerHeight * 0.4 // Section becomes active when top enters upper 40%

      // Go through sections in reverse to prioritize later sections
      for (const section of [...sections].reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Section is active if its top is above the threshold
          if (rect.top <= threshold) {
            setActiveSection(section)
            return
          }
        }
      }

      // If no section is above threshold, clear selection
      setActiveSection('')
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on scroll
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => setIsOpen(false)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  const handleClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${galaxyOpen ? 'opacity-0 pointer-events-none' : ''
          } ${scrolled ? 'py-3' : 'py-4'}`}
        initial={{ y: -100 }}
        animate={{ y: galaxyOpen ? -100 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <nav
            className={`flex items-center justify-between px-4 py-2 rounded-full transition-all duration-300 border ${scrolled
              ? 'bg-surface/80 backdrop-blur-xl border-border shadow-lg'
              : 'bg-transparent border-transparent'
              }`}
          >
            {/* Logo: appears only when header is scrolled (hero not visible) */}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="text-sm font-medium text-text-primary hover:text-accent transition-colors"
            >
              <div className="min-w-[40px] md:min-w-[140px] flex items-center">
                <AnimatePresence mode="wait">
                  {scrolled ? (
                    <motion.span
                      key="logo"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                      className="inline-block"
                    >
                      <span className="font-mono hidden md:inline">Andrei Fedyna</span>
                      <Home className="w-4 h-4 md:hidden" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="logo-empty"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -8 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {/* placeholder to preserve layout */}
                      &nbsp;
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className={`relative px-3 py-1.5 text-xs rounded-full transition-colors duration-200 ${activeSection === item.href.replace('#', '')
                    ? 'bg-white/10 text-zinc-200 font-medium'
                    : 'text-text-secondary hover:text-zinc-200'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center text-text-primary"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu - Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Content */}
            <div className="relative flex flex-col h-full pt-24 pb-8 px-8">
              {/* Menu Items */}
              <nav className="flex-1 flex flex-col justify-center gap-2">
                {navItems.map((item, index) => {
                  const isActive = activeSection === item.href.replace('#', '')
                  return (
                    <motion.button
                      key={item.href}
                      onClick={() => handleClick(item.href)}
                      className="group flex items-center justify-between py-3"
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <span
                        className={`text-2xl font-medium transition-colors duration-200 ${isActive
                            ? 'text-accent'
                            : 'text-text-primary group-hover:text-accent'
                          }`}
                      >
                        {item.label}
                      </span>

                      {/* Progress indicator */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${isActive
                              ? 'bg-accent scale-125'
                              : 'bg-border group-hover:bg-text-muted'
                            }`}
                          layoutId={`dot-${item.href}`}
                        />
                        <div
                          className={`w-8 h-px transition-all duration-300 ${isActive ? 'bg-accent' : 'bg-border'
                            }`}
                        />
                      </div>
                    </motion.button>
                  )
                })}
              </nav>

              {/* Bottom Section - Social Links */}
              <motion.div
                className="flex items-center justify-center gap-6 pt-8 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <a
                  href="https://www.linkedin.com/in/andrei-fedyna/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/Evalutik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side Progress Indicator - Desktop */}
      <motion.div
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2 transition-opacity duration-300 ${scrolled && !isOpen && !galaxyOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleClick(item.href)}
            className="group relative flex items-center justify-end"
          >
            <span className="absolute right-5 text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono">
              {item.label.toLowerCase()}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${activeSection === item.href.replace('#', '')
                ? 'bg-accent scale-125'
                : 'bg-border group-hover:bg-text-muted'
                }`}
            />
          </button>
        ))}
      </motion.div>
    </>
  )
}
