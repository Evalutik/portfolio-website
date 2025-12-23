'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface SectionDividerProps {
  variant?: 'code' | 'data' | 'dots' | 'wave' | 'spacer'
}

// Real code snippets for the code divider
const codeSnippets = [
  'def transform(df):',
  'spark.read.parquet()',
  'SELECT * FROM',
  'GROUP BY date',
  'pipeline.fit(X)',
  'model.predict()',
  'async def fetch():',
  'await client.get()',
  'return DataFrame',
  '.map(lambda x:',
  'JOIN ON id =',
  'ORDER BY DESC',
  'import pandas',
  'from sklearn',
  'class Pipeline:',
  'yield batch',
  '@dataclass',
  'typing.Dict',
]

export function SectionDivider({ variant = 'code' }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], [-100, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3])
  const dataX = useTransform(scrollYProgress, [0, 1], [50, -50])

  // spacer variant - just empty space, same height as dots
  if (variant === 'spacer') {
    return <div className="py-16" />
  }

  // Render content based on variant, ensuring hooks were called unconditionally above
  return (
    <div ref={ref} className={`relative overflow-hidden ${variant === 'wave' ? 'py-12' : 'py-16'} ${variant === 'code' ? 'select-none pointer-events-none' : ''}`}>
      {variant === 'code' && (
        <motion.div
          className="flex justify-center gap-4 text-text-muted/20 font-mono text-xs"
          style={{ x, opacity }}
        >
          {codeSnippets.map((snippet, i) => (
            <span key={i} className="whitespace-nowrap">
              {snippet}
            </span>
          ))}
        </motion.div>
      )}

      {variant === 'data' && (
        <motion.div
          className="flex justify-center gap-4"
          style={{ x: dataX, opacity }}
        >
          {/* Defined inline to avoid hook dependency issues locally */}
          {[24, 32, 18, 28, 22, 35, 20, 30, 25, 33, 19, 27, 23, 31, 21, 29, 26, 34, 20, 28, 24, 32, 18, 30, 22, 35, 25, 19, 27, 31].map((height, i) => (
            <motion.div
              key={i}
              className="w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
              style={{ height }}
            />
          ))}
        </motion.div>
      )}

      {variant === 'wave' && (
        <svg
          className="w-full h-12 text-accent/10"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>
      )}

      {variant === 'dots' && (
        <motion.div
          className="flex justify-center gap-2"
          style={{ opacity }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-border"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
