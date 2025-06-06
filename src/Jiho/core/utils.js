/**
 * JihoFrame Core Utilities
 * 에러 처리, 검증, 안전 실행 등 기본 유틸리티들
 */

// 에러 처리 유틸리티
export function handleError(error, context = 'Unknown') {
  console.error(`JihoFrame Error in ${context}:`, error);
  // 개발 모드에서 더 자세한 정보 제공
  if (typeof window !== 'undefined' && window.process?.env?.NODE_ENV === 'development') {
    console.trace();
  }
}

// 안전한 함수 실행
export function safeExecute(fn, context = 'function', fallback = null) {
  try {
    return fn();
  } catch (error) {
    handleError(error, context);
    return fallback;
  }
}

// 값 검증 유틸리티
export function validateValue(value, expectedType, context) {
  if (expectedType === 'function' && typeof value !== 'function') {
    console.warn(`JihoFrame: Expected function in ${context}, got ${typeof value}`);
    return false;
  }
  return true;
}

// 구독 해제 관리 헬퍼 함수
export function addUnsubscriber(el, unsubscribe) {
  if (el._jihoUnsubscribers) {
    el._jihoUnsubscribers.push(unsubscribe);
  } else {
    el._jihoUnsubscribers = [unsubscribe];
  }
}

// DOM 노드 추적을 위한 WeakMap
export const nodeComponentMap = new WeakMap();
export const componentNodeMap = new WeakMap(); 