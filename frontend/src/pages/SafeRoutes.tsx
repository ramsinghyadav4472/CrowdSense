import DashboardLayout from '../components/layout/DashboardLayout';
import MapComponent from '../components/MapComponent';

import { useGeolocation } from '../hooks/useGeolocation';

const SafeRoutes = () => {
    const { position: location } = useGeolocation(true);
    // Mock data for Safe Routes map - reusing basic map component but imagining it shows routes
    // In a real app we'd pass a 'routes' prop or similar

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Safe Routes</h1>
                    <p className="text-sm text-gray-500">Suggested low-density paths to your destination</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold shadow-md hover:bg-indigo-700 transition-colors">
                    Start Navigation
                </button>
            </div>

            <div className="h-[600px] w-full bg-gray-100 rounded-3xl overflow-hidden shadow-inner border border-gray-200 relative">
                <MapComponent users={[]} userLocation={location} className="h-full w-full" />

                {/* Mock Overlay Interface */}
                <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg z-[500] max-w-xs">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <p className="font-medium text-gray-900">Current Location</p>
                    </div>
                    <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-6"></div>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <p className="font-medium text-gray-900">City Center</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-green-600 font-bold">Safe Route</span>
                            <span className="text-gray-500">15 min</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Avoids high density main square</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SafeRoutes;
