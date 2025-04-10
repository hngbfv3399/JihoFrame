let state = {};
let subscribers = [];

export function createState(initialValue) {
  const key = Object.keys(state).length;
  state[key] = state[key] ?? initialValue;

  const listeners = new Set();

  const stateObj = {
    get value() {
      return state[key];
    },
    set(newValue) {
      state[key] = newValue;
      subscribers.forEach((cb) => cb());
      listeners.forEach((cb) => cb());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };

  return stateObj;
}

export function subscribeState(fn) {
  subscribers.push(fn);
}