import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import { Edit2, ThumbsUp, ThumbsDown, AlertTriangle, TrendingUp, TrendingDown, Minus, Info, Shield, CheckCircle, Navigation, MapPin, Activity } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import AlertBanner from '../components/dashboard/AlertBanner';
import DashboardLayout from '../components/layout/DashboardLayout';
import SavedLocations from '../components/dashboard/SavedLocations';
import EmergencyButton from '../components/dashboard/EmergencyButton';
import toast from 'react-hot-toast';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

// --- Helper Components ---

const TrendIndicator = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <span className="flex items-center text-red-500 font-bold bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm"><TrendingUp size={14} className="mr-1" /> Rising</span>;
    if (trend === 'down') return <span className="flex items-center text-green-400 font-bold bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm"><TrendingDown size={14} className="mr-1" /> Falling</span>;
    return <span className="flex items-center text-gray-300 font-bold bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm"><Minus size={14} className="mr-1" /> Stable</span>;
};

// Circular Progress Component for Cooldown
const CircularProgress = ({ value, max, size = 24 }: { value: number, max: number, size?: number }) => {
    const radius = (size - 4) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = value / max;
    const dashoffset = circumference - progress * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-700 opacity-20" />
                <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={dashoffset} className="text-orange-500 transition-all duration-300 ease-out" />
            </svg>
        </div>
    );
};


