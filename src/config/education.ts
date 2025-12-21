/**
 * Education Timeline Configuration
 * 
 * Contains the content for each education milestone displayed in the timeline.
 * Each item has multiple content segments for progressive reveal via "Keep reading".
 */

export interface EducationItem {
    id: number
    title: string
    subtitle: string
    year: string
    /** Array of paragraphs - first shown by default, rest revealed on expand */
    content: string[]
    position: 'left' | 'right'
}

export const educationData: EducationItem[] = [
    {
        id: 1,
        title: 'How It All Started',
        subtitle: 'The Beginning',
        year: '2015',
        content: [
            'My programming journey began in high school when I discovered the power of automation through Pascal. Writing my first scripts to solve homework problems faster than doing them manually was a revelation.',
            'This early experience sparked a deep curiosity about how software could transform ideas into reality. I spent countless hours experimenting with different languages and building small utilities, laying the foundation for everything that followed.'
        ],
        position: 'left',
    },
    {
        id: 2,
        title: 'College',
        subtitle: 'Foundation Years',
        year: '2017 - 2019',
        content: [
            'College provided a structured environment to formalize my self-taught knowledge. I dove deep into fundamental computer science concepts including data structures, algorithms, and discrete mathematics.',
            'Beyond the curriculum, I participated in coding competitions and collaborated on team projects that taught me the importance of clean code and effective communication in software development.',
            'Beyond the curriculum, I participated in coding competitions and collaborated on team projects that taught me the importance of clean code and effective communication in software development.'
        ],
        position: 'right',
    },
    {
        id: 3,
        title: 'BSc Computer Science',
        subtitle: 'University Degree',
        year: '2019 - 2022',
        content: [
            'University expanded my horizons with advanced topics in software engineering, database systems, and distributed computing. I developed a particular interest in data engineering and building scalable systems.',
            'My final year project focused on implementing a real-time data pipeline, combining theoretical knowledge with practical engineering skills that would become central to my professional work.'
        ],
        position: 'left',
    },
    {
        id: 4,
        title: 'Honours Mathematics',
        subtitle: 'Advanced Studies',
        year: '2022 - 2023',
        content: [
            'Pursuing honours in mathematics was driven by my growing interest in machine learning and statistical methods. The rigorous coursework in linear algebra, probability theory, and optimization provided essential tools for ML engineering.',
            'This mathematical foundation proved invaluable for understanding the theoretical underpinnings of modern AI systems and developing more intuitive approaches to complex data problems.'
        ],
        position: 'right',
    },
    {
        id: 5,
        title: "What's Next?",
        subtitle: 'The Journey Continues',
        year: '2024+',
        content: [
            'The future holds exciting possibilities at the intersection of data engineering and AI. I am constantly exploring emerging technologies and methodologies to stay at the cutting edge of the field.',
            'I am open to challenging opportunities that push boundaries and allow me to contribute to meaningful projects. If you have an interesting challenge, let us connect and explore how we might collaborate.'
        ],
        position: 'left',
    },
]
