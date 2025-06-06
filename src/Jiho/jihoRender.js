import {
  subscribeState,
  initCallbacks,
  mountCallbacks,
  unmountCallbacks,
  unsubscribeAll,
} from "./jihoFunc.js";

// JihoUI 컴포넌트들 import
import { 
  JihoHeader, 
  JihoNav, 
  JihoSection, 
  JihoGrid 
} from "./jihoUI/jihoLayout.js";
import { JihoButton } from "./jihoUI/JihoButton.js";

// DOM 노드 추적을 위한 WeakMap
const nodeComponentMap = new WeakMap();
const componentNodeMap = new WeakMap();

// 에러 처리 유틸리티
function handleError(error, context = 'Unknown') {
  console.error(`JihoFrame Error in ${context}:`, error);
  // 개발 모드에서 더 자세한 정보 제공
  if (typeof window !== 'undefined' && window.process?.env?.NODE_ENV === 'development') {
    console.trace();
  }
}

// 안전한 함수 실행
function safeExecute(fn, context = 'function', fallback = null) {
  try {
    return fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
}

// 값 검증 유틸리티
function validateValue(value, expectedType, context) {
  if (expectedType === 'function' && typeof value !== 'function') {
    console.warn(`JihoFrame: Expected function in ${context}, got ${typeof value}`);
    return false;
  }
  return true;
}

function bindValue(el, value, type = "text") {
  if (typeof value === "function") {
    const update = () => {
      const newValue = safeExecute(value, 'bindValue update');
      if (newValue === null) return;
      
      if (type === "checkbox") {
        el.checked = !!newValue;
      } else if (type === "radio") {
        el.checked = el.value === newValue;
      } else {
        el.value = newValue;
      }
    };

    update();
    const unsubscribe = subscribeState(update);
    
    // 엘리먼트가 제거될 때 구독 해제
    if (el._jihoUnsubscribers) {
      el._jihoUnsubscribers.push(unsubscribe);
    } else {
      el._jihoUnsubscribers = [unsubscribe];
    }

    el.addEventListener("input", (e) => {
      if (value._setter) {
        try {
          if (type === "checkbox") {
            value._setter(e.target.checked);
          } else if (type === "radio") {
            if (e.target.checked) value._setter(e.target.value);
          } else {
            value._setter(e.target.value);
          }
        } catch (error) {
          handleError(error, 'input event handler');
        }
      }
    });
  } else {
    if (type === "checkbox") {
      el.checked = !!value;
    } else if (type === "radio") {
      el.checked = el.value === value;
    } else {
      el.value = value;
    }
  }
}

// 구독 해제 관리 헬퍼 함수
function addUnsubscriber(el, unsubscribe) {
  if (el._jihoUnsubscribers) {
    el._jihoUnsubscribers.push(unsubscribe);
  } else {
    el._jihoUnsubscribers = [unsubscribe];
  }
}

// 텍스트 속성 처리
function applyTextAttribute(el, text) {
  if (typeof text === "function") {
    const updateText = () => {
      const newText = safeExecute(text, 'text update');
      if (newText !== null) {
        el.textContent = newText;
      }
    };
    
    updateText();
    const unsubscribe = subscribeState(updateText);
    addUnsubscriber(el, unsubscribe);
  } else if (text !== undefined) {
    el.textContent = text;
  }
}

// 스타일 속성 처리
function applyStyleAttribute(el, style) {
  if (style && typeof style === 'object') {
    try {
      Object.assign(el.style, style);
    } catch (error) {
      handleError(error, 'style application');
    }
  }
}

// 이벤트 처리
function applyEventHandlers(el, event) {
  if (Array.isArray(event)) {
    event.forEach((evtObj) => {
      if (typeof evtObj !== 'object') {
        console.warn('JihoFrame: Event object must be an object');
        return;
      }
      applyEventObject(el, evtObj);
    });
  } else if (event && typeof event === 'object') {
    applyEventObject(el, event);
  }
}

// 단일 이벤트 객체 처리
function applyEventObject(el, eventObj) {
  for (const [evtName, handler] of Object.entries(eventObj)) {
    if (!validateValue(handler, 'function', `event ${evtName}`)) continue;
    
    const eventType = evtName.toLowerCase().replace(/^on/, "");
    el.addEventListener(eventType, (e) => {
      safeExecute(() => handler(e), `event handler ${evtName}`);
    });
  }
}

// Input 속성 적용 헬퍼
function applyInputAttrs(el, options, attrs) {
  attrs.forEach((attr) => {
    if (attr in options) {
      try {
        el[attr] = options[attr];
      } catch (error) {
        handleError(error, `setting attribute ${attr}`);
      }
    }
  });
}

// Select 옵션 처리
function applySelectOptions(el, options) {
  if (Array.isArray(options)) {
    options.forEach((opt) => {
      const optionEl = document.createElement("option");
      if (typeof opt === "string") {
        optionEl.value = opt;
        optionEl.textContent = opt;
      } else if (opt && typeof opt === 'object') {
        optionEl.value = opt.value || '';
        optionEl.textContent = opt.label || opt.value || '';
      }
      el.appendChild(optionEl);
    });
  }
}

// 태그별 특수 처리
function applyTagSpecificAttributes(el, options, tag) {
  switch (tag) {
    case "input":
      applyInputAttrs(el, options, [
        "type", "checked", "multiple", "placeholder", "required", "name"
      ]);
      const inputType = options.type || "text";
      bindValue(el, options.value, inputType);
      break;
      
    case "textarea":
      applyInputAttrs(el, options, ["placeholder", "required", "rows", "cols"]);
      bindValue(el, options.value);
      break;
      
    case "select":
      applyInputAttrs(el, options, ["multiple", "required", "name"]);
      applySelectOptions(el, options.options);
      bindValue(el, options.value);
      break;
      
    case "checkbox":
      bindValue(el, options.value, "checkbox");
      break;
      
    case "radio":
      bindValue(el, options.value, "radio");
      break;
  }
}

// disabled 속성 처리
function applyDisabledAttribute(el, disabled) {
  if (typeof disabled === "function") {
    const updateDisabled = () => {
      const disabledValue = safeExecute(disabled, 'disabled update');
      if (disabledValue !== null) {
        el.disabled = !!disabledValue;
      }
    };
    
    updateDisabled();
    const unsubscribe = subscribeState(updateDisabled);
    addUnsubscriber(el, unsubscribe);
  } else if (disabled !== undefined) {
    el.disabled = !!disabled;
  }
}

// show 속성 처리
function applyShowAttribute(el, show) {
  if (typeof show === "function") {
    const updateShow = () => {
      const showValue = safeExecute(show, 'show update');
      if (showValue !== null) {
        el.style.display = showValue ? "" : "none";
      }
    };
    
    updateShow();
    const unsubscribe = subscribeState(updateShow);
    addUnsubscriber(el, unsubscribe);
  } else if (show === false) {
    el.style.display = "none";
  }
}

function applyAttributes(el, options, tag) {
  if (!options || typeof options !== 'object') {
    console.warn('JihoFrame: Invalid options passed to applyAttributes');
    return;
  }

  const { text, style, id, className, event, disabled, show } = options;

  // 기본 속성들 처리
  applyTextAttribute(el, text);
  applyStyleAttribute(el, style);
  
  if (id) el.id = id;
  if (className) el.className = className;

  // 이벤트 처리
  applyEventHandlers(el, event);

  // 태그별 특수 처리
  applyTagSpecificAttributes(el, options, tag);

  // 상태 기반 속성들 처리
  applyDisabledAttribute(el, disabled);
  applyShowAttribute(el, show);
}

function renderChildren(el, options) {
  if (!options || typeof options !== 'object') return;
  
  const ignoreKeys = new Set([
    "text", "style", "id", "className", "event", "children",
    "if", "elseIf", "else", "switch", "case", "default", "option",
    "type", "value", "checked", "multiple", "placeholder", "required",
    "for", "each", "show", "disabled",
  ]);

  // 직접 자식 요소들 처리
  Object.entries(options).forEach(([childTag, childValue]) => {
    if (ignoreKeys.has(childTag)) return;
    
    try {
      const resolved = typeof childValue === "function" 
        ? safeExecute(childValue, `child component ${childTag}`)
        : childValue;
        
      if (!resolved || typeof resolved !== 'object') return;
      
      const entries = Object.entries(resolved);
      if (entries.length === 0) {
        console.warn(`JihoFrame: Empty object for child ${childTag}`);
        return;
      }
      
      const [resolvedTag, resolvedValue] = entries[0];
      const childEl = createElement(resolvedTag, resolvedValue);
      if (childEl) {
        el.appendChild(childEl);
      }
    } catch (error) {
      handleError(error, `rendering child ${childTag}`);
    }
  });

  // children 배열 처리
  if (Array.isArray(options.children)) {
    options.children.forEach((child, index) => {
      try {
        if (!child || typeof child !== 'object') {
          console.warn(`JihoFrame: Invalid child at index ${index}`);
          return;
        }
        
        const entries = Object.entries(child);
        if (entries.length === 0) {
          console.warn(`JihoFrame: Empty child object at index ${index}`);
          return;
        }
        
        const [childTag, childOptions] = entries[0];
        const childEl = createElement(childTag, childOptions);
        if (childEl) {
          el.appendChild(childEl);
        }
      } catch (error) {
        handleError(error, `rendering child at index ${index}`);
      }
    });
  }

  // each 반복 렌더링 처리
  if (options.each?.list) {
    try {
      const list = typeof options.each.list === "function" 
        ? safeExecute(options.each.list, 'each list function')
        : options.each.list;
        
      if (Array.isArray(list) && typeof options.each.render === 'function') {
        list.forEach((item, index) => {
          try {
            const rendered = safeExecute(() => options.each.render(item, index), `each render at index ${index}`);
            if (rendered && typeof rendered === 'object') {
              const entries = Object.entries(rendered);
              if (entries.length > 0) {
                const [tag, value] = entries[0];
                const childEl = createElement(tag, value);
                if (childEl) {
                  el.appendChild(childEl);
                }
              }
            }
          } catch (error) {
            handleError(error, `each item rendering at index ${index}`);
          }
        });
      }
    } catch (error) {
      handleError(error, 'each list processing');
    }
  }
}

// 엘리먼트 정리 함수
function cleanupElement(el) {
  if (el._jihoUnsubscribers) {
    el._jihoUnsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        handleError(error, 'cleanup unsubscribe');
      }
    });
    delete el._jihoUnsubscribers;
  }
  
  // 자식 요소들도 정리
  Array.from(el.children).forEach(child => cleanupElement(child));
}

