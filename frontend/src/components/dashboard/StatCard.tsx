import type { LucideIcon } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Inline utility to avoid import issues
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: StatCardProps) => {

    const colorStyles: Record<string, string> = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 group-hover:bg-green-600 group-hover:text-white',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 group-hover:bg-red-600 group-hover:text-white',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white',
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl transition-colors duration-300", colorStyles[color])}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
                    <span className={trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {trend}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">vs last hour</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
