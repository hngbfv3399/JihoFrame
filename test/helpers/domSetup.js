/**
 * DOM 환경 설정
 * Jest와 jsdom을 위한 초기 설정
 */

// jsdom 환경에서 누락될 수 있는 전역 객체들 추가
if (typeof global !== 'undefined') {
  // Node.js 환경에서 실행되는 경우
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // MutationObserver가 없는 경우 폴리필
  if (!global.MutationObserver) {
    global.MutationObserver = class MutationObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  }

  // IntersectionObserver 폴리필
  if (!global.IntersectionObserver) {
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

// DOM 이벤트 폴리필
if (typeof Event === 'undefined') {
  global.Event = class Event {
    constructor(type, options = {}) {
      this.type = type;
      this.bubbles = options.bubbles || false;
      this.cancelable = options.cancelable || false;
      this.defaultPrevented = false;
    }
    
    preventDefault() {
      this.defaultPrevented = true;
    }
    
    stopPropagation() {}
    stopImmediatePropagation() {}
  };
}

// CustomEvent 폴리필
if (typeof CustomEvent === 'undefined') {
  global.CustomEvent = class CustomEvent extends Event {
    constructor(type, options = {}) {
      super(type, options);
      this.detail = options.detail || null;
    }
  };
}

// beforeEach에서 실행할 공통 설정
beforeEach(() => {
  // 콘솔 에러/경고를 캐치하여 실제 에러를 방지
  jest.spyOn(console, 'error').mockImplementation((message) => {
    // 실제 에러인 경우에만 fail
    if (message.includes('Error:') && !message.includes('JihoFrame:')) {
      throw new Error(message);
    }
  });
  
  jest.spyOn(console, 'warn').mockImplementation(() => {
    // 경고는 무시하되 테스트에서 확인할 수 있도록 함
  });
});

// afterEach에서 실행할 정리
afterEach(() => {
  // 모든 mock 복원
  jest.restoreAllMocks();
  
  // DOM 정리
  document.body.innerHTML = '';
  
  // 타이머 정리
  jest.clearAllTimers();
});

// 테스트용 유틸리티 함수들
export const testUtils = {
  // DOM 요소가 생성될 때까지 대기
  waitForElement: (selector, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const check = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        } else {
          setTimeout(check, 10);
        }
      };
      
      check();
    });
  },
  
  // 상태 변경 후 DOM 업데이트 대기
  waitForUpdate: (timeout = 100) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  },
  
  // 이벤트 시뮬레이션
  fireEvent: (element, eventType, options = {}) => {
    const event = new Event(eventType, {
      bubbles: true,
      cancelable: true,
      ...options
    });
    
    Object.keys(options).forEach(key => {
      if (key !== 'bubbles' && key !== 'cancelable') {
        event[key] = options[key];
      }
    });
    
    element.dispatchEvent(event);
    return event;
  },
  
  // 테스트용 컨테이너 생성
  createTestContainer: () => {
    const container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
    return container;
  },
  
  // 테스트용 컨테이너 정리
  cleanupTestContainer: (container) => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};

// 비동기 테스트를 위한 헬퍼
export const asyncTestUtils = {
  // Promise 기반 상태 업데이트 대기
  waitForStateUpdate: () => Promise.resolve().then(() => Promise.resolve()),
  
  // 특정 조건이 참이 될 때까지 대기
  waitFor: (condition, timeout = 1000, interval = 10) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error(`Condition not met within ${timeout}ms`));
        } else {
          setTimeout(check, interval);
        }
      };
      
      check();
    });
  },
  
  // 다음 프레임까지 대기
  nextFrame: () => {
    return new Promise(resolve => {
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(resolve);
      } else {
        setTimeout(resolve, 16); // ~60fps
      }
    });
  }
};

// 모킹 헬퍼
export const mockHelpers = {
  // 로컬 스토리지 모킹
  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => { store[key] = value; }),
      removeItem: jest.fn(key => { delete store[key]; }),
      clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
      get length() { return Object.keys(store).length; },
      key: jest.fn(index => Object.keys(store)[index] || null)
    };
  },
  
  // 세션 스토리지 모킹
  mockSessionStorage: () => {
    return mockHelpers.mockLocalStorage();
  },
  
  // fetch API 모킹
  mockFetch: (response) => {
    return jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response))
      })
    );
  }
};

// Jest 환경에서만 사용 가능한 전역 설정
if (typeof jest !== 'undefined') {
  // 타이머 모킹 설정
  jest.useFakeTimers();
  
  // 콘솔 스파이 자동 정리
  afterAll(() => {
    jest.useRealTimers();
  });
} 