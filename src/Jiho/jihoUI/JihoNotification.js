/**
 * JihoNotification - 토스트 및 알림 시스템
 * 다양한 스타일과 위치를 지원하는 알림 시스템
 */

// 전역 알림 컨테이너 및 상태 관리
let notificationContainer = null;
let notifications = [];
let notificationId = 0;

// 알림 컨테이너 생성
const createNotificationContainer = (position = 'top-right') => {
  if (notificationContainer) return notificationContainer;

  const container = document.createElement('div');
  container.id = 'jiho-notifications';
  container.style.cssText = `
    position: fixed;
    z-index: 9999;
    pointer-events: none;
    ${getPositionStyles(position)}
  `;

  document.body.appendChild(container);
  notificationContainer = container;
  return container;
};

// 위치별 스타일
const getPositionStyles = (position) => {
  const styles = {
    'top-left': 'top: 1rem; left: 1rem;',
    'top-right': 'top: 1rem; right: 1rem;',
    'top-center': 'top: 1rem; left: 50%; transform: translateX(-50%);',
    'bottom-left': 'bottom: 1rem; left: 1rem;',
    'bottom-right': 'bottom: 1rem; right: 1rem;',
    'bottom-center': 'bottom: 1rem; left: 50%; transform: translateX(-50%);',
    'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);'
  };
  
  return styles[position] || styles['top-right'];
};

// 알림 타입별 아이콘과 색상
const getNotificationConfig = (type) => {
  const configs = {
    success: {
      icon: '✅',
      backgroundColor: '#10b981',
      borderColor: '#059669',
      textColor: '#ffffff'
    },
    error: {
      icon: '❌',
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
      textColor: '#ffffff'
    },
    warning: {
      icon: '⚠️',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      textColor: '#ffffff'
    },
    info: {
      icon: 'ℹ️',
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      textColor: '#ffffff'
    },
    default: {
      icon: '📢',
      backgroundColor: '#6b7280',
      borderColor: '#4b5563',
      textColor: '#ffffff'
    }
  };

  return configs[type] || configs.default;
};

