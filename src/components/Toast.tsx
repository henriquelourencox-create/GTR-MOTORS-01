import React, { useEffect } from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      id="notification-toast"
      className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm bg-[#111111] border border-emerald-500/40 text-white p-3 rounded-sm shadow-2xl flex items-start gap-2.5"
    >
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
          Sucesso
        </h4>
        <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
        aria-label="Fechar notificação"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
