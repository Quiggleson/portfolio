import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeInBottom: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInUnderline: {
          '0%': {
            width: "10%",
            transform: 'scaleX(2)'
          },
          '100%': {
            width: "100%",
            transform: 'scaleX(1)'
          }
        },
        expand: {
          '0%': {
            height: '0%'
          },
          '100%': {
            height: 'h-full'
          }
        }
      },
      animation: {
        fadeInBottom: 'fadeInBottom 1s ease-out',
        fadeInUnderline: 'fadeInUnderline .5s',
        expand: 'transition-height expand .5s ease-in-out'
      },
      colors: {
        'purple-com': '#7D26CD',
        'purple-hover': '#ddbbff',
        'purple-light': '#a868e3',
        'button-hover': '#ccc',
        'bg-light': '#d9d9d9'
      },
      transitionProperty: {
        'max-height': 'max-height',
        'filter': 'filter'
      }
    },
  },
  plugins: [],
};
export default config;
