import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/Jiho/index.js',
      name: 'JihoFrame',
      fileName: 'jiho-frame.global',
      formats: ['iife']
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
