/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pilates: {
          bg: '#FAF8F5',
          surface: '#FFFFFF',
          card: '#F6F3EE',
          border: '#E8E2D8',
          subtle: '#E2DBD0',
          text: '#222A23',
          muted: '#637064',
          darkBg: '#131814',
          darkSurface: '#1C231E',
          darkCard: '#242D26',
          darkBorder: '#2E3A31',
          darkText: '#EDF3EC',
          darkMuted: '#94A396',
          sage: {
            DEFAULT: '#6B8065',
            light: '#8F9E8B',
            soft: '#EAF0E9',
            dark: '#4B5E46',
          },
          clay: {
            DEFAULT: '#C08670',
            light: '#DCA996',
            soft: '#FAF1ED',
          },
          sand: {
            DEFAULT: '#E5DDCF',
            light: '#F3EFE7',
            soft: '#FAF7F2',
          },
          cream: '#FFFDF9',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'ambient': '0 8px 30px -4px rgba(90, 105, 85, 0.07), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'ambient-lg': '0 16px 40px -8px rgba(90, 105, 85, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'ambient-sm': '0 4px 15px -2px rgba(90, 105, 85, 0.05)',
      }
    },
  },
  plugins: [],
}
