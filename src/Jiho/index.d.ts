export declare function createState<T>(initialValue: T): {
    value: T;
    set: (newValue: T) => void;
    subscribe: (fn: () => void) => () => void;
  };
  
  export declare function renderApp(appFunc: () => any, container: HTMLElement): void;
  