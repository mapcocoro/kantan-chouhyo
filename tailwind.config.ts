import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // 日本語最適化フォントファミリー
        'sans': [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Hiragino Kaku Gothic Pro"',
          '"Yu Gothic UI"', '"Yu Gothic"', '"Meiryo UI"', '"Meiryo"',
          '"Noto Sans CJK JP"', '"Noto Sans JP"', '"Source Han Sans"',
          'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"'
        ],
        'ja-heading': [
          '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Yu Gothic UI"',
          '"Noto Sans CJK JP"', '"Source Han Sans"', 'sans-serif'
        ],
        'ja-body': [
          '"Hiragino Kaku Gothic ProN"', '"Yu Gothic"', '"Meiryo"',
          '"Noto Sans JP"', '"Source Han Sans"', 'sans-serif'
        ],
        'mono': [
          '"SF Mono"', '"Monaco"', '"Inconsolata"', '"Roboto Mono"',
          '"Noto Sans Mono CJK JP"', 'monospace'
        ]
      },
      letterSpacing: {
        'ja-tight': '0.025em',
        'ja-normal': '0.05em',
        'ja-wide': '0.1em',
      },
      lineHeight: {
        'ja-compact': '1.6',
        'ja-normal': '1.75',
        'ja-relaxed': '1.85',
      },
    },
  },
  plugins: [],
};
export default config;
