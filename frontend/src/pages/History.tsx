import DashboardLayout from '../components/layout/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: '00:00', users: 10 },
    { name: '04:00', users: 5 },
    { name: '08:00', users: 45 },
    { name: '12:00', users: 120 },
    { name: '16:00', users: 95 },
    { name: '20:00', users: 60 },
    { name: '23:59', users: 30 },
];

const History = () => {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Crowd Density History</h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[500px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Daily Activity Trend</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </DashboardLayout>
    );
};

export default History;
