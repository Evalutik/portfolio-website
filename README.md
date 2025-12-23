# 🌌 Portfolio Website

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)

> A high-performance, immersive portfolio website featuring glassmorphism, 3D visualizations, and fluid animations.

## ✨ Features

- **🌐 3D Galaxy Navigation**: Interactive skill visualization using force-directed graphs.
- **🎨 Glassmorphism UI**: Modern, frosted-glass aesthetic for a premium feel.
- **⚡ Smooth Performance**: Optimized with standard CSS and lightweight libraries.
- **📱 Fully Responsive**: Seamless experience across mobile, tablet, and desktop.
- **🎭 Dynamic Animations**: Fluid page transitions and scroll effects powered by GSAP and Framer Motion.
- **🌌 Particle Effects**: Interactive background systems that respond to user input.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **3D & Visualization**: [React Force Graph](https://github.com/vasturiano/react-force-graph), [TSParticles](https://particles.js.org/)
- **Smooth Scrolling**: [Lenis](https://lenis.studiofreight.com/)

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/portfolio-website.git
    cd portfolio-website
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the site live.


## 💡 Motivation & Philosophy

I built this portfolio with a clear vision: **to push the boundaries of what a personal website can be.** 

Too often, portfolios are static, grid-based galleries. I wanted to create something that feels *alive*—an immersive digital space that reflects not just my work, but my passion for creative coding and interactive design.

- **Immersive Experience**: The 3D galaxy and glassmorphism aren't just eye candy; they represent the depth and interconnectedness of skills and projects.
- **Performance First**: Despite the heavy visuals, I prioritized optimizations (using Lenis for smooth scrolling and efficient canvas rendering) to ensure it runs smoothly on any device.
- **Open for Inspiration**: I'm open-sourcing this to inspire other developers. Feel free to explore the code, deconstruct the animations, and use it as a launchpad for your own creative ideas.

## 📂 Project Structure

Here's a quick overview of the codebase to help you navigate:

```
├── src
│   ├── app          # Next.js App Router pages
│   ├── components   # React components
│   │   ├── sections # Main page sections (Hero, About, Projects, etc.)
│   │   └── ui       # Reusable UI elements (Cards, Buttons, Effects)
│   ├── config       # ⚡ DATA CENTER (Edit content here!)
│   ├── hooks        # Custom React hooks
│   └── lib          # Utilities and helper functions
├── public           # Static assets (images, fonts)
└── ...config files  # Tailwind, TypeScript, etc.
```

## ⚙️ Configuration & Customization

Most of the content is driven by data files in `src/config`, making it easy to update without diving deep into component code.

### 1. 🦸‍♂️ Hero Section
- **File**: `src/config/hero.ts`
- **What to edit**: Change the `title`, `subtitle`, and the scrolling "adjectives" that describe you.

### 2. 🚀 Projects
- **File**: `src/config/projects.ts`
- **What to edit**: Add your own projects here. Each project has a title, description, tags, image, and links (demo/github).
- **Tip**: The "featured" flag determines layout prominence.

### 3. 🧠 Skills & Galaxy
- **File**: `src/config/skills.ts`
- **What to edit**: Define your skill nodes and connections for the 3D graph.
- **Structure**: You can categorize skills (Frontend, Backend, etc.) which colors the nodes differently.

### 4. 🎓 Education & Experience
- **Files**: `src/config/education.ts` & `src/config/experience.ts`
- **What to edit**: Add your timeline entries for work history and degrees.

### 5. ℹ️ About Section
- **File**: `src/components/sections/About.tsx`
- **What to edit**: This section is currently a React component to allow for rich text and effects. Locate the `<p>` tags to update your bio.

---

## 📄 License

This project is licensed under the **GPL-3.0 License**. See the [LICENSE](LICENSE) file for details.