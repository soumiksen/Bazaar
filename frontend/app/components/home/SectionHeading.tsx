import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  children?: React.ReactNode;
}

export default function SectionHeading({ eyebrow, title, href, linkLabel = 'See all', children }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 px-1">
      <div>
        {eyebrow && <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{eyebrow}</p>}
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 md:text-2xl">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        {children}
        {href && (
          <Link
            href={href}
            className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
          >
            {linkLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}
