/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Manual toggle for dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary-h) / 1)',
          hover: 'hsl(var(--color-primary-hover-h) / 1)',
          light: 'hsl(var(--color-primary-h) var(--color-primary-s) calc(var(--color-primary-l) + 15%))',
          dark: 'hsl(var(--color-primary-h) var(--color-primary-s) calc(var(--color-primary-l) - 15%))',
          active: 'hsl(var(--color-primary-h) var(--color-primary-s) calc(var(--color-primary-l) - 25%))',
          disabled: 'hsl(var(--color-primary-h) var(--color-primary-s) calc(var(--color-primary-l) + 40%))',
        },
        background: {
          light: 'rgb(var(--color-bg-light) / <alpha-value>)',
          dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
          overlay: 'rgba(0, 0, 0, 0.6)',
        },
        text: {
          light: 'rgb(var(--color-text-light) / <alpha-value>)',
          dark: 'rgb(var(--color-text-dark) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          link: 'hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l))',
        },
        border: {
          light: 'rgb(var(--color-border-light) / <alpha-value>)',
          dark: 'rgb(var(--color-border-dark) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'primary-glow': '0 0 12px hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l) / 0.6)',
        'focus-ring': '0 0 0 3px hsl(var(--color-primary-h) var(--color-primary-s) var(--color-primary-l) / 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      maxWidth: {
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      zIndex: {
        modal: '1050',
        popover: '1100',
        tooltip: '1200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
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
