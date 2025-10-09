import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

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
        target: 'http://localhost:5000',
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