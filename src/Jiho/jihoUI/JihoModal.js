/**
 * JihoModal - 모던 모달 다이얼로그
 * 다양한 크기와 스타일을 지원하는 오버레이 모달
 */

const JihoModal = (props = {}) => {
  const {
    open = false,             // 모달 열림 상태
    title = null,             // 모달 제목
    content = null,           // 모달 내용
    actions = null,           // 하단 액션 버튼들
    size = 'medium',          // small, medium, large, fullscreen
    variant = 'default',      // default, danger, success, info
    closable = true,          // 닫기 버튼 표시 여부
    backdrop = true,          // 배경 클릭시 닫기
    keyboard = true,          // ESC 키로 닫기
    animation = 'fade',       // fade, slide, zoom, flip
    onClose = () => {},       // 닫기 콜백
    style = {},               // 커스텀 스타일
    ...rest
  } = props;

  if (!open) return null;

  // 모달 크기별 스타일
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: '400px',
          maxWidth: '90vw',
          maxHeight: '60vh'
        };
      case 'medium':
        return {
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '70vh'
        };
      case 'large':
        return {
          width: '800px',
          maxWidth: '95vw',
          maxHeight: '80vh'
        };
      case 'fullscreen':
        return {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: '0'
        };
      default:
        return getSizeStyle.medium;
    }
  };

  // variant별 색상 테마
  const getVariantStyle = () => {
    const base = {
      background: '#ffffff',
      borderTop: '4px solid'
    };

    switch (variant) {
      case 'danger':
        return {
          ...base,
          borderTopColor: '#ef4444'
        };
      case 'success':
        return {
          ...base,
          borderTopColor: '#10b981'
        };
      case 'info':
        return {
          ...base,
          borderTopColor: '#3b82f6'
        };
      case 'warning':
        return {
          ...base,
          borderTopColor: '#f59e0b'
        };
      default:
        return {
          ...base,
          borderTopColor: '#6366f1'
        };
    }
  };

  // 애니메이션별 스타일
  const getAnimationStyle = () => {
    const baseAnimation = {
      animationDuration: '0.3s',
      animationFillMode: 'both',
      animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };

    switch (animation) {
      case 'slide':
        return {
          ...baseAnimation,
          animationName: 'jiho-modal-slide-in'
        };
      case 'zoom':
        return {
          ...baseAnimation,
          animationName: 'jiho-modal-zoom-in'
        };
      case 'flip':
        return {
          ...baseAnimation,
          animationName: 'jiho-modal-flip-in'
        };
      default: // fade
        return {
          ...baseAnimation,
          animationName: 'jiho-modal-fade-in'
        };
    }
  };

  // 모달 스타일
  const modalStyle = {
    position: 'relative',
    borderRadius: size === 'fullscreen' ? '0' : '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    ...getSizeStyle(),
    ...getVariantStyle(),
    ...getAnimationStyle(),
    ...style
  };

  // 배경 오버레이 스타일
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: size === 'fullscreen' ? 'stretch' : 'center',
    justifyContent: size === 'fullscreen' ? 'stretch' : 'center',
    padding: size === 'fullscreen' ? '0' : '1rem',
    zIndex: 1000,
    animation: 'jiho-overlay-fade-in 0.3s ease-out'
  };

  // 닫기 핸들러
  const handleClose = (e) => {
    e.preventDefault();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (backdrop && e.target === e.currentTarget) {
      handleClose(e);
    }
  };

  const handleKeyDown = (e) => {
    if (keyboard && e.key === 'Escape') {
      handleClose(e);
    }
  };

  // 모달 내용 렌더링
  const renderContent = () => {
    const modalContent = [];

    // 헤더 (제목 + 닫기 버튼)
    if (title || closable) {
      modalContent.push({
        div: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 1.5rem 0 1.5rem',
            minHeight: '60px'
          },
          children: [
            // 제목
            title && {
              h2: {
                text: title,
                style: {
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }
              }
            },
            // 닫기 버튼
            closable && {
              button: {
                text: '✕',
                style: {
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#374151'
                  }
                },
                event: {
                  onClick: handleClose
                }
              }
            }
          ].filter(Boolean)
        }
      });
    }

    // 컨텐츠 영역
    if (content) {
      modalContent.push({
        div: {
          style: {
            flex: 1,
            padding: title ? '1rem 1.5rem' : '1.5rem',
            overflow: 'auto',
            color: '#374151',
            lineHeight: '1.6'
          },
          children: typeof content === 'string' ? [
            {
              p: {
                text: content,
                style: { margin: 0 }
              }
            }
          ] : (Array.isArray(content) ? content : [content])
        }
      });
    }

    // 액션 영역
    if (actions) {
      modalContent.push({
        div: {
          style: {
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            padding: '1rem 1.5rem 1.5rem 1.5rem',
            borderTop: '1px solid #f3f4f6',
            backgroundColor: '#f9fafb'
          },
          children: Array.isArray(actions) ? actions : [actions]
        }
      });
    }

    return modalContent;
  };

  return {
    div: {
      style: overlayStyle,
      'data-jiho-component': 'Modal',
      'data-modal-size': size,
      'data-modal-variant': variant,
      event: {
        onClick: handleBackdropClick,
        onKeyDown: handleKeyDown
      },
      tabIndex: -1,
      children: [
        {
          div: {
            style: modalStyle,
            event: {
              onClick: (e) => e.stopPropagation() // 모달 내부 클릭 시 이벤트 버블링 방지
            },
            children: renderContent(),
            ...rest.attributes
          }
        }
      ]
    }
  };
};

export { JihoModal }; 