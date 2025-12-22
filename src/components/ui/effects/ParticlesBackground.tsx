'use client'

import { useEffect, useState, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import {
  PARTICLES_ENABLED,
  PARTICLES_COLORS,
} from '@/config/colors'

export function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (!PARTICLES_ENABLED) return

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Configuration for the Sharp (Foreground) Particles
  const sharpOptions: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 20, // Reduced from 30
        density: { enable: true, width: 1920, height: 1080 },
      },
      color: { value: PARTICLES_COLORS },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.1, max: 0.4 }, // Reduced opacity for subtlety
        animation: { enable: true, speed: 0.8, sync: false, mode: 'auto' },
      },
      size: { value: { min: 1, max: 3 } },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      links: { enable: false },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
      },
    },
    detectRetina: true,
  }), [])

  // Configuration for the Blurred (Background) Particles
  const blurOptions: ISourceOptions = useMemo(() => ({
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 10, // Reduced from 15
        density: { enable: true, width: 1920, height: 1080 },
      },
      color: { value: PARTICLES_COLORS },
      shape: { type: 'circle' },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: { enable: true, speed: 0.3, sync: false, mode: 'auto' },
      },
      size: { value: { min: 4, max: 8 } }, // Larger for bokeh effect
      move: {
        enable: true,
        speed: 0.4, // Slower background movement
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      links: { enable: false },
    },
    detectRetina: true,
  }), [])

  if (!PARTICLES_ENABLED || !init) return null

  return (
    <>
      {/* Layer 1: Blurred Background (Deep Bokeh) */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{ willChange: 'opacity', filter: 'blur(3px)' }} // CSS Blur makes them look out of focus
      >
        <Particles
          id="tsparticles-blur"
          options={blurOptions}
          className="absolute inset-0"
        />
      </div>

      {/* Layer 2: Sharp Foreground (Focus Plane) */}
      <div
        className="fixed inset-0 -z-10"
        style={{ willChange: 'opacity' }}
      >
        <Particles
          id="tsparticles-sharp"
          options={sharpOptions}
          className="absolute inset-0"
        />
        {/* Gradient fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, var(--background) 100%)',
          }}
        />
      </div>
    </>
  )
}
