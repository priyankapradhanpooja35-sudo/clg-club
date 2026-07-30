'use client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'border-green-500/30 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200',
  error: 'border-red-500/30 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200',
  warning: 'border-amber-500/30 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200',
  info: 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200',
};

function Toast({ id, message, type, onRemove }: ToastProps) {
  const Icon = icons[type];
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm min-w-72', styles[type])}>
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => onRemove(id)} className="opacity-60 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Simple imperative toast API using a global event
export function toast(message: string, type: ToastType = 'info') {
  window.dispatchEvent(new CustomEvent('bec-toast', { detail: { message, type } }));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      setToasts((prev) => [...prev, { id: Date.now().toString(), message, type }]);
    };
    window.addEventListener('bec-toast', handler);
    return () => window.removeEventListener('bec-toast', handler);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
}
