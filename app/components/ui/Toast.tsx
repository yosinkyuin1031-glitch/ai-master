"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastProps = {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
};

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "i",
};

const STYLES: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: ToastMessage;
  onRemove: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // フェードイン
    const showTimer = setTimeout(() => setVisible(true), 10);
    // 3秒後にフェードアウト
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onRemove, 300);
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onRemove]);

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
        transition-all duration-300
        ${STYLES[toast.type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs font-bold">
        {ICONS[toast.type]}
      </span>
      <span>{toast.message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onRemove, 300);
        }}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="通知を閉じる"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}

// Toastを管理するカスタムフック
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
