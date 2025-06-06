/**
 * JihoFrame 개발자 도구
 * 상태 관리, 성능 모니터링, 디버깅 기능 제공
 */

class JihoDevTools {
  constructor() {
    this.isEnabled = typeof window !== 'undefined' && window.__DEV__;
    this.stateHistory = [];
    this.renderMetrics = [];
    this.componentTree = new Map();
    this.activeStates = new Map();
    
    if (this.isEnabled) {
      this.initializeDevTools();
    }
  }

  /**
   * 개발자 도구 초기화
   */
  initializeDevTools() {
    // 전역 DevTools 객체 설정
    if (typeof window !== 'undefined') {
      window.__JIHO_DEV_TOOLS__ = this;
      console.log('🛠️ JihoFrame DevTools 활성화됨');
    }

    // 성능 관찰자 설정
    this.setupPerformanceObserver();
    
    // 키보드 단축키 설정
    this.setupKeyboardShortcuts();
  }

  /**
   * 상태 변화 추적
   */
  trackStateChange(stateName, oldValue, newValue, source = 'unknown') {
    if (!this.isEnabled) return;

    const stateChange = {
      timestamp: Date.now(),
      stateName,
      oldValue: this.deepClone(oldValue),
      newValue: this.deepClone(newValue),
      source,
      stackTrace: new Error().stack,
    };

    this.stateHistory.push(stateChange);
    this.activeStates.set(stateName, newValue);

    // 최대 1000개 히스토리 유지
    if (this.stateHistory.length > 1000) {
      this.stateHistory.shift();
    }

    this.logStateChange(stateChange);
  }

  /**
   * 렌더링 성능 추적
   */
  trackRender(componentName, renderTime, updateType = 'full') {
    if (!this.isEnabled) return;

    const renderMetric = {
      timestamp: Date.now(),
      componentName,
      renderTime,
      updateType,
      memoryUsage: this.getMemoryUsage(),
    };

    this.renderMetrics.push(renderMetric);

    // 최대 500개 메트릭 유지
    if (this.renderMetrics.length > 500) {
      this.renderMetrics.shift();
    }

    // 느린 렌더링 경고
    if (renderTime > 16) { // 60fps 기준
      console.warn(`🐌 느린 렌더링: ${componentName} (${renderTime}ms)`);
    }
  }

  /**
   * 컴포넌트 트리 추적
   */
  trackComponent(componentId, componentData) {
    if (!this.isEnabled) return;

    this.componentTree.set(componentId, {
      ...componentData,
      lastUpdate: Date.now(),
    });
  }

  /**
   * 성능 리포트 생성
   */
  getPerformanceReport() {
    if (!this.isEnabled) return null;

    const avgRenderTime = this.renderMetrics.reduce(
      (sum, metric) => sum + metric.renderTime, 0
    ) / this.renderMetrics.length;

    const slowRenders = this.renderMetrics.filter(
      metric => metric.renderTime > 16
    );

    return {
      totalRenders: this.renderMetrics.length,
      averageRenderTime: avgRenderTime.toFixed(2),
      slowRenders: slowRenders.length,
      slowRenderPercentage: ((slowRenders.length / this.renderMetrics.length) * 100).toFixed(2),
      memoryUsage: this.getMemoryUsage(),
      stateChanges: this.stateHistory.length,
      activeStates: this.activeStates.size,
      components: this.componentTree.size,
    };
  }

  /**
   * 상태 히스토리 검색
   */
  searchStateHistory(stateName, limit = 50) {
    if (!this.isEnabled) return [];

    return this.stateHistory
      .filter(change => !stateName || change.stateName.includes(stateName))
      .slice(-limit)
      .reverse();
  }

  /**
   * 컴포넌트 트리 시각화
   */
  visualizeComponentTree() {
    if (!this.isEnabled) return;

    console.group('🌳 컴포넌트 트리');
    this.componentTree.forEach((data, id) => {
      console.log(`📦 ${id}:`, data);
    });
    console.groupEnd();
  }

  /**
   * 메모리 사용량 측정
   */
  getMemoryUsage() {
    if (typeof performance !== 'undefined' && performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }

  /**
   * 깊은 복사 유틸리티
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  }

  /**
   * 상태 변화 로깅
   */
  logStateChange(change) {
    console.group(`🔄 상태 변화: ${change.stateName}`);
    console.log('⏰ 시간:', new Date(change.timestamp).toLocaleTimeString());
    console.log('📤 이전 값:', change.oldValue);
    console.log('📥 새 값:', change.newValue);
    console.log('📍 소스:', change.source);
    console.groupEnd();
  }

  /**
   * 성능 관찰자 설정
   */
  setupPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name.includes('jiho-frame')) {
            console.log(`⚡ 성능 측정: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('성능 관찰자 설정 실패:', error);
    }
  }

  /**
   * 키보드 단축키 설정
   */
  setupKeyboardShortcuts() {
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + D: DevTools 콘솔 출력
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        this.printDevToolsInfo();
      }

      // Ctrl/Cmd + Shift + P: 성능 리포트
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        event.preventDefault();
        console.table(this.getPerformanceReport());
      }

      // Ctrl/Cmd + Shift + S: 상태 히스토리
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        console.table(this.searchStateHistory());
      }
    });
  }

  /**
   * DevTools 정보 출력
   */
  printDevToolsInfo() {
    console.clear();
    console.log(`
    ╔══════════════════════════════════════╗
    ║         🛠️ JihoFrame DevTools         ║
    ╠══════════════════════════════════════╣
    ║  단축키:                              ║
    ║  • Ctrl+Shift+D: DevTools 정보        ║
    ║  • Ctrl+Shift+P: 성능 리포트          ║
    ║  • Ctrl+Shift+S: 상태 히스토리        ║
    ║                                      ║
    ║  콘솔 명령어:                         ║
    ║  • __JIHO_DEV_TOOLS__.getPerformanceReport() ║
    ║  • __JIHO_DEV_TOOLS__.searchStateHistory()   ║
    ║  • __JIHO_DEV_TOOLS__.visualizeComponentTree() ║
    ╚══════════════════════════════════════╝
    `);
    
    console.table(this.getPerformanceReport());
  }

  /**
   * DevTools 비활성화
   */
  disable() {
    this.isEnabled = false;
    if (typeof window !== 'undefined') {
      delete window.__JIHO_DEV_TOOLS__;
    }
  }
}

export default JihoDevTools; 