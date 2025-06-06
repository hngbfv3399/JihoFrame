/**
 * JihoFrame Components
 * 컴포넌트 처리 관련 함수들
 */

import { handleError, safeExecute } from "./utils.js";

// JihoUI 컴포넌트들 import
import { 
  JihoHeader, 
  JihoNav, 
  JihoSection, 
  JihoGrid 
} from "../jihoUI/jihoLayout.js";
import { JihoButton } from "../jihoUI/JihoButton.js";

// JihoUI 컴포넌트 처리 함수
export function handleJihoComponent(tag, options) {
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
        // createElement를 import하면 순환 참조가 될 수 있으므로 여기서는 결과만 반환
        return { tag: tagName, props };
      }
    }
    
    return null;
  } catch (error) {
    handleError(error, `JihoUI component ${tag}`);
    return null;
  }
}

// 함수형 컴포넌트 처리
export function handleFunctionComponent(tag, options) {
  const resolved = safeExecute(() => tag(options), `component ${tag.name || 'anonymous'}`);
  if (!resolved) return null;
  
  // 컴포넌트가 직접 엘리먼트를 반환하는 경우
  if (resolved.nodeType) {
    return resolved;
  }
  
  // 컴포넌트가 JihoFrame 형식을 반환하는 경우
  if (resolved.layout) {
    // DOMUpdater 처리는 상위에서 하도록 정보만 반환
    return { layout: resolved.layout };
  }
  
  // 기존 방식 (단일 엘리먼트)
  if (typeof resolved === 'object' && resolved !== null) {
    const entries = Object.entries(resolved);
    if (entries.length > 0) {
      const [resolvedTag, resolvedValue] = entries[0];
      return { tag: resolvedTag, props: resolvedValue };
    }
  }
  
  console.warn('JihoFrame: Component returned invalid object');
  return null;
}

// 함수형 옵션 처리
export function handleFunctionOptions(options) {
  const resolved = safeExecute(options, 'options function');
  if (!resolved) return null;
  
  if (typeof resolved === 'object' && resolved !== null) {
    const entries = Object.entries(resolved);
    if (entries.length > 0) {
      const [resolvedTag, resolvedValue] = entries[0];
      return { tag: resolvedTag, props: resolvedValue };
    }
  }
  
  console.warn('JihoFrame: Options function returned invalid object');
  return null;
} 