const Dashboard = () => {
    const { user } = useAuth();
    const { location, isManual, setManualLocation, resetToGPS } = useLocationContext();
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [manualSearchQuery, setManualSearchQuery] = useState('');
    const [addressName, setAddressName] = useState('');
    const [crowdDensity, setCrowdDensity] = useState<'Low' | 'Medium' | 'Heavy'>('Low');
    const [crowdCount, setCrowdCount] = useState(12);
    const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
    const [lastSpikeTime, setLastSpikeTime] = useState<number | null>(null);
    const [cooldownRemaining, setCooldownRemaining] = useState(0);
    const [detectionRadius, setDetectionRadius] = useState<25 | 50 | 100>(50);
    const [safeZone, setSafeZone] = useState<{ lat: number; lng: number } | null>(null);
    const [safeZoneDistance, setSafeZoneDistance] = useState<number | null>(null);
    const [otherUsers, setOtherUsers] = useState<any[]>([]);
    const [crowdHistory, setCrowdHistory] = useState<{ time: string, count: number }[]>([]);

    // 1. Manual Location Search
    const handleManualLocationSearch = async () => {
        if (!manualSearchQuery.trim()) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${manualSearchQuery}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setManualLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
                setAddressName(display_name.split(',')[0]);
                setIsEditingLocation(false);
                setManualSearchQuery('');
                toast.success(`Location set to ${display_name.split(',')[0]}`);
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Failed to search location');
        }
    };

    const handleResetGPS = () => {
        resetToGPS();
        setAddressName('');
        toast.success('Switched back to GPS 🛰️');
    };

    // SMART CROWD LOGIC SIMULATION
    useEffect(() => {
        const interval = setInterval(() => {
            const baseCount = detectionRadius === 25 ? 10 : detectionRadius === 50 ? 50 : 120;
            const variance = Math.floor(Math.random() * 20) - 5;
            const newCount = Math.max(0, baseCount + variance);

            // Determine Trend
            setCrowdCount(prev => {
                const diff = newCount - prev;
                if (diff > 2) setTrend('up');
                else if (diff < -2) setTrend('down');
                else setTrend('stable');

                // Spike Detection
                if (diff > 15) {
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

            // Update History
            setCrowdHistory(prev => {
                const newEntry = { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), count: newCount };
                const updated = [...prev, newEntry];
                return updated.slice(-20); // Keep last 20 points for smoother sparkline
            });

            // Set Density Label
            if (newCount > (baseCount * 1.5)) setCrowdDensity('Heavy');
            else if (newCount > (baseCount * 1.1)) setCrowdDensity('Medium');
            else setCrowdDensity('Low');

            // Simulate Other Users
            if (location) {
                const simulatedUsers = Array.from({ length: Math.floor(newCount / 5) }).map((_, i) => ({
                    id: i,
                    lat: location.lat + (Math.random() - 0.5) * 0.005,
                    lng: location.lng + (Math.random() - 0.5) * 0.005,
                    density: newCount // pass count for color logic
                }));
                setOtherUsers(simulatedUsers);

                // Smart Safe Zone Logic
                if (crowdDensity === 'Heavy') {
                    // Simulating a fixed safe spot relative to user
                    const safeLat = location.lat + 0.002;
                    const safeLng = location.lng + 0.002;
                    setSafeZone({ lat: safeLat, lng: safeLng });

                    // Tiny Haversine-ish distance calc (approx meters)
                    const R = 6371e3; // metres
                    const φ1 = location.lat * Math.PI / 180;
                    const φ2 = safeLat * Math.PI / 180;
                    const Δφ = (safeLat - location.lat) * Math.PI / 180;
                    const Δλ = (safeLng - location.lng) * Math.PI / 180;
                    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const d = R * c;
                    setSafeZoneDistance(Math.round(d));
                } else {
                    setSafeZone(null);
                    setSafeZoneDistance(null);
                }
            }

        }, 3000);

        return () => clearInterval(interval);
    }, [location, detectionRadius]); // crowdDensity in dep array causes loop if not careful, better to use numeric thresholds

    const handleQuickAction = (action: string) => {
        toast.success(`${action} initiated!`);
        if (action === 'Alert') {
            setCooldownRemaining(30);
            const timer = setInterval(() => {
                setCooldownRemaining(prev => {
                    if (prev <= 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const handleReport = (_type: 'accurate' | 'busy' | 'quiet') => {
        toast.success('Thanks for your report! Improving accuracy...', { icon: '🙌' });
    };

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
                {/* Header with improved layout */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-black dark:text-white drop-shadow-sm tracking-tight transition-all">
                            {user ? `Welcome, ${user.username}!` : 'Dashboard'}
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-black/60 dark:text-gray-400 text-sm font-medium flex items-center gap-1">
                                {location ? `📍 ${addressName || 'Current Location'}` : 'Locating...'}
                            </p>
                            <button onClick={() => setIsEditingLocation(!isEditingLocation)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-indigo-500 transition-colors" title="Change Location"><Edit2 size={14} /></button>
                            {isManual && <button onClick={handleResetGPS} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-green-500 transition-colors" title="Use GPS"><MapPin size={14} /></button>}

                            {/* Feature 5: Accuracy Badge */}
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
                                GPS: High
                            </span>
                        </div>

                        {isEditingLocation && (
                            <div className="mt-3 flex gap-2 animate-in slide-in-from-top-2">
                                <input type="text" value={manualSearchQuery} onChange={e => setManualSearchQuery(e.target.value)} className="border rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter city or area..." autoFocus />
                                <button onClick={handleManualLocationSearch} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">Set</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Left: Map & Smart Overlay */}
                    <div className="xl:col-span-2 relative">
                        <div className="relative group rounded-[32px] overflow-hidden shadow-2xl h-[550px] border dark:border-gray-800 transition-all hover:shadow-indigo-500/10">
                            <MapComponent
                                users={otherUsers}
                                userLocation={location}
                                className="h-full w-full"
                                radius={detectionRadius}
                                safeZoneLocation={safeZone}
                            />

                            {/* Feature 1: Live Density Badge & Trend */}
                            <div className={`absolute top-6 left-6 z-[500] pl-4 pr-6 py-3 rounded-3xl shadow-xl backdrop-blur-md flex items-center gap-4 transition-all duration-500 ${getDensityColor(crowdDensity)}`}>
                                <div className="relative">
                                    <Activity className="animate-pulse" size={24} />
                                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Current Density</p>
                                        <Info size={12} className="opacity-70 cursor-help" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-2xl font-black tracking-tight transition-numbers">{crowdCount}</p>
                                        <TrendIndicator trend={trend} />
                                    </div>
                                </div>
                            </div>

                            {/* Feature 6: Cooldown Ring */}
                            {cooldownRemaining > 0 && (
                                <div className="absolute top-6 right-20 z-[500] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 border border-orange-200">
                                    <CircularProgress value={cooldownRemaining} max={30} size={28} />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Alert Cooldown</p>
                                        <p className="text-sm font-bold text-orange-600">{cooldownRemaining}s</p>
                                    </div>
                                </div>
                            )}

                            {/* Feature 3: Radius Selector */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[500] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-1.5 rounded-full shadow-2xl flex items-center gap-1 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                                <span className="hidden sm:block text-[10px] font-bold text-gray-500 uppercase px-3">Radius</span>
                                {[25, 50, 100].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setDetectionRadius(r as any)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${detectionRadius === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        {r}m
                                    </button>
                                ))}
                            </div>

                            {/* Feature 4: Smart Safe Zone Callout */}
                            {safeZone && (
                                <div className="absolute bottom-8 right-6 z-[500] p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l-4 border-l-green-500 rounded-r-2xl rounded-l-md shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 max-w-xs group cursor-pointer hover:bg-green-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="p-2.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                            Safe Zone Nearby
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded font-extrabold">REC</span>
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            Low crowd density detected <strong>{safeZoneDistance}m</strong> away.
                                        </p>
                                    </div>
                                    <div className="ml-2 text-gray-300">
                                        <Navigation size={16} />
                                    </div>
                                </div>
                            )}

                            {/* Alert Banner */}
                            {crowdDensity === 'Heavy' && (
                                <div className="absolute top-24 left-6 z-[500] max-w-sm animate-in zoom-in-95 duration-300">
                                    <AlertBanner type="heavy" message="High density zone! Moving to a safer area is recommended." />
                                </div>
                            )}

                            {/* Feedback Widget */}
                            <div className="absolute bottom-8 left-6 z-[500] flex flex-col gap-2 group">
                                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-1.5 pl-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-2 transition-all opacity-70 hover:opacity-100">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Verify?</span>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
                                    <button onClick={() => handleReport('accurate')} className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg text-green-600 transition-colors"><ThumbsUp size={14} /></button>
                                    <button onClick={() => handleReport('busy')} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-500 transition-colors"><AlertTriangle size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & Actions */}
                    <div className="space-y-6">

                        {/* Live Stats Card with Sparkline */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Activity size={18} className="text-indigo-500" />
                                    Crowd Timeline
                                </h3>
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-[10px] font-bold text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                    LIVE
                                </span>
                            </div>

                            <div className="h-16 w-full mb-4 relative z-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={crowdHistory}>
                                        <defs>
                                            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip cursor={false} content={<></>} />
                                        <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#colorWave)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Last Spike</span>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {lastSpikeTime ? new Date(lastSpikeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'None recently'}
                                    </span>
                                </div>
                                <div className="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Trend</span>
                                    <TrendIndicator trend={trend} />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions (Smart Contextual) */}
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <CheckCircle size={18} className="text-gray-400" />
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => handleQuickAction('Check-in')} className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-2xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 border border-transparent hover:border-indigo-200">
                                    <MapPin size={20} />
                                    Check In
                                </button>
                                <button onClick={() => handleQuickAction('Alert')} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-2 border border-transparent hover:border-red-200" disabled={cooldownRemaining > 0}>
                                    <Shield size={20} />
                                    {cooldownRemaining > 0 ? `${cooldownRemaining}s` : 'SOS Alert'}
                                </button>
                            </div>

                            {/* Feature 8: Contextual Action */}
                            {crowdDensity === 'Heavy' && (
                                <button onClick={() => handleManualLocationSearch()} className="w-full mt-3 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-100 transition-colors animate-pulse">
                                    <Navigation size={16} />
                                    Find Safer Route
                                </button>
                            )}

                            <div className="mt-6">
                                <EmergencyButton />
                            </div>
                        </div>

                        <SavedLocations />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
