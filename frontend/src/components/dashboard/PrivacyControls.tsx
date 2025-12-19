import { useState } from 'react';
import { Shield, Eye, Map, Lock } from 'lucide-react';

const PrivacyControls = () => {
    const [settings, setSettings] = useState({
        scrambleLocation: false,
        incognito: false,
        shareAnonymous: true
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Shield className="text-indigo-500" size={20} />
                Privacy Shield
            </h3>

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Map size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">Location Scrambling</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Add noise to exact coordinates</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSettings(s => ({ ...s, scrambleLocation: !s.scrambleLocation }))}
                        className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.scrambleLocation ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.scrambleLocation ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                            <Eye size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">Incognito Mode</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Hide from other users</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSettings(s => ({ ...s, incognito: !s.incognito }))}
                        className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.incognito ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.incognito ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg">
                            <Lock size={18} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">Anonymous Data</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Contribute without identity</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSettings(s => ({ ...s, shareAnonymous: !s.shareAnonymous }))}
                        className={`w-11 h-6 flex items-center rounded-full px-1 transition-colors ${settings.shareAnonymous ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${settings.shareAnonymous ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Status: Secure</span>
            </div>
        </div>
    );
};

export default PrivacyControls;
