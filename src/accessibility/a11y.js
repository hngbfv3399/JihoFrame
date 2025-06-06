/**
 * JihoFrame 접근성(A11y) 지원 모듈
 * WCAG 2.1 AA 기준을 준수하여 웹 접근성을 개선합니다.
 */

class AccessibilityManager {
  constructor() {
    this.ariaDescribedBy = new Map();
    this.liveRegions = new Map();
    this.focusStack = [];
    this.announceQueue = [];
    this.isProcessingQueue = false;
    
    this.initializeA11y();
  }

  /**
   * 접근성 초기화
   */
  initializeA11y() {
    this.createLiveRegions();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupColorContrastCheck();
  }

  /**
   * ARIA Live Region 생성
   */
  createLiveRegions() {
    // 화면 읽기 프로그램용 공지 영역
    const assertiveRegion = this.createElement('div', {
      id: 'jiho-live-assertive',
      'aria-live': 'assertive',
      'aria-atomic': 'true',
      style: {
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      },
    });

    const politeRegion = this.createElement('div', {
      id: 'jiho-live-polite',
      'aria-live': 'polite',
      'aria-atomic': 'true',
      style: {
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      },
    });

    document.body.appendChild(assertiveRegion);
    document.body.appendChild(politeRegion);

    this.liveRegions.set('assertive', assertiveRegion);
    this.liveRegions.set('polite', politeRegion);
  }

  /**
   * 화면 읽기 프로그램 공지
   */
  announce(message, priority = 'polite') {
    this.announceQueue.push({ message, priority, timestamp: Date.now() });
    
    if (!this.isProcessingQueue) {
      this.processAnnounceQueue();
    }
  }

