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
        // Luxury Oat Milk & Warm Sand aesthetic brand scale
        emerald: {
          50: '#F9F5EE',   // pale oat milk linen
          100: '#F2E9DC',  // soft oat cream
          200: '#E6D7C3',  // warm sand
          300: '#D5C0A4',  // soft almond
          400: '#BFA483',  // toasted almond
          500: '#A68B69',  // warm sand camel
          600: '#917654',  // rich toasted oat
          700: '#7B6244',  // warm almond bronze
          800: '#675137',  // signature toasted almond brand
          900: '#52402B',  // deep roasted almond
          950: '#33271A',  // warm dark espresso wood
        },
        pilates: {
          bg: '#F9F6F0',
          surface: '#FFFFFF',
          card: '#F6F1EA',
          border: '#EAE1D4',
          subtle: '#DFC8AF',
          text: '#2D251E',
          muted: '#786B5D',
          darkBg: '#1C1916',
          darkSurface: '#26211C',
          darkCard: '#302A24',
          darkBorder: '#3D352D',
          darkText: '#F7F3ED',
          darkMuted: '#A89B8C',
          sand: {
            DEFAULT: '#E6D7C3',
            light: '#F2E9DC',
            soft: '#F9F5EE',
          },
          almond: {
            DEFAULT: '#7B6244',
            light: '#A68B69',
            dark: '#52402B',
          },
          oat: '#F6F1EA',
          cream: '#FFFDF9',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'ambient': '0 8px 30px -4px rgba(115, 95, 75, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'ambient-lg': '0 16px 40px -8px rgba(115, 95, 75, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'ambient-sm': '0 4px 15px -2px rgba(115, 95, 75, 0.06)',
      }
    },
  },
  plugins: [],
}
