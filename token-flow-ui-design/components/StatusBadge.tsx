import { TicketStatus, TicketPriority } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: TicketStatus | TicketPriority;
    type?: 'status' | 'priority';
    className?: string;
}

export function StatusBadge({ status, type = 'status', className }: StatusBadgeProps) {
    const isPriority = type === 'priority';

    const getColors = (stat: string) => {
        switch (stat) {
            // Statuses
            case 'Open': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            case 'In Progress': return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
            case 'Waiting for User': return 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
            case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            case 'Closed': return 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700';

            // Priorities
            case 'Low': return 'text-zinc-500 bg-zinc-50 border-zinc-100';
            case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'High': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'Critical': return 'text-red-600 bg-red-50 border-red-100';

            default: return 'bg-zinc-100 text-zinc-800';
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 text-xs font-medium border uppercase tracking-wider",
            getColors(status),
            className
        )}>
            {status}
        </span>
    );
}
