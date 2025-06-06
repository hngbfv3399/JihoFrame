# 🚀 JihoFrame

<div align="center">

![JihoFrame Logo](https://img.shields.io/badge/JihoFrame-3.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Bundle Size](https://img.shields.io/badge/Bundle%20Size-8KB%20gzipped-orange?style=for-the-badge)

**Modern Reactive UI Framework with Full Component System**

[🚀 Quick Start](#-quick-start) • [🎨 Components](#-jihoui-components) • [🛣️ Router](#-routing) • [📱 Animations](#-animations) • [🔔 Notifications](#-notifications)

</div>

---

## ✨ 특징

- 🎯 **No HTML Tags**: 객체로 UI 구성하는 현대적 접근
- ⚡ **High Performance**: 스마트 DOM 업데이트 시스템
- 🧠 **Reactive State**: 자동 상태 관리 및 반응형 업데이트
- 🎨 **Complete UI System**: 30+ 내장 JihoUI 컴포넌트
- 🛣️ **SPA Router**: 클라이언트 사이드 라우팅 지원
- 📱 **Rich Animations**: CSS 키프레임 애니메이션 시스템
- 🔔 **Notification System**: 토스트, 알림, 모달 다이얼로그
- 📦 **Lightweight**: 8KB gzipped, Zero Dependencies

## 🚀 Quick Start

### 설치
```bash
npm install jiho-frame
```

### 기본 사용법
```js
import { renderApp, createState } from "jiho-frame";

const count = createState("count", 0);

const App = () => ({
  layout: [
    {
      div: {
        style: { padding: "2rem", textAlign: "center" },
        children: [
          { h1: { text: () => `카운트: ${count.value}` } },
          {
            button: {
              text: "증가",
              event: { onClick: () => count.value++ }
            }
          }
        ]
      }
    }
  ]
});

renderApp(App, document.getElementById("app"));
```

## 🎨 JihoUI Components

### JihoButton
```js
{
  JihoButton: {
    text: "클릭하세요",
    color: "primary",      // primary, secondary, success, warning, danger
    type: "filled",        // filled, outlined, text, elevated
    size: "medium",        // small, medium, large
    onClick: () => alert("클릭!")
  }
}
```

### JihoCard
```js
{
  JihoCard: {
    image: "https://example.com/image.jpg",
    title: "카드 제목",
    subtitle: "부제목",
    content: "카드 내용입니다.",
    variant: "elevated",   // elevated, outlined, filled
    clickable: true,
    actions: [
      {
        JihoButton: {
          text: "상세보기",
          color: "primary",
          onClick: () => console.log("상세보기")
        }
      }
    ]
  }
}
```

### JihoModal
```js
const modalOpen = createState("modal", false);

{
  JihoModal: {
    open: modalOpen.value,
    title: "확인",
    content: "정말 삭제하시겠습니까?",
    size: "medium",        // small, medium, large, fullscreen
    variant: "warning",    // default, success, warning, danger, info
    animation: "fade",     // fade, slide, zoom, flip
    actions: [
      {
        JihoButton: {
          text: "취소",
          onClick: () => modalOpen.value = false
        }
      },
      {
        JihoButton: {
          text: "삭제",
          color: "danger",
          onClick: () => {
            modalOpen.value = false;
            // 삭제 로직
          }
        }
      }
    ],
    onClose: () => modalOpen.value = false
  }
}
```

### JihoHeader
```js
{
  JihoHeader: {
    left: [
      { h1: { text: "사이트 제목" } }
    ],
    center: [
      {
        JihoNav: {
          items: [
            { label: "홈", icon: "🏠" },
            { label: "소개", icon: "📖" },
            { label: "연락처", icon: "📞" }
          ],
          style: "pills",      // pills, tabs, buttons
          direction: "horizontal",
          onChange: (index, item) => console.log(item)
        }
      }
    ],
    right: [
      {
        JihoButton: {
          text: "로그인",
          color: "primary"
        }
      }
    ],
    blur: true,
    sticky: true
  }
}
```

### JihoSection
```js
{
  JihoSection: {
    title: "섹션 제목",
    subtitle: "섹션 설명",
    background: "gradient",    // solid, gradient, image
    padding: "normal",         // tight, normal, loose
    actions: [
      {
        JihoButton: {
          text: "더보기",
          type: "outlined"
        }
      }
    ],
    children: [
      // 섹션 내용
    ]
  }
}
```

### JihoGrid
```js
{
  JihoGrid: {
    cols: 3,              // 또는 { mobile: 1, tablet: 2, desktop: 3 }
    gap: "1rem",
    children: [
      { div: { text: "아이템 1" } },
      { div: { text: "아이템 2" } },
      { div: { text: "아이템 3" } }
    ]
  }
}
```

## 🛣️ Routing

### 라우터 설정
```js
import { createRouter, JihoRouterOutlet, JihoLink } from "jiho-frame";

// 라우트 정의
const router = createRouter({
  '/': HomePage,
  '/about': AboutPage,
  '/user/:id': UserPage          // 동적 라우트
}, {
  mode: 'hash',                  // hash 또는 history
  transition: 'fade'             // 페이지 전환 효과
});

// 라우터 아웃렛
{
  JihoRouterOutlet: {
    loading: { div: { text: "로딩 중..." } },
    notFound: { div: { text: "페이지를 찾을 수 없습니다" } }
  }
}

// 네비게이션 링크
{
  JihoLink: {
    to: "/about",
    children: [{ span: { text: "소개 페이지" } }]
  }
}
```

### 프로그래매틱 네비게이션
```js
import { useRouter } from "jiho-frame";

const router = useRouter();

// 페이지 이동
router.navigate('/about');
router.back();
router.forward();

// 현재 라우트 정보
const currentRoute = router.getCurrentRoute();
console.log(currentRoute.path, currentRoute.params);
```

## 📱 Animations

### 애니메이션 컴포넌트
```js
{
  JihoAnimated: {
    animation: "fade-in",         // fade-in, slide-in-up, bounce-in, zoom-in 등
    duration: "0.5s",
    delay: "0.1s",
    trigger: "mount",             // mount, scroll, hover
    children: [
      { div: { text: "애니메이션 적용됨!" } }
    ]
  }
}
```

### 사용 가능한 애니메이션
- `fade-in`, `fade-out`
- `slide-in-up`, `slide-in-down`, `slide-in-left`, `slide-in-right`
- `zoom-in`, `zoom-out`
- `bounce-in`, `flip-in`
- `shake`, `pulse`, `rotate`

## 🔔 Notifications

### 토스트 메시지
```js
import { showToast } from "jiho-frame";

showToast("성공적으로 저장되었습니다!", "success");
showToast("오류가 발생했습니다", "error");
showToast("주의가 필요합니다", "warning");
showToast("정보를 확인하세요", "info");
```

### 알림
```js
import { showNotification } from "jiho-frame";

showNotification("새 메시지가 도착했습니다", {
  title: "메시지 알림",
  type: "info",
  position: "top-right",        // top-left, top-right, bottom-left 등
  duration: 5000,               // 0이면 수동 닫기
  actions: [
    {
      text: "읽기",
      onClick: () => console.log("읽기 클릭")
    }
  ]
});
```

### 확인 다이얼로그
```js
import { showConfirm } from "jiho-frame";

showConfirm(
  "정말 삭제하시겠습니까?",
  "이 작업은 되돌릴 수 없습니다.",
  () => console.log("삭제 확인"),     // onConfirm
  () => console.log("취소")          // onCancel
);
```

## 🔄 State Management

### 기본 상태
```js
import { createState } from "jiho-frame";

const count = createState("count", 0);

// 값 읽기/쓰기
console.log(count.value);
count.value = 10;
```

### 계산된 상태
```js
import { computedState } from "jiho-frame";

const firstName = createState("firstName", "김");
const lastName = createState("lastName", "지호");
const fullName = computedState([firstName, lastName], (first, last) => `${first}${last}`);
```

### 상태 결합
```js
import { combineStates } from "jiho-frame";

const userInfo = combineStates([user, isOnline], (userData, online) => ({
  ...userData,
  status: online ? "온라인" : "오프라인"
}));
```

## 🎪 Events

```js
{
  button: {
    text: "클릭",
    event: {
      onClick: (e) => console.log("클릭", e),
      onMouseOver: () => console.log("호버"),
      onKeyDown: (e) => {
        if (e.key === 'Enter') console.log("엔터키");
      }
    }
  }
}
```

## 🧩 Components

### 컴포넌트 정의
```js
const UserCard = ({ user, onEdit }) => ({
  JihoCard: {
    title: user.name,
    subtitle: user.email,
    actions: [
      {
        JihoButton: {
          text: "편집",
          onClick: () => onEdit(user)
        }
      }
    ]
  }
});
```

### 컴포넌트 사용
```js
{
  UserCard: {
    user: { name: "김지호", email: "jiho@example.com" },
    onEdit: (user) => console.log("편집:", user)
  }
}
```

## 🔧 Advanced Features

### 조건부 렌더링
```js
const isLoggedIn = createState("isLoggedIn", false);

{
  div: {
    children: [
      isLoggedIn.value ? 
        { span: { text: "환영합니다!" } } :
        { JihoButton: { text: "로그인" } }
    ]
  }
}
```

### 리스트 렌더링
```js
const items = createState("items", ["사과", "바나나", "오렌지"]);

{
  ul: {
    children: items.value.map(item => ({
      li: { text: item }
    }))
  }
}
```

### 동적 스타일
```js
const isActive = createState("isActive", false);

{
  div: {
    style: {
      backgroundColor: isActive.value ? "#007bff" : "#6c757d",
      color: "white",
      padding: "1rem",
      borderRadius: "0.5rem",
      transition: "all 0.3s ease"
    }
  }
}
```

## 📦 Build & Deploy

### Vite 사용
```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.js',
      formats: ['es']
    }
  }
});
```

### 프로덕션 빌드
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by JihoFrame Team
</div> 