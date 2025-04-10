// 상태 및 콜백 저장소
let state = {};
let listenersMap = {};
let globalSubscribers = [];

let initCallbacks = [];
let mountCallbacks = [];
let updateCallbacks = new Map(); // state 객체별 콜백
let unmountCallbacks = [];

// ✅ 초기 상태 설정 시 실행
export function jihoInit(cb) {
  initCallbacks.push(cb);
}

// ✅ 마운트 시 실행
export function jihoMount(cb) {
  mountCallbacks.push(cb);
}

// ✅ 상태가 변경되었을 때 실행
export function jihoUpdate(cb, stateObj) {
  if (!updateCallbacks.has(stateObj)) {
    updateCallbacks.set(stateObj, []);
  }
  updateCallbacks.get(stateObj).push(cb);
}

// ✅ 언마운트 시 실행
export function jihoUnMount(cb) {
  unmountCallbacks.push(cb);
}

// ✅ 상태 생성
export function createState(key, initialValue) {
  if (!(key in state)) {
    state[key] = initialValue;
    listenersMap[key] = new Set();
  }

  const stateObj = {
    get value() {
      return state[key];
    },
    set(newValue) {
      state[key] = newValue;

      // 전역 렌더 콜백
      globalSubscribers.forEach((cb) => cb());

      // 해당 상태에 등록된 업데이트 콜백 실행
      if (updateCallbacks.has(stateObj)) {
        updateCallbacks.get(stateObj).forEach((cb) => cb());
      }

      // 기본 리스너 실행
      listenersMap[key].forEach((cb) => cb());
    },
    subscribe(fn) {
      listenersMap[key].add(fn);
      return () => listenersMap[key].delete(fn);
    },
  };

  return stateObj;
}

// ✅ 전체 리렌더 구독
export function subscribeState(fn) {
  globalSubscribers.push(fn);
}

// ✅ renderApp에서 접근 가능하도록 export
export {
  initCallbacks,
  mountCallbacks,
  updateCallbacks,
  unmountCallbacks,
};
