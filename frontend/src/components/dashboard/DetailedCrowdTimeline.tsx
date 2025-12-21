
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailedCrowdTimelineProps {
    data: { time: string; count: number; density: string }[];
    height?: number;
}

export default function DetailedCrowdTimeline({ data, height = 300 }: DetailedCrowdTimelineProps) {
    // If no data, show a placeholder or empty state
    if (!data || data.length === 0) {
        return (
            <div className={`w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center`} style={{ height }}>
                <p className="text-gray-400">Waiting for crowd data...</p>
            </div>
        );
    }

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 mb-1">{new Date(label).toLocaleTimeString()}</p>
                    <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                        {payload[0].value} <span className="text-xs font-medium text-gray-500">People</span>
                    </p>
                    <p className={`text-xs font-bold mt-1 ${payload[0].payload.density === 'Heavy' ? 'text-red-500' :
                        payload[0].payload.density === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                        {payload[0].payload.density} Density
                    </p>
                </div>
            );
        }
        return null;
    };

    // Calculate gradient offset for dynamic coloring
    const gradientOffset = () => {
        const dataMax = Math.max(...data.map((i) => i.count));
        const dataMin = Math.min(...data.map((i) => i.count));

        if (dataMax <= 0) return 0;

        // Thresholds
        const heavyThreshold = 35;
        const mediumThreshold = 15;

        if (dataMax < mediumThreshold) return 0; // All low (Green)
        if (dataMin > heavyThreshold) return 1; // All heavy (Red)

        return 0.5; // Default split
    };

    const off = gradientOffset();

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Crowd Stability Timeline</h3>
                    <p className="text-gray-500 text-xs">Real-time density fluctuations (Last 20 updates)</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Low
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Med
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> High
                    </span>
                </div>
            </div>

            <div style={{ height: height - 80 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={off} stopColor="#ef4444" stopOpacity={0.4} />
                                <stop offset={off} stopColor="#22c55e" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
                                <stop offset={off} stopColor="#ef4444" stopOpacity={1} />
                                <stop offset={off} stopColor="#22c55e" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                        <XAxis
                            dataKey="time"
                            tickFormatter={(t) => new Date(t).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                            stroke="#9CA3AF"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="url(#splitColorStroke)"
                            fill="url(#splitColor)"
                            strokeWidth={3}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


