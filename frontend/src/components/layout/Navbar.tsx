import React from 'react';
import { Search, Bell, Menu, Moon, Sun, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useMapContext } from '../../context/MapContext';

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    // Search Logic
    const { triggerFlyTo } = useMapContext();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            try {
                // Toaster notification start?
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    triggerFlyTo({ lat: parseFloat(lat), lng: parseFloat(lon) });
                    // Optional: toaster notification or clear search
                }
            } catch (error) {
                console.error("Search failed", error);
            }
        }
    };

    return (
        <nav className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between z-20 sticky top-0 shadow-sm transition-colors">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden text-gray-600 dark:text-gray-300">
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <div className="w-5 h-5 border-2 border-white rounded-full"></div>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        CrowdSense
                    </span>
                </div>
            </div>

            <div className="flex-1 max-w-xl mx-8 hidden md:block">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder="Search location, area, or city..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-gray-900 dark:text-gray-100 placeholder-gray-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="relative">
                    <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </button>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
                    >
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                            <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
                                </div>
                                <div className="p-1">
                                    <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">
                                        <UserIcon size={16} />
                                        Profile
                                    </button>
                                    <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors">
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                </div>
                                <div className="p-1 border-t border-gray-100 dark:border-gray-700">
                                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
