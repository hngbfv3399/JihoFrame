export function createState(initialValue) {
    let value = initialValue;
    const listeners = new Set();
  
    const get = () => value;
    const set = (newValue) => {
      value = newValue;
      listeners.forEach((fn) => fn());
    };
  
    return {
      get value() {
        return get();
      },
      set: (v) => set(v),
      subscribe: (fn) => listeners.add(fn),
      unsubscribe: (fn) => listeners.delete(fn),
    };
  }
  