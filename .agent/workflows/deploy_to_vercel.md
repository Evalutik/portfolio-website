---
description: How to deploy the portfolio website to Vercel
---

# Deploying to Vercel

This Next.js portfolio is optimized for Vercel deployment. Follow these steps to host it for free.

## Prerequisites

1.  **GitHub Repository**: Ensure your project is pushed to a GitHub repository.
2.  **Vercel Account**: Create an account at [vercel.com](https://vercel.com/signup).

## Steps

1.  **Import Project**:
    *   Go to your [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Select "Continue with GitHub" and choose your `portfolio-website` repository.

2.  **Configure Project**:
    *   **Framework Preset**: Should automatically detect `Next.js`.
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: Leave default (`next build`).
    *   **Output Directory**: Leave default (`.next`).
    *   **Environment Variables**: None required for this static portfolio.

3.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete (usually < 1 minute).

## Post-Deployment

*   **Custom Domain**: Go to **Settings** -> **Domains** to add your own domain (e.g., `andrei.dev`).
*   **Analytics**: You can enable Vercel Analytics/Speed Insights in the dashboard if desired.
