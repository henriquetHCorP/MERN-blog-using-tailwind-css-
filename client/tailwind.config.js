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
        'slow-blink': 'slow-blink 3s linear infinite', // 3s duration, linear timing, infinite loop

      },
      

      keyframes: {
        'slow-blink': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
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