/**
 * JihoRouter - SPA 라우팅 시스템
 * 클라이언트 사이드 라우팅과 네비게이션을 지원
 */

// 전역 라우터 인스턴스
let globalRouter = null;

// 라우터 클래스
class JihoRouter {
  constructor(routes = {}, options = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.currentParams = {};
    this.listeners = new Set();
    this.beforeNavigationGuards = [];
    this.afterNavigationGuards = [];
    
    // 옵션 설정
    this.options = {
      mode: 'hash',           // hash, history
      base: '/',              // 기본 경로
      transition: 'none',     // 페이지 전환 애니메이션
      scrollToTop: true,      // 라우트 변경시 스크롤 맨 위로
      ...options
    };

    // 초기화
    this.init();
  }

  init() {
    // 현재 경로 파싱
    this.currentRoute = this.getCurrentPath();
    
    // 브라우저 이벤트 리스너
    if (this.options.mode === 'hash') {
      window.addEventListener('hashchange', this.handleRouteChange.bind(this));
    } else {
      window.addEventListener('popstate', this.handleRouteChange.bind(this));
    }

    // 초기 라우트 처리
    this.handleRouteChange();
  }

  // 현재 경로 가져오기
  getCurrentPath() {
    if (this.options.mode === 'hash') {
      return window.location.hash.slice(1) || '/';
    } else {
      return window.location.pathname.replace(this.options.base, '') || '/';
    }
  }

  // 경로 파라미터 파싱
  parseParams(route, path) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
      }
    }

    return params;
  }

  // 라우트 매칭
  findMatchingRoute(path) {
    // 정확한 매치 우선
    if (this.routes[path]) {
      return { route: path, component: this.routes[path], params: {} };
    }

    // 파라미터 라우트 매칭
    for (const route in this.routes) {
      if (route.includes(':')) {
        const routeRegex = new RegExp(
          '^' + route.replace(/:[^/]+/g, '([^/]+)') + '$'
        );
        
        if (routeRegex.test(path)) {
          const params = this.parseParams(route, path);
          return { route, component: this.routes[route], params };
        }
      }
    }

    return null;
  }

  // 라우트 변경 처리
  async handleRouteChange() {
    const newPath = this.getCurrentPath();
    const matchResult = this.findMatchingRoute(newPath);

    // Before navigation guards
    for (const guard of this.beforeNavigationGuards) {
      const result = await guard(newPath, this.currentRoute);
      if (result === false) return; // 네비게이션 취소
    }

    // 라우트 업데이트
    const oldRoute = this.currentRoute;
    this.currentRoute = newPath;
    this.currentParams = matchResult?.params || {};

    // 스크롤 맨 위로
    if (this.options.scrollToTop) {
      window.scrollTo(0, 0);
    }

    // 리스너들에게 알림
    this.listeners.forEach(listener => {
      try {
        listener({
          path: newPath,
          oldPath: oldRoute,
          params: this.currentParams,
          component: matchResult?.component || null
        });
      } catch (error) {
        console.error('JihoRouter: Route listener error:', error);
      }
    });

    // After navigation guards
    for (const guard of this.afterNavigationGuards) {
      try {
        await guard(newPath, oldRoute);
      } catch (error) {
        console.error('JihoRouter: After navigation guard error:', error);
      }
    }
  }

  // 프로그래매틱 네비게이션
  navigate(path, replace = false) {
    if (this.options.mode === 'hash') {
      if (replace) {
        window.location.replace(`${window.location.pathname}#${path}`);
      } else {
        window.location.hash = path;
      }
    } else {
      const fullPath = this.options.base + path.replace(/^\//, '');
      if (replace) {
        window.history.replaceState(null, '', fullPath);
      } else {
        window.history.pushState(null, '', fullPath);
      }
      this.handleRouteChange();
    }
  }

  // 뒤로 가기
  back() {
    window.history.back();
  }

  // 앞으로 가기
  forward() {
    window.history.forward();
  }

  // 라우트 리스너 등록
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Navigation Guard 등록
  beforeNavigate(guard) {
    this.beforeNavigationGuards.push(guard);
    return () => {
      const index = this.beforeNavigationGuards.indexOf(guard);
      if (index > -1) this.beforeNavigationGuards.splice(index, 1);
    };
  }

  afterNavigate(guard) {
    this.afterNavigationGuards.push(guard);
    return () => {
      const index = this.afterNavigationGuards.indexOf(guard);
      if (index > -1) this.afterNavigationGuards.splice(index, 1);
    };
  }

  // 현재 라우트 정보
  getCurrentRoute() {
    return {
      path: this.currentRoute,
      params: this.currentParams,
      query: new URLSearchParams(window.location.search)
    };
  }
}

