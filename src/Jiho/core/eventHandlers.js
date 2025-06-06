/**
 * JihoFrame Event Handlers
 * 이벤트 처리 관련 함수들
 */

import { safeExecute, validateValue } from "./utils.js";

// 이벤트 처리
export function applyEventHandlers(el, event) {
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
export function applyEventObject(el, eventObj) {
  for (const [evtName, handler] of Object.entries(eventObj)) {
    if (!validateValue(handler, 'function', `event ${evtName}`)) continue;
    
    const eventType = evtName.toLowerCase().replace(/^on/, "");
    el.addEventListener(eventType, (e) => {
      safeExecute(() => handler(e), `event handler ${evtName}`);
    });
  }
} 