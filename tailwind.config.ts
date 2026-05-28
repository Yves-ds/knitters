import type { Config } from 'tailwindcss'
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF5831',
        'primary-light': '#FF7A5C',
        'primary-dark': '#E04020',
        dark: '#1A1A1A',
        sub: '#888888',
        'bg-light': '#F5F5F5',
        border: '#E0E0E0',
      },
      fontFamily: { sans: ['Pretendard', 'Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
