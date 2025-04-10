// 상태 및 콜백 저장소
let state = {};
let listenersMap = {};
let globalSubscribers = [];

let initCallbacks = [];
let mountCallbacks = [];
let updateCallbacks = new Map(); 
let unmountCallbacks = [];


export function jihoInit(cb) {
  initCallbacks.push(cb);
}

export function jihoMount(cb) {
  mountCallbacks.push(cb);
}

export function jihoUpdate(cb, stateObj) {
  if (!updateCallbacks.has(stateObj)) {
    updateCallbacks.set(stateObj, []);
  }
  updateCallbacks.get(stateObj).push(cb);
}

export function jihoUnMount(cb) {
  unmountCallbacks.push(cb);
}

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

      globalSubscribers.forEach((cb) => cb());

      if (updateCallbacks.has(stateObj)) {
        updateCallbacks.get(stateObj).forEach((cb) => cb());
      }

      listenersMap[key].forEach((cb) => cb());
    },
    subscribe(fn) {
      listenersMap[key].add(fn);
      return () => listenersMap[key].delete(fn);
    },
  };

  return stateObj;
}

export function subscribeState(fn) {
  globalSubscribers.push(fn);
}

export {
  initCallbacks,
  mountCallbacks,
  updateCallbacks,
  unmountCallbacks,
};
