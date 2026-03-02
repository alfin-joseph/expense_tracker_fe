import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

interface StatsOverviewProps {
  stats: StatItem[];
  columns?: number;
}

export function StatsOverview({ stats, columns = 4 }: StatsOverviewProps) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={cn('grid gap-4', gridClass)}>
      {stats.map((stat, index) => (
        <Card key={index} className="p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</h3>
          {stat.change && (
            <p
              className={cn(
                'text-xs font-medium mt-2',
                stat.trend === 'up' && 'text-green-600 dark:text-green-400',
                stat.trend === 'down' && 'text-red-600 dark:text-red-400',
                stat.trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {stat.change}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
