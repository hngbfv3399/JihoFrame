/**
 * JihoAppBar - Flutter AppBar 스타일의 상단 네비게이션 바
 */

export const JihoAppBar = (props = {}) => {
  const {
    title = '',
    leading = null,
    actions = [],
    backgroundColor = '#007bff',
    elevation = 4,
    centerTitle = true,
    height = 56,
    textColor = '#ffffff',
    ...rest
  } = props;

  // 기본 스타일
  const appBarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${height}px`,
    backgroundColor,
    color: textColor,
    padding: '0 16px',
    boxShadow: elevation > 0 ? `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.1)` : 'none',
    position: 'relative',
    zIndex: 1000,
    ...rest.style
  };

  // Leading (왼쪽) 영역
  const leadingElement = leading ? leading : {
    div: {
      style: { width: '48px', height: '48px' } // 공간 확보
    }
  };

  // Title 영역
  const titleElement = {
    div: {
      style: {
        flex: 1,
        textAlign: centerTitle ? 'center' : 'left',
        fontSize: '20px',
        fontWeight: '500',
        marginLeft: !centerTitle && !leading ? '0' : '16px',
        marginRight: !centerTitle && actions.length === 0 ? '0' : '16px'
      },
      children: [
        typeof title === 'string' ? {
          span: { text: title }
        } : title
      ]
    }
  };

  // Actions (오른쪽) 영역
  const actionsElement = {
    div: {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      children: actions.map((action, index) => {
        if (action.JihoIconButton) {
          return {
            JihoIconButton: {
              ...action.JihoIconButton,
              color: textColor,
              size: 24
            }
          };
        }
        return action;
      })
    }
  };

  return {
    header: {
      style: appBarStyle,
      'data-jiho-component': 'AppBar',
      children: [
        leadingElement,
        titleElement,
        actionsElement
      ]
    }
  };
};

export default JihoAppBar; 