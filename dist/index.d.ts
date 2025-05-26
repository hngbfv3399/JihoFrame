// JihoFrame TypeScript Definitions

export interface StateObject<T = any> {
  value: T;
  get(): T;
  set(newValue: T): void;
  subscribe(callback: (value: T) => void, component?: any): () => void;
  cleanup?: () => void;
}

export interface JihoComponent {
  layout: Array<any>;
}

export interface EventHandlers {
  [key: string]: (event: Event) => void;
}

export interface ElementOptions {
  text?: string | (() => string);
  style?: { [key: string]: string };
  id?: string;
  className?: string;
  event?: EventHandlers | EventHandlers[];
  children?: Array<any>;
  show?: boolean | (() => boolean);
  disabled?: boolean | (() => boolean);
  value?: any;
  type?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  [key: string]: any;
}

// State Management
export declare function createState<T>(key: string, initialValue: T): StateObject<T>;
export declare function subscribeState(callback: () => void, component?: any): () => void;
export declare function unsubscribeAll(component: any): void;
export declare function getStateSnapshot(): { [key: string]: any };
export declare function resetState(key?: string): void;
export declare function watchState<T>(key: string, callback: (newValue: T, oldValue: T, key: string) => void): () => void;
export declare function combineStates<T extends any[], R>(
  stateObjects: StateObject<T[number]>[], 
  combiner: (...values: T) => R
): StateObject<R>;
export declare function computedState<T extends any[], R>(
  dependencies: StateObject<T[number]>[], 
  computer: (...values: T) => R
): StateObject<R>;

// Lifecycle
export declare function jihoInit(callback: () => void): void;
export declare function jihoMount(callback: () => void): void;
export declare function jihoUpdate(callback: () => void, stateObj: StateObject): void;
export declare function jihoUnMount(callback: () => void): void;

// Rendering
export declare function renderApp(appFunc: () => JihoComponent, container: HTMLElement): () => void;

export declare function renderApp(appFunc: () => any, container: HTMLElement): void;
  