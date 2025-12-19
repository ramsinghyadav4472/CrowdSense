import { MapPin, Navigation, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const savedPlaces = [
    { id: 1, name: 'Lovely Professional University', address: 'Jalandhar - Delhi, G.T. Road, Phagwara', density: 'High', color: 'red' },
    { id: 2, name: 'Phagwara City', address: 'Punjab 144401', density: 'Medium', color: 'yellow' },
    { id: 3, name: 'Jalandhar City', address: 'Punjab', density: 'Low', color: 'green' },
];

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

const SavedLocations = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    Saved Locations
                </h3>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                {savedPlaces.map((place) => (
                    <div key={place.id} className="group p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all cursor-pointer border border-transparent hover:border-indigo-100 dark:hover:border-gray-600">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "p-2.5 rounded-xl text-white shadow-sm",
                                    place.color === 'green' ? 'bg-green-500' :
                                        place.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                )}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{place.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                        {place.address}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
                                    place.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        place.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                )}>
                                    {place.density}
                                </span>
                                <button className="p-1.5 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors">
                                    <Navigation size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedLocations;
