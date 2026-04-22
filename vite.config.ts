import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@coderline/alphatab/dist/font/*',
          dest: 'font',
        },
        {
          src: 'node_modules/@coderline/alphatab/dist/soundfont/*',
          dest: 'soundfont',
        },
      ],
    }),
  ],
  assetsInclude: ['**/*.sf2'],
  optimizeDeps: {
    exclude: ['@coderline/alphatab'],
  },
  // Allow Tauri dev server to clear the screen
  clearScreen: false,
  server: {
    strictPort: true,
  },
})
