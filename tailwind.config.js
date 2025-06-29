/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './public/index.html',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        md: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary-h) / 1)',
          hover: 'hsl(var(--color-primary-hover-h) / 1)',
          light: 'hsl(var(--color-primary-h) / 0.9)',
          dark: 'hsl(var(--color-primary-h) / 0.7)',
          disabled: 'hsl(var(--color-primary-h) / 0.3)',
        },
        background: {
          light: 'rgb(var(--color-bg-light) / 1)',
          dark: 'rgb(var(--color-bg-dark) / 1)',
          overlay: 'rgba(0, 0, 0, 0.6)',
        },
        text: {
          light: 'rgb(var(--color-text-light) / 1)',
          dark: 'rgb(var(--color-text-dark) / 1)',
          muted: 'rgb(var(--color-text-muted) / 0.6)',
          link: 'hsl(var(--color-primary-h) / 1)',
        },
        border: {
          light: 'rgb(var(--color-border-light) / 1)',
          dark: 'rgb(var(--color-border-dark) / 1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'primary-glow': '0 0 12px hsl(var(--color-primary-h) / 0.5)',
        'focus-ring': '0 0 0 3px hsl(var(--color-primary-h) / 0.4)',
        card: '0 2px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expo: 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
      maxWidth: {
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      zIndex: {
        base: 1,
        dropdown: 50,
        sticky: 100,
        modal: 1050,
        popover: 1100,
        tooltip: 1200,
        top: 9999,
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px hsl(var(--color-primary-h) / 0.4)' },
          '50%': { boxShadow: '0 0 24px hsl(var(--color-primary-h) / 0.8)' },
        },
        dashSpin: {
          '0%': { strokeDashoffset: '220', transform: 'rotate(0deg)' },
          '50%': { strokeDashoffset: '60', transform: 'rotate(180deg)' },
          '100%': { strokeDashoffset: '220', transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        dashSpin: 'dashSpin 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    // `line-clamp` is built-in from Tailwind v3.3 — plugin no longer needed.
  ],
  safelist: [
    'dark',
    'bg-primary',
    'hover:bg-primary-hover',
    'text-primary',
    'shadow-primary-glow',
    'bg-primary-hover',
    'text-light',
    'text-dark',
    'text-blue-600',
    'hover:text-blue-800',
    'text-blue-400',
    'dark:text-blue-300',
    'bg-blue-50',
    'dark:bg-blue-900',
    'bg-blue-600',
    'hover:bg-blue-700',
    'bg-red-600',
    'hover:bg-red-700',
    'bg-green-600',
    'hover:bg-green-700',
    'text-red-500',
    'text-green-600',
  ],
};

