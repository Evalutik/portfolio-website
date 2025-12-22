'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Menu } from 'lucide-react'

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
              <div className="min-w-[40px] md:min-w-[140px]">
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
                      <span className="font-mono md:hidden">AF</span>
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="fixed top-20 left-4 right-4 z-50 md:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="bg-surface border border-border rounded-2xl p-2 shadow-xl">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all duration-200 ${activeSection === item.href.replace('#', '')
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                      }`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
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
