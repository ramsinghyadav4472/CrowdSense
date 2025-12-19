import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', current: 40, usual: 60 },
    { name: 'Tue', current: 30, usual: 50 },
    { name: 'Wed', current: 20, usual: 55 },
    { name: 'Thu', current: 70, usual: 60 },
    { name: 'Fri', current: 90, usual: 80 },
    { name: 'Sat', current: 50, usual: 90 },
    { name: 'Sun', current: 30, usual: 40 },
];

const CrowdComparison = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors h-[300px]">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Crowd vs Usual</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backgroundColor: '#1f2937', color: '#fff' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="usual" fill="#e5e7eb" radius={[4, 4, 4, 4]} barSize={8} />
                    <Bar dataKey="current" fill="#6366f1" radius={[4, 4, 4, 4]} barSize={8} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CrowdComparison;