// JihoUI 컴포넌트 처리 함수
function handleJihoComponent(tag, options) {
  const componentMap = {
    'JihoHeader': JihoHeader,
    'JihoNav': JihoNav,
    'JihoSection': JihoSection,
    'JihoGrid': JihoGrid,
    'JihoButton': JihoButton
  };

  const componentFunc = componentMap[tag];
  if (!componentFunc) {
    console.warn(`JihoFrame: Unknown JihoUI component: ${tag}`);
    return null;
  }

  try {
    // 컴포넌트 함수 실행하여 JihoFrame 객체 구조 반환
    const result = componentFunc(options);
    
    // 결과가 JihoFrame 객체인 경우 재귀적으로 처리
    if (result && typeof result === 'object') {
      const entries = Object.entries(result);
      if (entries.length > 0) {
        const [tagName, props] = entries[0];
        return createElement(tagName, props);
      }
    }
    
    return null;
  } catch (error) {
    handleError(error, `JihoUI component ${tag}`);
    return null;
  }
}

// 함수형 컴포넌트 처리
function handleFunctionComponent(tag, options) {
  const resolved = safeExecute(() => tag(options), `component ${tag.name || 'anonymous'}`);
  if (!resolved) return null;
  
  // 컴포넌트가 직접 엘리먼트를 반환하는 경우
  if (resolved.nodeType) {
    return resolved;
  }
  
  // 컴포넌트가 JihoFrame 형식을 반환하는 경우
  if (resolved.layout) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'contents'; // wrapper가 레이아웃에 영향주지 않도록
    
    const domUpdater = new DOMUpdater(wrapper);
    domUpdater.update(resolved.layout);
    
    return wrapper;
  }
  
  // 기존 방식 (단일 엘리먼트)
  if (typeof resolved === 'object' && resolved !== null) {
    const entries = Object.entries(resolved);
    if (entries.length > 0) {
      const [resolvedTag, resolvedValue] = entries[0];
      return createElement(resolvedTag, resolvedValue);
    }
  }
  
  console.warn('JihoFrame: Component returned invalid object');
  return null;
}

