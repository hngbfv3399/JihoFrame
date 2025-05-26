let state = {};
let listenersMap = {};
let globalSubscribers = [];
let componentSubscriptions = new WeakMap(); // 컴포넌트별 구독 관리
let batchUpdateQueue = new Set();
let isBatchUpdating = false;

let initCallbacks = [];
let mountCallbacks = [];
let updateCallbacks = new Map(); 
let unmountCallbacks = [];

// 배치 업데이트 시스템
function flushBatchUpdates() {
  if (isBatchUpdating) return;
  
  isBatchUpdating = true;
  const callbacks = Array.from(batchUpdateQueue);
  batchUpdateQueue.clear();
  
  // 중복 제거 후 실행
  const uniqueCallbacks = [...new Set(callbacks)];
  uniqueCallbacks.forEach(cb => {
    try {
      cb();
    } catch (error) {
      console.error('JihoFrame: 업데이트 중 오류 발생:', error);
    }
  });
  
  isBatchUpdating = false;
}

// 다음 틱에 배치 업데이트 실행
function scheduleBatchUpdate() {
  if (batchUpdateQueue.size > 0) {
    Promise.resolve().then(flushBatchUpdates);
  }
}

export function jihoInit(cb) {
  if (typeof cb !== 'function') {
    console.warn('JihoFrame: jihoInit expects a function');
    return;
  }
  initCallbacks.push(cb);
}

export function jihoMount(cb) {
  if (typeof cb !== 'function') {
    console.warn('JihoFrame: jihoMount expects a function');
    return;
  }
  mountCallbacks.push(cb);
}

export function jihoUpdate(cb, stateObj) {
  if (typeof cb !== 'function') {
    console.warn('JihoFrame: jihoUpdate expects a function as first parameter');
    return;
  }
  if (!updateCallbacks.has(stateObj)) {
    updateCallbacks.set(stateObj, []);
  }
  updateCallbacks.get(stateObj).push(cb);
}

export function jihoUnMount(cb) {
  if (typeof cb !== 'function') {
    console.warn('JihoFrame: jihoUnMount expects a function');
    return;
  }
  unmountCallbacks.push(cb);
}

// 구독 해제 함수
export function unsubscribeAll(component) {
  if (componentSubscriptions.has(component)) {
    const subscriptions = componentSubscriptions.get(component);
    subscriptions.forEach(unsubscribe => unsubscribe());
    componentSubscriptions.delete(component);
  }
}

export function createState(key, initialValue) {
  if (typeof key !== 'string') {
    throw new Error('JihoFrame: State key must be a string');
  }
  
  if (!(key in state)) {
    state[key] = initialValue;
    listenersMap[key] = new Set();
  }

  const stateObj = {
    // 일관된 API - value 프로퍼티로 통일
    get value() {
      return state[key];
    },
    
    set value(newValue) {
      if (state[key] === newValue) return; // 같은 값이면 업데이트 안함
      
      state[key] = newValue;

      // 배치 업데이트에 추가
      globalSubscribers.forEach(cb => batchUpdateQueue.add(cb));
      
      if (updateCallbacks.has(stateObj)) {
        updateCallbacks.get(stateObj).forEach(cb => batchUpdateQueue.add(cb));
      }

      listenersMap[key].forEach(cb => batchUpdateQueue.add(cb));
      
      scheduleBatchUpdate();
    },
    
    // 기존 API 호환성 유지
    get: () => state[key],
    set: (newValue) => {
      stateObj.value = newValue;
    },
    
    subscribe: (fn, component = null) => {
      if (typeof fn !== 'function') {
        console.warn('JihoFrame: subscribe expects a function');
        return () => {};
      }
      
      listenersMap[key].add(fn);
      
      const unsubscribe = () => listenersMap[key].delete(fn);
      
      // 컴포넌트별 구독 관리
      if (component) {
        if (!componentSubscriptions.has(component)) {
          componentSubscriptions.set(component, []);
        }
        componentSubscriptions.get(component).push(unsubscribe);
      }
      
      return unsubscribe;
    },
  };
  
  // setter 참조 유지 (기존 호환성)
  stateObj.get._setter = stateObj.set;
  return stateObj;
}

