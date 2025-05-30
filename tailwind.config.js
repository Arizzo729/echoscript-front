/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // manual dark mode toggle
  content: [
    "./src/**/*.{js,jsx,ts,tsx,vue}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          light: "rgb(147 197 253 / <alpha-value>)",
          dark: "rgb(37 99 235 / <alpha-value>)",
          active: "rgb(29 78 216 / <alpha-value>)",
          disabled: "rgb(191 219 254 / <alpha-value>)",
        },
        background: {
          light: "rgb(var(--color-bg-light) / <alpha-value>)",
          dark: "rgb(var(--color-bg-dark) / <alpha-value>)",
          overlay: "rgba(0, 0, 0, 0.6)", // for modals or dropdown overlays
        },
        text: {
          light: "rgb(var(--color-text-light) / <alpha-value>)",
          dark: "rgb(var(--color-text-dark) / <alpha-value>)",
          muted: "rgb(107 114 128 / <alpha-value>)", // cool gray-500
          link: "rgb(59 130 246 / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(229 231 235 / <alpha-value>)", // gray-300
          dark: "rgb(55 65 81 / <alpha-value>)",       // gray-700
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'primary-glow': '0 0 12px rgba(59, 130, 246, 0.6)',
        'focus-ring': '0 0 0 3px rgba(59, 130, 246, 0.4)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      maxWidth: {
        'screen-sm': '640px',
        'screen-md': '768px',
        'screen-lg': '1024px',
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
      },
      zIndex: {
        'modal': '1050',
        'popover': '1100',
        'tooltip': '1200',
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

    // Tailwind utilities used across components
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

