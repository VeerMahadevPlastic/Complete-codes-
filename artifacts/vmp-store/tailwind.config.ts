import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effdf5',
          100: '#d9fbe7',
          500: '#10b981',
          600: '#059669',
          900: '#064e3b',
        },
        ink: '#0f172a',
      },
      boxShadow: {
        glass: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
};

export default config;
