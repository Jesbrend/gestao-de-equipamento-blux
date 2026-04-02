import { useState, useEffect, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toastStyles = {
  success: {
    border: 'border-emerald-500/30',
    icon: (
      <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    border: 'border-red-500/30',
    icon: (
      <svg className="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  info: {
    border: 'border-cyan-500/30',
    icon: (
      <svg className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    border: 'border-amber-500/30',
    icon: (
      <svg className="h-4 w-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

type ToastHandler = (toast: Toast) => void;
let listeners: ToastHandler[] = [];

export const toast = {
  success: (message: string) => emit({ id: Date.now().toString(), message, type: 'success' }),
  error: (message: string) => emit({ id: Date.now().toString(), message, type: 'error' }),
  info: (message: string) => emit({ id: Date.now().toString(), message, type: 'info' }),
  warning: (message: string) => emit({ id: Date.now().toString(), message, type: 'warning' }),
};

function emit(t: Toast) {
  listeners.forEach((l) => l(t));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler: ToastHandler = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => removeToast(t.id), 4000);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, [removeToast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl bg-[#0d1421] border ${toastStyles[t.type].border} p-4 shadow-2xl shadow-black/40`}
        >
          <div className="flex-shrink-0 mt-0.5">{toastStyles[t.type].icon}</div>
          <p className="flex-1 text-sm text-slate-200">{t.message}</p>
          <button
            onClick={() => removeToast(t.id)}
            className="flex-shrink-0 rounded p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
