import type { Config } from 'tailwindcss'

export default {
  content: [],
  theme: {
    extend: {
      colors: {
        navy: '#26234f',
        plum: '#3f2e80',
        violet: '#7c5cc4',
        lavender: '#e9e4f7',
        'lavender-soft': '#f1eef9',
        cream: '#fdf9f6',
        peach: '#fbe3d3',
        blush: '#f6d9e6',
        sky: '#dce9f6',
        mint: '#d9eee5',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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