// 함수형 옵션 처리
function handleFunctionOptions(options) {
  const resolved = safeExecute(options, 'options function');
  if (!resolved) return null;
  
  if (typeof resolved === 'object' && resolved !== null) {
    const entries = Object.entries(resolved);
    if (entries.length > 0) {
      const [resolvedTag, resolvedValue] = entries[0];
      return createElement(resolvedTag, resolvedValue);
    }
  }
  
  console.warn('JihoFrame: Options function returned invalid object');
  return null;
}

// 일반 엘리먼트 생성
function createStandardElement(tag, options) {
  if (typeof tag !== 'string') {
    console.warn('JihoFrame: Tag must be a string, got:', typeof tag);
    return null;
  }
  
  const el = document.createElement(tag);
  
  if (options) {
    applyAttributes(el, options, tag);
    renderChildren(el, options);
  }
  
  return el;
}

export function createElement(tag, options) {
  try {
    // JihoUI 컴포넌트 처리
    if (typeof tag === "string" && tag.startsWith("Jiho")) {
      return handleJihoComponent(tag, options);
    }

    // 함수형 컴포넌트 처리
    if (typeof tag === "function") {
      return handleFunctionComponent(tag, options);
    }

    // 옵션이 함수인 경우
    if (typeof options === "function") {
      return handleFunctionOptions(options);
    }

    // 간단한 텍스트 노드
    if (typeof options === "string") {
      const el = document.createElement(tag);
      el.textContent = options;
      return el;
    }

    // 일반 엘리먼트 생성
    return createStandardElement(tag, options);
  } catch (error) {
    handleError(error, `createElement for tag ${tag}`);
    return null;
  }
}

