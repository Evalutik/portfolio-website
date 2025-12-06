'use client'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-2 text-text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-muted text-sm max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
