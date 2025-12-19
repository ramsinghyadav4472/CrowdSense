import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

const EmergencyButton = () => {
    const handlePanic = () => {
        toast.error(
            <div className="flex flex-col">
                <span className="font-bold">Emergency Mode Activated</span>
                <span className="text-sm">Notifying verified contacts & nearby safe zones.</span>
            </div>,
            { duration: 5000, icon: '🚨' }
        );
    };

    return (
        <button
            onClick={handlePanic}
            className="w-full mt-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
        >
            <AlertTriangle size={20} />
            EMERGENCY / PANIC
        </button>
    );
};

export default EmergencyButton;
