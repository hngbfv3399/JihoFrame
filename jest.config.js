export default {
  // 테스트 환경 설정
  testEnvironment: 'jsdom',
  
  // 테스트 실행 전 설정 파일
  setupFilesAfterEnv: ['<rootDir>/test/helpers/domSetup.js'],
  
  // 테스트 파일 패턴
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/test/__tests__/**/*.js'
  ],
  
  // 커버리지 수집 대상
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts',
    '!src/**/index.js' // 진입점 파일은 제외
  ],
  
  // 커버리지 출력 디렉토리
  coverageDirectory: 'test/coverage',
  
  // 커버리지 리포터
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json'
  ],
  
  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  
  // 모듈 해상도
  moduleFileExtensions: ['js', 'json'],
  
  // 변환 설정 (ES 모듈 지원)
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // ES 모듈 지원
  extensionsToTreatAsEsm: ['.js'],
  
  // 모듈 이름 매핑
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // 무시할 패턴
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/test/coverage/'
  ],
  
  // 변환 무시 패턴
  transformIgnorePatterns: [
    'node_modules/(?!(your-es6-module)/)'
  ],
  
  // 전역 설정
  globals: {
    'babel-jest': {
      useESM: true
    }
  },
  
  // 모킹 설정
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // 타임아웃 설정 (밀리초)
  testTimeout: 10000,
  
  // 상세 출력
  verbose: true,
  
  // 병렬 실행 설정
  maxWorkers: '50%',
  
  // 에러 수집
  errorOnDeprecated: true,
  
  // 테스트 결과 알림 (CI 환경에서는 비활성화)
  notify: process.env.CI !== 'true',
  
  // 실패한 스냅샷 자동 업데이트 방지
  updateSnapshot: false
}; 