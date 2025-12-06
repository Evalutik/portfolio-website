'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, useScroll } from 'framer-motion'

// ML/AI code snippets in different languages
const codeSnippets = [
  {
    id: 1,
    language: 'python',
    code: `model = Sequential([
  Dense(128, activation='relu'),
  Dropout(0.3),
  Dense(10, activation='softmax')
])`,
    position: { side: 'left' as const, top: '15%' },
  },
  {
    id: 2,
    language: 'python',
    code: `optimizer = Adam(lr=0.001)
model.compile(
  loss='categorical_crossentropy',
  metrics=['accuracy']
)`,
    position: { side: 'right' as const, top: '25%' },
  },
  {
    id: 3,
    language: 'python',
    code: `df = spark.read.parquet(path)
df_clean = df.dropna()
  .filter(col("value") > 0)
  .groupBy("category")`,
    position: { side: 'left' as const, top: '40%' },
  },
  {
    id: 4,
    language: 'sql',
    code: `SELECT features, labels
FROM training_data
WHERE epoch = (
  SELECT MAX(epoch)
  FROM model_runs
)`,
    position: { side: 'right' as const, top: '55%' },
  },
  {
    id: 5,
    language: 'python',
    code: `pipe = Pipeline([
  ('scaler', StandardScaler()),
  ('pca', PCA(n_components=50)),
  ('clf', RandomForest())
])`,
    position: { side: 'left' as const, top: '65%' },
  },
  {
    id: 6,
    language: 'python',
    code: `embeddings = model.encode(
  sentences,
  batch_size=32,
  show_progress=True
)`,
    position: { side: 'right' as const, top: '80%' },
  },
]

interface TypewriterCodeProps {
  code: string
  language: string
  side: 'left' | 'right'
  top: string
  triggerStart: number
  triggerEnd: number
}

function TypewriterCode({ 
  code, 
  language, 
  side, 
  top, 
  triggerStart,
  triggerEnd 
}: TypewriterCodeProps) {
  const [displayedCode, setDisplayedCode] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [opacity, setOpacity] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll()
  
  // Handle scroll progress changes
  useEffect(() => {
    const updateFromScroll = () => {
      const progress = scrollYProgress.get()
      const localProgress = Math.max(0, Math.min(1, (progress - triggerStart) / (triggerEnd - triggerStart)))
      const isVisible = progress >= triggerStart - 0.05 && progress <= triggerEnd + 0.1
      
      // Calculate opacity
      const newOpacity = isVisible 
        ? Math.min(1, localProgress * 3) * (1 - Math.max(0, (localProgress - 0.8) * 5)) 
        : 0
      
      setOpacity(newOpacity)
      
      // Typing effect
      if (!isVisible) {
        setDisplayedCode('')
      } else {
        const charsToShow = Math.floor(localProgress * code.length * 1.2)
        setDisplayedCode(code.slice(0, Math.min(charsToShow, code.length)))
      }
    }
    
    // Initial update
    updateFromScroll()
    
    // Subscribe to scroll changes using requestAnimationFrame for throttling
    let rafId: number
    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateFromScroll)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [scrollYProgress, triggerStart, triggerEnd, code])
  
  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed pointer-events-none select-none font-mono text-[10px] md:text-xs lg:text-sm hidden md:block"
      style={{
        top,
        left: side === 'left' ? '2%' : 'auto',
        right: side === 'right' ? '2%' : 'auto',
        opacity,
        zIndex: 0,
        maxWidth: '200px',
      }}
    >
      {/* Language tag */}
      <div className="text-text-muted/30 text-[10px] mb-1 uppercase tracking-wider">
        {language}
      </div>
      
      {/* Code block */}
      <pre className="text-text-muted/25 leading-relaxed whitespace-pre">
        {displayedCode}
        <span 
          className="inline-block w-[2px] h-[1em] bg-text-muted/40 ml-[1px] align-middle"
          style={{ opacity: showCursor && displayedCode.length < code.length ? 1 : 0 }}
        />
      </pre>
    </div>
  )
}

/**
 * FloatingCode
 * 
 * Background decoration component that shows ML/AI code snippets
 * appearing on scroll with a typewriter effect.
 * Snippets appear on left and right edges, partially off-screen.
 * Hidden on mobile for performance.
 */
export function FloatingCode() {
  // Memoize snippet configs to prevent re-renders
  const snippetConfigs = useMemo(() => 
    codeSnippets.map((snippet, index) => ({
      ...snippet,
      triggerStart: 0.05 + index * 0.14,
      triggerEnd: 0.05 + index * 0.14 + 0.18,
    })), 
  [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {snippetConfigs.map((snippet) => (
        <TypewriterCode
          key={snippet.id}
          code={snippet.code}
          language={snippet.language}
          side={snippet.position.side}
          top={snippet.position.top}
          triggerStart={snippet.triggerStart}
          triggerEnd={snippet.triggerEnd}
        />
      ))}
    </div>
  )
}
