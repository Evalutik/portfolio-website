'use client'

import { useCallback, useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'

export function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options: ISourceOptions = {
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
      },
      color: {
        value: ['#6366f1', '#8b5cf6', '#a78bfa'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.1, max: 0.3 },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#6366f1',
        opacity: 0.08,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.2,
          },
        },
      },
    },
    detectRetina: true,
  }

  if (!init) return null

  return (
    <div className="fixed inset-0 -z-10">
      <Particles
        id="tsparticles"
        options={options}
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
  )
}
