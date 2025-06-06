# 🧪 Tests

이 디렉토리는 JihoFrame 라이브러리의 모든 테스트를 포함합니다.

## 📁 디렉토리 구조

```
test/
├── README.md                    # 이 파일
├── __tests__/                   # Jest 스타일 테스트
│   ├── jihoFunc.test.js        # 상태 관리 테스트
│   ├── jihoRender.test.js      # 렌더링 시스템 테스트
│   └── integration.test.js     # 통합 테스트
├── fixtures/                    # 테스트용 고정 데이터
│   ├── components.js           # 테스트용 컴포넌트
│   └── mockData.js             # 모킹 데이터
├── helpers/                     # 테스트 헬퍼 함수들
│   ├── testUtils.js            # 테스트 유틸리티
│   └── domSetup.js             # DOM 환경 설정
└── coverage/                    # 커버리지 리포트 (gitignore됨)
```

## 🎯 테스트 카테고리

### 1. 단위 테스트 (Unit Tests)
- **상태 관리**: `createState`, `computedState`, `combineStates` 등
- **DOM 렌더링**: `createElement`, `renderApp` 등
- **이벤트 처리**: 이벤트 바인딩 및 핸들링
- **생명주기**: `jihoInit`, `jihoMount`, `jihoUpdate`, `jihoUnMount`

### 2. 통합 테스트 (Integration Tests)
- **전체 앱 렌더링**: 실제 DOM 환경에서의 테스트
- **상태-UI 연동**: 상태 변화에 따른 DOM 업데이트
- **컴포넌트 상호작용**: 중첩 컴포넌트 간의 상호작용

### 3. 성능 테스트 (Performance Tests)
- **메모리 누수**: 컴포넌트 언마운트 시 메모리 정리
- **배치 업데이트**: 다중 상태 변경 시 성능
- **DOM 업데이트**: 대량 데이터 렌더링 성능

## 🛠️ 테스트 도구

### 추천 테스트 프레임워크
```bash
# Jest + jsdom (추천)
npm install --save-dev jest jsdom

# 또는 Vitest (Vite 네이티브)
npm install --save-dev vitest @vitest/ui jsdom

# 또는 Mocha + Chai
npm install --save-dev mocha chai jsdom
```

### 테스트 실행 스크립트 (package.json)
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## 📋 테스트 예제

### 기본 상태 관리 테스트
```javascript
// __tests__/jihoFunc.test.js
import { createState } from '../src/Jiho/jihoFunc.js';

describe('createState', () => {
  test('should create state with initial value', () => {
    const state = createState('test', 'initial');
    expect(state.value).toBe('initial');
  });

  test('should update state value', () => {
    const state = createState('counter', 0);
    state.value = 5;
    expect(state.value).toBe(5);
  });
});
```

### DOM 렌더링 테스트
```javascript
// __tests__/jihoRender.test.js
import { createElement } from '../src/Jiho/jihoRender.js';

describe('createElement', () => {
  test('should create div element', () => {
    const element = createElement('div', { text: 'Hello' });
    expect(element.tagName).toBe('DIV');
    expect(element.textContent).toBe('Hello');
  });
});
```

## 🔧 환경 설정

### Jest 설정 (jest.config.js)
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/helpers/domSetup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'test/coverage',
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/test/__tests__/**/*.js'
  ]
};
```

### Vitest 설정 (vite.config.js 추가)
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  // 기존 설정...
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/helpers/domSetup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## 🎯 테스트 전략

### 1. 상태 관리 검증
- ✅ 상태 생성 및 초기화
- ✅ 상태 값 변경 및 구독
- ✅ 계산된 상태 동작
- ✅ 메모리 누수 방지

### 2. 렌더링 검증
- ✅ 엘리먼트 생성 및 속성 적용
- ✅ 이벤트 핸들러 바인딩
- ✅ 조건부 렌더링
- ✅ 동적 컨텐츠 업데이트

### 3. 통합 시나리오
- ✅ 전체 앱 라이프사이클
- ✅ 복잡한 컴포넌트 트리
- ✅ 상태 기반 UI 업데이트

## 📊 커버리지 목표

- **라인 커버리지**: 90% 이상
- **함수 커버리지**: 95% 이상
- **브랜치 커버리지**: 85% 이상
- **명령문 커버리지**: 90% 이상

## 🚀 CI/CD 통합

### GitHub Actions 예제
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## 📝 테스트 작성 가이드

1. **명확한 테스트명**: 무엇을 테스트하는지 명확히
2. **AAA 패턴**: Arrange, Act, Assert
3. **격리된 테스트**: 각 테스트는 독립적으로 실행
4. **엣지 케이스**: 경계값과 예외 상황 테스트
5. **모킹 최소화**: 실제 동작에 가까운 테스트

## 🔗 참고 자료

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/) 