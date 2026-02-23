import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // relative paths — required for cPanel subdirectory hosting
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