function renderConditionalBlock(value, container) {
  if (!Array.isArray(value)) {
    console.warn('JihoFrame: Conditional block value must be an array');
    return;
  }

  let start = document.createComment("condition-start");
  let end = document.createComment("condition-end");
  let currentElement = null;
  let unsubscribers = [];

  container.appendChild(start);
  container.appendChild(end);

  const cleanup = () => {
    // 기존 엘리먼트 정리
    if (currentElement) {
      cleanupElement(currentElement);
      if (currentElement.parentNode) {
        currentElement.parentNode.removeChild(currentElement);
      }
      currentElement = null;
    }
    
    // 구독 해제
    unsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        handleError(error, 'conditional cleanup unsubscribe');
      }
    });
    unsubscribers = [];
  };

  // 조건 평가 헬퍼 함수
  const evaluateCondition = (props, rendered) => {
    const condition = props.if ?? (rendered ? false : props.elseIf ?? props.else);
    return typeof condition === "function" 
      ? safeExecute(condition, 'conditional condition')
      : condition;
  };

  // 조건부 아이템 처리 헬퍼 함수
  const processConditionalItem = (item, rendered) => {
    if (!item || typeof item !== 'object') {
      console.warn('JihoFrame: Invalid conditional item');
      return { shouldContinue: true, rendered };
    }
    
    const entries = Object.entries(item);
    if (entries.length === 0) {
      console.warn('JihoFrame: Empty conditional item');
      return { shouldContinue: true, rendered };
    }
    
    const [tag, props] = entries[0];
    if (!props || typeof props !== 'object') {
      return { shouldContinue: true, rendered };
    }

    const shouldRender = evaluateCondition(props, rendered);
    
    if (shouldRender && !rendered) {
      const element = createElement(tag, props);
      if (element && container.contains(end)) {
        container.insertBefore(element, end);
        currentElement = element;
        return { shouldContinue: false, rendered: true };
      }
    }
    
    return { shouldContinue: true, rendered };
  };

  const rerender = () => {
    try {
      // end가 아직 존재하는지 확인
      if (!container.contains(end)) {
        end = document.createComment("condition-end");
        container.appendChild(end);
      }

      // 기존 엘리먼트 정리
      cleanup();

      let rendered = false;

      for (const item of value) {
        const result = processConditionalItem(item, rendered);
        rendered = result.rendered;
        if (!result.shouldContinue) break;
      }
    } catch (error) {
      handleError(error, 'conditional block rerender');
    }
  };

  const unsubscribe = subscribeState(rerender);
  unsubscribers.push(unsubscribe);
  rerender();
  
  // 정리 함수 반환
  return cleanup;
}

