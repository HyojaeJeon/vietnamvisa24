"use client";

import { useEffect, useRef, useState } from "react";

// 포커스 트랩 컴포넌트 (모달, 드롭다운 등에 사용)
export const FocusTrap = ({ children, isActive = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    // 첫 번째 요소에 포커스
    firstElement?.focus();

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isActive]);

  return <div ref={containerRef}>{children}</div>;
};

// 스크린 리더용 라이브 리전
export const LiveRegion = ({ children, politeness = "polite", atomic = false, className = "sr-only" }) => {
  return (
    <div aria-live={politeness} aria-atomic={atomic} className={className}>
      {children}
    </div>
  );
};

// 스킵 링크 컴포넌트
export const SkipLink = ({ href = "#main-content", children = "본문으로 바로가기" }) => {
  return (
    <a href={href} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:no-underline">
      {children}
    </a>
  );
};

// 접근 가능한 버튼 컴포넌트
export const AccessibleButton = ({ children, onClick, ariaLabel, ariaDescribedBy, disabled = false, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button onClick={onClick} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// 접근 가능한 모달 컴포넌트
export const AccessibleModal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const [modalId] = useState(`modal-${Math.random().toString(36).substr(2, 9)}`);
  const [titleId] = useState(`modal-title-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={titleId} aria-describedby={modalId} role="dialog" aria-modal="true">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} aria-hidden="true" />

      {/* 모달 컨테이너 */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <FocusTrap isActive={isOpen}>
          <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full`}>
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" aria-label="모달 닫기">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 내용 */}
            <div id={modalId} className="p-6">
              {children}
            </div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
};

// 접근 가능한 툴팁 컴포넌트
export const AccessibleTooltip = ({ children, content, position = "top", delay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipId] = useState(`tooltip-${Math.random().toString(36).substr(2, 9)}`);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} onFocus={showTooltip} onBlur={hideTooltip}>
      <div aria-describedby={isVisible ? tooltipId : undefined}>{children}</div>

      {isVisible && (
        <div id={tooltipId} role="tooltip" className={`absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded shadow-lg ${positionClasses[position]}`}>
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

// 키보드 네비게이션 향상된 메뉴
export const AccessibleMenu = ({ trigger, items, isOpen, onToggle, onClose }) => {
  const menuRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('[role="menuitem"]');

      const handleKeyDown = (e) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setFocusedIndex((prev) => (prev + 1) % menuItems.length);
            break;
          case "ArrowUp":
            e.preventDefault();
            setFocusedIndex((prev) => (prev <= 0 ? menuItems.length - 1 : prev - 1));
            break;
          case "Escape":
            e.preventDefault();
            onClose();
            break;
          case "Home":
            e.preventDefault();
            setFocusedIndex(0);
            break;
          case "End":
            e.preventDefault();
            setFocusedIndex(menuItems.length - 1);
            break;
        }
      };

      menuRef.current.addEventListener("keydown", handleKeyDown);
      return () => {
        if (menuRef.current) {
          menuRef.current.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('[role="menuitem"]');
      if (menuItems[focusedIndex]) {
        menuItems[focusedIndex].focus();
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div className="relative">
      <button onClick={onToggle} aria-expanded={isOpen} aria-haspopup="true" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
        {trigger}
      </button>

      {isOpen && (
        <div ref={menuRef} role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items.map((item, index) => (
              <button
                key={index}
                role="menuitem"
                onClick={() => {
                  item.onClick();
                  onClose();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
