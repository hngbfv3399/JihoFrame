/**
 * JihoButton - Material Design 스타일의 버튼 컴포넌트
 */

const JihoButton = (props = {}) => {
  const {
    text = '',
    type = 'elevated', // elevated, outlined, text, icon
    color = 'primary', // primary, secondary, success, danger, warning
    size = 'medium', // small, medium, large
    disabled = false,
    fullWidth = false,
    startIcon = null,
    endIcon = null,
    onClick = () => {},
    ...rest
  } = props;

  // 색상 팔레트
  const colorPalette = {
    primary: { main: '#007bff', contrast: '#ffffff', hover: '#0056b3' },
    secondary: { main: '#6c757d', contrast: '#ffffff', hover: '#545b62' },
    success: { main: '#28a745', contrast: '#ffffff', hover: '#1e7e34' },
    danger: { main: '#dc3545', contrast: '#ffffff', hover: '#c82333' },
    warning: { main: '#ffc107', contrast: '#000000', hover: '#e0a800' }
  };

  // 크기별 스타일
  const sizeStyles = {
    small: { padding: '6px 12px', fontSize: '14px', height: '32px' },
    medium: { padding: '10px 20px', fontSize: '16px', height: '40px' },
    large: { padding: '14px 28px', fontSize: '18px', height: '48px' }
  };

  // 타입별 스타일
  const getTypeStyle = (type, colorConfig) => {
    const baseStyle = {
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      opacity: disabled ? 0.6 : 1,
      outline: 'none',
      textDecoration: 'none',
      ...sizeStyles[size]
    };

    switch (type) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: colorConfig.main,
          color: colorConfig.contrast,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': !disabled ? {
            backgroundColor: colorConfig.hover,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          } : {}
        };

      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: colorConfig.main,
          border: `2px solid ${colorConfig.main}`,
          '&:hover': !disabled ? {
            backgroundColor: `${colorConfig.main}10`,
            borderColor: colorConfig.hover
          } : {}
        };

      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: colorConfig.main,
          padding: sizeStyles[size].padding,
          '&:hover': !disabled ? {
            backgroundColor: `${colorConfig.main}10`
          } : {}
        };

      case 'icon':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: colorConfig.main,
          padding: '8px',
          borderRadius: '50%',
          width: sizeStyles[size].height,
          height: sizeStyles[size].height,
          minWidth: sizeStyles[size].height,
          '&:hover': !disabled ? {
            backgroundColor: `${colorConfig.main}10`
          } : {}
        };

      default:
        return baseStyle;
    }
  };

  const colorConfig = colorPalette[color] || colorPalette.primary;
  const buttonStyle = {
    ...getTypeStyle(type, colorConfig),
    width: fullWidth ? '100%' : 'auto',
    ...rest.style
  };

  // 아이콘 렌더링 헬퍼
  const renderIcon = (icon, position) => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return {
        span: {
          text: icon,
          style: {
            fontSize: size === 'small' ? '16px' : size === 'large' ? '24px' : '20px'
          }
        }
      };
    }
    return icon;
  };

  // 버튼 내용 구성
  const buttonContent = [];
  
  if (startIcon) {
    buttonContent.push(renderIcon(startIcon, 'start'));
  }
  
  if (text && type !== 'icon') {
    buttonContent.push({
      span: { text }
    });
  }
  
  if (endIcon) {
    buttonContent.push(renderIcon(endIcon, 'end'));
  }

  // 클릭 핸들러
  const handleClick = (event) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return {
    button: {
      type: 'button',
      disabled,
      style: buttonStyle,
      'data-jiho-component': 'Button',
      'data-button-type': type,
      'data-button-color': color,
      'data-button-size': size,
      event: {
        onClick: handleClick,
        onMouseEnter: (e) => {
          if (!disabled && rest.onMouseEnter) {
            rest.onMouseEnter(e);
          }
        },
        onMouseLeave: (e) => {
          if (!disabled && rest.onMouseLeave) {
            rest.onMouseLeave(e);
          }
        }
      },
      children: buttonContent,
      ...rest.attributes
    }
  };
};

export { JihoButton };
export default JihoButton; 