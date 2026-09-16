import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-[90vw] sm:max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold backdrop-blur-xl border transition-all animate-bounce-short ${
              isSuccess
                ? 'bg-slate-900/95 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10'
                : isError
                ? 'bg-slate-900/95 text-rose-300 border-rose-500/40 shadow-rose-500/10'
                : 'bg-slate-900/95 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
