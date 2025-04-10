// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/Jiho/index.js',
      name: 'JihoFrame',
      fileName: (format) => `jiho-frame.${format}.js`,
      formats: ['es', 'umd'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [] // 외부 종속성 넣을 거 없으면 빈 배열
    }
  }
});
