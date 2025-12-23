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
        year: '2020 - 2022',
        content: [
            "I always felt a strong pull towards tech, but my path wasn't a straight line. I had the roadmap efficiently planned: finish school, then start the degree here. But life had other plans. I unexpectedly moved to England, and suddenly that straightforward path was gone.",
            "It felt scary to restart from scratch, navigating a new system while keeping my eyes on the goal. But I refused to let it slow me down. I decided to forge my own way, compressing years of coursework into a timeline that worked for me."
        ],
        position: 'left',
    },
    {
        id: 2,
        title: 'College Years',
        subtitle: "King's InterHigh",
        year: '2022 - 2024',
        content: [
            "I needed to catch up, so I doubled the workload. I took A-Levels in Math, Further Math, and Physics alongside my GCSEs, running both timelines simultaneously. It was an intense grind of constant context-switching, but honestly, I loved the adrenaline of it.",
            "I ended up with straight A's and a feeling of pure invincibility. That momentum carried me straight to the Netherlands, armed with the knowledge I needed for the next step.",
            "It was a chaotic few years, but it proved to me that I can handle heavy lifting when the passion is real. That experience defined my work ethic, showing me that I don't just survive under pressure, I actually start to thrive when the stakes are high."
        ],
        position: 'right',
    },
    {
        id: 3,
        title: 'Technical Computer Science',
        subtitle: 'BSc at University of Twente',
        year: '2025 - 2026',
        content: [
            "The unique education model here throws you into the deep end immediately. We work in teams to build working software systems, solving problems that don't have textbook answers. Essential concepts from 'Discrete Structures & Efficient Algorithms' gave me the foundation, while 'Cyber-Physical Systems' forced me to think like an engineer, prioritizing architecture over quick code fixes.",
            "I'm building deep technical expertise while mastering 'Data Science & Artificial Intelligence'. Surrounded by peers who are just as passionate, I feel a constant drive to push myself further. We challenge each other to find better solutions, turning every assignment into a competition for quality that raises the bar for everyone involved.",
            "It is demanding, but seeing things I built actually work in the real world is the best feeling there is. There is a specific kind of joy in watching a system you architected from scratch handle live data without breaking, confirming that the long nights were absolutely worth it."
        ],
        position: 'left',
    },
    {
        id: 4,
        title: 'Honours Mathematics',
        subtitle: 'Honours Programme at University of Twente',
        year: '2025 - 2026',
        content: [
            "Computer Science wasn't enough, I wanted to understand the mathematical machinery under the hood, so I joined this track. It’s an advanced program for the top 5%, covering abstract topics like 'Topology' and 'Optimal Transport & Machine Learning'.",
            "This rigorous theoretical grounding brings me a deep sense of clarity. Taking deep dives into 'Complex Networks' and the 'Anatomy of Quantum Theory' allows me to see patterns that drive algorithms, bridging the gap between abstract theory and applied engineering. It is grueling work that often keeps me up late, but the satisfaction of cracking a complex mathematical structure makes it all worth it."
        ],
        position: 'right',
    },
    {
        id: 5,
        title: "What's Next?",
        subtitle: 'The Journey Continues',
        year: '2026+',
        content: [
            "My ambition has scaled with my skills. I am targeting a Master's in Machine Learning to eventually become an AI Architect. I want to design the intelligent systems that shape our future, lead teams, and solve the hardest problems.",
            "The journey is long, but I feel ready for every step of it. I am constantly learning, growing, and looking for the next challenge. I'm not just looking for a job; I am chasing problems that force me to evolve and seeking a team that moves as fast as I do, building the future one system at a time."
        ],
        position: 'left',
    },
]
