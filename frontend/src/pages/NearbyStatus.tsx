import DashboardLayout from '../components/layout/DashboardLayout';
import { MapPin } from 'lucide-react';

const users = [
    { id: 1, name: 'Alice', distance: '120m', status: 'Safe' },
    { id: 2, name: 'Bob', distance: '300m', status: 'In Crowd' },
    { id: 3, name: 'Charlie', distance: '500m', status: 'Safe' },
    { id: 4, name: 'Dave', distance: '800m', status: 'Heavy Crowd' },
    { id: 5, name: 'Eve', distance: '1.2km', status: 'Safe' },
];

const NearbyStatus = () => {
    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Nearby Status</h1>

            <div className="grid gap-4">
                {users.map((u) => (
                    <div key={u.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {u.name[0]}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{u.name}</h3>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin size={12} />
                                    <span>{u.distance} away</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                            ${u.status === 'Safe' ? 'bg-green-100 text-green-700' :
                                u.status === 'Average' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'}`}>
                            {u.status}
                        </span>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default NearbyStatus;
