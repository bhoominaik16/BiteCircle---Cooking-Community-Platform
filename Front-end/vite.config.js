import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { API_BASE_URL } from '../utils/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  server: {
    proxy: {
      '/api': {
        target: `${API_BASE_URL}`,
        changeOrigin: true,
      }
    }
  },
  // NEW: Add this block to fix the dependency pre-bundling error
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx' // Ensure .js files in node_modules are treated as JSX
      },
    },
  },
})