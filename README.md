# Andrei Fedyna - Portfolio Website

> Personal portfolio website for **Andrei Fedyna** ([@Evalutik](https://github.com/Evalutik)) — Data Engineer & Software Developer

A modern, interactive portfolio built with Next.js 15, featuring a professional dark theme, 3D isometric skills marquee, and immersive animations.

## 🌐 Live Demo

Coming soon...

## ✨ Features

- **Dark Professional Theme** — Clean design with purple/violet accent colors
- **3D Isometric Skills Marquee** — Interactive rotating skill cards with hover effects
- **Skill Detail Modal** — Click any skill to see detailed description with "camera zoom" animation
- **Floating Code Snippets** — ML/AI code typewriter effect on scroll
- **Cursor Glow** — Subtle light following mouse movement
- **Glowing Background Blobs** — Scroll-reactive ambient effects
- **Particle Network Background** — Interactive particles with connections
- **Fully Responsive** — Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS with custom color configuration
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Particles:** tsparticles
- **Language:** TypeScript
- **Fonts:** Inter, JetBrains Mono

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/
│   ├── sections/           # Page sections (Hero, About, Skills, etc.)
│   └── ui/                 # Reusable UI components
├── config/
│   ├── colors.ts           # Color palette configuration
│   └── skills.ts           # Skills data (icons, descriptions, use cases)
└── styles/
    └── globals.css         # Global styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Customization

### Colors
Edit `src/config/colors.ts` to customize the color palette:
- `PRIMARY` — Main brand color (indigo)
- `ACCENT` — Secondary accent (violet)
- `BACKGROUND` — Page background
- `SURFACE` — Card backgrounds

### Skills
Edit `src/config/skills.ts` to update skills:
- Each skill has: `title`, `icon`, `description`, `experience`, `useCases`
- Skills are organized into 4 rows for the marquee display

## 📋 Future Development

### Phase 1: Content & Polish
- [ ] Add real project showcases with screenshots/demos
- [ ] Write detailed case studies for key projects
- [ ] Add resume/CV download functionality
- [ ] Implement contact form with email integration
- [ ] Add blog section for technical articles

### Phase 2: Interactivity
- [ ] Add project filtering by technology
- [ ] Implement dark/light theme toggle
- [ ] Add page transition animations
- [ ] Create interactive timeline for experience section
- [ ] Add GitHub activity integration

### Phase 3: Performance & SEO
- [ ] Optimize images with Next.js Image component
- [ ] Add proper meta tags and Open Graph
- [ ] Implement structured data (JSON-LD)
- [ ] Add sitemap and robots.txt
- [ ] Optimize Core Web Vitals

### Phase 4: Advanced Features
- [ ] Add internationalization (i18n) support
- [ ] Implement analytics tracking
- [ ] Add testimonials/recommendations section
- [ ] Create admin dashboard for content management
- [ ] Add RSS feed for blog

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

**Andrei Fedyna** — Data Engineer | [GitHub](https://github.com/Evalutik)