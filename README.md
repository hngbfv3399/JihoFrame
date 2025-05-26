# 🚀 JihoFrame

<div align="center">

![JihoFrame Logo](https://img.shields.io/badge/JihoFrame-2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Bundle Size](https://img.shields.io/badge/Bundle%20Size-4.07KB%20gzipped-orange?style=for-the-badge)

**Flutter-inspired Reactive UI Library for the Web**

[📖 Documentation](#-documentation) • [🚀 Quick Start](#-quick-start) • [💡 Examples](#-examples) • [🔧 API Reference](#-api-reference)

</div>

---

## ✨ 특징

- 🎯 **Flutter-inspired Syntax**: HTML 태그 없이 객체로 UI 구성
- ⚡ **High Performance**: 스마트 DOM 업데이트로 최적화된 렌더링
- 🧠 **Reactive State**: 자동 상태 관리 및 반응형 업데이트
- 🔒 **Memory Safe**: 자동 메모리 누수 방지 시스템
- 🛠️ **Developer Friendly**: 강력한 에러 처리 및 디버깅 도구
- 📦 **Lightweight**: 4KB gzipped, Zero Dependencies
- 🔧 **TypeScript Support**: 완전한 타입 정의 제공

## 🚀 Quick Start

### 설치

```bash
npm install jiho-frame
```

### 기본 사용법

```js
// main.js
import { renderApp } from "jiho-frame";
import App from "./App.js";

const app = document.getElementById("app");
renderApp(App, app);
```

```js
// App.js
import { createState } from "jiho-frame";

function App() {
  const count = createState("count", 0);
  
  return {
    layout: [
      {
        div: {
          style: { textAlign: "center", padding: "20px" },
          children: [
            {
              h1: {
                text: `카운트: ${count.value}`,
                style: { color: "#333" }
              }
            },
            {
              button: {
                text: "증가",
                style: { 
                  padding: "10px 20px", 
                  fontSize: "16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                },
                event: {
                  onClick: () => count.value++
                }
              }
            }
          ]
        }
      }
    ]
  };
}

export default App;
```

## 📚 Documentation

### 🎯 기본 개념

JihoFrame은 HTML 태그를 직접 작성하지 않고 JavaScript 객체로 UI를 구성하는 프레임워크입니다.

#### Layout 구조
```js
{
  layout: [
    {
      태그명: {
        속성들...
      }
    }
  ]
}
```

#### 중첩 요소
```js
{
  div: {
    children: [
      { h1: { text: "제목" } },
      { p: { text: "내용" } }
    ]
  }
}
```

### 🔄 상태 관리

#### 기본 상태
```js
import { createState } from "jiho-frame";

const name = createState("name", "초기값");

// 값 읽기
console.log(name.value);

// 값 변경
name.value = "새로운 값";
```

#### 계산된 상태 (Computed State)
```js
import { createState, computedState } from "jiho-frame";

const firstName = createState("firstName", "김");
const lastName = createState("lastName", "지호");

const fullName = computedState(
  [firstName, lastName],
  (first, last) => `${first}${last}`
);

console.log(fullName.value); // "김지호"
```

#### 상태 결합
```js
import { combineStates } from "jiho-frame";

const user = createState("user", { name: "지호" });
const isOnline = createState("isOnline", true);

const userStatus = combineStates(
  [user, isOnline],
  (userData, online) => `${userData.name} (${online ? "온라인" : "오프라인"})`
);
```

### 🎪 이벤트 처리

#### 간단한 방식
```js
{
  button: {
    text: "클릭",
    event: {
      onClick: () => console.log("클릭됨!"),
      onMouseOver: () => console.log("마우스 오버!")
    }
  }
}
```

#### 배열 방식 (기존 호환성)
```js
{
  button: {
    text: "클릭",
    event: [
      { onClick: () => console.log("클릭됨!") }
    ]
  }
}
```

### 🧩 컴포넌트

#### 컴포넌트 정의
```js
// components/Button.js
function Button({ text, onClick, color = "#007bff" }) {
  return {
    button: {
      text,
      style: {
        padding: "10px 20px",
        backgroundColor: color,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      },
      event: { onClick }
    }
  };
}

export default Button;
```

#### 컴포넌트 사용
```js
import Button from "./components/Button.js";

{
  layout: [
    {
      Button: {
        text: "저장",
        color: "#28a745",
        onClick: () => console.log("저장됨!")
      }
    }
  ]
}
```

### 🔀 조건부 렌더링

```js
{
  condition: [
    {
      div: {
        text: "로그인됨",
        if: () => user.value.isLoggedIn
      }
    },
    {
      div: {
        text: "게스트",
        else: true
      }
    }
  ]
}
```

### 📋 리스트 렌더링

```js
const items = createState("items", ["사과", "바나나", "오렌지"]);

{
  ul: {
    children: items.value.map((item, index) => ({
      li: {
        text: `${index + 1}. ${item}`,
        style: { padding: "5px 0" }
      }
    }))
  }
}
```

### 🔄 라이프사이클

```js
import { jihoInit, jihoMount, jihoUpdate, jihoUnMount } from "jiho-frame";

function App() {
  const count = createState("count", 0);

  jihoInit(() => {
    console.log("앱 초기화");
  });

  jihoMount(() => {
    console.log("컴포넌트 마운트됨");
  });

  jihoUpdate(() => {
    console.log("상태 업데이트:", count.value);
  }, count);

  jihoUnMount(() => {
    console.log("컴포넌트 언마운트됨");
  });

  // ... 컴포넌트 로직
}
```

## 💡 Examples

### 📝 완전한 TodoList 앱

```js
import { createState, computedState } from "jiho-frame";

function TodoApp() {
  // 상태 정의
  const todos = createState("todos", []);
  const newTodoText = createState("newTodoText", "");
  const filter = createState("filter", "all"); // all, active, completed

  // 계산된 상태
  const filteredTodos = computedState([todos, filter], (todoList, currentFilter) => {
    switch (currentFilter) {
      case "active":
        return todoList.filter(todo => !todo.completed);
      case "completed":
        return todoList.filter(todo => todo.completed);
      default:
        return todoList;
    }
  });

  const remainingCount = computedState([todos], (todoList) =>
    todoList.filter(todo => !todo.completed).length
  );

  // 액션 함수들
  const addTodo = () => {
    if (newTodoText.value.trim()) {
      todos.value = [
        ...todos.value,
        {
          id: Date.now(),
          text: newTodoText.value.trim(),
          completed: false
        }
      ];
      newTodoText.value = "";
    }
  };

  const toggleTodo = (id) => {
    todos.value = todos.value.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  };

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(todo => todo.id !== id);
  };

  const clearCompleted = () => {
    todos.value = todos.value.filter(todo => !todo.completed);
  };

  return {
    layout: [
      {
        div: {
          style: {
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            fontFamily: "Arial, sans-serif"
          },
          children: [
            // 헤더
            {
              header: {
                style: { textAlign: "center", marginBottom: "30px" },
                children: [
                  {
                    h1: {
                      text: "📝 JihoFrame TodoList",
                      style: {
                        color: "#333",
                        fontSize: "2.5rem",
                        marginBottom: "10px"
                      }
                    }
                  },
                  {
                    p: {
                      text: "Flutter-inspired Todo App",
                      style: {
                        color: "#666",
                        fontSize: "1.1rem"
                      }
                    }
                  }
                ]
              }
            },

            // 입력 섹션
            {
              section: {
                style: { marginBottom: "20px" },
                children: [
                  {
                    div: {
                      style: {
                        display: "flex",
                        gap: "10px",
                        marginBottom: "15px"
                      },
                      children: [
                        {
                          input: {
                            type: "text",
                            placeholder: "새로운 할 일을 입력하세요...",
                            value: newTodoText.value,
                            style: {
                              flex: "1",
                              padding: "12px",
                              border: "2px solid #e1e5e9",
                              borderRadius: "8px",
                              fontSize: "16px",
                              outline: "none"
                            },
                            event: {
                              onInput: (e) => newTodoText.value = e.target.value,
                              onKeyPress: (e) => {
                                if (e.key === "Enter") addTodo();
                              },
                              onFocus: (e) => {
                                e.target.style.borderColor = "#007bff";
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = "#e1e5e9";
                              }
                            }
                          }
                        },
                        {
                          button: {
                            text: "추가",
                            style: {
                              padding: "12px 24px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "16px",
                              cursor: "pointer",
                              transition: "background-color 0.2s"
                            },
                            event: {
                              onClick: addTodo,
                              onMouseOver: (e) => {
                                e.target.style.backgroundColor = "#0056b3";
                              },
                              onMouseOut: (e) => {
                                e.target.style.backgroundColor = "#007bff";
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },

            // 통계 및 필터
            {
              section: {
                style: { marginBottom: "20px" },
                children: [
                  {
                    div: {
                      style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "15px"
                      },
                      children: [
                        {
                          span: {
                            text: `남은 할 일: ${remainingCount.value}개`,
                            style: {
                              fontSize: "16px",
                              fontWeight: "bold",
                              color: "#495057"
                            }
                          }
                        },
                        {
                          div: {
                            style: { display: "flex", gap: "5px" },
                            children: [
                              {
                                button: {
                                  text: "전체",
                                  style: {
                                    padding: "8px 16px",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "6px",
                                    backgroundColor: filter.value === "all" ? "#007bff" : "white",
                                    color: filter.value === "all" ? "white" : "#495057",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                  },
                                  event: {
                                    onClick: () => filter.value = "all"
                                  }
                                }
                              },
                              {
                                button: {
                                  text: "진행중",
                                  style: {
                                    padding: "8px 16px",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "6px",
                                    backgroundColor: filter.value === "active" ? "#007bff" : "white",
                                    color: filter.value === "active" ? "white" : "#495057",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                  },
                                  event: {
                                    onClick: () => filter.value = "active"
                                  }
                                }
                              },
                              {
                                button: {
                                  text: "완료됨",
                                  style: {
                                    padding: "8px 16px",
                                    border: "1px solid #dee2e6",
                                    borderRadius: "6px",
                                    backgroundColor: filter.value === "completed" ? "#007bff" : "white",
                                    color: filter.value === "completed" ? "white" : "#495057",
                                    cursor: "pointer",
                                    fontSize: "14px"
                                  },
                                  event: {
                                    onClick: () => filter.value = "completed"
                                  }
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },

            // 할 일 목록
            {
              section: {
                children: [
                  {
                    condition: [
                      {
                        div: {
                          style: {
                            textAlign: "center",
                            padding: "40px",
                            color: "#6c757d"
                          },
                          children: [
                            {
                              p: {
                                text: "📝 할 일이 없습니다",
                                style: { fontSize: "18px", margin: "0" }
                              }
                            }
                          ],
                          if: () => filteredTodos.value.length === 0
                        }
                      },
                      {
                        ul: {
                          style: {
                            listStyle: "none",
                            padding: "0",
                            margin: "0"
                          },
                          children: filteredTodos.value.map(todo => ({
                            li: {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                padding: "15px",
                                marginBottom: "10px",
                                backgroundColor: "white",
                                border: "1px solid #e1e5e9",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                transition: "transform 0.2s, box-shadow 0.2s"
                              },
                              children: [
                                {
                                  input: {
                                    type: "checkbox",
                                    checked: todo.completed,
                                    style: {
                                      marginRight: "15px",
                                      transform: "scale(1.2)",
                                      cursor: "pointer"
                                    },
                                    event: {
                                      onChange: () => toggleTodo(todo.id)
                                    }
                                  }
                                },
                                {
                                  span: {
                                    text: todo.text,
                                    style: {
                                      flex: "1",
                                      fontSize: "16px",
                                      textDecoration: todo.completed ? "line-through" : "none",
                                      color: todo.completed ? "#6c757d" : "#212529",
                                      opacity: todo.completed ? "0.7" : "1"
                                    }
                                  }
                                },
                                {
                                  button: {
                                    text: "🗑️",
                                    style: {
                                      padding: "8px 12px",
                                      backgroundColor: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      fontSize: "14px",
                                      transition: "background-color 0.2s"
                                    },
                                    event: {
                                      onClick: () => deleteTodo(todo.id),
                                      onMouseOver: (e) => {
                                        e.target.style.backgroundColor = "#c82333";
                                      },
                                      onMouseOut: (e) => {
                                        e.target.style.backgroundColor = "#dc3545";
                                      }
                                    }
                                  }
                                }
                              ],
                              event: {
                                onMouseOver: (e) => {
                                  e.currentTarget.style.transform = "translateY(-2px)";
                                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                                },
                                onMouseOut: (e) => {
                                  e.currentTarget.style.transform = "translateY(0)";
                                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                }
                              }
                            }
                          })),
                          else: true
                        }
                      }
                    ]
                  }
                ]
              }
            },

            // 하단 액션
            {
              condition: [
                {
                  footer: {
                    style: {
                      marginTop: "30px",
                      textAlign: "center"
                    },
                    children: [
                      {
                        button: {
                          text: "완료된 항목 삭제",
                          style: {
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px"
                          },
                          event: {
                            onClick: clearCompleted
                          }
                        }
                      }
                    ],
                    if: () => todos.value.some(todo => todo.completed)
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  };
}

export default TodoApp;
```

### 🎮 간단한 카운터 앱

```js
import { createState, computedState } from "jiho-frame";

function CounterApp() {
  const count = createState("count", 0);
  const step = createState("step", 1);
  
  const isEven = computedState([count], (num) => num % 2 === 0);
  
  return {
    layout: [
      {
        div: {
          style: {
            textAlign: "center",
            padding: "50px",
            fontFamily: "Arial, sans-serif"
          },
          children: [
            {
              h1: {
                text: `카운트: ${count.value}`,
                style: {
                  fontSize: "3rem",
                  color: isEven.value ? "#28a745" : "#dc3545",
                  marginBottom: "20px"
                }
              }
            },
            {
              p: {
                text: `현재 숫자는 ${isEven.value ? "짝수" : "홀수"}입니다`,
                style: { fontSize: "1.2rem", marginBottom: "30px" }
              }
            },
            {
              div: {
                style: { marginBottom: "20px" },
                children: [
                  {
                    label: {
                      text: "증가 단위: ",
                      style: { marginRight: "10px" }
                    }
                  },
                  {
                    input: {
                      type: "number",
                      value: step.value,
                      min: 1,
                      style: {
                        padding: "5px",
                        fontSize: "16px",
                        width: "60px"
                      },
                      event: {
                        onInput: (e) => step.value = parseInt(e.target.value) || 1
                      }
                    }
                  }
                ]
              }
            },
            {
              div: {
                style: { display: "flex", gap: "10px", justifyContent: "center" },
                children: [
                  {
                    button: {
                      text: `-${step.value}`,
                      style: {
                        padding: "15px 25px",
                        fontSize: "18px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      },
                      event: {
                        onClick: () => count.value -= step.value
                      }
                    }
                  },
                  {
                    button: {
                      text: "리셋",
                      style: {
                        padding: "15px 25px",
                        fontSize: "18px",
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      },
                      event: {
                        onClick: () => count.value = 0
                      }
                    }
                  },
                  {
                    button: {
                      text: `+${step.value}`,
                      style: {
                        padding: "15px 25px",
                        fontSize: "18px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                      },
                      event: {
                        onClick: () => count.value += step.value
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  };
}

export default CounterApp;
```

## 🔧 API Reference

### State Management

#### `createState(key, initialValue)`
새로운 상태를 생성합니다.

```js
const count = createState("count", 0);
console.log(count.value); // 0
count.value = 10; // 상태 업데이트
```

#### `computedState(dependencies, computer)`
다른 상태들로부터 계산되는 상태를 생성합니다.

```js
const fullName = computedState(
  [firstName, lastName],
  (first, last) => `${first} ${last}`
);
```

#### `combineStates(stateObjects, combiner)`
여러 상태를 하나로 결합합니다.

```js
const combined = combineStates(
  [state1, state2],
  (val1, val2) => val1 + val2
);
```

#### `watchState(key, callback)`
상태 변화를 감시합니다 (디버깅용).

```js
const unwatch = watchState("count", (newVal, oldVal) => {
  console.log(`${oldVal} → ${newVal}`);
});
```

### Lifecycle Hooks

#### `jihoInit(callback)`
앱 초기화 시 실행됩니다.

#### `jihoMount(callback)`
컴포넌트 마운트 시 실행됩니다.

#### `jihoUpdate(callback, stateObject)`
특정 상태 업데이트 시 실행됩니다.

#### `jihoUnMount(callback)`
컴포넌트 언마운트 시 실행됩니다.

### Utilities

#### `getStateSnapshot()`
현재 모든 상태의 스냅샷을 반환합니다.

#### `resetState(key?)`
특정 상태 또는 모든 상태를 초기화합니다.

#### `unsubscribeAll(component)`
컴포넌트의 모든 구독을 해제합니다.

## 🚀 Performance Tips

1. **상태 분리**: 관련 없는 상태는 분리하여 불필요한 리렌더링 방지
2. **Computed State 활용**: 복잡한 계산은 `computedState`로 캐싱
3. **메모리 정리**: 컴포넌트 언마운트 시 `unsubscribeAll` 사용
4. **조건부 렌더링**: 큰 리스트는 조건부로 렌더링

## 📈 Migration Guide

### v1.x → v2.0

```js
// ❌ 이전 방식
const name = createState("name", "지호");
text: name.get()

// ✅ 새로운 방식 (기존 방식도 여전히 지원)
text: name.value
```

```js
// ❌ 이전 방식
event: [{ onClick: handler }]

// ✅ 새로운 방식 (더 간단!)
event: { onClick: handler }
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Flutter's widget system
- Built with modern JavaScript and Vite
- Special thanks to the open source community

---

<div align="center">

**Made with ❤️ by 김지호**

[⭐ Star this project](https://github.com/your-username/jiho-frame) • [🐛 Report Bug](https://github.com/your-username/jiho-frame/issues) • [💡 Request Feature](https://github.com/your-username/jiho-frame/issues)

</div>
