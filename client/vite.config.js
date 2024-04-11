import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', 
        secure:false, 
        //secure is false because we are using http and not https; 
      },
    },
  },
  plugins: [react()],
})
