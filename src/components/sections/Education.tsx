'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EducationCard } from '@/components/ui/EducationCard'

const education = [
  {
    school: 'University Name',
    degree: 'M.Sc. Computer Science',
    field: 'Data Science & Machine Learning',
    year: '2022 - 2024',
    details: 'Thesis on distributed data processing systems. Focus on ML pipelines and big data.',
  },
  {
    school: 'University Name',
    degree: 'B.Sc. Computer Science',
    field: 'Computer Science',
    year: '2018 - 2022',
    details: 'GPA: 3.9/4.0. Coursework in databases, algorithms, and distributed systems.',
  },
]

export function Education() {
  return (
    <section id="education" className="py-16 px-4 max-w-3xl mx-auto">
      <SectionHeading title="Education" />

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        {education.map((edu, index) => (
          <EducationCard key={index} {...edu} />
        ))}
      </motion.div>
    </section>
  )
}
