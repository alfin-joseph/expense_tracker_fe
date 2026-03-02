import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'accent';
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  variant = 'primary',
}: StatCardProps) {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    secondary: 'bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20',
    accent: 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border p-6 backdrop-blur-sm transition-all duration-200 hover:shadow-lg',
        variantClasses[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {change && (
            <p
              className={cn(
                'text-xs font-medium mt-2',
                change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl',
          variant === 'primary' && 'bg-primary/20 text-primary',
          variant === 'secondary' && 'bg-secondary/20 text-secondary',
          variant === 'accent' && 'bg-accent/20 text-accent'
        )}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
