"use client";

import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = React.useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now();
    const newToast = {
      id,
      title,
      description,
      variant,
    };

    setToasts((prev) => [...prev, newToast]);

    // 3초 후 자동 제거
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = React.useMemo(() => ({
    toast,
    toasts,
    removeToast
  }), [toast, toasts, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    // 컨텍스트가 없을 때는 빈 함수 반환
    return {
      toast: () => {},
      toasts: [],
      removeToast: () => {}
    };
  }
  return context;
}