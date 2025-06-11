'use client'

import { useToast } from '../../app/src/hooks/useToast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg p-4 shadow-lg ${
            toast.variant === 'destructive' 
              ? 'bg-red-500 text-white' 
              : 'bg-white border'
          }`}
        >
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          {toast.description && <div className="text-sm">{toast.description}</div>}
        </div>
      ))}
    </div>
  )
}