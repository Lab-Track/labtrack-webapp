import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
          soft: "var(--primary-soft)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        divider: "var(--divider)",
        placeholder: "var(--placeholder)",
        disabled: "var(--disabled)",
        success: { DEFAULT: "var(--success)", bg: "var(--success-bg)" },
        destructive: {
          DEFAULT: "var(--destructive)",
          bg: "var(--destructive-bg)",
          foreground: "var(--destructive-foreground)",
        },
        warning: { DEFAULT: "var(--warning)", bg: "var(--warning-bg)" },
        ring: "var(--ring)",
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        full: "9999px",
        DEFAULT: "var(--radius)",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      fontSize: {
        display: ["28px", { fontWeight: "600" }],
        h1: ["24px", { fontWeight: "600" }],
        h2: ["20px", { fontWeight: "600" }],
        h3: ["17px", { fontWeight: "500" }],
        body: ["14px", { fontWeight: "400" }],
        "body-sm": ["12px", { fontWeight: "400" }],
        caption: ["11px", { fontWeight: "400" }],
        label: ["10px", { fontWeight: "400" }],
      },
    },
  },
} satisfies Config;