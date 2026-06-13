import React from 'react'

const Button = ({ 
  variant = 'primary', 
  width = 'auto', 
  children 
}: { 
  variant?: 'primary' | 'secondary', 
  width?: 'full' | 'auto', 
  children: React.ReactNode 
}) => {
  return (
    <button 
      className={`
        ${width === 'full' ? 'w-full' : 'w-auto px-4'} 
        py-2 cursor-pointer flex items-center justify-center gap-3 rounded-full text-sm font-bold shadow-xs shadow-black/10 transition-all duration-300 hover:scale-[1.02] active:scale-95
        ${variant === 'primary' 
          ? 'bg-neutral-950 hover:bg-neutral-800 text-white' 
          : 'bg-white hover:bg-neutral-50 text-neutral-900'
        }
      `}
    >
      {children}
    </button>
  )
}

export default Button