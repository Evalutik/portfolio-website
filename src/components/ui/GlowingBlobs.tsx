'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export function GlowingBlobs() {
  const { scrollYProgress } = useScroll()
  
  // Blob 1: Visible at start, fades out mid-page, travels from top-left to bottom-right
  const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.3, 0.35], [0.35, 0.4, 0.1, 0])
  const x1 = useTransform(scrollYProgress, [0, 0.35], ['10%', '40%'])
  const y1 = useTransform(scrollYProgress, [0, 0.35], ['20%', '50%'])
  
  // Blob 2: Appears mid-page on right, fades in and out, travels down
  const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 0.35, 0.35, 0])
  const x2 = useTransform(scrollYProgress, [0.25, 0.65], ['75%', '65%'])
  const y2 = useTransform(scrollYProgress, [0.25, 0.65], ['30%', '60%'])
  
  // Blob 3: Appears in second half on left, travels to bottom
  const opacity3 = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 0.4, 0.35, 0])
  const x3 = useTransform(scrollYProgress, [0.5, 0.9], ['20%', '35%'])
  const y3 = useTransform(scrollYProgress, [0.5, 0.9], ['50%', '80%'])
  
  // Blob 4: Appears at end on right side
  const opacity4 = useTransform(scrollYProgress, [0.7, 0.8, 0.95, 1], [0, 0.35, 0.4, 0.3])
  const x4 = useTransform(scrollYProgress, [0.7, 1], ['70%', '80%'])
  const y4 = useTransform(scrollYProgress, [0.7, 1], ['60%', '75%'])

  const blobs = [
    { 
      size: 350, 
      color: '#8b5cf6',
      xTransform: x1,
      yTransform: y1,
      opacityTransform: opacity1,
    },
    { 
      size: 300, 
      color: '#8b5cf6',
      xTransform: x2,
      yTransform: y2,
      opacityTransform: opacity2,
    },
    { 
      size: 320, 
      color: '#8b5cf6',
      xTransform: x3,
      yTransform: y3,
      opacityTransform: opacity3,
    },
    { 
      size: 280, 
      color: '#a78bfa',
      xTransform: x4,
      yTransform: y4,
      opacityTransform: opacity4,
    },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -5 }}>
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            left: blob.xTransform,
            top: blob.yTransform,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            opacity: blob.opacityTransform,
            x: '-50%',
            y: '-50%',
          }}
        />
      ))}
    </div>
  )
}
