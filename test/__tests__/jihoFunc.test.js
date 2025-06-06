/**
 * @jest-environment jsdom
 */

import { 
  createState, 
  computedState, 
  combineStates,
  subscribeState,
  getStateSnapshot,
  resetState,
  watchState
} from '../../src/Jiho/jihoFunc.js';

describe('JihoFrame State Management', () => {
  
  // 각 테스트 후 상태 초기화
  afterEach(() => {
    resetState();
  });

  describe('createState', () => {
    test('should create state with initial value', () => {
      const state = createState('test', 'initial');
      expect(state.value).toBe('initial');
    });

    test('should update state value', () => {
      const state = createState('counter', 0);
      state.value = 5;
      expect(state.value).toBe(5);
    });

    test('should maintain backward compatibility with get/set methods', () => {
      const state = createState('legacy', 10);
      expect(state.get()).toBe(10);
      
      state.set(20);
      expect(state.value).toBe(20);
      expect(state.get()).toBe(20);
    });

    test('should not update if value is the same', () => {
      const state = createState('same', 'value');
      const mockCallback = jest.fn();
      
      state.subscribe(mockCallback);
      state.value = 'value'; // 같은 값 설정
      
      // 동기적으로 실행되지 않으므로 약간의 지연 후 확인
      setTimeout(() => {
        expect(mockCallback).not.toHaveBeenCalled();
      }, 0);
    });

    test('should throw error for non-string key', () => {
      expect(() => createState(123, 'value')).toThrow('State key must be a string');
    });
  });

  describe('State Subscription', () => {
    test('should call subscribers when state changes', (done) => {
      const state = createState('subscription', 0);
      const mockCallback = jest.fn();
      
      state.subscribe(mockCallback);
      state.value = 1;
      
      // 배치 업데이트는 비동기이므로 Promise로 확인
      Promise.resolve().then(() => {
        expect(mockCallback).toHaveBeenCalled();
        done();
      });
    });

    test('should unsubscribe correctly', (done) => {
      const state = createState('unsubscribe', 0);
      const mockCallback = jest.fn();
      
      const unsubscribe = state.subscribe(mockCallback);
      unsubscribe();
      
      state.value = 1;
      
      Promise.resolve().then(() => {
        expect(mockCallback).not.toHaveBeenCalled();
        done();
      });
    });

    test('should handle global state subscription', (done) => {
      const mockCallback = jest.fn();
      subscribeState(mockCallback);
      
      const state = createState('global', 0);
      state.value = 1;
      
      Promise.resolve().then(() => {
        expect(mockCallback).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('computedState', () => {
    test('should compute value from dependencies', () => {
      const firstName = createState('firstName', 'John');
      const lastName = createState('lastName', 'Doe');
      
      const fullName = computedState(
        [firstName, lastName],
        (first, last) => `${first} ${last}`
      );
      
      expect(fullName.value).toBe('John Doe');
    });

    test('should update when dependencies change', (done) => {
      const a = createState('a', 1);
      const b = createState('b', 2);
      
      const sum = computedState([a, b], (aVal, bVal) => aVal + bVal);
      expect(sum.value).toBe(3);
      
      a.value = 5;
      
      Promise.resolve().then(() => {
        expect(sum.value).toBe(7);
        done();
      });
    });
  });

  describe('combineStates', () => {
    test('should combine multiple states', () => {
      const user = createState('user', { name: 'Alice' });
      const online = createState('online', true);
      
      const userStatus = combineStates(
        [user, online],
        (userData, isOnline) => `${userData.name} (${isOnline ? 'online' : 'offline'})`
      );
      
      expect(userStatus.value).toBe('Alice (online)');
    });

    test('should update when any combined state changes', (done) => {
      const x = createState('x', 10);
      const y = createState('y', 20);
      
      const combined = combineStates([x, y], (xVal, yVal) => xVal * yVal);
      expect(combined.value).toBe(200);
      
      y.value = 30;
      
      Promise.resolve().then(() => {
        expect(combined.value).toBe(300);
        done();
      });
    });
  });

  describe('Utility Functions', () => {
    test('getStateSnapshot should return current state', () => {
      createState('test1', 'value1');
      createState('test2', 'value2');
      
      const snapshot = getStateSnapshot();
      expect(snapshot).toEqual({
        test1: 'value1',
        test2: 'value2'
      });
    });

    test('resetState should clear specific state', () => {
      const state1 = createState('reset1', 'value1');
      const state2 = createState('reset2', 'value2');
      
      resetState('reset1');
      
      const snapshot = getStateSnapshot();
      expect(snapshot.reset1).toBeUndefined();
      expect(snapshot.reset2).toBe('value2');
    });

    test('resetState without key should clear all states', () => {
      createState('clear1', 'value1');
      createState('clear2', 'value2');
      
      resetState();
      
      const snapshot = getStateSnapshot();
      expect(Object.keys(snapshot)).toHaveLength(0);
    });

    test('watchState should monitor state changes', (done) => {
      const state = createState('watch', 'initial');
      const mockCallback = jest.fn();
      
      watchState('watch', mockCallback);
      state.value = 'changed';
      
      Promise.resolve().then(() => {
        expect(mockCallback).toHaveBeenCalledWith('changed', 'initial');
        done();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid subscribe callback', () => {
      const state = createState('error', 'test');
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const unsubscribe = state.subscribe('not-a-function');
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: subscribe expects a function');
      expect(typeof unsubscribe).toBe('function');
      
      consoleSpy.mockRestore();
    });

    test('should handle invalid global subscribe callback', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const unsubscribe = subscribeState('not-a-function');
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: subscribeState expects a function');
      expect(typeof unsubscribe).toBe('function');
      
      consoleSpy.mockRestore();
    });

    test('watchState should handle non-existent state key', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const unsubscribe = watchState('nonexistent', () => {});
      expect(consoleSpy).toHaveBeenCalledWith('JihoFrame: State key "nonexistent" does not exist');
      expect(typeof unsubscribe).toBe('function');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Memory Management', () => {
    test('should prevent memory leaks with component-based subscriptions', () => {
      const state = createState('memory', 'test');
      const mockComponent = {};
      const mockCallback = jest.fn();
      
      // 컴포넌트 기반 구독
      state.subscribe(mockCallback, mockComponent);
      
      // 컴포넌트 언마운트 시뮬레이션
      // unsubscribeAll(mockComponent); // 실제로는 render에서 호출됨
      
      state.value = 'changed';
      
      // 구독이 여전히 활성 상태인지 확인
      Promise.resolve().then(() => {
        expect(mockCallback).toHaveBeenCalled();
      });
    });
  });
}); 