  /**
   * 공지 큐 처리
   */
  async processAnnounceQueue() {
    this.isProcessingQueue = true;

    while (this.announceQueue.length > 0) {
      const { message, priority } = this.announceQueue.shift();
      const region = this.liveRegions.get(priority);
      
      if (region) {
        // 기존 메시지 지우기
        region.textContent = '';
        
        // 잠시 대기 후 새 메시지 설정 (화면 읽기 프로그램이 인식하도록)
        await this.delay(100);
        region.textContent = message;
        
        // 메시지가 읽혀질 시간 확보
        await this.delay(priority === 'assertive' ? 2000 : 1000);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * 키보드 내비게이션 설정
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Skip Links (Skip to content)
      if (event.key === 'Tab' && !event.shiftKey && document.activeElement === document.body) {
        this.createSkipLinks();
      }

      // ESC 키로 모달/오버레이 닫기
      if (event.key === 'Escape') {
        this.handleEscapeKey();
      }

      // 화살표 키로 내비게이션
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        this.handleArrowNavigation(event);
      }
    });
  }

  /**
   * Skip Links 생성
   */
  createSkipLinks() {
    const existing = document.getElementById('jiho-skip-links');
    if (existing) return;

    const skipLinks = this.createElement('div', {
      id: 'jiho-skip-links',
      style: {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        backgroundColor: '#000',
        color: '#fff',
        padding: '10px',
        borderRadius: '0 0 5px 0',
      },
    });

    const mainLink = this.createElement('a', {
      href: '#main-content',
      style: {
        color: '#fff',
        textDecoration: 'underline',
        marginRight: '10px',
      },
      textContent: '메인 콘텐츠로 이동',
    });

    const navLink = this.createElement('a', {
      href: '#navigation',
      style: {
        color: '#fff',
        textDecoration: 'underline',
      },
      textContent: '내비게이션으로 이동',
    });

    skipLinks.appendChild(mainLink);
    skipLinks.appendChild(navLink);
    document.body.insertBefore(skipLinks, document.body.firstChild);

    // 첫 번째 링크에 포커스
    mainLink.focus();

    // Tab 떼면 skip links 숨기기
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Tab') {
        setTimeout(() => {
          if (!skipLinks.contains(document.activeElement)) {
            skipLinks.remove();
          }
        }, 100);
      }
    }, { once: true });
  }

  /**
   * 포커스 관리 설정
   */
  setupFocusManagement() {
    // 포커스 스타일 개선
    const style = document.createElement('style');
    style.textContent = `
      .jiho-focus-visible {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      .jiho-focus-hidden {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);

    // 포커스 가시성 관리
    document.addEventListener('mousedown', () => {
      document.body.classList.add('jiho-using-mouse');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.remove('jiho-using-mouse');
      }
    });
  }

  /**
   * 포커스 트랩 (모달 등에서 사용)
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // 초기 포커스
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  /**
   * 포커스 스택 관리
   */
  pushFocus(element) {
    this.focusStack.push(document.activeElement);
    if (element) {
      element.focus();
    }
  }

  popFocus() {
    const previousElement = this.focusStack.pop();
    if (previousElement && previousElement.focus) {
      previousElement.focus();
    }
  }

  /**
   * 색상 대비 검사
   */
  setupColorContrastCheck() {
    // 개발 모드에서만 실행
    if (process.env.NODE_ENV !== 'development') return;

    this.checkColorContrast();
  }

  /**
   * WCAG 색상 대비 검사
   */
  checkColorContrast() {
    const elements = document.querySelectorAll('*');
    const warnings = [];

    elements.forEach(element => {
      const style = getComputedStyle(element);
      const color = this.parseColor(style.color);
      const backgroundColor = this.parseColor(style.backgroundColor);

      if (color && backgroundColor) {
        const contrast = this.calculateContrast(color, backgroundColor);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = style.fontWeight;

        // WCAG AA 기준
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        const minContrast = isLargeText ? 3 : 4.5;

        if (contrast < minContrast) {
          warnings.push({
            element,
            contrast: contrast.toFixed(2),
            required: minContrast,
            color: style.color,
            backgroundColor: style.backgroundColor,
          });
        }
      }
    });

    if (warnings.length > 0) {
      console.group('⚠️ 색상 대비 경고 (WCAG AA 기준)');
      warnings.forEach(warning => {
        console.warn('대비 부족:', warning);
      });
      console.groupEnd();
    }
  }

  /**
   * ARIA 속성 헬퍼 메서드들
   */
  setAriaLabel(element, label) {
    element.setAttribute('aria-label', label);
  }

  setAriaDescribedBy(element, description) {
    const descId = `jiho-desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const descElement = this.createElement('div', {
      id: descId,
      'aria-hidden': 'true',
      style: {
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      },
      textContent: description,
    });

    document.body.appendChild(descElement);
    element.setAttribute('aria-describedby', descId);
    
    this.ariaDescribedBy.set(element, descElement);
  }

  setAriaExpanded(element, expanded) {
    element.setAttribute('aria-expanded', expanded.toString());
  }

  setAriaHidden(element, hidden) {
    element.setAttribute('aria-hidden', hidden.toString());
  }

  /**
   * 의미적 HTML 요소 생성 도우미
   */
  createButton(options = {}) {
    const button = this.createElement('button', {
      type: options.type || 'button',
      'aria-label': options.ariaLabel,
      'aria-describedby': options.ariaDescribedBy,
      disabled: options.disabled,
      ...options.attributes,
    });

    if (options.text) {
      button.textContent = options.text;
    }

    return button;
  }

  createHeading(level, text, options = {}) {
    if (level < 1 || level > 6) {
      throw new Error('제목 레벨은 1-6 사이여야 합니다.');
    }

    return this.createElement(`h${level}`, {
      id: options.id,
      'aria-label': options.ariaLabel,
      textContent: text,
      ...options.attributes,
    });
  }

  createLandmark(role, options = {}) {
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    if (!validRoles.includes(role)) {
      throw new Error(`유효하지 않은 landmark role: ${role}`);
    }

    return this.createElement(options.element || 'div', {
      role,
      'aria-label': options.ariaLabel,
      'aria-labelledby': options.ariaLabelledBy,
      ...options.attributes,
    });
  }

  /**
   * 유틸리티 메서드들
   */
  createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (value !== undefined && value !== null) {
        element.setAttribute(key, value);
      }
    });

    return element;
  }

  parseColor(colorString) {
    // RGB 색상 파싱 (간단한 구현)
    const rgb = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgb) {
      return {
        r: parseInt(rgb[1]),
        g: parseInt(rgb[2]),
        b: parseInt(rgb[3]),
      };
    }
    return null;
  }

  calculateContrast(color1, color2) {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  getLuminance(color) {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleEscapeKey() {
    // 모달이나 오버레이가 있으면 닫기
    const modal = document.querySelector('[role="dialog"][aria-modal="true"]');
    if (modal) {
      const closeButton = modal.querySelector('[aria-label*="닫기"], [aria-label*="close"]');
      if (closeButton) {
        closeButton.click();
      }
    }
  }

  handleArrowNavigation(event) {
    // 메뉴나 리스트에서 화살표 키 내비게이션
    const activeElement = document.activeElement;
    const parent = activeElement.closest('[role="menu"], [role="listbox"], [role="tree"]');
    
    if (parent) {
      const items = parent.querySelectorAll('[role="menuitem"], [role="option"], [role="treeitem"]');
      const currentIndex = Array.from(items).indexOf(activeElement);
      
      let nextIndex;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      }
      
      if (nextIndex !== undefined && items[nextIndex]) {
        event.preventDefault();
        items[nextIndex].focus();
      }
    }
  }

  /**
   * 접근성 검사 실행
   */
  runA11yAudit() {
    const issues = [];

    // 이미지 alt 속성 검사
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt && !img.hasAttribute('aria-label')) {
        issues.push({
          type: 'missing-alt',
          element: img,
          message: '이미지에 alt 속성이 누락되었습니다.',
        });
      }
    });

    // 제목 구조 검사
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName[1]);
      if (currentLevel > previousLevel + 1) {
        issues.push({
          type: 'heading-skip',
          element: heading,
          message: `제목 레벨이 건너뛰어졌습니다. (${previousLevel} → ${currentLevel})`,
        });
      }
      previousLevel = currentLevel;
    });

    // 링크 텍스트 검사
    document.querySelectorAll('a').forEach(link => {
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      if (!text && !ariaLabel) {
        issues.push({
          type: 'empty-link',
          element: link,
          message: '링크에 텍스트나 aria-label이 없습니다.',
        });
      }
    });

    return issues;
  }

  /**
   * 정리
   */
  cleanup() {
    // ARIA 설명 요소들 정리
    this.ariaDescribedBy.forEach(descElement => {
      descElement.remove();
    });
    this.ariaDescribedBy.clear();

    // Live regions 정리
    this.liveRegions.forEach(region => {
      region.remove();
    });
    this.liveRegions.clear();

    // 포커스 스택 정리
    this.focusStack = [];
  }
}

export default AccessibilityManager; 