import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Map as MapIcon,
    Users,
    History,
    Navigation,
    Settings,
    HelpCircle,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Highlight active link based on current path
    const activeItem = location.pathname;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Live Map', icon: MapIcon, path: '/dashboard' }, // Could be separate /map route
        { name: 'Nearby Status', icon: Users, path: '/nearby' },
        { name: 'History', icon: History, path: '/history' },
        { name: 'Safe Routes', icon: Navigation, path: '/routes' },
    ];

    const bottomItems = [
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Support', icon: HelpCircle, path: '#' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transition-all duration-300 ease-in-out flex flex-col
                ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}
            `}>
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
                    <span className="font-bold text-lg text-gray-800 dark:text-white">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 dark:text-gray-400">
                        <ChevronLeft />
                    </button>
                </div>

                {/* Main Menu */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${activeItem === item.path
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                            `}
                        >
                            <item.icon size={22} className={`${activeItem === item.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                            <span className={`font-medium whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>
                                {item.name}
                            </span>

                            {/* Desktop Tooltip */}
                            {!isOpen && (
                                <div className="hidden lg:block absolute left-14 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap ml-4">
                                    {item.name}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    {bottomItems.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            className={`
                                w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                                ${activeItem === item.path
                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                            `}
                        >
                            <item.icon size={22} className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                            <span className={`font-medium whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>
                                {item.name}
                            </span>
                        </button>
                    ))}

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all mt-2 group"
                    >
                        <LogOut size={22} className="text-red-400 group-hover:text-red-600" />
                        <span className={`font-medium whitespace-nowrap ${!isOpen && 'lg:hidden'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
