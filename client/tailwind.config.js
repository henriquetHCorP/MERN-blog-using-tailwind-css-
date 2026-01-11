 /** @type {import('tailwindcss').Config} */
 const flowbite = require("flowbite-react/tailwind");

 
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
    
  ],
  theme: {
    extend: {
      animation: {
        'blink': 'blink 1s steps(1, end) infinite', // Use 'steps(1, end)' for an instant on/off blink
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' }, // Visible at 0% and 100%
          '50%': { opacity: '0' },      // Invisible at 50%
        },
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),
  ],
}