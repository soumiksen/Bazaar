import { ReactNode } from 'react';
import { GLASS_STYLES } from '@/app/constants';

interface AuthCardProps {
  badge?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthCard({ badge, title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      <div className={`w-full max-w-md p-6 sm:p-8 space-y-6 ${GLASS_STYLES.container}`}>

        <div className="space-y-1 text-center">
          {badge && (
            <span className="inline-block rounded-full bg-neutral-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              {badge}
            </span>
          )}
          <h1 className={`text-2xl font-black tracking-tight text-neutral-900 ${badge ? 'pt-2' : ''}`}>
            {title}
          </h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            {subtitle}
          </p>
        </div>

        {children}

        <hr className="border-white/20" />

        <div className="space-y-3 text-center">
          {footer}
        </div>

      </div>
    </div>
  );
}
