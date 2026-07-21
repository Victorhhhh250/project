import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        heading: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: '0 12px 24px rgba(2, 6, 23, 0.08)',
        glow: '0 0 0 4px rgb(var(--color-primary) / 0.12)',
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          600: 'rgb(var(--color-primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      spacing: {
        'gap-sm': '8px',
        'gap-md': '16px',
        'gap-lg': '24px',
      },
    },
  },
  plugins: [],
} satisfies Config;
