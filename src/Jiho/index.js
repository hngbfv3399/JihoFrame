// src/Jiho/index.js

// 상태 관리 및 라이프사이클
export { 
  createState, 
  subscribeState, 
  jihoInit, 
  jihoMount, 
  jihoUpdate, 
  jihoUnMount,
  unsubscribeAll,
  getStateSnapshot,
  resetState,
  watchState,
  combineStates,
  computedState
} from "./jihoFunc.js";

// 렌더링 엔진
export { renderApp } from "./jihoRender.js";

// JihoUI 컴포넌트 시스템
export { 
  JihoHeader, 
  JihoNav, 
  JihoSection, 
  JihoGrid,
  JihoButton
} from "./jihoUI/index.js"; 
