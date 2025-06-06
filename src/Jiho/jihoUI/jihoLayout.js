/**
 * JihoFrame 레이아웃 시스템 - 웹 친화적이고 직관적인 접근
 */

// 🏗️ JihoHeader - 상단 헤더 (AppBar보다 더 유연함)
const JihoHeader = (props = {}) => {
  const {
    left = null,        // 왼쪽 영역 (로고, 메뉴 등)
    center = null,      // 중앙 영역 (제목, 검색바 등)  
    right = null,       // 오른쪽 영역 (버튼들, 프로필 등)
    sticky = true,      // 스크롤시 고정 여부
    blur = false,       // 배경 블러 효과
    transparent = false, // 투명 배경
    height = 60,
    style = {},
    ...rest
  } = props;

  const headerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr', // 좌:중앙:우 = 1:2:1 비율
    alignItems: 'center',
    height: `${height}px`,
    padding: '0 1rem',
    background: transparent ? 'transparent' : 
                blur ? 'rgba(255,255,255,0.8)' : '#ffffff',
    backdropFilter: blur ? 'blur(10px)' : 'none',
    borderBottom: transparent ? 'none' : '1px solid #e0e0e0',
    position: sticky ? 'sticky' : 'relative',
    top: sticky ? 0 : 'auto',
    zIndex: 100,
    transition: 'all 0.3s ease',
    ...style
  };

  return {
    div: {
      style: headerStyle,
      'data-jiho-layout': 'header',
      children: [
        // 왼쪽 영역
        {
          div: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start' },
            children: left ? (Array.isArray(left) ? left : [left]) : []
          }
        },
        // 중앙 영역  
        {
          div: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
            children: center ? (Array.isArray(center) ? center : [center]) : []
          }
        },
        // 오른쪽 영역
        {
          div: {
            style: { display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' },
            children: right ? (Array.isArray(right) ? right : [right]) : []
          }
        }
      ]
    }
  };
};

// 🎯 JihoNav - 네비게이션 (더 웹스러운 접근)
const JihoNav = (props = {}) => {
  const {
    items = [],
    direction = 'horizontal', // horizontal, vertical
    position = 'bottom',      // top, bottom, left, right
    style = 'pills',          // pills, tabs, breadcrumb, dots
    activeIndex = 0,
    onChange = () => {},
    ...rest
  } = props;

  const getNavStyle = () => {
    const base = {
      display: 'flex',
      gap: '0.5rem',
      padding: '0.75rem',
      background: '#ffffff',
      borderRadius: style === 'pills' ? '2rem' : '0.5rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    if (direction === 'vertical') {
      base.flexDirection = 'column';
    }

    if (position === 'bottom') {
      base.position = 'fixed';
      base.bottom = '1rem';
      base.left = '50%';
      base.transform = 'translateX(-50%)';
    }

    return base;
  };

  const getItemStyle = (index, isActive) => {
    const base = {
      padding: '0.5rem 1rem',
      borderRadius: style === 'pills' ? '1.5rem' : '0.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.9rem',
      fontWeight: isActive ? '600' : '400',
      textDecoration: 'none'
    };

    if (isActive) {
      base.background = '#007bff';
      base.color = '#ffffff';
    } else {
      base.background = 'transparent';
      base.color = '#666';
    }

    return base;
  };

  return {
    nav: {
      style: getNavStyle(),
      'data-jiho-layout': 'nav',
      'data-nav-style': style,
      children: items.map((item, index) => ({
        div: {
          style: getItemStyle(index, index === activeIndex),
          event: {
            onClick: () => onChange(index, item)
          },
          children: [
            item.icon && {
              span: { 
                text: item.icon,
                style: { fontSize: '1.2rem' }
              }
            },
            item.label && {
              span: { text: item.label }
            }
          ].filter(Boolean)
        }
      }))
    }
  };
};

// 🎪 JihoSection - 섹션 기반 레이아웃 (더 시맨틱함)
const JihoSection = (props = {}) => {
  const {
    title = null,
    subtitle = null,
    actions = null,
    children = [],
    padding = 'normal', // none, tight, normal, loose
    background = 'default', // default, card, gradient, image
    ...rest
  } = props;

  const paddingValues = {
    none: '0',
    tight: '1rem',
    normal: '1.5rem',
    loose: '2.5rem'
  };

  const backgroundStyles = {
    default: { background: 'transparent' },
    card: { 
      background: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f0f0f0'
    },
    gradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff'
    }
  };

  return {
    section: {
      style: {
        padding: paddingValues[padding],
        marginBottom: '1rem',
        ...backgroundStyles[background],
        ...rest.style
      },
      'data-jiho-layout': 'section',
      children: [
        // 헤더 영역 (제목 + 액션)
        (title || subtitle || actions) && {
          div: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            },
            children: [
              // 제목 영역
              (title || subtitle) && {
                div: {
                  children: [
                    title && {
                      h2: {
                        text: title,
                        style: {
                          margin: 0,
                          fontSize: '1.5rem',
                          fontWeight: '600',
                          color: 'inherit'
                        }
                      }
                    },
                    subtitle && {
                      p: {
                        text: subtitle,
                        style: {
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.9rem',
                          opacity: 0.7,
                          color: 'inherit'
                        }
                      }
                    }
                  ].filter(Boolean)
                }
              },
              // 액션 영역
              actions && {
                div: {
                  style: {
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  },
                  children: Array.isArray(actions) ? actions : [actions]
                }
              }
            ].filter(Boolean)
          }
        },
        // 컨텐츠 영역
        ...children
      ].filter(Boolean)
    }
  };
};

// 🔥 JihoGrid - 반응형 그리드 (CSS Grid 기반)
const JihoGrid = (props = {}) => {
  const {
    cols = 'auto',        // 1, 2, 3, 4, 'auto', 'fit'
    gap = '1rem',
    minItemWidth = '250px', // cols가 'auto'일 때 최소 너비
    children = [],
    responsive = true,
    ...rest
  } = props;

  const getGridCols = () => {
    if (cols === 'auto') {
      return `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    }
    if (cols === 'fit') {
      return `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`;
    }
    if (responsive) {
      // 반응형 기본값
      return `repeat(auto-fit, minmax(max(${minItemWidth}, ${100/cols}%), 1fr))`;
    }
    return `repeat(${cols}, 1fr)`;
  };

  return {
    div: {
      style: {
        display: 'grid',
        gridTemplateColumns: getGridCols(),
        gap,
        width: '100%',
        ...rest.style
      },
      'data-jiho-layout': 'grid',
      'data-grid-cols': cols,
      children
    }
  };
};

export { JihoHeader, JihoNav, JihoSection, JihoGrid }; 