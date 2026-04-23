import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
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
  optimizeDeps: {
    exclude: ['@coderline/alphatab'],
  },
});
