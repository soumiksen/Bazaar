'use client';

import Link from 'next/link';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToastStore } from '@/app/store/toastStore';

const ICONS = {
  success: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />,
  error: <XCircle className="h-4 w-4 shrink-0 text-red-400" />,
  info: <Info className="h-4 w-4 shrink-0 text-sky-400" />,
};

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-neutral-950 px-4 py-3 text-sm text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {ICONS[toast.kind]}
          <span className="min-w-0 flex-1 truncate">{toast.message}</span>
          {toast.actionHref && toast.actionLabel && (
            <Link
              href={toast.actionHref}
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-xs font-bold uppercase tracking-wider text-white/80 underline-offset-2 hover:text-white hover:underline"
            >
              {toast.actionLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss notification"
            className="shrink-0 cursor-pointer text-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
