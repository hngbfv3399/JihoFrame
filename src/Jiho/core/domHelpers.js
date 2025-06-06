/**
 * JihoFrame DOM Helpers
 * DOM 조작, 값 바인딩, 정리 등 DOM 관련 유틸리티들
 */

import { subscribeState } from "../jihoFunc.js";
import { handleError, safeExecute, addUnsubscriber } from "./utils.js";

// 값 바인딩 (양방향 데이터 바인딩)
export function bindValue(el, value, type = "text") {
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
    addUnsubscriber(el, unsubscribe);

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

// Input 속성 적용 헬퍼
export function applyInputAttrs(el, options, attrs) {
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
export function applySelectOptions(el, options) {
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

// 엘리먼트 정리 (메모리 누수 방지)
export function cleanupElement(el) {
  if (!el || !el.nodeType) return;
  
  // 구독 해제
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