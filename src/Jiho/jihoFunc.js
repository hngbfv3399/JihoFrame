let subscribers = [];

export function createState(initialValue) {
  let value = initialValue;

  const listeners = new Set();

  const state = {
    get value() {
      return value;
    },
    set(newValue) {
      value = newValue;
      subscribers.forEach(fn => fn());
      listeners.forEach(fn => fn());
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    }
  };

  return state;
}

export function subscribeState(fn) {
  subscribers.push(fn);
}
