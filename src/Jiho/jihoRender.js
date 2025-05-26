import {
  subscribeState,
  initCallbacks,
  mountCallbacks,
  unmountCallbacks,
  unsubscribeAll,
} from "./jihoFunc.js";

// DOM 노드 추적을 위한 WeakMap
const nodeComponentMap = new WeakMap();
const componentNodeMap = new WeakMap();

// 에러 처리 유틸리티
function handleError(error, context = 'Unknown') {
  console.error(`JihoFrame Error in ${context}:`, error);
  // 개발 모드에서 더 자세한 정보 제공
  if (process?.env?.NODE_ENV === 'development') {
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

function applyAttributes(el, options, tag) {
  if (!options || typeof options !== 'object') {
    console.warn('JihoFrame: Invalid options passed to applyAttributes');
    return;
  }

  const { text, style, id, className, event } = options;

  // 텍스트 처리 개선
  if (typeof text === "function") {
    const updateText = () => {
      const newText = safeExecute(text, 'text update');
      if (newText !== null) {
        el.textContent = newText;
      }
    };
    
    updateText();
    const unsubscribe = subscribeState(updateText);
    
    if (el._jihoUnsubscribers) {
      el._jihoUnsubscribers.push(unsubscribe);
    } else {
      el._jihoUnsubscribers = [unsubscribe];
    }
  } else if (text !== undefined) {
    el.textContent = text;
  }

  // 스타일 적용 개선
  if (style && typeof style === 'object') {
    try {
      Object.assign(el.style, style);
    } catch (error) {
      handleError(error, 'style application');
    }
  }
  
  if (id) el.id = id;
  if (className) el.className = className;

  // 이벤트 처리 개선 - 더 간단한 API 지원
  if (Array.isArray(event)) {
    event.forEach((evtObj) => {
      if (typeof evtObj !== 'object') {
        console.warn('JihoFrame: Event object must be an object');
        return;
      }
      
      for (const [evtName, handler] of Object.entries(evtObj)) {
        if (!validateValue(handler, 'function', `event ${evtName}`)) continue;
        
        const eventType = evtName.toLowerCase().replace(/^on/, "");
        el.addEventListener(eventType, (e) => {
          safeExecute(() => handler(e), `event handler ${evtName}`);
        });
      }
    });
  } else if (event && typeof event === 'object') {
    // 단순한 객체 형태도 지원: { onClick: handler, onInput: handler }
    for (const [evtName, handler] of Object.entries(event)) {
      if (!validateValue(handler, 'function', `event ${evtName}`)) continue;
      
      const eventType = evtName.toLowerCase().replace(/^on/, "");
      el.addEventListener(eventType, (e) => {
        safeExecute(() => handler(e), `event handler ${evtName}`);
      });
    }
  }

  const applyInputAttrs = (attrs) => {
    attrs.forEach((attr) => {
      if (attr in options) {
        try {
          el[attr] = options[attr];
        } catch (error) {
          handleError(error, `setting attribute ${attr}`);
        }
      }
    });
  };

  // 태그별 특수 처리
  switch (tag) {
    case "input":
      applyInputAttrs([
        "type",
        "checked",
        "multiple",
        "placeholder",
        "required",
        "name",
      ]);
      
      const inputType = options.type || "text";
      bindValue(el, options.value, inputType);
      break;
      
    case "textarea":
      applyInputAttrs(["placeholder", "required", "rows", "cols"]);
      bindValue(el, options.value);
      break;
      
    case "select":
      applyInputAttrs(["multiple", "required", "name"]);
      if (Array.isArray(options.options)) {
        options.options.forEach((opt) => {
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
      bindValue(el, options.value);
      break;
      
    case "checkbox":
      bindValue(el, options.value, "checkbox");
      break;
      
    case "radio":
      bindValue(el, options.value, "radio");
      break;
  }

  // disabled 속성 처리
  if (typeof options.disabled === "function") {
    const updateDisabled = () => {
      const disabled = safeExecute(options.disabled, 'disabled update');
      if (disabled !== null) {
        el.disabled = !!disabled;
      }
    };
    
    updateDisabled();
    const unsubscribe = subscribeState(updateDisabled);
    
    if (el._jihoUnsubscribers) {
      el._jihoUnsubscribers.push(unsubscribe);
    } else {
      el._jihoUnsubscribers = [unsubscribe];
    }
  } else if (options.disabled !== undefined) {
    el.disabled = !!options.disabled;
  }

  // show 속성 처리
  if (typeof options.show === "function") {
    const updateShow = () => {
      const show = safeExecute(options.show, 'show update');
      if (show !== null) {
        el.style.display = show ? "" : "none";
      }
    };
    
    updateShow();
    const unsubscribe = subscribeState(updateShow);
    
    if (el._jihoUnsubscribers) {
      el._jihoUnsubscribers.push(unsubscribe);
    } else {
      el._jihoUnsubscribers = [unsubscribe];
    }
  } else if (options.show === false) {
    el.style.display = "none";
  }
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
        
      if (!resolved) return;
      
      const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
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
        
        const [childTag, childOptions] = Object.entries(child)[0];
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
            if (rendered) {
              const [tag, value] = Object.entries(rendered)[0];
              const childEl = createElement(tag, value);
              if (childEl) {
                el.appendChild(childEl);
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

export function createElement(tag, options) {
  try {
    // 함수형 컴포넌트 처리 - 개선된 방식
    if (typeof tag === "function") {
      const resolved = safeExecute(() => tag(options), `component ${tag.name || 'anonymous'}`);
      if (!resolved) return null;
      
      // 컴포넌트가 직접 엘리먼트를 반환하는 경우
      if (resolved.nodeType) {
        return resolved;
      }
      
      // 컴포넌트가 JihoFrame 형식을 반환하는 경우
      if (resolved.layout) {
        // 컴포넌트의 layout을 직접 렌더링
        const wrapper = document.createElement('div');
        wrapper.style.display = 'contents'; // wrapper가 레이아웃에 영향주지 않도록
        
        const domUpdater = new DOMUpdater(wrapper);
        domUpdater.update(resolved.layout);
        
        return wrapper;
      }
      
      // 기존 방식 (단일 엘리먼트)
      const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
      return createElement(resolvedTag, resolvedValue);
    }

    // 옵션이 함수인 경우
    if (typeof options === "function") {
      const resolved = safeExecute(options, 'options function');
      if (!resolved) return null;
      
      const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
      return createElement(resolvedTag, resolvedValue);
    }

    // 간단한 텍스트 노드
    if (typeof options === "string") {
      const el = document.createElement(tag);
      el.textContent = options;
      return el;
    }

    // 일반 엘리먼트 생성
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
        if (!item || typeof item !== 'object') {
          console.warn('JihoFrame: Invalid conditional item');
          continue;
        }
        
        const [tag, props] = Object.entries(item)[0];
        if (!props || typeof props !== 'object') continue;

        // 조건 평가
        const condition = props.if ?? (rendered ? false : props.elseIf ?? props.else);
        const shouldRender = typeof condition === "function" 
          ? safeExecute(condition, 'conditional condition')
          : condition;

        if (shouldRender && !rendered) {
          const element = createElement(tag, props);
          if (element && container.contains(end)) {
            container.insertBefore(element, end);
            currentElement = element;
            rendered = true;
            break;
          }
        }
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

  const rerender = () => {
    try {
      if (!container.contains(end)) {
        end = document.createComment("switch-end");
        container.appendChild(end);
      }

      // 기존 엘리먼트 정리
      cleanup();

      const switchValue = typeof switchObj.switch === "function"
        ? safeExecute(switchObj.switch, 'switch value function')
        : switchObj.switch;

      if (!Array.isArray(switchObj.cases)) {
        console.warn('JihoFrame: Switch cases must be an array');
        return;
      }

      for (const caseObj of switchObj.cases) {
        if (!caseObj || typeof caseObj !== 'object') continue;
        
        if (caseObj.case === switchValue || caseObj.default === true) {
          if (caseObj.element && typeof caseObj.element === 'object') {
            const [tag, props] = Object.entries(caseObj.element)[0];
            const element = createElement(tag, props);
            if (element && container.contains(end)) {
              container.insertBefore(element, end);
              currentElement = element;
              break;
            }
          }
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
          const resolved = safeExecute(item, `layout function at index ${index}`);
          if (resolved) {
            const [resolvedTag, resolvedValue] = Object.entries(resolved)[0];
            const element = createElement(resolvedTag, resolvedValue);
            if (element) {
              this.container.appendChild(element);
              this.currentNodes.push(element);
            }
          }
        } else if (item && typeof item === 'object') {
          const [tag, value] = Object.entries(item)[0];
          
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

  const rerender = () => {
    try {
      const tree = safeExecute(appFunc, 'app function');
      if (!tree) return;

      if (!tree.layout) {
        console.warn('JihoFrame: App function must return an object with layout property');
        return;
      }

      domUpdater.update(tree.layout);

      // 마운트 콜백 실행
      mountCallbacks.forEach((cb) => {
        try {
          cb();
        } catch (error) {
          handleError(error, 'mount callback');
        }
      });
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
