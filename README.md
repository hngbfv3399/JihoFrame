# JihoFrame

## 공지
해당 프로젝트는 테스트 버전입니다.
코드 작성중 오류가 있을 수 있고 버그가 많습니다.
최적화 or 안전성은 개나 줘버렸고
단순히 재미 취미용으로 만든 프로젝트입니다.
그래도 업데이트 및 개선은 꾸준히 하겠습니다.

## 소개

html을 작성할떄 왜 굳이 태그로 작성을 해야 할까? 라는 아주 이상한 생각부터 시작했습니다.
그럼 태그를 안쓰고 html을 작성하는 방법이 뭐가 있을까 고민을 하다
flutter가 생각이 나더라고요? 그래서 flutter 처럼 위젯을 배치하는 방식으로 구현하면 되겠다 라고 생각했습니다.
그렇게 만들어진 저의 첫번째 프레임워크 jiho-frame 소개해드리겠습니다.

## 설치방법

vite로 환경을 구축 하겠습니다.

```bash
mkdir ex-project
cd ex-project
npm create vite@latest my-project # Vanilla 하고 javascript로 선택해주세요
cd my-project
npm install
npm install jiho-frame
```

## 개발 환경 설정

현재 파일구조에서 src 안의 내용은 다 삭제해주시고 src안에 main.js 와 App.js를 생성 후 이와 같이 작성하시면 됩니다.

```js
//src/main.js
import { renderApp } from "jiho-frame";
import App from "./App.js";

const app = document.getElementById("app");

renderApp(App, app);
```

```js
//src/App.js

function App() {
  return {
    layout: [
      {
        h1: {
          text: "hi",
        },
      },
    ],
  };
}

export default App;
```

이제 실행을 하시면 됩니다.

```bash
npm run dev
```

# 코드 작성법

## 기초 작성법

jiho-frame에서는 기본적으로 layout 키워드를 사용해 태그 및 속성을 감지합니다.
시용 예시)

```js
function App() {
  return {
    layout: [
      {
        h1: {
          text: "Hello World",
        },
      },
      {
        h2: {
          text: "this is h2",
        },
      },
    ],
  };
}

export default App;
```

이런식으로 layout:[] 배열안에 객체를 추가해 태그를 넣는 방식입니다.
만약에 태그안에 태그를 넣고 싶다면 div나 header와 같은 시멕틱태그를 추가하시면 됩니다.

사용 예시)

```js
function App() {
  return {
    layout: [
      {
        div: {
          h1: {
            text: "Hello World",
          },

          h2: {
            text: "this is h2",
          },
        },
      },
    ],
  };
}

export default App;
```

하지만 독립적인 태그를 사용 하고 싶다면 반드시 객체로 나눠야 합니다.

## 컴포넌트

해당 기능은 오류가 있어 수정 예정입니다.

## 이벤트 헨들러

이벤트 헨들러는 해당 태그가 있는 객체 안에 event:[{}]를 추가해 이벤트를 추가합니다.
사용 예시)

```js
function App() {
  return {
    layout: [
      {
        div: {
          h1: {
            text: "Hello World",
            event: [
              {
                onclick: () => {
                  console.log("Hello World");
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export default App;
```

이와 같이 사용 하시면 됩니다.

## 상태관리

jiho-frame에서는 createState('키',값)을 이용해 상태관리변수를 추가 및 수정 할 수 있습니다.
사용 예시1)

```js
//추가 및 값을 불러오는법
import { createState } from "jiho-frame";

function App() {
  const name = createState("name", "취미로개발");
  return {
    layout: [
      {
        div: {
          h1: {
            text: name.value,
          },
        },
      },
    ],
  };
}

export default App;
```

사용 예시2)

```js
//값을 수정 하는 방법
import { createState } from "jiho-frame";

function App() {
  const name = createState("name", "취미로개발");
  return {
    layout: [
      {
        div: {
          h1: {
            text: name.value,
          },
          button: {
            text: "이름 바꾸기",
            event: [
              {
                onclick: () => {
                  name.set("응애");
                },
              },
            ],
          },
        },
      },
    ],
  };
}

export default App;
```

## 조건부 렌더링

jiho-frame에서 조건부 렌더링을 추가 하실려면 condition과 condition 안에 객체를 추가해 사용 할 수 있는 if,elseIf,else문이 필요합니다.

사용 예시)

```js
import { createState } from "jiho-frame";

function App() {
  const count = createState("count", 0);
  return {
    layout: [
      {
        h1: {
          text: `${count.value}`,
        },
      },
      {
        condition: [
          {
            h2: {
              text: "5 이상입니다!",
              if: count.value >= 5,
            },
          },
          {
            h2: {
              text: "3 이상입니다!",
              elseIf: count.value >= 3,
            },
          },
          {
            h2: {
              text: "3 미만입니다!",
              else: true,
            },
          },
        ],
      },
      {
        button: {
          text: "증가!",
          event: [
            {
              onClick: () => count.set(count.value + 1),
            },
          ],
        },
      },
    ],
  };
}

export default App;
```

## 리스트 렌더링

```js
import { createState } from "jiho-frame";

function App() {
  const count = createState("count", ["사과", "배", "수박"]);
  return {
    layout: [
      {
        ol: {
          children: count.value.map((item, idx) => ({
            li: { text: `${idx + 1}번째: ${item}` },
          })),
        },
      },
    ],
  };
}

export default App;
```

이런식으로 사용 하시면 됩니다.

## 라이프 사이클(생명 주기)

jiho-frame에서는 생명 주기가 있습니다.jihoMount,jihoUpdate,jihoUnMount가 있습니다.

- jihoMount : 컴포넌트가 렌더링 된 후 실행 하는 함수 입니다
- jihoUpdate : 값을 변경하는 것을 감지해 실행해 주는 함수 입니다.
- jihoUnMount : 컴포넌트가 삭제 될때 실행 해주는 함수 입니다.
  사용 예시)

```js
import { createState, jihoMount, jihoUpdate, jihoUnMount } from "jiho-frame";

function App() {
  const count = createState("count", 0);

  jihoMount(() => {
    console.log("🚀 [Mount] 마운트 완료!");
  });

  jihoUpdate(() => {
    console.log("🔄 [Update] 상태 업데이트 감지됨! count =", count.value);
  }, count);

  jihoUnMount(() => {
    console.log("❌ [Unmount] 컴포넌트 제거됨.");
  });

  return {
    layout: [
      {
        h1: {
          text: `${count.value}`,
        },
      },
      {
        button: {
          text: "증가",
          event: [
            {
              onclick: () => {
                count.set(count.value + 1);
              },
            },
          ],
        },
      },
    ],
  };
}

export default App;
```


## 마무리
더 뭔가 추가를 하거나 수정을 해야 하지만 하루종일 이것만 만지니깐 많이 피곤하네요 현재 시간 새벽 5시 00분..