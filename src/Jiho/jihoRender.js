import {
  subscribeState,
  initCallbacks,
  mountCallbacks,
  unmountCallbacks,
} from "./jihoFunc.js";

function applyAttributes(el, options, tag) {
  const { text, style, id, className, event } = options;

  if (text) el.textContent = text;
  if (style) Object.assign(el.style, style);
  if (id) el.id = id;
  if (className) el.className = className;

  if (Array.isArray(event)) {
    event.forEach((evtObj) => {
      for (const [evtName, handler] of Object.entries(evtObj)) {
        const eventType = evtName.toLowerCase().replace(/^on/, "");
        el.addEventListener(eventType, handler);
      }
    });
  }

  if (tag === "input") {
    const attrs = ["type", "value", "checked", "multiple", "placeholder", "required"];
    attrs.forEach((attr) => attr in options && (el[attr] = options[attr]));
  }

  if (tag === "textarea") {
    ["value", "placeholder", "required"].forEach((attr) => {
      if (attr in options) el[attr] = options[attr];
    });
  }

  if (tag === "select") {
    if ("value" in options) el.value = options.value;
    if ("multiple" in options) el.multiple = options.multiple;
    if (Array.isArray(options.option)) {
      options.option.forEach(({ value, text }) => {
        const optEl = document.createElement("option");
        optEl.value = value;
        optEl.textContent = text;
        if (options.value === value) optEl.selected = true;
        el.appendChild(optEl);
      });
    }
  }

  if (tag === "label") {
    if ("for" in options) el.htmlFor = options.for;
    if ("text" in options) el.textContent = options.text;
  }
}

function renderChildren(el, options) {
  const ignoreKeys = [
    "text", "style", "id", "className", "event", "children", "if",
    "elseIf", "else", "option", "type", "value", "checked",
    "multiple", "placeholder", "required", "for"
  ];

  for (const [childTag, childValue] of Object.entries(options)) {
    if (ignoreKeys.includes(childTag)) continue;

    const childEl =
      typeof childValue === "function"
        ? createElement(...Object.entries(childValue())[0])
        : createElement(childTag, childValue);

    el.appendChild(childEl);
  }

  if (Array.isArray(options.children)) {
    options.children.forEach((child) => {
      const [childTag, childOptions] = Object.entries(child)[0];
      const childEl = createElement(childTag, childOptions);
      if (childEl) el.appendChild(childEl);
    });
  }
}

export function createElement(tag, options) {
  // ✅ 함수형 컴포넌트 - 함수 자체만 들어온 경우
  if (typeof tag === "function" && options === undefined) {
    const resolved = tag();
    const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
    return createElement(resolvedTag, resolvedValue);
  }

  // ✅ 함수형 컴포넌트 - 객체 안에 함수
  if (typeof options === "function") {
    const resolved = options();
    const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
    return createElement(resolvedTag, resolvedValue);
  }

  if (typeof options === "string") {
    const el = document.createElement(tag);
    el.textContent = options;
    return el;
  }

  const el = document.createElement(tag);
  applyAttributes(el, options, tag);
  renderChildren(el, options);
  return el;
}

function renderConditionalBlock(value, container) {
  let rendered = false;
  for (const item of value) {
    const [tag, props] = Object.entries(item)[0];
    if ((props.if || props.elseIf || props.else) && !rendered) {
      const el = createElement(tag, props);
      container.appendChild(el);
      rendered = true;
    }
  }
}

export function renderApp(appFunc, container) {
  initCallbacks.forEach((cb) => cb());

  const rerender = () => {
    container.innerHTML = "";
    const tree = appFunc();

    if (Array.isArray(tree.layout)) {
      for (const item of tree.layout) {
        if (typeof item === "function") {
          const resolved = item();
          const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
          const el = createElement(resolvedTag, resolvedValue);
          if (el) container.appendChild(el);
        } else {
          const [tag, value] = Object.entries(item)[0];

          if (tag === "condition" && Array.isArray(value)) {
            renderConditionalBlock(value, container);
          } else {
            const el = createElement(tag, value);
            if (el) container.appendChild(el);
          }
        }
      }
    }

    mountCallbacks.forEach((cb) => cb());
  };

  subscribeState(rerender);
  rerender();

  window.addEventListener("beforeunload", () => {
    unmountCallbacks.forEach((cb) => cb());
  });
}
