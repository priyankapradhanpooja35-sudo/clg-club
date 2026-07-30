import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none select-none';

    const variants = {
      primary: 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98] shadow-lg shadow-violet-600/30',
      secondary:
        'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)] border border-[var(--border)] active:scale-[0.98]',
      ghost: 'text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950 active:scale-[0.98]',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/30',
      gradient:
        'bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white hover:brightness-110 active:scale-[0.98] shadow-lg shadow-violet-500/40',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
