import type { Config } from "tailwindcss";

export default {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Yeng Brand Colors
                primary: {
                    red: '#E63946',
                    navy: '#1D3557',
                    orange: '#F77F00',
                },
                yeng: {
                    red: {
                        DEFAULT: '#E63946',
                        light: '#FF5A67',
                        dark: '#C72835',
                    },
                    navy: {
                        DEFAULT: '#1D3557',
                        light: '#2E4A6F',
                        dark: '#0F1F3F',
                    },
                    orange: {
                        DEFAULT: '#F77F00',
                        light: '#FF9933',
                        dark: '#D66D00',
                    },
                    gray: {
                        light: '#F1FAEE',
                        DEFAULT: '#457B9D',
                    },
                },
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
