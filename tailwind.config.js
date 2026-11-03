/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Treasury & Market Terminal tokens
        ink: {
          DEFAULT: '#0B1120', // latar utama
          surface: '#111827', // permukaan panel
          edge: '#1F2937', // garis tepi 1px
        },
        mist: {
          DEFAULT: '#E5E7EB', // teks utama
          dim: '#9CA3AF', // teks sekunder
        },
        amber: {
          DEFAULT: '#F59E0B', // aksen utama
          ink: '#0B1120', // teks pada amber
        },
        teal: {
          DEFAULT: '#2DD4BF', // aksen sekunder
        },
        ok: '#34D399', // status baik/naik
        crit: '#F87171', // kritis
        warn: '#FBBF24', // peringatan
        spike: '#FB923C', // lonjakan
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        flat: 'none',
      },
    },
  },
  plugins: [],
};
