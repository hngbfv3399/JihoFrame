/**
 * JihoFrame Attributes
 * 엘리먼트 속성 적용 관련 함수들
 */

import { subscribeState } from "../jihoFunc.js";
import { handleError, safeExecute, addUnsubscriber } from "./utils.js";
import { bindValue, applyInputAttrs, applySelectOptions } from "./domHelpers.js";

// 텍스트 속성 처리
export function applyTextAttribute(el, text) {
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
export function applyStyleAttribute(el, style) {
  if (style && typeof style === 'object') {
    try {
      Object.assign(el.style, style);
    } catch (error) {
      handleError(error, 'style application');
    }
  }
}

// disabled 속성 처리
export function applyDisabledAttribute(el, disabled) {
  if (typeof disabled === "function") {
    const updateDisabled = () => {
      const newDisabled = safeExecute(disabled, 'disabled update');
      if (newDisabled !== null) {
        el.disabled = !!newDisabled;
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
export function applyShowAttribute(el, show) {
  if (typeof show === "function") {
    const updateShow = () => {
      const newShow = safeExecute(show, 'show update');
      if (newShow !== null) {
        el.style.display = newShow ? '' : 'none';
      }
    };
    
    updateShow();
    const unsubscribe = subscribeState(updateShow);
    addUnsubscriber(el, unsubscribe);
  } else if (show !== undefined) {
    el.style.display = show ? '' : 'none';
  }
}

// 태그별 특수 처리
export function applyTagSpecificAttributes(el, options, tag) {
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
      if (options.options) {
        applySelectOptions(el, options.options);
      }
      bindValue(el, options.value);
      break;
      
    case "button":
      applyInputAttrs(el, options, ["type", "disabled"]);
      break;
      
    case "form":
      applyInputAttrs(el, options, ["method", "action", "enctype"]);
      break;
      
    case "img":
      applyInputAttrs(el, options, ["src", "alt", "width", "height"]);
      break;
      
    case "a":
      applyInputAttrs(el, options, ["href", "target", "rel"]);
      break;
      
    case "iframe":
      applyInputAttrs(el, options, ["src", "width", "height", "frameborder"]);
      break;
  }
}

// 모든 속성 적용 (메인 함수)
export function applyAttributes(el, options, tag) {
  if (!options || typeof options !== 'object') return;

  // 기본 속성들
  applyTextAttribute(el, options.text);
  applyStyleAttribute(el, options.style);
  applyDisabledAttribute(el, options.disabled);
  applyShowAttribute(el, options.show);

  // HTML 속성들
  if (options.id) el.id = options.id;
  if (options.className) el.className = options.className;
  if (options.class) el.className = options.class;

  // 태그별 특수 속성들
  applyTagSpecificAttributes(el, options, tag);

  // 기타 HTML 속성들
  Object.keys(options).forEach(key => {
    if (!['text', 'style', 'children', 'event', 'value', 'disabled', 'show', 
          'id', 'className', 'class', 'options'].includes(key)) {
      try {
        el.setAttribute(key, options[key]);
      } catch (error) {
        // 일부 속성은 setAttribute으로 설정할 수 없음 (무시)
      }
    }
  });
} 