// vite.config.js
import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';

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
  },
  plugins: [
    {
      name: 'copy-types',
      writeBundle() {
        // TypeScript 정의 파일을 dist로 복사
        try {
          copyFileSync('./src/Jiho/index.d.ts', './dist/index.d.ts');
          console.log('✅ TypeScript definitions copied to dist/');
        } catch (error) {
          console.warn('⚠️ Failed to copy TypeScript definitions:', error.message);
        }
      }
    }
  ]
});
