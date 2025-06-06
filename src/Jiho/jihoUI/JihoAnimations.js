/**
 * JihoAnimations - 애니메이션 시스템
 * CSS 애니메이션과 JavaScript 기반 애니메이션 지원
 */

// CSS 애니메이션 스타일을 동적으로 추가
let stylesInjected = false;

const injectAnimationStyles = () => {
  if (stylesInjected) return;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* 기본 애니메이션 키프레임 */
    @keyframes jiho-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes jiho-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    @keyframes jiho-slide-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes jiho-slide-in-down {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes jiho-slide-in-left {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes jiho-slide-in-right {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes jiho-zoom-in {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes jiho-zoom-out {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.9);
      }
    }

    @keyframes jiho-bounce-in {
      0% {
        opacity: 0;
        transform: scale(0.3);
      }
      50% {
        opacity: 1;
        transform: scale(1.05);
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes jiho-flip-in {
      from {
        opacity: 0;
        transform: perspective(400px) rotateX(-90deg);
      }
      to {
        opacity: 1;
        transform: perspective(400px) rotateX(0deg);
      }
    }

    @keyframes jiho-shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes jiho-pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes jiho-rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* 모달 애니메이션 */
    @keyframes jiho-modal-fade-in {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes jiho-modal-slide-in {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes jiho-modal-zoom-in {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes jiho-modal-flip-in {
      from {
        opacity: 0;
        transform: perspective(1000px) rotateX(-60deg);
      }
      to {
        opacity: 1;
        transform: perspective(1000px) rotateX(0deg);
      }
    }

    /* 오버레이 애니메이션 */
    @keyframes jiho-overlay-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* 라우트 전환 애니메이션 */
    @keyframes jiho-route-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes jiho-route-slide-in {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* 스켈레톤 로딩 애니메이션 */
    @keyframes skeleton-loading {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }

    /* 토스트 애니메이션 */
    @keyframes jiho-toast-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes jiho-toast-slide-out {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    /* 애니메이션 클래스 */
    .jiho-animate {
      animation-fill-mode: both;
    }

    .jiho-fade-in { animation: jiho-fade-in 0.3s ease-out; }
    .jiho-fade-out { animation: jiho-fade-out 0.3s ease-out; }
    .jiho-slide-in-up { animation: jiho-slide-in-up 0.3s ease-out; }
    .jiho-slide-in-down { animation: jiho-slide-in-down 0.3s ease-out; }
    .jiho-slide-in-left { animation: jiho-slide-in-left 0.3s ease-out; }
    .jiho-slide-in-right { animation: jiho-slide-in-right 0.3s ease-out; }
    .jiho-zoom-in { animation: jiho-zoom-in 0.3s ease-out; }
    .jiho-zoom-out { animation: jiho-zoom-out 0.3s ease-out; }
    .jiho-bounce-in { animation: jiho-bounce-in 0.6s ease-out; }
    .jiho-flip-in { animation: jiho-flip-in 0.5s ease-out; }
    .jiho-shake { animation: jiho-shake 0.5s ease-in-out; }
    .jiho-pulse { animation: jiho-pulse 1s ease-in-out infinite; }
    .jiho-rotate { animation: jiho-rotate 1s linear infinite; }
  `;
  
  document.head.appendChild(styleSheet);
  stylesInjected = true;
};

// 애니메이션 유틸리티 함수들
export const JihoAnimations = {
  // 초기화 (스타일 주입)
  init() {
    injectAnimationStyles();
  },

  // 엘리먼트에 애니메이션 적용
  animate(element, animation, options = {}) {
    if (!element) return Promise.resolve();

    const {
      duration = '0.3s',
      easing = 'ease-out',
      delay = '0s',
      fillMode = 'both',
      onComplete = null
    } = options;

    return new Promise((resolve) => {
      // 애니메이션 스타일 적용
      element.style.animation = `jiho-${animation} ${duration} ${easing} ${delay} ${fillMode}`;
      
      const handleAnimationEnd = () => {
        element.removeEventListener('animationend', handleAnimationEnd);
        if (onComplete) onComplete();
        resolve();
      };

      element.addEventListener('animationend', handleAnimationEnd);
    });
  },

  // 시퀀스 애니메이션
  sequence(animations) {
    return animations.reduce((promise, { element, animation, options }) => {
      return promise.then(() => this.animate(element, animation, options));
    }, Promise.resolve());
  },

  // 병렬 애니메이션
  parallel(animations) {
    const promises = animations.map(({ element, animation, options }) => 
      this.animate(element, animation, options)
    );
    return Promise.all(promises);
  },

  // 스크롤 기반 애니메이션
  onScroll(element, animation, options = {}) {
    if (!element) return;

    const {
      threshold = 0.1,
      once = true
    } = options;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(entry.target, animation, options);
          if (once) observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    observer.observe(element);
    return observer;
  },

  // CSS 변수 애니메이션 (커스텀 속성)
  animateProperty(element, property, from, to, options = {}) {
    if (!element) return Promise.resolve();

    const {
      duration = 300,
      easing = 'ease-out',
      onUpdate = null,
      onComplete = null
    } = options;

    const startTime = performance.now();
    const fromValue = parseFloat(from);
    const toValue = parseFloat(to);
    const difference = toValue - fromValue;

    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 이징 함수 적용
        const easedProgress = this.easingFunctions[easing] 
          ? this.easingFunctions[easing](progress)
          : progress;

        const currentValue = fromValue + (difference * easedProgress);
        
        // 속성 업데이트
        if (property.startsWith('--')) {
          element.style.setProperty(property, currentValue);
        } else {
          element.style[property] = currentValue;
        }

        if (onUpdate) onUpdate(currentValue, progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  },

  // 이징 함수들
  easingFunctions: {
    'ease-in': (t) => t * t,
    'ease-out': (t) => t * (2 - t),
    'ease-in-out': (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'bounce': (t) => {
      if (t < 1/2.75) return 7.5625 * t * t;
      if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
      if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
    },
    'elastic': (t) => {
      if (t === 0 || t === 1) return t;
      const p = 0.3;
      const s = p / 4;
      return -(Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1 - s) * (2 * Math.PI) / p));
    }
  }
};

// 애니메이션 컴포넌트 래퍼
export const JihoAnimated = (props = {}) => {
  const {
    animation = 'fade-in',      // 애니메이션 타입
    duration = '0.3s',          // 지속 시간
    delay = '0s',               // 지연 시간
    easing = 'ease-out',        // 이징
    trigger = 'mount',          // mount, scroll, hover, click
    threshold = 0.1,            // 스크롤 트리거 임계값
    once = true,                // 한 번만 실행
    children = [],              // 자식 엘리먼트들
    style = {},
    ...rest
  } = props;

  // 애니메이션 스타일
  const animationStyle = trigger === 'mount' ? {
    animation: `jiho-${animation} ${duration} ${easing} ${delay} both`
  } : {};

  return {
    div: {
      style: {
        ...animationStyle,
        ...style
      },
      'data-jiho-component': 'Animated',
      'data-animation': animation,
      'data-trigger': trigger,
      children: Array.isArray(children) ? children : [children],
      ...rest.attributes
    }
  };
};

// 페이지 전환 애니메이션 헬퍼
export const createPageTransition = (type = 'fade', duration = '0.3s') => {
  return {
    enter: `jiho-${type}-in ${duration} ease-out`,
    exit: `jiho-${type}-out ${duration} ease-out`
  };
};

// 애니메이션 초기화 (자동 호출)
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    JihoAnimations.init();
  });
  
  // 이미 로드된 경우
  if (document.readyState !== 'loading') {
    JihoAnimations.init();
  }
} 