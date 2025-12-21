
import { TrendingUp, TrendingDown, Minus, Clock, Wind, Users, Zap, AlertTriangle } from 'lucide-react';

interface SmartInsightsProps {
    crowdDensity: 'Low' | 'Medium' | 'Heavy';
    trend: 'rising' | 'falling' | 'stable';
    trendDelta: number;
    waitTime: number | null;
    isPassiveMode: boolean;
}

export default function SmartInsightsWidget({
    crowdDensity,
    trend,
    trendDelta,
    waitTime,
    isPassiveMode
}: SmartInsightsProps) {

    // Helper Styles
    const cardClass = "bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-[100px] relative overflow-hidden group hover:shadow-md transition-all";
    const headerClass = "text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1";
    const valueClass = "text-xl font-black text-gray-900 dark:text-white truncate";
    const subtextClass = "text-[10px] font-medium text-gray-500 mt-1 line-clamp-2";

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem' }} className="w-full">

            {/* 1. Crowd Stability Score */}
            <div className={cardClass}>
                <div className={headerClass}><Zap size={10} /> Stability</div>
                <div className="flex items-end gap-2 min-w-0">
                    <span className={valueClass}>
                        {trend === 'stable' ? '98%' : trend === 'rising' ? '45%' : '82%'}
                    </span>
                    <span className={`text-[10px] font-bold mb-1 ${trend === 'rising' ? 'text-red-500' : 'text-green-500'} shrink-0`}>
                        {trend === 'rising' ? 'Volatile' : 'Stable'}
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1 mt-auto">
                    <div
                        className={`h-1 rounded-full transition-all duration-1000 ${trend === 'rising' ? 'bg-red-500 w-[45%]' : 'bg-green-500 w-[98%]'}`}
                    />
                </div>
            </div>

            {/* 2. Crowd Flow Trend */}
            <div className={cardClass}>
                <div className={headerClass}><Wind size={10} /> Flow</div>
                <div className="flex items-center gap-2 mt-1 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${trend === 'rising' ? 'bg-red-50 text-red-500' :
                        trend === 'falling' ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-500'
                        }`}>
                        {trend === 'rising' ? <TrendingUp size={16} /> :
                            trend === 'falling' ? <TrendingDown size={16} /> : <Minus size={16} />}
                    </div>
                    <div>
                        <div className="text-xs font-bold truncate">
                            {trendDelta > 0 ? '+' : ''}{trendDelta} /min
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">Net Inflow</div>
                    </div>
                </div>
            </div>

            {/* 3. Est. Clear Time */}
            <div className={`${cardClass} ${crowdDensity === 'Heavy' ? 'ring-1 ring-orange-200 bg-orange-50/10' : ''}`}>
                <div className={headerClass}><Clock size={10} /> Wait Time</div>
                {waitTime ? (
                    <>
                        <div className="text-xl font-black text-orange-600 truncate">{waitTime} min</div>
                        <p className={subtextClass}>Estimated queue clear time</p>
                    </>
                ) : (
                    <>
                        <div className="text-xl font-black text-green-600 truncate">0 min</div>
                        <p className={subtextClass}>No delays expected</p>
                    </>
                )}
            </div>

            {/* 4. Zone Profile */}
            <div className={cardClass}>
                <div className={headerClass}><Users size={10} /> Profile</div>
                <div className="text-xs font-bold text-indigo-600 truncate">
                    {new Date().getHours() > 18 ? 'Nightlife' : new Date().getHours() > 12 ? 'Shoppers' : 'Commuters'}
                </div>
                <p className={subtextClass}>
                    Dominant crowd type suitable for {new Date().getHours() > 18 ? 'Leisure' : 'Transit'}
                </p>
            </div>

            {/* 5. User Impact */}
            <div className={cardClass}>
                <div className={headerClass}><AlertTriangle size={10} /> Impact</div>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                    {isPassiveMode ? 'Ghost Mode' : 'Contributing'}
                </div>
                <p className={subtextClass}>
                    {isPassiveMode ? 'Not affecting data' : 'You are part of the crowd'}
                </p>
            </div>

            {/* 6. Passive Toggle Mini (Mobile optimization) */}
            {/* Note: Main toggle is in header, this is context */}
        </div>
    );
};


