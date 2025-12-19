import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Bell, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: user?.username || '',
        email: user?.email || 'user@example.com'
    });

    const handleSave = () => {
        // Simulate API update
        const updatedUser = { ...user, username: formData.username, email: formData.email };
        login(updatedUser); // Update context
        setIsEditing(false);
        toast.success("Profile updated successfully!");
    };

    return (
        <DashboardLayout>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">

                {/* Profile Settings */}
                <div className="p-6 flex flex-col gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Profile Settings</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {isEditing && (
                        <div className="pl-14 space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage crowd alerts and updates</p>
                        </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-green-400" />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
                    </div>
                </div>

                <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Privacy & Security</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Control who can see your location</p>
                        </div>
                    </div>
                    <button className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline">Manage</button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
