/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],  /* pour les titres */
        body: ['Nunito', 'sans-serif'],      /* pour les paragraphes et textes */
      },
      fontSize: {
        'h1': ['4rem', { lineHeight: '1.2' }],
        'h2': ['3rem', { lineHeight: '1.25' }],
        'h3': ['2rem', { lineHeight: '1.3' }],
        'h4': ['1.5rem', { lineHeight: '1.35' }],
        'base': ['1.125rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.4' }],
      },
      /* Couleurs principales de la charte */
      colors: {
        cardinal: '#C41E3A',
        gunmetal: '#2A3439',
        whitesmoke: '#F5F5F5',
        jet: '#343434',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        nexus: {
          /* Couleurs principales */
          "primary": "#C41E3A",         /* cardinal */
          "primary-focus": "#A01B33",
          "primary-content": "#ffffff",

          "secondary": "#2A3439",       /* gunmetal */
          "secondary-focus": "#1D2428",
          "secondary-content": "#ffffff",

          "accent": "#343434",          /* jet */
          "accent-focus": "#2A2A2A",
          "accent-content": "#ffffff",

          /* Backgrounds et textes neutres */
          "base-100": "#F5F5F5",        /* whitesmoke */
          "base-200": "#E0E0E0",
          "base-300": "#CFCFCF",
          "base-content": "#2A3439",    /* gunmetal */

          /* Couleurs d’état */
          "info": "#3ABFF8",
          "success": "#22C55E",
          "warning": "#FBBD23",
          "error": "#EF4444",

          /* Variables d’UI */
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "0.3rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",
        },
      },

      "light",
      "dark",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
  },
};
