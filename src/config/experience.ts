/**
 * Work Experience Configuration
 * 
 * Contains the content for each work experience displayed in the terminal.
 */

export interface ExperienceItem {
    id: number
    company: string
    role: string
    period: string
    /** Array of paragraphs for the job description */
    description: string[]
}

export const experienceData: ExperienceItem[] = [
    {
        id: 1,
        company: 'Company One',
        role: 'Data Engineer',
        period: '2023 - Present',
        description: [
            'Led the development of scalable data pipelines processing millions of records daily. Implemented real-time streaming solutions using Apache Kafka and Spark.',
            'Collaborated with cross-functional teams to design data warehouse architecture, improving query performance by 60%.',
            'Mentored junior engineers and established best practices for data quality and testing.',
        ],
    },
    {
        id: 2,
        company: 'Company Two',
        role: 'Junior Data Engineer',
        period: '2022 - 2023',
        description: [
            'Built and maintained ETL pipelines for business intelligence reporting. Automated data collection from multiple sources.',
            'Developed Python scripts for data validation and cleaning, reducing manual effort by 80%.',
        ],
    },
]