function renderSwitchBlock(switchObj, container) {
  if (!switchObj || typeof switchObj !== 'object') {
    console.warn('JihoFrame: Switch block must be an object');
    return;
  }

  let start = document.createComment("switch-start");
  let end = document.createComment("switch-end");
  let currentElement = null;
  let unsubscribers = [];

  container.appendChild(start);
  container.appendChild(end);

  const cleanup = () => {
    // 기존 엘리먼트 정리
    if (currentElement) {
      cleanupElement(currentElement);
      if (currentElement.parentNode) {
        currentElement.parentNode.removeChild(currentElement);
      }
      currentElement = null;
    }
    
    // 구독 해제
    unsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        handleError(error, 'switch cleanup unsubscribe');
      }
    });
    unsubscribers = [];
  };

  // switch 값 평가 헬퍼 함수
  const getSwitchValue = () => {
    return typeof switchObj.switch === "function"
      ? safeExecute(switchObj.switch, 'switch value function')
      : switchObj.switch;
  };

  // switch case 처리 헬퍼 함수
  const processSwitchCase = (caseObj, switchValue) => {
    if (!caseObj || typeof caseObj !== 'object') {
      return false;
    }
    
    if (caseObj.case === switchValue || caseObj.default === true) {
      if (caseObj.element && typeof caseObj.element === 'object') {
        const entries = Object.entries(caseObj.element);
        if (entries.length > 0) {
          const [tag, props] = entries[0];
          const element = createElement(tag, props);
          if (element && container.contains(end)) {
            container.insertBefore(element, end);
            currentElement = element;
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const rerender = () => {
    try {
      if (!container.contains(end)) {
        end = document.createComment("switch-end");
        container.appendChild(end);
      }

      // 기존 엘리먼트 정리
      cleanup();

      const switchValue = getSwitchValue();

      if (!Array.isArray(switchObj.cases)) {
        console.warn('JihoFrame: Switch cases must be an array');
        return;
      }

      for (const caseObj of switchObj.cases) {
        if (processSwitchCase(caseObj, switchValue)) {
          break;
        }
      }
    } catch (error) {
      handleError(error, 'switch block rerender');
    }
  };

  const unsubscribe = subscribeState(rerender);
  unsubscribers.push(unsubscribe);
  rerender();
  
  // 정리 함수 반환
  return cleanup;
}

// 개선된 DOM 업데이트 시스템
class DOMUpdater {
  constructor(container) {
    this.container = container;
    this.currentNodes = [];
    this.cleanupFunctions = [];
  }

  // 기존 노드들 정리
  cleanup() {
    this.currentNodes.forEach(node => {
      if (node && node.parentNode) {
        cleanupElement(node);
        node.parentNode.removeChild(node);
      }
    });
    
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        handleError(error, 'DOM updater cleanup');
      }
    });
    
    this.currentNodes = [];
    this.cleanupFunctions = [];
  }

  // 함수형 아이템 처리
  processFunctionItem(item, index) {
    const resolved = safeExecute(item, `layout function at index ${index}`);
    if (resolved && typeof resolved === 'object') {
      const entries = Object.entries(resolved);
      if (entries.length > 0) {
        const [resolvedTag, resolvedValue] = entries[0];
        const element = createElement(resolvedTag, resolvedValue);
        if (element) {
          this.container.appendChild(element);
          this.currentNodes.push(element);
        }
      }
    }
  }

  // 객체형 아이템 처리
  processObjectItem(item) {
    const entries = Object.entries(item);
    if (entries.length > 0) {
      const [tag, value] = entries[0];
      
      if (tag === "condition" && Array.isArray(value)) {
        const cleanup = renderConditionalBlock(value, this.container);
        if (cleanup) this.cleanupFunctions.push(cleanup);
      } else if (tag === "switchBlock") {
        const cleanup = renderSwitchBlock(value, this.container);
        if (cleanup) this.cleanupFunctions.push(cleanup);
      } else {
        const element = createElement(tag, value);
        if (element) {
          this.container.appendChild(element);
          this.currentNodes.push(element);
        }
      }
    }
  }

  // 새로운 노드들 추가
  update(layoutItems) {
    this.cleanup();

    if (!Array.isArray(layoutItems)) {
      console.warn('JihoFrame: Layout must be an array');
      return;
    }

    layoutItems.forEach((item, index) => {
      try {
        if (typeof item === "function") {
          this.processFunctionItem(item, index);
        } else if (item && typeof item === 'object') {
          this.processObjectItem(item);
        }
      } catch (error) {
        handleError(error, `rendering layout item at index ${index}`);
      }
    });
  }
}

export function renderApp(appFunc, container) {
  if (typeof appFunc !== 'function') {
    throw new Error('JihoFrame: App must be a function');
  }
  
  if (!container || !container.appendChild) {
    throw new Error('JihoFrame: Container must be a valid DOM element');
  }

  // 초기화 콜백 실행
  initCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (error) {
      handleError(error, 'init callback');
    }
  });

  const domUpdater = new DOMUpdater(container);
  let appUnsubscribers = [];

  // 마운트 콜백 실행 헬퍼
  const executeMountCallbacks = () => {
    mountCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (error) {
        handleError(error, 'mount callback');
      }
    });
  };

  const rerender = () => {
    try {
      const tree = safeExecute(appFunc, 'app function');
      if (!tree) return;

      if (!tree.layout) {
        console.warn('JihoFrame: App function must return an object with layout property');
        return;
      }

      domUpdater.update(tree.layout);
      executeMountCallbacks();
    } catch (error) {
      handleError(error, 'app rerender');
    }
  };

  const unsubscribe = subscribeState(rerender);
  appUnsubscribers.push(unsubscribe);
  rerender();

  // 페이지 언로드 시 정리
  const handleUnload = () => {
    try {
      // 언마운트 콜백 실행
      unmountCallbacks.forEach((cb) => {
        try {
          cb();
        } catch (error) {
          handleError(error, 'unmount callback');
        }
      });
      
      // DOM 정리
      domUpdater.cleanup();
      
      // 구독 해제
      appUnsubscribers.forEach(unsub => {
        try {
          unsub();
        } catch (error) {
          handleError(error, 'app unsubscribe');
        }
      });
      
    } catch (error) {
      handleError(error, 'app cleanup');
    }
  };

  window.addEventListener("beforeunload", handleUnload);
  
  // 정리 함수 반환 (수동 정리용)
  return handleUnload;
}
