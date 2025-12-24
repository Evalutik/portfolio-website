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
        company: 'CyBlink',
        role: 'Co-Founder & Software Engineer',
        period: 'Aug 2025 - Nov 2025',
        description: [
            'Co-founded an IoT startup developing innovative bike safety systems to enhance cyclist visibility and reduce urban accidents. Led full-stack software development from concept through working prototype in a fast-paced environment, leveraging Agile and Scrum methodologies for rapid product iteration.',
            'Engineered a Raspberry Pi-based prototype using Python for automatic braking detection and customizable LED turn signals using sensor fusion and real-time processing. Managed development cycles using Jira/Kanban, ensuring seamless hardware-software integration through iterative testing and continuous improvement.',
            'Collaborated on rapid prototyping cycles, hardware-software integration testing, and investor pitches. Transformed academic research into a market-ready product concept with real user validation, maintaining a high-velocity development pace while coordinating cross-functional efforts.',
        ],
    },
    {
        id: 2,
        company: 'Laser Export Ltd',
        role: 'Software Engineer',
        period: 'Jun 2025 - Aug 2025',
        description: [
            'Developed a professional, high-performance desktop application for generating structured, multilingual PDF/HTML reports from industrial Laser-Induced Plasma Spectroscopy (LIPS) analyzer measurement data. Built with JavaFX, the system automates mission-critical technical reporting for metallurgy labs and quality control departments.',
            'Engineered robust data pipelines to fetch, decode, and transform complex measurement datasets from SQLite databases. Implemented a decoupled reporting engine using FreeMarker templates, enabling flexible, multi-language report generation with advanced technical layouts and dynamic content.',
            'Owned the full development lifecycle: from initial requirements gathering and UI/UX design to final implementation and cross-platform deployment. Delivered production-ready installers via jpackage, reducing manual reporting time by over 70% and ensuring data integrity across large laboratory workflows.',
        ],
    },
]
