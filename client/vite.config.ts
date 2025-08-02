import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // Load environment variables from root directory
  envDir: path.resolve(__dirname, '..'),
  // Ensure VITE_ prefixed variables are loaded
  define: {
    'process.env': {}
  }
})
