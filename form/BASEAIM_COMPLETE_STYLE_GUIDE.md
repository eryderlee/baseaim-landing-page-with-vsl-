# Baseaim.co Complete Design System & Style Guide

> **Transfer this file to AI agents for complete implementation guidance**

---

## 📋 Table of Contents

1. [Overview & Design Philosophy](#overview--design-philosophy)
2. [Brand Colors & Color System](#brand-colors--color-system)
3. [Typography System](#typography-system)
4. [Component Architecture](#component-architecture)
5. [Layout & Grid System](#layout--grid-system)
6. [Animation & Interaction Patterns](#animation--interaction-patterns)
7. [Responsive Design System](#responsive-design-system)
8. [UI Component Library](#ui-component-library)
9. [Gradient Background System](#gradient-background-system)
10. [Accessibility Standards](#accessibility-standards)
11. [Code Conventions & Best Practices](#code-conventions--best-practices)

---

## 🎨 Overview & Design Philosophy

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4.6 + Custom CSS
- **Animations**: Framer Motion 11.3.8
- **Fonts**: Google Fonts (Inter, Poppins, Montserrat, DM Serif Display, Work Sans, JetBrains Mono)

### Design Aesthetic
- **Style**: Modern, clean, professional with subtle motion
- **Mood**: Trustworthy, innovative, calming
- **Animation Style**: Slow, smooth, continuous (45-60 second loops)
- **Visual Depth**: Layered gradients with soft blur effects

### Key Characteristics
- Minimalist white base with blue gradient accents
- Soft, organic wave shapes (not geometric)
- Gentle animations that don't distract
- High contrast text on gradient backgrounds
- Ample white space
- Subtle shadows and depth effects

---

## 🎨 Brand Colors & Color System

### Primary Color Palette

```css
/* Blues - Primary Brand Colors */
--primary-blue: #2563eb;          /* rgb(37, 99, 235) - Main brand color */
--sky-blue: #87CEEB;              /* rgb(135, 206, 235) - Light accents */
--deep-blue: #0A2E6E;             /* rgb(10, 46, 110) - Dark accents */
--medium-blue: #0052CC;           /* rgb(0, 82, 204) - Medium tone */
--bright-blue: #0066FF;           /* rgb(0, 102, 255) - Vibrant accents */
--azure-blue: #4FC3F7;            /* rgb(79, 195, 247) - Bright highlights */
--light-blue: #6BB6FF;            /* rgb(107, 182, 255) - Soft highlights */
--powder-blue: #B0E0E6;           /* rgb(176, 224, 230) - Very light */
```

```css
/* Accent Colors */
--brand-red: #E11D48;             /* rgb(225, 29, 72) - Primary accent */
--brand-orange: #F97316;          /* rgb(249, 115, 22) - Secondary accent */
--brand-yellow: #EAB308;          /* rgb(234, 179, 8) - Tertiary accent */
--success-green: #10B981;         /* rgb(16, 185, 129) - Success states */
--cyan-accent: #06b6d4;           /* rgb(6, 182, 212) - Cyan highlights */
--light-cyan: #22d3ee;            /* rgb(34, 211, 238) - Light cyan */
```

```css
/* Background Colors */
--pure-white: #FFFFFF;
--ice-blue: #F8FCFF;              /* rgb(248, 252, 255) */
--sky-tint: #E1F5FE;              /* rgb(225, 245, 254) */
--cloud-white: #E3F2FD;           /* rgb(227, 242, 253) */
```

```css
/* Text Colors */
--text-dark: #0a0a0a;             /* Primary text */
--text-charcoal: #1F2937;         /* Headings */
--text-medium-gray: #374151;      /* Subheadings */
--text-light-gray: #6b7280;       /* Muted text */
--text-lighter-gray: #9ca3af;     /* Helper text */
```

### CSS Custom Properties (Gradients)

```css
:root {
  /* Background colors */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --foreground-muted: #6b7280;

  /* Gradient overlays */
  --gradient-blue-start: rgba(59, 130, 246, 0.15);
  --gradient-blue-end: rgba(147, 197, 253, 0.08);
  --gradient-cyan-start: rgba(34, 211, 238, 0.12);
  --gradient-cyan-end: rgba(165, 243, 252, 0.06);
  --gradient-purple-start: rgba(168, 85, 247, 0.1);
  --gradient-purple-end: rgba(196, 181, 253, 0.05);

  /* Brand accent gradient */
  --brand-accent: #E11D48;
  --brand-gradient: linear-gradient(135deg, #E11D48 0%, #F97316 50%, #EAB308 100%);

  /* Accent variations */
  --accent-blue-light: rgba(147, 197, 253, 0.3);
  --accent-blue-medium: rgba(59, 130, 246, 0.4);
}
```

### Color Usage Guidelines

| Color | Use Case | Examples |
|-------|----------|----------|
| **Primary Blue** | CTAs, links, primary actions | Buttons, navigation active states |
| **Sky Blue** | Gradient bases, light accents | Background gradients, hover states |
| **Deep Blue** | Gradient depth, dark accents | Wave layers, shadows |
| **Brand Red/Orange/Yellow** | Special highlights, badges | ROI indicators, important metrics |
| **Grays** | Text hierarchy, borders | Body text, dividers, subtle backgrounds |
| **Success Green** | Success states, positive metrics | Form success, positive ROI |

---

## 🔤 Typography System

### Font Families

```css
font-family: {
  'inter': ['Inter', 'sans-serif'],
  'poppins': ['Poppins', 'sans-serif'],
  'work-sans': ['Work Sans', 'sans-serif'],
  'montserrat': ['Montserrat', 'sans-serif'],
  'dm-serif': ['DM Serif Display', 'serif'],
  'jetbrains-mono': ['JetBrains Mono', 'monospace'],
}
```

### Font Weights
- **Inter**: 300, 400, 500, 600, 700
- **Poppins**: 300, 400, 500, 600, 700, 800, 900
- **Montserrat**: 400, 500, 600, 700
- **DM Serif Display**: 400 (normal + italic)
- **Work Sans**: 300, 400, 500, 600, 700
- **JetBrains Mono**: 400, 500, 600

### Typography Hierarchy

```css
/* Hero Headline */
.hero-headline {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(2rem, 5vw, 4.5rem);
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.1;
}

/* Hero Highlight/Accent (Cycling Words) */
.hero-highlight {
  font-family: 'DM Serif Display', serif;
  font-style: italic;
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 400;
  background: linear-gradient(135deg, #87CEEB, #0052CC, #0066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Section Titles */
.section-title {
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 600;
  color: #1f2937;
}

/* Section Subtitles */
.section-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #6b7280;
}

/* Body Text */
body {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #374151;
  line-height: 1.6;
}

/* Card Titles */
.card-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* Button Text */
.button-text {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* Labels/Small Text */
.label-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500-600;
  color: #6b7280;
}

/* Metrics/Numbers */
.metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* Helper Text */
.helper-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  color: #9ca3af;
}
```

### Gradient Text Pattern

```css
.gradient-text-inline {
  background: linear-gradient(135deg, #87CEEB, #0052CC, #0066FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
```

**Usage**: Apply to emphasized words, key metrics, or special callouts.

---

## 🏗️ Component Architecture

### File Structure

```
src/
├── app/
│   ├── globals.css          # All global styles, animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # All React components
│   ├── Hero.tsx
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── ProcessTimeline.tsx
│   ├── AIROICalculator.tsx
│   ├── ContactForm.tsx
│   ├── GradientBG.tsx
│   ├── CardGradientBG.tsx
│   ├── HelicopterAnimation.tsx
│   ├── IndustryPainPoints.tsx
│   ├── AutomationBenefitsCard.tsx
│   ├── LogoCarousel.tsx
│   └── audit/               # Specialized components
│       ├── AuditHero.tsx
│       ├── AuditForm.tsx
│       └── ...
├── contexts/
│   └── FormContext.tsx      # Shared form state
├── hooks/
│   ├── useInViewOnce.ts     # Viewport detection
│   └── useReducedMotion.ts  # Motion preferences
└── utils/
    └── roiCalculations.ts   # Business logic
```

### Component Naming Conventions

- **File Names**: PascalCase (e.g., `Hero.tsx`, `ContactForm.tsx`)
- **Component Names**: Match file names
- **CSS Class Names**: kebab-case (e.g., `.section-container`, `.card-gradient-bg`)
- **Utility Classes**: Tailwind utilities preferred

### Component Patterns

```tsx
// Standard Component Pattern
'use client' // Next.js client component directive

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ComponentProps {
  variant?: 'primary' | 'secondary'
  className?: string
  onAction?: () => void
}

export default function Component({ variant = 'primary', className, onAction }: ComponentProps) {
  const [state, setState] = useState(false)

  return (
    <motion.div
      className={`component-base ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Component content */}
    </motion.div>
  )
}
```

### TypeScript Conventions

- All components use TypeScript
- Props defined as interfaces (not types)
- Explicit return types for utility functions
- Strict null checks enabled

---

## 📐 Layout & Grid System

### Responsive Breakpoints

```css
/* Tailwind breakpoints */
xs: 475px   /* Small mobile */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### Container Patterns

```css
/* Standard container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* Wide content container */
.max-w-6xl {
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}

/* Narrow content container */
.max-w-xl {
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}
```

### Grid Systems

**Comparison Grid (Pain Points)**
```css
/* Desktop: 3 columns with divider */
display: grid;
grid-template-columns: 1fr auto 1fr;
gap: 3rem;

/* Mobile: Single column */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

**Stats Grid**
```css
/* Desktop: 5 columns with dividers */
display: grid;
grid-template-columns: 1fr auto 1fr auto 1fr;

/* Tablet: 2x2 grid */
@media (max-width: 1024px) {
  grid-template-columns: 1fr auto 1fr;
}

/* Mobile: Single column */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

### Section Structure

```tsx
<section className="relative overflow-hidden py-20 md:py-32">
  {/* Background layer */}
  <GradientBG />

  {/* Content layer */}
  <div className="relative z-10 container mx-auto px-6">
    <div className="max-w-6xl mx-auto">
      {/* Section content */}
    </div>
  </div>
</section>
```

### Spacing Scale

```css
/* Consistent spacing using Tailwind scale */
gap-2: 0.5rem    /* Tight spacing */
gap-4: 1rem      /* Standard spacing */
gap-6: 1.5rem    /* Medium spacing */
gap-8: 2rem      /* Large spacing */
gap-12: 3rem     /* Extra large spacing */

/* Vertical section spacing */
py-12: 3rem      /* Small sections */
py-20: 5rem      /* Standard sections */
py-32: 8rem      /* Hero/major sections */
```

---

## ✨ Animation & Interaction Patterns

### Animation Libraries

- **Primary**: Framer Motion 11.3.8
- **CSS Animations**: Custom @keyframes for backgrounds

### Standard Animation Variants

```tsx
// Entrance animations
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
}

// Scroll-triggered
const scrollReveal = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6 }
}

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Hover effects
const hoverScale = {
  whileHover: { scale: 1.05, y: -1 },
  whileTap: { scale: 0.95 }
}
```

### Keyframe Animations

```css
/* Wave animations */
@keyframes wave-drift-1 {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(20px, -10px, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

/* Pulse animation */
@keyframes pulse-active {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

/* Spin animation (helicopter rotors) */
@keyframes spinRotor {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Interaction States

```css
/* Hover state */
.interactive-element:hover {
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
  transition: all 0.3s ease;
}

/* Focus state (accessibility) */
.interactive-element:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}

/* Active/pressed state */
.interactive-element:active {
  transform: scale(0.95);
}

/* Disabled state */
.interactive-element:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Loading States

```css
.loading-spinner {
  border: 3px solid rgba(37, 99, 235, 0.1);
  border-top-color: #2563eb;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## 📱 Responsive Design System

### Mobile-First Approach

All base styles apply to mobile, then enhanced for larger screens:

```css
/* Base: Mobile */
.element {
  font-size: 1rem;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .element {
    font-size: 1.25rem;
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .element {
    font-size: 1.5rem;
    padding: 2rem;
  }
}
```

### Responsive Typography

```css
/* Fluid typography with clamp() */
font-size: clamp(2rem, 5vw, 4.5rem);
/* min: 2rem (32px), preferred: 5vw, max: 4.5rem (72px) */
```

### Component Responsive Patterns

**Navigation**
```tsx
{/* Desktop */}
<div className="hidden lg:flex items-center gap-8">
  <NavLinks />
</div>

{/* Mobile */}
<div className="lg:hidden">
  <MobileMenu />
</div>
```

**Hero Text**
```tsx
{/* Desktop line breaks */}
<span className="desktop-breaks">
  Line 1<br />Line 2
</span>

{/* Mobile line breaks */}
<span className="mobile-breaks">
  Line 1 Line 2
</span>
```

**Grid Layouts**
```css
/* Auto-responsive grid */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

/* Manual responsive */
grid-template-columns: 1fr;

@media (min-width: 768px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 1024px) {
  grid-template-columns: repeat(3, 1fr);
}
```

### Touch Target Sizes

All interactive elements must meet minimum touch target size:

```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 0.75rem 1.5rem;
}
```

### Mobile Optimizations

```css
/* Reduce blur on mobile for performance */
@media (max-width: 768px) {
  .wave-layer {
    filter: blur(25px); /* Reduced from 30px */
  }

  /* Slow animations on mobile to save battery */
  .wave-1 { animation-duration: 60s; }
  .wave-2 { animation-duration: 75s; }
}
```

---

## 🎨 UI Component Library

### Buttons

**Primary CTA Button**
```css
.btn-primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(37, 99, 235, 0.3);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05) translateY(-1px);
  box-shadow: 0 12px 35px rgba(37, 99, 235, 0.4);
}

.btn-primary:active {
  transform: scale(0.95);
}
```

**Secondary Button**
```css
.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  color: #1f2937;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
}
```

**Outlined Button**
```css
.btn-outlined {
  background: transparent;
  color: #2563eb;
  padding: 1rem 2rem;
  border-radius: 0.375rem;
  border: 2px solid #2563eb;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
}
```

### Cards

**Standard Card**
```css
.card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

**Glass Card**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}
```

**Gradient Card**
```tsx
<div className="relative overflow-hidden rounded-2xl">
  <CardGradientBG colorScheme="blue-cyan" />
  <div className="relative z-10 p-8">
    {/* Card content */}
  </div>
</div>
```

### Form Elements

**Input Field**
```css
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: #2563eb;
  ring: 1px;
  ring-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field.error {
  border-color: #ef4444;
}
```

**Select Dropdown**
```css
.select-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,..."); /* Custom arrow */
  background-repeat: no-repeat;
  background-position: right 1rem center;
}
```

**Checkbox/Radio**
```css
.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}
```

**Error Message**
```css
.error-message {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
  font-family: 'Inter', sans-serif;
}
```

### Badges & Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
  border-color: #a7f3d0;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.badge-error {
  background: #fee2e2;
  color: #991b1b;
  border-color: #fecaca;
}
```

### Modals/Dialogs

```tsx
<motion.div
  className="fixed inset-0 z-50 flex items-center justify-center"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />

  {/* Modal */}
  <motion.div
    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8"
    initial={{ scale: 0.9, y: 20 }}
    animate={{ scale: 1, y: 0 }}
    exit={{ scale: 0.9, y: 20 }}
  >
    {/* Close button */}
    <button
      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      aria-label="Close modal"
    >
      ×
    </button>

    {/* Modal content */}
  </motion.div>
</motion.div>
```

### Tooltips

```tsx
<div className="relative group">
  <button>Hover me</button>
  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
    Tooltip text
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
  </div>
</div>
```

### Progress Indicators

**Progress Bar**
```css
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  border-radius: 9999px;
  transition: width 0.3s ease;
}
```

**Circular Progress**
```tsx
<div className="relative w-24 h-24">
  <svg className="w-full h-full transform -rotate-90">
    <circle
      cx="48"
      cy="48"
      r="40"
      stroke="#e5e7eb"
      strokeWidth="8"
      fill="none"
    />
    <circle
      cx="48"
      cy="48"
      r="40"
      stroke="#2563eb"
      strokeWidth="8"
      fill="none"
      strokeDasharray={`${progress * 2.512} 251.2`}
      strokeLinecap="round"
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center">
    <span className="text-xl font-semibold">{progress}%</span>
  </div>
</div>
```

---

## 🌊 Gradient Background System

### GradientBG Component

**File: `components/GradientBG.tsx`**

```tsx
'use client'

export default function GradientBG() {
  return (
    <div className="moving-gradient-hero">
      {/* Base gradient layer */}
      <div className="gradient-base"></div>

      {/* Edge wave layers - positioned around perimeter */}
      <div className="wave-layer wave-1"></div>
      <div className="wave-layer wave-2"></div>
      <div className="wave-layer wave-3"></div>
      <div className="wave-layer wave-4"></div>
      <div className="wave-layer wave-5"></div>

      {/* Soft overlay for depth */}
      <div className="gradient-overlay"></div>
    </div>
  )
}
```

### Complete CSS (Add to globals.css)

```css
/* ========================================
   ANIMATED GRADIENT BACKGROUND SYSTEM
   ======================================== */

/* Main Container */
.moving-gradient-hero {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

/* Base Gradient Layer */
.gradient-base {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center,
    #FFFFFF 0%,
    #FFFFFF 40%,
    #F8FCFF 60%,
    #E1F5FE 80%,
    #87CEEB 100%);
  opacity: 1;
}

/* Wave Layers Base Styles */
.wave-layer {
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 50% 40% 60% 30%;
  filter: blur(25px);
  opacity: 0.5;
  animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  backface-visibility: hidden;
  transform: translateZ(0);
  contain: layout style paint;
}

/* Firefox-specific optimization */
@supports (-moz-appearance:none) {
  .wave-layer {
    filter: blur(20px);
  }
}

/* Individual Wave Configurations */
.wave-1 {
  background: linear-gradient(45deg,
    rgba(10, 46, 110, 0.9) 0%,
    rgba(79, 195, 247, 0.7) 50%,
    rgba(135, 206, 235, 0.5) 100%);
  top: -30%;
  left: -30%;
  animation: wave-drift-1 45s infinite linear;
  transform-origin: center center;
}

.wave-2 {
  background: linear-gradient(-45deg,
    rgba(135, 206, 235, 0.5) 0%,
    rgba(107, 182, 255, 0.7) 50%,
    rgba(10, 46, 110, 0.9) 100%);
  bottom: -30%;
  right: -30%;
  animation: wave-drift-2 60s infinite linear reverse;
  transform-origin: center center;
}

.wave-3 {
  background: linear-gradient(90deg,
    rgba(107, 182, 255, 0.6) 0%,
    rgba(135, 206, 235, 0.7) 30%,
    rgba(10, 46, 110, 0.5) 70%,
    rgba(79, 195, 247, 0.6) 100%);
  top: -20%;
  right: -20%;
  width: 60%;
  height: 60%;
  animation: wave-drift-3 50s infinite linear;
  transform-origin: center center;
}

.wave-4 {
  background: linear-gradient(180deg,
    rgba(10, 46, 110, 0.8) 0%,
    rgba(107, 182, 255, 0.6) 50%,
    rgba(176, 224, 230, 0.4) 100%);
  top: 60%;
  left: -25%;
  width: 50%;
  height: 70%;
  animation: wave-drift-1 55s infinite linear reverse;
  transform-origin: center center;
}

.wave-5 {
  background: linear-gradient(270deg,
    rgba(79, 195, 247, 0.7) 0%,
    rgba(135, 206, 235, 0.5) 50%,
    rgba(107, 182, 255, 0.6) 100%);
  bottom: -10%;
  left: 50%;
  width: 55%;
  height: 60%;
  animation: wave-drift-2 48s infinite linear;
  transform-origin: center center;
}

/* Gradient Overlay */
.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center,
    transparent 0%,
    transparent 50%,
    rgba(227, 242, 253, 0.1) 80%,
    rgba(187, 222, 251, 0.15) 100%);
  animation: overlay-pulse 40s infinite alternate;
}

/* Keyframe Animations */
@keyframes wave-drift-1 {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(20px, -10px, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes wave-drift-2 {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(-15px, 10px, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes wave-drift-3 {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(15px, 8px, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

@keyframes overlay-pulse {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.02);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .wave-layer {
    filter: blur(25px);
  }

  .wave-1 {
    animation-duration: 60s;
  }

  .wave-2 {
    animation-duration: 75s;
  }

  .wave-3 {
    animation-duration: 65s;
  }
}

/* Accessibility: Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .wave-layer {
    animation: none;
  }

  .gradient-overlay {
    animation: none;
  }
}
```

### Usage Example

```tsx
import GradientBG from '@/components/GradientBG'

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Gradient Background (z-index: 1) */}
      <GradientBG />

      {/* Content Layer (z-index: 10+) */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-gray-900">
          Your Hero Headline
        </h1>
        <p className="text-xl text-gray-600 mt-4">
          Your supporting text here
        </p>
      </div>
    </section>
  )
}
```

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast**
- Text on white: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- All primary text uses #1f2937 or darker on white backgrounds

**Keyboard Navigation**
- All interactive elements are keyboard accessible
- Visible focus indicators on all focusable elements
- Logical tab order maintained
- Skip links for screen readers

**Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**ARIA Labels**
```tsx
<button aria-label="Close modal">×</button>
<nav aria-label="Main navigation">...</nav>
<section aria-labelledby="section-title">...</section>
```

**Focus Management**
```css
.focus-visible:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.375rem;
}
```

**Screen Reader Only Content**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Touch Targets**
- Minimum size: 44x44px
- Adequate spacing between interactive elements
- Buttons clearly distinguishable from non-interactive elements

**Semantic HTML**
```tsx
<nav>          {/* Navigation */}
<main>         {/* Main content */}
<section>      {/* Thematic grouping */}
<article>      {/* Independent content */}
<aside>        {/* Sidebar content */}
<footer>       {/* Footer */}
<button>       {/* Interactive buttons */}
<a href="#">   {/* Links */}
```

---

## 💻 Code Conventions & Best Practices

### TypeScript Standards

```tsx
// Interface naming
interface ComponentProps {
  variant?: 'primary' | 'secondary'
  className?: string
  onAction?: () => void
}

// No 'I' prefix for interfaces
// Use PascalCase for interfaces and types
// Use optional chaining and nullish coalescing
const value = data?.nested?.property ?? 'default'

// Explicit return types for functions
function calculateROI(input: number): number {
  return input * 1.5
}
```

### React Patterns

**Client Components**
```tsx
'use client' // Always at top of file

import { useState } from 'react'

export default function Component() {
  const [state, setState] = useState(false)
  return <div>...</div>
}
```

**Custom Hooks**
```tsx
// hooks/useInViewOnce.ts
import { useEffect, useState, useRef } from 'react'

export function useInViewOnce() {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}
```

**Context Pattern**
```tsx
// contexts/FormContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface FormContextType {
  formData: Record<string, any>
  updateField: (field: string, value: any) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState({})

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <FormContext.Provider value={{ formData, updateField }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within FormProvider')
  }
  return context
}
```

### CSS Best Practices

**Naming Conventions**
- Use kebab-case for class names
- Prefix custom classes to avoid Tailwind conflicts
- Use descriptive names that indicate purpose

```css
/* Good */
.section-container { }
.card-gradient-bg { }
.hero-headline { }

/* Avoid */
.sc { }
.bg1 { }
.h1 { }
```

**Utility-First with Custom Classes**
```tsx
{/* Prefer Tailwind utilities */}
<div className="flex items-center gap-4 p-6 bg-white rounded-lg">

{/* Custom classes for complex/reusable patterns */}
<div className="moving-gradient-hero">
```

**Variable Usage**
```css
/* Use CSS custom properties for dynamic values */
:root {
  --brand-primary: #2563eb;
  --spacing-lg: 2rem;
}

.element {
  color: var(--brand-primary);
  padding: var(--spacing-lg);
}
```

### Performance Optimization

**Image Optimization**
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

**Code Splitting**
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Client-side only if needed
})
```

**Animation Performance**
```css
/* Use GPU-accelerated properties */
transform: translate3d(0, 0, 0); /* Good */
backface-visibility: hidden;     /* Prevents flicker */

