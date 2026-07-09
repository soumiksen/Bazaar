import React from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonWidth = 'full' | 'auto';

interface ButtonOptions {
  variant?: ButtonVariant;
  width?: ButtonWidth;
}

const BASE =
  'py-2 flex items-center justify-center gap-3 rounded-full text-sm font-bold shadow-xs shadow-black/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100';

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-950 hover:bg-neutral-800 text-white',
  secondary: 'bg-white hover:bg-neutral-50 text-neutral-900',
};

const WIDTH: Record<ButtonWidth, string> = {
  full: 'w-full',
  auto: 'w-auto px-4',
};

export function buttonVariants({ variant = 'primary', width = 'auto' }: ButtonOptions = {}): string {
  return `${BASE} ${VARIANT[variant]} ${WIDTH[width]}`;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  width?: ButtonWidth;
}

const Button = ({ variant = 'primary', width = 'auto', className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`${buttonVariants({ variant, width })} cursor-pointer${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
