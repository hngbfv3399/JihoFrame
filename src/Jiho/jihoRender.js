import { subscribeState } from "./jihoFunc.js";

export function renderApp(appFunc, container) {
  const rerender = () => {
    const tree = appFunc();
    if (Array.isArray(tree.layout)) {
      container.innerHTML = "";  // 초기화

      tree.layout.forEach((item) => {
        const itemTree = typeof item === "function" ? item() : item;
        for (const [tag, value] of Object.entries(itemTree)) {
          const el = createElement(tag, value);
          container.appendChild(el);
        }
      });
    }
  };

  subscribeState(rerender);  // 상태가 바뀔 때마다 재렌더링
  rerender();  // 첫 렌더링
}

function createElement(tag, options) {
  const el = document.createElement(tag);

  // 텍스트 설정 (기본 텍스트 또는 텍스트 속성 사용)
  if (typeof options === "string") {
    el.textContent = options;
    return el;
  }

  // 옵션에서 텍스트 설정
  if (options.text) el.textContent = options.text;

  // 스타일 적용
  if (options.style) Object.assign(el.style, options.style);
  
  // ID 및 클래스 설정
  if (options.id) el.id = options.id;
  if (options.className) el.className = options.className;

  // 이벤트 처리
  if (Array.isArray(options.event)) {
    options.event.forEach((evtObj) => {
      for (const [evtName, handler] of Object.entries(evtObj)) {
        const eventType = evtName.toLowerCase().replace(/^on/, "");
        el.addEventListener(eventType, handler);
      }
    });
  }

  // 자식 요소 처리 (재귀적으로 자식 요소 추가)
  for (const [childTag, childValue] of Object.entries(options)) {
    if (["text", "style", "id", "className", "event"].includes(childTag)) continue;
    const childEl = createElement(childTag, childValue);
    el.appendChild(childEl);
  }

  return el;
}