// 라우터 생성 함수
export function createRouter(routes, options = {}) {
  globalRouter = new JihoRouter(routes, options);
  return globalRouter;
}

// 전역 라우터 인스턴스 가져오기
export function useRouter() {
  if (!globalRouter) {
    throw new Error('JihoRouter: Router not initialized. Call createRouter() first.');
  }
  return globalRouter;
}

// 라우터 아웃렛 컴포넌트
export const JihoRouterOutlet = (props = {}) => {
  const {
    loading = null,           // 로딩 컴포넌트
    notFound = null,          // 404 컴포넌트
    error = null,             // 에러 컴포넌트
    transition = 'fade',      // 전환 효과
    style = {},
    ...rest
  } = props;

  const router = useRouter();
  const [currentComponent, setCurrentComponent] = createState('routerComponent', null);
  const [isLoading, setIsLoading] = createState('routerLoading', false);
  const [routerError, setRouterError] = createState('routerError', null);

  // 라우트 변경 리스너
  const handleRouteChange = async (routeInfo) => {
    try {
      setIsLoading.value = true;
      setRouterError.value = null;

      if (!routeInfo.component) {
        // 404 Not Found
        setCurrentComponent.value = notFound || {
          div: {
            style: { 
              textAlign: 'center', 
              padding: '2rem',
              color: '#6b7280'
            },
            children: [
              { h1: { text: '404', style: { fontSize: '3rem', margin: 0 } } },
              { p: { text: `페이지를 찾을 수 없습니다: ${routeInfo.path}` } }
            ]
          }
        };
      } else {
        // 컴포넌트 렌더링
        if (typeof routeInfo.component === 'function') {
          setCurrentComponent.value = routeInfo.component(routeInfo.params);
        } else {
          setCurrentComponent.value = routeInfo.component;
        }
      }
    } catch (err) {
      console.error('JihoRouter: Route rendering error:', err);
      setRouterError.value = err;
      setCurrentComponent.value = error || {
        div: {
          style: { 
            textAlign: 'center', 
            padding: '2rem',
            color: '#ef4444'
          },
          children: [
            { h1: { text: '라우팅 에러', style: { color: '#ef4444' } } },
            { p: { text: err.message } }
          ]
        }
      };
    } finally {
      setIsLoading.value = false;
    }
  };

  // 라우터 구독
  router.subscribe(handleRouteChange);

  // 초기 컴포넌트 설정
  const initialRoute = router.getCurrentRoute();
  const matchResult = router.findMatchingRoute(initialRoute.path);
  handleRouteChange({
    path: initialRoute.path,
    params: initialRoute.params,
    component: matchResult?.component || null
  });

  // 전환 효과 스타일
  const getTransitionStyle = () => {
    const baseStyle = {
      width: '100%',
      minHeight: '100%'
    };

    if (transition === 'none') return baseStyle;

    return {
      ...baseStyle,
      animation: `jiho-route-${transition}-in 0.3s ease-out`
    };
  };

  return {
    div: {
      style: {
        ...getTransitionStyle(),
        ...style
      },
      'data-jiho-component': 'RouterOutlet',
      'data-router-transition': transition,
      children: [
        // 로딩 상태
        isLoading.value && loading ? [loading] : [],
        // 에러 상태
        routerError.value && error ? [error] : [],
        // 현재 컴포넌트
        !isLoading.value && !routerError.value && currentComponent.value ? [currentComponent.value] : []
      ].flat().filter(Boolean),
      ...rest.attributes
    }
  };
};

// 라우터 링크 컴포넌트
export const JihoLink = (props = {}) => {
  const {
    to = '/',                 // 네비게이션 경로
    replace = false,          // 히스토리 대체 여부
    active = 'active',        // 활성 상태 클래스
    children = [],            // 자식 요소들
    style = {},
    ...rest
  } = props;

  const router = useRouter();
  const currentPath = router.getCurrentRoute().path;
  const isActive = currentPath === to;

  const handleClick = (e) => {
    e.preventDefault();
    router.navigate(to, replace);
  };

  return {
    a: {
      href: router.options.mode === 'hash' ? `#${to}` : to,
      style: {
        textDecoration: 'none',
        color: isActive ? '#3b82f6' : '#374151',
        fontWeight: isActive ? '600' : '400',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        ...style
      },
      'data-jiho-component': 'Link',
      'data-link-active': isActive,
      'data-link-to': to,
      event: {
        onClick: handleClick
      },
      children: Array.isArray(children) ? children : [children],
      ...rest.attributes
    }
  };
};

export { JihoRouter }; 