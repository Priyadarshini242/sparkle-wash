import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react' // or vue/svelte etc.
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import dotenv from 'dotenv'

export default ({ mode }) => {
  // Load .env files
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

  // Optionally load via dotenv (for non-prefixed vars)
  dotenv.config()

  return defineConfig({
    plugins: [react(),tailwindcss()],
    resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'), // <-- Add this
    },
},
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV), // optional
    },
    server: {
      port: 5173,
    },
  })
}
