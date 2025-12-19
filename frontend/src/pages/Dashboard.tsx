import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { Edit2 } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import StatCard from '../components/dashboard/StatCard';
import AlertBanner from '../components/dashboard/AlertBanner';
import DashboardLayout from '../components/layout/DashboardLayout';
import SavedLocations from '../components/dashboard/SavedLocations';
import CrowdComparison from '../components/dashboard/CrowdComparison';
import EmergencyButton from '../components/dashboard/EmergencyButton';
import { Users, MapPin, TrendingUp, Navigation, Pause, Activity, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Define User Interface
interface OtherUser {
    id: number;
    username: string;
    location: {
        y: number;
        x: number;
    };
    density: number;
}

const Dashboard = () => {
    const { user } = useAuth();
    const { location, trackingEnabled, setTrackingEnabled, isManual, setManualLocation, accuracy, resetToGPS } = useLocationContext();
    const [crowdDensity, setCrowdDensity] = useState<'Low' | 'Medium' | 'Heavy'>('Low');
    const [activeUsers, setActiveUsers] = useState(0);

    // Accuracy Warning Effect
    useEffect(() => {
        if (accuracy && accuracy > 2000 && trackingEnabled && !isManual) {
            toast.error(`Precise location unavailable (Accuracy: ${(accuracy / 1000).toFixed(1)}km). We are using your approximate network location.`, {
                id: 'accuracy-warning',
                duration: 6000,
                icon: '⚠️'
            });
        }
    }, [accuracy, trackingEnabled, isManual]);

    // Manual Location Edit State
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [manualSearchQuery, setManualSearchQuery] = useState('');

    const handleManualLocationSearch = async () => {
        if (!manualSearchQuery.trim()) return;
        try {
            // Toaster notification start?
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualSearchQuery)}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setManualLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                toast.success(`Location set to ${data[0].display_name.split(',')[0]}`);
                setIsEditingLocation(false);
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            toast.error('Search failed');
        }
    };

    // ... (keep existing mocks)
    const [otherUsers, setOtherUsers] = useState<OtherUser[]>([]);

    useEffect(() => {
        // ... (existing websocket logic placeholder)
        // Simulating data updates for "Real-time" feel
        const interval = setInterval(() => {
            setActiveUsers(() => Math.floor(Math.random() * 50) + 100);
            // Mock crowd density changes
            const densities: ('Low' | 'Medium' | 'Heavy')[] = ['Low', 'Medium', 'Heavy'];
            setCrowdDensity(densities[Math.floor(Math.random() * densities.length)]);

            // Mock other users movement
            setOtherUsers(() => {
                // Generate some dummy users around the current location or a fixed point if no location
                const centerLat = location?.lat || 51.505;
                const centerLng = location?.lng || -0.09;
                return Array.from({ length: 5 }).map((_, i) => ({
                    id: i,
                    username: `User ${i}`,
                    location: {
                        y: centerLat + (Math.random() - 0.5) * 0.01,
                        x: centerLng + (Math.random() - 0.5) * 0.01
                    },
                    density: Math.random() * 10
                }));
            });

        }, 5000);

        return () => clearInterval(interval);
    }, [location]);

    // State for user's address
    const [addressName, setAddressName] = useState<string | null>(null);

    // Reverse Geocoding Effect (Updated to dep on location)
    useEffect(() => {
        if (location) {
            const fetchAddress = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`);
                    const data = await response.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
                        const country = data.address.country || '';
                        setAddressName(`${city}, ${country}`);
                    }
                } catch (error) {
                    console.error("Failed to fetch address", error);
                    // Fallback to coordinates if fetch fails
                    setAddressName(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
                }
            };
            fetchAddress();
        }
    }, [location]);

    // Update location when it changes
    useEffect(() => {
        if (location && user) {
            // sendLocation implementation here
        }
    }, [location, user]);

    const handleQuickAction = (action: string) => {
        toast.success(`${action} Activated!`, {
            icon: '🚀',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in duration-500">

                {/* 1. Header & Status */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black dark:text-white drop-shadow-sm">
                            Welcome back, {user?.username} 👋
                        </h1>
                        <p className="text-black/80 dark:text-gray-200 text-sm flex items-center gap-2 mt-1 font-semibold">
                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${trackingEnabled ? 'bg-green-600 animate-pulse' : 'bg-gray-500'}`}></span>
                            {isManual ? 'Manual Location' : (trackingEnabled ? 'Live Tracking Active' : 'Tracking Paused')}
                            <span className="text-gray-400 dark:text-gray-500">|</span>
                            {location ? `Location: ${addressName || 'Locating...'}` : 'Locating...'}

                            <button
                                onClick={() => setIsEditingLocation(!isEditingLocation)}
                                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 transition-colors"
                                title="Wrong location? Click to edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            {isManual && (
                                <button
                                    onClick={resetToGPS}
                                    className="ml-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-indigo-600 transition-colors"
                                    title="Auto-detect my location"
                                >
                                    <MapPin size={14} />
                                </button>
                            )}
                        </p>

                        {isEditingLocation && (
                            <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1">
                                <input
                                    type="text"
                                    placeholder="Enter correct city..."
                                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={manualSearchQuery}
                                    onChange={(e) => setManualSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                                />
                                <button
                                    onClick={handleManualLocationSearch}
                                    className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                                >
                                    Set Location
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setTrackingEnabled(!trackingEnabled)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${trackingEnabled ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {trackingEnabled ? <Activity size={16} /> : <Pause size={16} />}
                            {trackingEnabled ? 'Active' : 'Paused'}
                        </button>
                    </div>
                </div>

                {/* 2. Smart Alert Section */}
                {crowdDensity === 'Heavy' && (
                    <AlertBanner
                        type="heavy"
                        message="Heavy crowd detected in your zone! Maintain safety distances."
                    />
                )}
                {crowdDensity === 'Medium' && (
                    <AlertBanner
                        type="medium"
                        message="Crowd levels are rising. Keep an eye on the heatmap."
                    />
                )}

                {/* 3. Main Grid Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Left Column: Stats & Map (2/3 width) */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard
                                title="Current Density"
                                value={crowdDensity}
                                icon={Users}
                                trend="+12%"
                                trendUp={true}
                                color="blue"
                            />
                            <StatCard
                                title="People Nearby"
                                value={activeUsers.toString()}
                                icon={MapPin}
                                trend="+5"
                                trendUp={true}
                                color="purple"
                            />
                            <StatCard
                                title="Safety Score"
                                value="94/100"
                                icon={CheckCircle}
                                trend="Stable"
                                trendUp={true}
                                color="green"
                            />
                        </div>

                        {/* Hero Live Map */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[26px] opacity-30 blur group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative">
                                <MapComponent users={otherUsers} userLocation={location} className="h-[450px] w-full shadow-2xl" />
                            </div>
                        </div>

                        {/* Crowd Comparison Chart */}
                        <CrowdComparison />
                    </div>

                    {/* Right Column: Quick Actions & Saved (1/3 width) */}
                    <div className="space-y-6">

                        {/* Saved Locations */}
                        <SavedLocations />

                        {/* Quick Actions Panel */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleQuickAction('Heatmap')}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border border-transparent hover:border-indigo-100 text-gray-600 dark:text-gray-300"
                                >
                                    <TrendingUp size={20} />
                                    Heatmap
                                </button>
                                <button
                                    onClick={() => handleQuickAction('Safe Route')}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border border-transparent hover:border-green-100 text-gray-600 dark:text-gray-300"
                                >
                                    <Navigation size={20} />
                                    Safe Route
                                </button>
                                <button
                                    onClick={() => handleQuickAction('Smart Check-In')}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border border-transparent hover:border-purple-100 text-gray-600 dark:text-gray-300"
                                >
                                    <CheckCircle size={20} />
                                    Check-In
                                </button>
                                <button
                                    onClick={() => handleQuickAction('Share Location')}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-2 border border-transparent hover:border-blue-100 text-gray-600 dark:text-gray-300"
                                >
                                    <MapPin size={20} />
                                    Share Loc
                                </button>
                            </div>

                            <EmergencyButton />
                        </div>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
