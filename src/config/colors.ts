/**
 * Color Configuration
 * 
 * This file contains all color variables used throughout the portfolio website.
 * Colors are organized by category for easy maintenance and consistency.
 * 
 * Usage in Tailwind: These colors are imported in tailwind.config.ts
 * Usage in components: Import this file for any programmatic color access
 */

// =============================================================================
// PRIMARY COLORS
// Main brand colors used for accents, buttons, and highlights
// =============================================================================

/** Primary indigo - main brand color for CTAs and highlights */
export const PRIMARY = '#6f3ef6ff'

/** Darker primary - used for hover states on primary buttons */
export const PRIMARY_DARK = '#432499ff'

/** Lighter primary - used for subtle highlights and disabled states */
export const PRIMARY_LIGHT = '#818cf8'

/** Accent violet - secondary brand color for gradients and variety */
export const ACCENT = '#8b5cf6'

/** Darker accent - used for hover states */
export const ACCENT_DARK = '#7c3aed'


// =============================================================================
// GLOW/EFFECT COLORS
// Colors for visual effects like blobs, cursor glow, and skill modal wave
// =============================================================================

/** Toggle to enable/disable cursor glow effect */
export const CURSOR_GLOW_ENABLED = false

/** Toggle to enable/disable cursor grid (net) effect */
export const CURSOR_GRID_ENABLED = true

/** Cursor glow - follows mouse */
export const CURSOR_GLOW = '#3d4044ff'

/** Skill modal return button wave */
export const SKILL_WAVE = '#a78bfa'

/** Toggle to enable/disable particles background */
export const PARTICLES_ENABLED = true

/** Particle colors - array of colors for the floating particles 
export const PARTICLES_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa'] **/
export const PARTICLES_COLORS = ['#9a9aa4ff', '#6d6a73ff', '#ada4c5ff']

/** Particle opacity - min and max opacity values (0-1) */
export const PARTICLES_OPACITY_MIN = 0.1
export const PARTICLES_OPACITY_MAX = 0.4

/** Particle link lines color */
export const PARTICLES_LINK_COLOR = '#6366f1'

/** Particle link lines opacity (0-1) */
export const PARTICLES_LINK_OPACITY = 0.25

// =============================================================================
// BACKGROUND COLORS
// Surface and container background colors
// =============================================================================

/** Main background - deepest dark color for the page background */
export const BACKGROUND = '#0a0a0f'

/** Surface - slightly lighter for cards and elevated elements */
export const SURFACE = '#12121a'

/** Surface light - hover state for cards and interactive surfaces */
export const SURFACE_LIGHT = '#1a1a24'


// =============================================================================
// BORDER COLORS
// Used for dividers, card borders, and separators
// =============================================================================

/** Default border - subtle separator for cards and sections */
export const BORDER = 'rgba(255, 255, 255, 0.06)'

/** Light border - hover state for borders, slightly more visible */
export const BORDER_LIGHT = 'rgba(255, 255, 255, 0.1)'


// =============================================================================
// TEXT COLORS
// Typography colors for different levels of emphasis
// =============================================================================

/** Primary text - main content, headings, and important text */
export const TEXT_PRIMARY = '#f4f4f5'

/** Secondary text - subheadings and less emphasized content */
export const TEXT_SECONDARY = '#a1a1aa'

/** Muted text - captions, metadata, and least emphasized text */
export const TEXT_MUTED = '#71717a'


// =============================================================================
// TAILWIND COLOR OBJECT
// Export for use in tailwind.config.ts
// =============================================================================

export const tailwindColors = {
  primary: PRIMARY,
  'primary-dark': PRIMARY_DARK,
  'primary-light': PRIMARY_LIGHT,
  accent: ACCENT,
  'accent-dark': ACCENT_DARK,
  background: BACKGROUND,
  surface: SURFACE,
  'surface-light': SURFACE_LIGHT,
  border: BORDER,
  'border-light': BORDER_LIGHT,
  'text-primary': TEXT_PRIMARY,
  'text-secondary': TEXT_SECONDARY,
  'text-muted': TEXT_MUTED,
}
