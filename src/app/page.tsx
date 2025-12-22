import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Education } from '@/components/sections/Education'
import { Expertise } from '@/components/sections/Expertise'
import { Contact } from '@/components/sections/Contact'
import { Navigation } from '@/components/ui/Navigation'
import { ParticlesBackground } from '@/components/ui/effects/ParticlesBackground'
import { GlowingBlobs } from '@/components/ui/effects/GlowingBlobs'
import { SectionDivider } from '@/components/ui/common/SectionDivider'
import { FloatingCode } from '@/components/ui/effects/FloatingCode'
import { CursorGlow } from '@/components/ui/effects/CursorGlow'
import { ParallaxGrid } from '@/components/ui/effects/ParallaxGrid'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Background effects - layered */}
      <ParallaxGrid />
      <GlowingBlobs />
      <ParticlesBackground />
      <FloatingCode />
      <CursorGlow />

      {/* Navigation */}
      <Navigation />

      {/* Content */}
      <Hero />
      <SectionDivider variant="spacer" />
      <About />
      <div className="py-8" /> {/* Simple spacer before Skills */}
      <Skills />
      <div className="py-8" /> {/* Simple spacer after Skills */}
      <Projects />
      <SectionDivider variant="wave" />
      <Education />
      <Expertise />
      <Experience />
      <SectionDivider variant="code" />
      <Contact />
    </main>
  )
}
