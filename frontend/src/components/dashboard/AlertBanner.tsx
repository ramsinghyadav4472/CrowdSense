import { AlertTriangle, MapPin, ArrowRight } from 'lucide-react';

interface AlertBannerProps {
    type: 'normal' | 'medium' | 'heavy';
    message?: string;
    suggestion?: string;
}

const AlertBanner = ({ type, message, suggestion }: AlertBannerProps) => {
    if (type === 'normal') return null;

    const styles = {
        medium: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
        heavy: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
    };

    const iconStyles = {
        medium: 'text-yellow-600 dark:text-yellow-400',
        heavy: 'text-red-600 dark:text-red-400 animate-pulse',
    };

    return (
        <div className={`rounded-2xl p-4 border ${styles[type]} shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between transition-all duration-300`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm ${iconStyles[type]}`}>
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-lg">
                        {type === 'heavy' ? 'Heavy Crowd Detected!' : 'Moderate Crowd Density'}
                    </h4>
                    <p className="text-sm opacity-90">
                        {message || 'You are entering a high-density zone. Please maintain awareness.'}
                    </p>
                </div>
            </div>

            {suggestion && (
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                    <MapPin size={16} />
                    <span>{suggestion}</span>
                    <ArrowRight size={16} />
                </button>
            )}
        </div>
    );
};

export default AlertBanner;