export function subscribeState(fn, component = null) {
  if (typeof fn !== 'function') {
    console.warn('JihoFrame: subscribeState expects a function');
    return () => {};
  }
  
  globalSubscribers.push(fn);
  
  const unsubscribe = () => {
    const index = globalSubscribers.indexOf(fn);
    if (index > -1) {
      globalSubscribers.splice(index, 1);
    }
  };
  
  // 컴포넌트별 구독 관리
  if (component) {
    if (!componentSubscriptions.has(component)) {
      componentSubscriptions.set(component, []);
    }
    componentSubscriptions.get(component).push(unsubscribe);
  }
  
  return unsubscribe;
}

// 개발자 도구 및 유틸리티 함수들
export function getStateSnapshot() {
  return { ...state };
}

export function resetState(key) {
  if (key) {
    delete state[key];
    if (listenersMap[key]) {
      listenersMap[key].clear();
    }
  } else {
    // 모든 상태 초기화
    state = {};
    Object.values(listenersMap).forEach(listeners => listeners.clear());
    listenersMap = {};
  }
}

// 상태 변화 감지 (디버깅용)
export function watchState(key, callback) {
  if (typeof callback !== 'function') {
    console.warn('JihoFrame: watchState callback must be a function');
    return () => {};
  }
  
  if (!listenersMap[key]) {
    console.warn(`JihoFrame: State key "${key}" does not exist`);
    return () => {};
  }
  
  const listener = (newValue, oldValue) => {
    try {
      callback(newValue, oldValue, key);
    } catch (error) {
      handleError(error, `watchState callback for ${key}`);
    }
  };
  
  listenersMap[key].add(listener);
  return () => listenersMap[key].delete(listener);
}

// 여러 상태를 하나로 결합
export function combineStates(stateObjects, combiner) {
  if (!Array.isArray(stateObjects)) {
    throw new Error('JihoFrame: combineStates expects an array of state objects');
  }
  
  if (typeof combiner !== 'function') {
    throw new Error('JihoFrame: combineStates expects a combiner function');
  }
  
  const combinedKey = `combined_${Date.now()}_${Math.random()}`;
  
  const updateCombined = () => {
    const values = stateObjects.map(stateObj => stateObj.value);
    const combined = combiner(...values);
    if (state[combinedKey] !== combined) {
      state[combinedKey] = combined;
    }
  };
  
  // 초기값 설정
  updateCombined();
  
  // 각 상태 변화 감지
  const unsubscribers = stateObjects.map(stateObj => 
    stateObj.subscribe(updateCombined)
  );
  
  const combinedState = createState(combinedKey, state[combinedKey]);
  
  // 정리 함수 추가
  combinedState.cleanup = () => {
    unsubscribers.forEach(unsub => unsub());
    resetState(combinedKey);
  };
  
  return combinedState;
}

// 조건부 상태 (computed state)
export function computedState(dependencies, computer) {
  if (!Array.isArray(dependencies)) {
    throw new Error('JihoFrame: computedState expects an array of dependencies');
  }
  
  if (typeof computer !== 'function') {
    throw new Error('JihoFrame: computedState expects a computer function');
  }
  
  return combineStates(dependencies, computer);
}

// 에러 처리 함수 (jihoFunc에서도 사용)
function handleError(error, context = 'Unknown') {
  console.error(`JihoFrame Error in ${context}:`, error);
  if (typeof window !== 'undefined' && window.process?.env?.NODE_ENV === 'development') {
    console.trace();
  }
}

export {
  initCallbacks,
  mountCallbacks,
  updateCallbacks,
  unmountCallbacks,
};
