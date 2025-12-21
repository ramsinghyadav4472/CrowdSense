import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { Edit2 } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import AlertBanner from '../components/dashboard/AlertBanner';
import DashboardLayout from '../components/layout/DashboardLayout';
import SavedLocations from '../components/dashboard/SavedLocations';
import EmergencyButton from '../components/dashboard/EmergencyButton';
import { MapPin, Navigation, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import SmartInsightsWidget from '../components/dashboard/SmartInsightsWidget';
import DetailedCrowdTimeline from '../components/dashboard/DetailedCrowdTimeline';

import { Ghost, Shield } from 'lucide-react';

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
    const { user: _user } = useAuth(); // Keep for auth check if needed, or just remove
    const { location, trackingEnabled, isManual, setManualLocation, accuracy, resetToGPS } = useLocationContext();

    // Feature 1 & 4: Crowd States
    const [crowdDensity, setCrowdDensity] = useState<'Low' | 'Medium' | 'Heavy'>('Low');
    const [crowdCount, setCrowdCount] = useState(12); // Initial count
    const [lastSpikeTime, setLastSpikeTime] = useState<number | null>(null);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // Feature 3: Radius Selection
    const [detectionRadius, setDetectionRadius] = useState<25 | 50 | 100>(50);

    // Feature 5: Safe Zone
    const [safeZone, setSafeZone] = useState<{ lat: number, lng: number } | null>(null);

    // Premium Features State
    const [crowdHistory, setCrowdHistory] = useState<{ time: string; count: number; density: string }[]>([]);
    const [trend, setTrend] = useState<'rising' | 'falling' | 'stable'>('stable');
    const [trendDelta, setTrendDelta] = useState(0);
    const [waitTime, setWaitTime] = useState<number | null>(null);
    const [isPassiveMode, setIsPassiveMode] = useState(false);

    const togglePassiveMode = () => {
        setIsPassiveMode(!isPassiveMode);
        toast.success(isPassiveMode ? 'Live Mode Active' : 'Ghost Mode Activated 👻');
    };

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

    const [otherUsers, setOtherUsers] = useState<OtherUser[]>([]);

    // SMART CROWD LOGIC SIMULATION
    useEffect(() => {
        const interval = setInterval(() => {
            // 1. Calculate new random crowd count based on radius (larger radius = more people)
            const baseCount = detectionRadius === 25 ? 10 : detectionRadius === 50 ? 50 : 120;
            const variance = Math.floor(Math.random() * 20) - 5;
            const newCount = Math.max(0, baseCount + variance);

            // Feature 2: Spike Detection
            setCrowdCount(prev => {
                const diff = newCount - prev;
                if (diff > 15) { // Threshold for spike
                    toast('Sudden Crowd Spike Detected!', {
                        icon: '📈',
                        style: {
                            borderRadius: '10px',
                            background: '#ef4444',
                            color: '#fff',
                        },
                        duration: 4000
                    });
                    setLastSpikeTime(Date.now());
                }
                return newCount;
            });

            // Determine Density Level
            let newDensity: 'Low' | 'Medium' | 'Heavy' = 'Low';
            if (newCount > 35) newDensity = 'Heavy';
            else if (newCount > 15) newDensity = 'Medium';
            setCrowdDensity(newDensity);

            // Update History & Trend
            setCrowdHistory(prev => {
                const newHistory = [...prev, { time: new Date().toISOString(), count: newCount, density: newDensity }].slice(-20);

                // Calculate Trend
                if (newHistory.length > 2) {
                    const recent = newHistory.slice(-3);
                    const avgChange = (recent[recent.length - 1].count - recent[0].count) / 3;
                    setTrendDelta(Number(avgChange.toFixed(1)));
                    setTrend(avgChange > 0.5 ? 'rising' : avgChange < -0.5 ? 'falling' : 'stable');
                }
                return newHistory;
            });

            // Calculate Wait Time
            if (newDensity === 'Heavy') {
                setWaitTime(Math.max(5, Math.floor(newCount / 4)));
            } else {
                setWaitTime(null);
            }

            // Feature 4: Cooldown Timer (Simulated)
            if (newDensity === 'Heavy') {
                setCooldownRemaining(30); // Reset cooldown to 30s when heavy
            } else if (cooldownRemaining > 0) {
                setCooldownRemaining(prev => Math.max(0, prev - 5));
            }

            // Feature 5: Auto Safe Zone (Generate a point 100m away)
            if (newDensity === 'Heavy' && location) {
                // Determine a point ~0.001 degrees away
                setSafeZone({
                    lat: location.lat + 0.0015,
                    lng: location.lng + 0.0015
                });
            } else {
                setSafeZone(null);
            }

            // Update Mock Users
            setOtherUsers(() => {
                const centerLat = location?.lat || 51.505;
                const centerLng = location?.lng || -0.09;
                return Array.from({ length: Math.min(newCount, 50) }).map((_, i) => ({
                    id: i,
                    username: `User ${i}`,
                    location: {
                        y: centerLat + (Math.random() - 0.5) * (detectionRadius * 0.00002),
                        x: centerLng + (Math.random() - 0.5) * (detectionRadius * 0.00002)
                    },
                    density: Math.random() * 100
                }));
            });

        }, 5000);

        return () => clearInterval(interval);
    }, [location, detectionRadius]); // Re-run when radius changes

    // State for user's address
    const [addressName, setAddressName] = useState<string | null>(null);

    useEffect(() => {
        if (location) {
            const fetchAddress = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`);
                    const data = await response.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
                        setAddressName(city);
                    }
                } catch (error) {
                    setAddressName(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
                }
            };
            fetchAddress();
        }
    }, [location]);

    const handleQuickAction = (action: string) => {
        toast.success(`${action} Activated!`, {
            icon: '🚀',
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
    };

    // Helper for Density Color
    const getDensityColor = (d: string) => {
        switch (d) {
            case 'Heavy': return 'bg-red-500 text-white shadow-red-500/30';
            case 'Medium': return 'bg-yellow-500 text-white shadow-yellow-500/30';
            default: return 'bg-green-500 text-white shadow-green-500/30';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black dark:text-white drop-shadow-sm">
                            Dashboard
                        </h1>
                        <p className="text-black/80 dark:text-gray-400 text-sm flex items-center gap-2 mt-1 font-semibold">
                            {location ? `📍 ${addressName || 'Locating...'}` : 'Locating...'}
                            <button onClick={() => setIsEditingLocation(!isEditingLocation)} className="text-gray-400 hover:text-indigo-500"><Edit2 size={12} /></button>
                            {isManual && <button onClick={resetToGPS} title="Reset to GPS" className="text-indigo-500"><MapPin size={12} /></button>}
                        </p>
                        {isEditingLocation && (
                            <div className="mt-2 flex gap-2">
                                <input type="text" value={manualSearchQuery} onChange={e => setManualSearchQuery(e.target.value)} className="border rounded px-2 text-sm bg-white dark:bg-gray-700 dark:text-white" placeholder="City name..." />
                                <button onClick={handleManualLocationSearch} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs">Set</button>
                            </div>
                        )}
                    </div>

                    {/* Feature 8: Context-Aware Header Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePassiveMode}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${isPassiveMode
                                ? 'bg-indigo-600 text-white shadow-indigo-500/30 ring-2 ring-indigo-400 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900'
                                : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300'
                                }`}
                        >
                            {isPassiveMode ? <Ghost size={16} className="animate-pulse" /> : <Shield size={16} />}
                            {isPassiveMode ? 'Ghost Mode' : 'Live Mode'}
                        </button>
                    </div>
                </div>

                {/* 2. Smart Alert Section - MOVED TO MAP OVERLAY */}

                {/* 3. Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Left: Map & Smart Overlay */}
                    <div className="xl:col-span-2 relative">
                        {/* Map Container */}
                        <div className="relative group rounded-[26px] overflow-hidden shadow-2xl h-[500px]">
                            <MapComponent
                                users={otherUsers}
                                userLocation={location}
                                className="h-full w-full"
                                radius={detectionRadius}
                                safeZoneLocation={safeZone}
                            />

                            {/* Feature 1: Live Density Badge FLOAT */}
                            <div className={`absolute top-4 left-4 z-[500] px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-3 transition-colors duration-500 ${getDensityColor(crowdDensity)}`}>
                                <Activity className="animate-pulse" size={20} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Live Density</p>
                                    <p className="text-lg font-black">{crowdDensity} ({crowdCount})</p>
                                </div>
                            </div>

                            {/* Feature 4: Cooldown Timer FLOAT */}
                            {cooldownRemaining > 0 && (
                                <div className="absolute top-4 right-16 z-[500] bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                    <span className="text-xs font-mono">Cooldown: {cooldownRemaining}s</span>
                                </div>
                            )}

                            {/* Feature 3: Radius Selector FLOAT (Bottom Center) */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl flex items-center gap-1 border border-gray-200 dark:border-gray-700">
                                <span className="text-[10px] font-bold text-gray-400 uppercase px-2">Radius</span>
                                {[25, 50, 100].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setDetectionRadius(r as any)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${detectionRadius === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {r}m
                                    </button>
                                ))}
                            </div>

                            {/* Moved Feature 5: Safe Zone Callout (Overlay Bottom Right) */}
                            {safeZone && (
                                <div className="absolute bottom-6 right-6 z-[500] p-3 bg-green-50/90 dark:bg-green-900/90 backdrop-blur-md border border-green-200 rounded-2xl flex items-center gap-3 shadow-lg max-w-xs animate-in slide-in-from-bottom-5">
                                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg text-green-600 dark:text-green-300">
                                        <Navigation size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-900 dark:text-green-100 text-sm">Safe Zone</h4>
                                        <p className="text-[10px] text-green-700 dark:text-green-300 leading-tight">Low-density area ~100m NE.</p>
                                    </div>
                                </div>
                            )}

                            {/* Moved Alert Banner overlay (Top Center) */}
                            {crowdDensity === 'Heavy' && (
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[500] min-w-[300px]">
                                    <AlertBanner type="heavy" message="High density zone! Spike detected." />
                                </div>
                            )}
                        </div>
                        {/* NEW: Detailed Crowd Timeline Below Map */}
                        <div className="mt-6 animate-in slide-in-from-bottom-4 duration-700 delay-150">
                            <DetailedCrowdTimeline data={crowdHistory} height={350} />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="space-y-6">
                        <SavedLocations />

                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-900 dark:text-white">Live Stats</h3>
                                <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                                    Real-time
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                    <span className="text-sm text-gray-500">Spike Risk</span>
                                    <span className={`text-sm font-bold ${crowdCount > 15 ? 'text-red-500' : 'text-green-500'}`}>
                                        {crowdCount > 15 ? 'High' : 'Low'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                    <span className="text-sm text-gray-500">Zone Status</span>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {lastSpikeTime ? `Spike at ${new Date(lastSpikeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Stable'}
                                    </span>
                                </div>
                            </div>

                            <div className="my-6 h-px bg-gray-100 dark:bg-gray-700"></div>

                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleQuickAction('Check-in')} className="p-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition">Check In</button>
                                <button onClick={() => handleQuickAction('Alert')} className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition">SOS Alert</button>
                            </div>

                            <div className="mt-4">
                                <EmergencyButton />
                            </div>
                        </div>

                        {/* NEW: Smart Insights Widget */}
                        <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
                            <SmartInsightsWidget
                                crowdDensity={crowdDensity}
                                trend={trend}
                                trendDelta={trendDelta}
                                waitTime={waitTime}
                                isPassiveMode={isPassiveMode}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
