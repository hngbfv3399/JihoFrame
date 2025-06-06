/**
 * JihoCard - 현대적인 카드 컴포넌트
 * 이미지, 제목, 내용, 액션을 담을 수 있는 카드형 UI
 */

const JihoCard = (props = {}) => {
  const {
    image = null,           // 이미지 URL 또는 null
    title = null,           // 카드 제목
    subtitle = null,        // 부제목
    content = null,         // 카드 내용 (텍스트 또는 컴포넌트)
    actions = null,         // 하단 액션 버튼들
    variant = 'elevated',   // elevated, outlined, filled
    width = 'auto',         // 카드 너비
    height = 'auto',        // 카드 높이
    clickable = false,      // 카드 전체 클릭 가능 여부
    onClick = null,         // 카드 클릭 핸들러
    loading = false,        // 로딩 상태
    style = {},             // 커스텀 스타일
    ...rest
  } = props;

  // 카드 variant별 스타일
  const getCardStyle = () => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: clickable ? 'pointer' : 'default',
      width,
      height,
      position: 'relative',
      background: '#ffffff',
      ...style
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          border: 'none',
          '&:hover': clickable ? {
            boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 4px 6px rgba(0,0,0,0.10)',
            transform: 'translateY(-2px)'
          } : {}
        };

      case 'outlined':
        return {
          ...baseStyle,
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          '&:hover': clickable ? {
            borderColor: '#d1d5db',
            boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
          } : {}
        };

      case 'filled':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'none',
          '&:hover': clickable ? {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
          } : {}
        };

      default:
        return baseStyle;
    }
  };

  // 로딩 스켈레톤
  const renderSkeleton = () => ({
    div: {
      style: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      },
      children: [
        // 이미지 스켈레톤
        image && {
          div: {
            style: {
              width: '100%',
              height: '200px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-loading 1.5s infinite',
              borderRadius: '8px'
            }
          }
        },
        // 제목 스켈레톤
        {
          div: {
            style: {
              width: '70%',
              height: '20px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-loading 1.5s infinite',
              borderRadius: '4px'
            }
          }
        },
        // 내용 스켈레톤
        {
          div: {
            style: {
              width: '100%',
              height: '16px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'skeleton-loading 1.5s infinite',
              borderRadius: '4px'
            }
          }
        }
      ].filter(Boolean)
    }
  });

  // 카드 내용 렌더링
  const renderContent = () => {
    if (loading) return renderSkeleton();

    const cardContent = [];

    // 이미지 영역
    if (image) {
      cardContent.push({
        div: {
          style: {
            width: '100%',
            height: '200px',
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          },
          children: [
            // 이미지 오버레이 (옵션)
            variant === 'filled' && {
              div: {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%)'
                }
              }
            }
          ].filter(Boolean)
        }
      });
    }

    // 텍스트 컨텐츠 영역
    const hasTextContent = title || subtitle || content;
    if (hasTextContent) {
      cardContent.push({
        div: {
          style: {
            padding: '1.25rem',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          },
          children: [
            // 제목
            title && {
              h3: {
                text: title,
                style: {
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: variant === 'filled' ? '#ffffff' : '#1f2937',
                  lineHeight: '1.4'
                }
              }
            },
            // 부제목
            subtitle && {
              p: {
                text: subtitle,
                style: {
                  margin: 0,
                  fontSize: '0.875rem',
                  color: variant === 'filled' ? 'rgba(255,255,255,0.8)' : '#6b7280',
                  lineHeight: '1.4'
                }
              }
            },
            // 내용
            content && (
              typeof content === 'string' ? {
                p: {
                  text: content,
                  style: {
                    margin: 0,
                    fontSize: '0.9rem',
                    color: variant === 'filled' ? 'rgba(255,255,255,0.9)' : '#374151',
                    lineHeight: '1.6'
                  }
                }
              } : content
            )
          ].filter(Boolean)
        }
      });
    }

    // 액션 영역
    if (actions) {
      cardContent.push({
        div: {
          style: {
            padding: hasTextContent ? '0 1.25rem 1.25rem 1.25rem' : '1.25rem',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderTop: variant !== 'filled' && hasTextContent ? '1px solid #f3f4f6' : 'none',
            paddingTop: variant !== 'filled' && hasTextContent ? '1rem' : (hasTextContent ? '0' : '1.25rem')
          },
          children: Array.isArray(actions) ? actions : [actions]
        }
      });
    }

    return cardContent;
  };

  return {
    div: {
      style: getCardStyle(),
      'data-jiho-component': 'Card',
      'data-card-variant': variant,
      'data-card-clickable': clickable,
      event: clickable && onClick ? {
        onClick: (e) => {
          e.preventDefault();
          onClick(e);
        },
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        }
      } : {},
      tabIndex: clickable ? 0 : undefined,
      role: clickable ? 'button' : undefined,
      children: renderContent(),
      ...rest.attributes
    }
  };
};

export { JihoCard }; 