// 개별 알림 생성
const createNotificationElement = (notification) => {
  const {
    id,
    title,
    message,
    type,
    duration,
    closable,
    actions,
    position,
    variant
  } = notification;

  const config = getNotificationConfig(type);
  
  const notificationEl = document.createElement('div');
  notificationEl.id = `jiho-notification-${id}`;
  notificationEl.style.cssText = `
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding: 1rem;
    border-radius: ${variant === 'rounded' ? '1rem' : '0.5rem'};
    background-color: ${config.backgroundColor};
    border: 2px solid ${config.borderColor};
    color: ${config.textColor};
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(8px);
    max-width: 400px;
    min-width: 300px;
    pointer-events: auto;
    cursor: ${closable ? 'pointer' : 'default'};
    animation: jiho-toast-slide-in 0.3s ease-out;
    transition: transform 0.2s ease, opacity 0.2s ease;
    transform-origin: ${position.includes('right') ? 'right' : 'left'} top;
  `;

  // 호버 효과
  notificationEl.addEventListener('mouseenter', () => {
    notificationEl.style.transform = 'scale(1.02)';
  });

  notificationEl.addEventListener('mouseleave', () => {
    notificationEl.style.transform = 'scale(1)';
  });

  // 알림 내용 구성
  const contentHTML = `
    <div style="display: flex; align-items: center; gap: 0.75rem; flex: 1;">
      <span style="font-size: 1.25rem; flex-shrink: 0;">${config.icon}</span>
      <div style="flex: 1; min-width: 0;">
        ${title ? `<div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 0.25rem;">${title}</div>` : ''}
        <div style="font-size: 0.85rem; opacity: 0.95; line-height: 1.4;">${message}</div>
        ${actions ? `<div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">${renderActions(actions)}</div>` : ''}
      </div>
      ${closable ? `
        <button 
          onclick="removeNotification(${id})" 
          style="
            background: none; 
            border: none; 
            color: inherit; 
            font-size: 1.2rem; 
            cursor: pointer; 
            opacity: 0.7; 
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: opacity 0.2s ease, background 0.2s ease;
          "
          onmouseover="this.style.opacity='1'; this.style.background='rgba(255,255,255,0.1)'"
          onmouseout="this.style.opacity='0.7'; this.style.background='none'"
        >✕</button>
      ` : ''}
    </div>
  `;

  notificationEl.innerHTML = contentHTML;

  // 클릭으로 닫기
  if (closable) {
    notificationEl.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        removeNotification(id);
      }
    });
  }

  return notificationEl;
};

// 액션 버튼 렌더링
const renderActions = (actions) => {
  return actions.map(action => `
    <button 
      onclick="${action.onClick ? `(${action.onClick.toString()})()` : ''}"
      style="
        padding: 0.375rem 0.75rem;
        border: 1px solid rgba(255,255,255,0.3);
        background: rgba(255,255,255,0.1);
        color: inherit;
        border-radius: 0.375rem;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
      "
      onmouseover="this.style.background='rgba(255,255,255,0.2)'"
      onmouseout="this.style.background='rgba(255,255,255,0.1)'"
    >${action.text}</button>
  `).join('');
};

// 알림 제거
const removeNotification = (id) => {
  const element = document.getElementById(`jiho-notification-${id}`);
  if (!element) return;

  // 페이드 아웃 애니메이션
  element.style.animation = 'jiho-toast-slide-out 0.3s ease-out';
  
  setTimeout(() => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
    
    // 배열에서 제거
    notifications = notifications.filter(n => n.id !== id);
    
    // 컨테이너가 비어있으면 제거
    if (notifications.length === 0 && notificationContainer) {
      notificationContainer.remove();
      notificationContainer = null;
    }
  }, 300);
};

// 전역 함수로 removeNotification 등록
if (typeof window !== 'undefined') {
  window.removeNotification = removeNotification;
}

// 메인 알림 함수
export const showNotification = (message, options = {}) => {
  const {
    title = null,
    type = 'default',          // success, error, warning, info, default
    duration = 5000,           // 자동 닫기 시간 (ms), 0이면 수동
    closable = true,           // 닫기 버튼 표시
    position = 'top-right',    // top-left, top-right, top-center, bottom-left, bottom-right, bottom-center, center
    variant = 'rounded',       // rounded, square
    actions = null,            // 액션 버튼들
    onClose = null,            // 닫기 콜백
    ...rest
  } = options;

  const id = ++notificationId;
  
  const notification = {
    id,
    title,
    message,
    type,
    duration,
    closable,
    actions,
    position,
    variant,
    onClose
  };

  notifications.push(notification);

  // 컨테이너 생성/업데이트
  const container = createNotificationContainer(position);
  container.style.cssText = container.style.cssText.replace(
    /top: .*?;|bottom: .*?;|left: .*?;|right: .*?;|transform: .*?;/g, 
    ''
  ) + getPositionStyles(position);

  // 알림 요소 생성 및 추가
  const notificationElement = createNotificationElement(notification);
  
  if (position.includes('bottom')) {
    container.insertBefore(notificationElement, container.firstChild);
  } else {
    container.appendChild(notificationElement);
  }

  // 자동 닫기
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
      if (onClose) onClose();
    }, duration);
  }

  return {
    id,
    close: () => removeNotification(id)
  };
};

// 편의 함수들
export const showToast = (message, type = 'default', duration = 3000) => {
  return showNotification(message, { 
    type, 
    duration,
    closable: false,
    position: 'top-right',
    variant: 'rounded'
  });
};

export const showAlert = (title, message, type = 'info') => {
  return showNotification(message, {
    title,
    type,
    duration: 0, // 수동 닫기
    closable: true,
    position: 'center',
    variant: 'square'
  });
};

export const showConfirm = (title, message, onConfirm, onCancel) => {
  return showNotification(message, {
    title,
    type: 'warning',
    duration: 0,
    closable: false,
    position: 'center',
    variant: 'square',
    actions: [
      {
        text: '취소',
        onClick: () => {
          if (onCancel) onCancel();
        }
      },
      {
        text: '확인',
        onClick: () => {
          if (onConfirm) onConfirm();
        }
      }
    ]
  });
};

// 모든 알림 닫기
export const clearAllNotifications = () => {
  notifications.forEach(notification => {
    removeNotification(notification.id);
  });
};

// 특정 타입의 알림들만 닫기
export const clearNotificationsByType = (type) => {
  notifications
    .filter(n => n.type === type)
    .forEach(notification => {
      removeNotification(notification.id);
    });
};

// JihoToast 컴포넌트 (선언적 사용)
export const JihoToast = (props = {}) => {
  const {
    show = false,
    message = '',
    type = 'default',
    duration = 3000,
    position = 'top-right',
    onClose = () => {},
    ...rest
  } = props;

  if (show) {
    const toast = showNotification(message, {
      type,
      duration,
      position,
      closable: false,
      onClose
    });

    // 컴포넌트가 언마운트되면 토스트도 제거
    return {
      div: {
        style: { display: 'none' },
        'data-jiho-component': 'Toast',
        'data-toast-id': toast.id
      }
    };
  }

  return null;
};

export default {
  showNotification,
  showToast,
  showAlert,
  showConfirm,
  clearAllNotifications,
  clearNotificationsByType
}; 