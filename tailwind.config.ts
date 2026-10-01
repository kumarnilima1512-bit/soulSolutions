import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
       
        // Primary colors 
        navy: '#1E4D46',        // Deep Forest Green — headings, main text
        plum: '#1E4D46',        // Deep Forest Green — buttons, links, key accents
        violet: '#7DA88E',      // Sage Green — hover states, secondary accents
        gold: '#C9B88C',        // Warm Gold/Tan — highlights, borders

        // Secondary colors 
        lavender: '#DCEBE1',        // Light Mint — card backgrounds, soft accents
        'lavender-soft': '#F7F5F1', // Off-White — page backgrounds
        cream: '#F7F5F1',           // Off-White — main background
        peach: '#E7DED0',           // Beige — warm accent backgrounds
        blush: '#C9B88C',           // Warm Gold/Tan — used where a warm accent is needed
        sky: '#DCEBE1',             // Light Mint — used where a cool accent is needed
        mint: '#DCEBE1',            // Light Mint — success states, icon backgrounds
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      keyframes: {
        'blob-a': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(60px,-40px,0) scale(1.15)' },
        },
        'blob-b': {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1.05)' },
          '50%': { transform: 'translate3d(-50px,50px,0) scale(0.92)' },
        },
        ring: {
          '0%': { transform: 'scale(0.85)', opacity: '0.6' },
          '100%': { transform: 'scale(1.7)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'translate3d(0,0,0)' },
          '50%': { opacity: '0.95', transform: 'translate3d(0,-10px,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-12px,0)' },
        },
      },
      animation: {
        'blob-a': 'blob-a 22s ease-in-out infinite',
        'blob-b': 'blob-b 28s ease-in-out infinite',
        ring: 'ring 5s ease-out infinite',
        shimmer: 'shimmer 8s linear infinite',
        twinkle: 'twinkle 7s ease-in-out infinite',
        float: 'float 9s ease-in-out infinite',
      },
    },
  },
} satisfies Config