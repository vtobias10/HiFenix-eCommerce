import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/usuarios': 'http://localhost:3000',  // Proxy /usuarios requests to backend
      '/productos': 'http://localhost:3000', // Proxy /productos requests to backend
    },
  },
})
