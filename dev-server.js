import { createServer } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

/**
 * 개발 서버 설정
 */
const createDevServer = async() => {
  const server = await createServer({
    root: __dirname,
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      hmr: {
        port: 3001,
      },
    },
    build: {
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: 'JihoFrame',
        fileName: 'jiho-frame',
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@test': resolve(__dirname, 'test'),
      },
    },
    plugins: [
      // 개발 도구 플러그인들
      {
        name: 'jiho-frame-dev-tools',
        configureServer(server) {
          server.middlewares.use('/api/dev-tools', (req, res, next) => {
            if (req.url === '/api/dev-tools/stats') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                timestamp: Date.now(),
                mode: 'development',
                hmr: true,
                version: process.env.npm_package_version || '2.0.3',
              }));
            } else {
              next();
            }
          });
        },
      },
    ],
  });

  return server;
};

/**
 * 개발 서버 시작
 */
const startDevServer = async() => {
  try {
    const server = await createDevServer();
    await server.listen();
    
    console.log('\n🚀 JihoFrame 개발 서버가 시작되었습니다!');
    console.log(`📍 로컬: http://localhost:3000`);
    console.log(`🔥 HMR: 활성화됨 (포트: 3001)`);
    console.log(`📱 네트워크: ${server.resolvedUrls?.network[0] || 'N/A'}`);
    console.log('\n개발 도구:');
    console.log('- 상태 관리 디버거: http://localhost:3000/api/dev-tools/stats');
    console.log('- 코드 변경 시 자동 새로고침');
    console.log('- 소스맵 지원으로 디버깅 용이');
    
  } catch (error) {
    console.error('❌ 개발 서버 시작 실패:', error);
    process.exit(1);
  }
};

/**
 * 프로덕션 미리보기 서버
 */
const previewServer = async() => {
  const { preview } = await import('vite');
  const server = await preview({
    preview: {
      port: 4000,
      host: true,
      open: true,
    },
  });
  
  console.log('\n📦 프로덕션 빌드 미리보기 서버');
  console.log(`📍 로컬: http://localhost:4000`);
};

// CLI 명령어 처리
const command = process.argv[2];

switch (command) {
  case 'start':
  case 'dev':
    startDevServer();
    break;
  case 'preview':
    previewServer();
    break;
  default:
    console.log('사용법:');
    console.log('  node dev-server.js start   - 개발 서버 시작');
    console.log('  node dev-server.js preview - 프로덕션 미리보기');
    break;
}

export { createDevServer, startDevServer, previewServer }; 