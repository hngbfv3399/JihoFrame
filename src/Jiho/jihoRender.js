import { subscribeState } from "./jihoFunc.js";

export function renderApp(appFunc, container) {
  const rerender = () => {
    container.innerHTML = "";
    const tree = appFunc();

    if (Array.isArray(tree.layout)) {
      tree.layout.forEach((item) => {
        const itemTree = typeof item === "function" ? item() : item;
        for (const [tag, value] of Object.entries(itemTree)) {
          const el = createElement(tag, value);
          container.appendChild(el);
        }
      });
    }
  };

  subscribeState(rerender);
  rerender();
}

function createElement(tag, options) {
    const el = document.createElement(tag);
  
    if (typeof options === "string") {
      el.textContent = options;
      return el;
    }
  
    // 기본 속성 처리
    if (options.text) el.textContent = options.text;
    if (options.style) Object.assign(el.style, options.style);
    if (options.id) el.id = options.id;
    if (options.className) el.className = options.className;
  
    // ✅ 이벤트 배열 처리
    if (Array.isArray(options.event)) {
      options.event.forEach((evtObj) => {
        for (const [evtName, handler] of Object.entries(evtObj)) {
          const eventType = evtName.toLowerCase().replace(/^on/, "");
          el.addEventListener(eventType, handler);
        }
      });
    }
  
    // ✅ 자식 태그 처리
    for (const [childTag, childValue] of Object.entries(options)) {
      if (["text", "style", "id", "className", "event"].includes(childTag)) continue;
      const childEl = createElement(childTag, childValue);
      el.appendChild(childEl);
    }
  
    return el;
  }