/* Avoid animating expensive properties */
/* Bad: width, height, top, left */
/* Good: transform, opacity */
```

### Error Handling

```tsx
// Form validation
const [errors, setErrors] = useState<Record<string, string>>({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!email) {
    newErrors.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = 'Email is invalid'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

// Display errors
{errors.email && (
  <p className="error-message">{errors.email}</p>
)}
```

### Git Commit Conventions

```
feat: Add new ROI calculator component
fix: Correct gradient animation on mobile
style: Update button hover states
refactor: Simplify form validation logic
perf: Optimize wave layer animations
docs: Update component documentation
test: Add tests for calculator
chore: Update dependencies
```

---

## 🚀 Implementation Instructions for AI Agents

When implementing features based on this style guide:

1. **Colors**: Use the defined color palette and CSS variables
2. **Typography**: Follow the font hierarchy and size scale
3. **Components**: Use existing component patterns and naming conventions
4. **Animations**: Apply standard animation variants and respect reduced motion
5. **Responsive**: Mobile-first approach with defined breakpoints
6. **Accessibility**: Ensure WCAG 2.1 AA compliance
7. **Code Style**: Follow TypeScript and React best practices
8. **Performance**: Optimize images, animations, and code splitting

### Quick Start Checklist

- [ ] Import correct fonts (Inter, Poppins, Montserrat, DM Serif Display)
- [ ] Use Tailwind utilities first, custom CSS when needed
- [ ] Add `'use client'` directive for client components
- [ ] Include TypeScript interfaces for all props
- [ ] Apply gradient backgrounds with `<GradientBG />` component
- [ ] Use Framer Motion for animations
- [ ] Ensure keyboard accessibility and ARIA labels
- [ ] Test on mobile, tablet, and desktop breakpoints
- [ ] Verify color contrast ratios
- [ ] Add loading and error states
- [ ] Implement `prefers-reduced-motion` support

---

**Created by:** Baseaim Design Team
**Version:** 2.0
**Last Updated:** January 2025
**Framework:** Next.js 14 + TypeScript + Tailwind CSS
**License:** For authorized use in Baseaim projects
