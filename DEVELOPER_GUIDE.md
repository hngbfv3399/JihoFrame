# 🛠️ JihoFrame 개발자 가이드

## 📋 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 구조](#프로젝트-구조)
3. [개발 워크플로우](#개발-워크플로우)
4. [코딩 스타일 가이드](#코딩-스타일-가이드)
5. [테스트 작성법](#테스트-작성법)
6. [성능 최적화](#성능-최적화)
7. [접근성 고려사항](#접근성-고려사항)
8. [디버깅 및 프로파일링](#디버깅-및-프로파일링)
9. [기여 가이드라인](#기여-가이드라인)

---

## 🚀 개발 환경 설정

### 필수 조건
- **Node.js**: 16.0.0 이상 (18.x 권장)
- **npm**: 7.0.0 이상
- **Git**: 최신 버전

### 설치 및 설정

```bash
# 1. 저장소 클론
git clone https://github.com/hngbfv3399/jiho-frame.git
cd jiho-frame

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev

# 4. 다른 터미널에서 테스트 실행
npm run test:watch
```

### 개발 도구 설정

#### VS Code 확장 프로그램 (권장)
```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-jest"
  ]
}
```

#### VS Code 설정
```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "jest.autoRun": "watch"
}
```

---

## 📁 프로젝트 구조

```
jiho-frame/
├── 📁 src/                      # 소스 코드
│   ├── 📁 Jiho/                 # 핵심 라이브러리
│   │   ├── jihoFunc.js          # 상태 관리
│   │   └── jihoRender.js        # 렌더링 엔진
│   ├── 📁 accessibility/        # 접근성 모듈
│   │   └── a11y.js              # 접근성 매니저
│   └── index.js                 # 진입점
├── 📁 test/                     # 테스트 파일들
│   ├── 📁 __tests__/            # 테스트 케이스
│   │   ├── jihoFunc.test.js     # 상태 관리 테스트
│   │   └── jihoRender.test.js   # 렌더링 테스트
│   └── 📁 helpers/              # 테스트 헬퍼
│       └── domSetup.js          # DOM 환경 설정
├── 📁 tools/                    # 개발 도구들
│   ├── bundle-analyzer.js       # 번들 분석기
│   ├── performance-benchmark.js # 성능 벤치마크
│   └── dev-tools.js             # 개발자 도구
├── 📁 .github/                  # GitHub 설정
│   └── 📁 workflows/            # GitHub Actions
│       ├── ci.yml               # CI 파이프라인
│       └── release.yml          # 릴리즈 자동화
├── 📁 public/                   # 정적 자산 (공개)
├── 📁 assets/                   # 정적 자산 (번들링)
├── 📁 dist/                     # 빌드 결과물
├── package.json                 # 프로젝트 설정
├── vite.config.js              # 빌드 설정
├── jest.config.js              # 테스트 설정
├── .eslintrc.js                # 린트 설정
└── .prettier.config.js         # 포맷터 설정
```

---

## 🔄 개발 워크플로우

### 기본 명령어들

```bash
# 🔨 개발
npm run dev              # 개발 서버 시작 (HMR 포함)
npm run start            # 개발 서버 시작 (별칭)
npm run preview          # 프로덕션 빌드 미리보기

# 🧪 테스트
npm run test             # 테스트 한 번 실행
npm run test:watch       # 테스트 감시 모드
npm run test:coverage    # 커버리지 포함 테스트
npm run test:ci          # CI용 테스트

# 🏗️ 빌드
npm run build            # 프로덕션 빌드
npm run clean            # 빌드 결과물 정리

# 🔍 코드 품질
npm run lint             # ESLint 검사
npm run lint:fix         # ESLint 자동 수정
npm run format           # Prettier 포맷팅
npm run format:check     # 포맷팅 검사

# 📊 분석
npm run analyze:bundle   # 번들 분석
npm run analyze:size     # 번들 크기 확인
npm run benchmark        # 성능 벤치마크
npm run a11y:audit       # 접근성 검사
npm run security:audit   # 보안 검사
```

### 브랜치 전략

```
main                     # 프로덕션 브랜치
├── develop             # 개발 브랜치
│   ├── feature/        # 기능 개발
│   │   ├── animation-system
│   │   └── theme-support
│   ├── bugfix/         # 버그 수정
│   │   └── memory-leak-fix
│   └── hotfix/         # 긴급 수정
│       └── security-patch
└── release/            # 릴리즈 준비
    └── v2.1.0
```

### 커밋 메시지 규칙

```bash
# 형식: <타입>(<스코프>): <설명>

feat(animation): 애니메이션 시스템 추가
fix(render): DOM 업데이트 버그 수정
docs(readme): 설치 가이드 업데이트
style(eslint): 코딩 스타일 규칙 적용
refactor(state): 상태 관리 로직 개선
perf(render): 렌더링 성능 최적화
test(jihoFunc): 상태 관리 테스트 추가
chore(deps): 의존성 버전 업데이트
```

---

## ✨ 코딩 스타일 가이드

### JavaScript 스타일

```javascript
// ✅ 좋은 예시
const createComponent = (props = {}) => {
  const { name, children, ...rest } = props;
  
  return {
    type: 'div',
    props: {
      'data-component': name,
      ...rest,
    },
    children: children || [],
  };
};

// ❌ 나쁜 예시
function createComponent(props) {
  var name = props.name;
  var children = props.children;
  return {
    type: "div",
    props: {
      "data-component": name
    },
    children: children ? children : []
  };
}
```

### 네이밍 규칙

```javascript
// 상수: SCREAMING_SNAKE_CASE
const MAX_RENDER_DEPTH = 100;
const DEFAULT_TIMEOUT = 5000;

// 함수: camelCase
const createState = () => {};
const renderComponent = () => {};

// 클래스: PascalCase
class ComponentRenderer {}
class StateManager {}

// 변수: camelCase
const currentState = {};
const isRendering = false;

// 파일명: kebab-case 또는 camelCase
// jiho-render.js 또는 jihoRender.js
```

### 함수 작성 가이드

```javascript
// ✅ 작고 명확한 책임
const validateProps = (props) => {
  if (!props || typeof props !== 'object') {
    throw new Error('Props must be an object');
  }
  return true;
};

const normalizeChildren = (children) => {
  if (!Array.isArray(children)) {
    return [children];
  }
  return children.filter(child => child != null);
};

// ✅ 순수 함수 선호
const calculateNewState = (currentState, action) => {
  return {
    ...currentState,
    [action.key]: action.value,
  };
};

// ❌ 사이드 이펙트가 있는 함수
const updateGlobalState = (key, value) => {
  window.globalState[key] = value; // 글로벌 상태 변경
  console.log('State updated'); // 콘솔 출력
};
```

### 에러 처리

```javascript
// ✅ 명확한 에러 메시지와 타입
class JihoFrameError extends Error {
  constructor(message, code, context = {}) {
    super(message);
    this.name = 'JihoFrameError';
    this.code = code;
    this.context = context;
  }
}

const createState = (initialValue) => {
  try {
    validateInitialValue(initialValue);
    return new StateContainer(initialValue);
  } catch (error) {
    throw new JihoFrameError(
      `Failed to create state: ${error.message}`,
      'STATE_CREATION_ERROR',
      { initialValue }
    );
  }
};
```

---

## 🧪 테스트 작성법

### 테스트 구조

```javascript
// test/__tests__/myFeature.test.js
describe('MyFeature', () => {
  // 테스트 설정
  beforeEach(() => {
    jest.clearAllMocks();
    setupTestEnvironment();
  });

  // 기능별 그룹화
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const feature = createMyFeature();
      expect(feature.isInitialized).toBe(true);
    });

    it('should accept custom configuration', () => {
      const config = { option: 'value' };
      const feature = createMyFeature(config);
      expect(feature.config).toEqual(config);
    });
  });

  describe('error handling', () => {
    it('should throw error for invalid input', () => {
      expect(() => {
        createMyFeature(null);
      }).toThrow('Invalid configuration');
    });
  });
});
```

### 테스트 패턴

```javascript
// 1. AAA 패턴 (Arrange, Act, Assert)
test('should update state correctly', () => {
  // Arrange
  const initialState = { count: 0 };
  const state = createState(initialState);
  
  // Act
  state.update({ count: 5 });
  
  // Assert
  expect(state.getValue()).toEqual({ count: 5 });
});

// 2. 비동기 테스트
test('should handle async operations', async () => {
  const asyncFunction = jest.fn().mockResolvedValue('result');
  
  const result = await myAsyncFeature(asyncFunction);
  
  expect(asyncFunction).toHaveBeenCalledTimes(1);
  expect(result).toBe('result');
});

// 3. 모킹
test('should use mocked dependencies', () => {
  const mockDependency = {
    doSomething: jest.fn().mockReturnValue('mocked'),
  };
  
  const feature = createFeature(mockDependency);
  const result = feature.execute();
  
  expect(mockDependency.doSomething).toHaveBeenCalled();
  expect(result).toBe('mocked');
});
```

### 커버리지 목표

- **라인 커버리지**: 85% 이상
- **함수 커버리지**: 90% 이상
- **브랜치 커버리지**: 80% 이상
- **스테이트먼트 커버리지**: 85% 이상

---

## ⚡ 성능 최적화

### 성능 측정

```javascript
// 성능 벤치마크 예시
import PerformanceBenchmark from '../tools/performance-benchmark.js';

const benchmark = new PerformanceBenchmark();

benchmark
  .suite('State Management')
  .bench('create state', () => {
    createState({ value: Math.random() });
  })
  .bench('update state', () => {
    state.update({ value: Math.random() });
  });

benchmark.printResults();
```

### 최적화 체크리스트

#### 🚀 렌더링 최적화
- [ ] 불필요한 리렌더링 방지
- [ ] 가상 DOM diff 최적화
- [ ] 메모이제이션 활용
- [ ] 지연 로딩 구현

#### 💾 메모리 최적화
- [ ] 메모리 누수 방지
- [ ] 이벤트 리스너 정리
- [ ] 순환 참조 방지
- [ ] WeakMap/WeakSet 활용

#### 📦 번들 최적화
- [ ] 트리 셰이킹 적용
- [ ] 코드 분할
- [ ] 압축 최적화
- [ ] 불필요한 의존성 제거

---

## ♿ 접근성 고려사항

### 접근성 검사

```javascript
// 접근성 자동 검사
import AccessibilityManager from '../src/accessibility/a11y.js';

const a11y = new AccessibilityManager();
const issues = a11y.runA11yAudit();

if (issues.length > 0) {
  console.warn('접근성 문제 발견:', issues);
}
```

### 접근성 체크리스트

#### 키보드 내비게이션
- [ ] Tab 순서가 논리적
- [ ] 포커스 표시가 명확
- [ ] 키보드로 모든 기능 접근 가능
- [ ] ESC로 모달/오버레이 닫기

#### 스크린 리더
- [ ] 의미적 HTML 사용
- [ ] ARIA 라벨 제공
- [ ] 상태 변화 공지
- [ ] 랜드마크 역할 정의

#### 시각적 접근성
- [ ] 색상 대비 4.5:1 이상
- [ ] 텍스트 크기 조절 가능
- [ ] 색상에만 의존하지 않음
- [ ] 애니메이션 제어 가능

---

## 🐛 디버깅 및 프로파일링

### 개발자 도구 사용

```javascript
// 개발 모드에서만 활성화
if (process.env.NODE_ENV === 'development') {
  import('../tools/dev-tools.js').then(({ default: DevTools }) => {
    window.__JIHO_DEV_TOOLS__ = new DevTools();
  });
}

// 브라우저 콘솔에서 사용 가능한 명령어
// __JIHO_DEV_TOOLS__.getPerformanceReport()
// __JIHO_DEV_TOOLS__.searchStateHistory()
// __JIHO_DEV_TOOLS__.visualizeComponentTree()
```

### 성능 프로파일링

```javascript
// 성능 측정 마킹
performance.mark('jiho-render-start');
renderComponent(component);
performance.mark('jiho-render-end');

performance.measure(
  'jiho-render-duration',
  'jiho-render-start',
  'jiho-render-end'
);

const measures = performance.getEntriesByType('measure');
console.log('렌더링 시간:', measures[0].duration);
```

### 메모리 누수 탐지

```javascript
// 메모리 사용량 모니터링
const checkMemoryUsage = () => {
  if (performance.memory) {
    const used = performance.memory.usedJSHeapSize / 1048576;
    const total = performance.memory.totalJSHeapSize / 1048576;
    
    console.log(`메모리 사용량: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB`);
    
    if (used > 50) { // 50MB 초과 시 경고
      console.warn('높은 메모리 사용량 감지');
    }
  }
};

setInterval(checkMemoryUsage, 10000); // 10초마다 확인
```

---

## 🤝 기여 가이드라인

### Pull Request 프로세스

1. **이슈 생성**: 새 기능/버그에 대한 이슈 생성
2. **브랜치 생성**: `feature/issue-number-description` 형식
3. **개발 진행**: 코딩 스타일 가이드 준수
4. **테스트 작성**: 새 기능에 대한 테스트 추가
5. **PR 생성**: 상세한 설명과 함께 PR 생성
6. **코드 리뷰**: 팀원들의 리뷰 반영
7. **병합**: 모든 체크 통과 후 병합

### 코드 리뷰 체크리스트

#### 기능성
- [ ] 요구사항을 올바르게 구현했는가?
- [ ] 엣지 케이스를 고려했는가?
- [ ] 에러 처리가 적절한가?

#### 코드 품질
- [ ] 코딩 스타일 가이드를 준수했는가?
- [ ] 함수가 단일 책임을 가지는가?
- [ ] 변수명이 명확하고 이해하기 쉬운가?

#### 성능
- [ ] 불필요한 연산이 없는가?
- [ ] 메모리 누수 가능성은 없는가?
- [ ] 시간 복잡도가 적절한가?

#### 테스트
- [ ] 테스트 케이스가 충분한가?
- [ ] 테스트가 의미 있는 시나리오를 다루는가?
- [ ] 모든 테스트가 통과하는가?

### 릴리즈 프로세스

1. **버전 업데이트**: `npm version patch|minor|major`
2. **CHANGELOG 업데이트**: 변경사항 문서화
3. **릴리즈 노트 작성**: 주요 변경사항 요약
4. **태그 푸시**: `git push --tags`
5. **자동 배포**: GitHub Actions가 자동으로 npm에 배포

---

## 📚 추가 자료

- [API 문서](./README.md#api-reference)
- [기능 로드맵](./FEATURE_ROADMAP.md)
- [성능 벤치마크 결과](./benchmark-results/)
- [접근성 가이드](./src/accessibility/README.md)
- [보안 정책](./SECURITY.md)

---

## ❓ 문제 해결

### 자주 발생하는 문제들

#### Q: 개발 서버가 시작되지 않아요
```bash
# 포트 충돌 해결
npm run dev -- --port 3001

# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

#### Q: 테스트가 실패해요
```bash
# 캐시 클리어 후 재실행
npm run test -- --clearCache
npm run test
```

#### Q: 빌드 오류가 발생해요
```bash
# 타입 체크
npm run lint
npm run format:check

# 의존성 확인
npm audit
```

### 도움 요청하기

1. **GitHub Issues**: 버그 리포트, 기능 요청
2. **GitHub Discussions**: 질문, 아이디어 공유
3. **이메일**: hngbfv3399@gmail.com (긴급한 보안 문제)

---

*이 문서는 지속적으로 업데이트됩니다. 개선 사항이나 질문이 있으시면 언제든 이슈를 남겨주세요!* 