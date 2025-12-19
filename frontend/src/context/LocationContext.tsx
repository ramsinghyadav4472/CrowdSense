import { createContext, useContext, useState, type ReactNode } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';

interface LatLng {
    lat: number;
    lng: number;
}

interface LocationContextType {
    location: LatLng | null;
    error: string | null;
    accuracy: number | null; // Added accuracy
    trackingEnabled: boolean;
    setTrackingEnabled: (enabled: boolean) => void;
    setManualLocation: (location: LatLng) => void;
    isManual: boolean;
    resetToGPS: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
    const [trackingEnabled, setTrackingEnabled] = useState(true);
    const { position: gpsPosition, error: gpsError, accuracy } = useGeolocation(trackingEnabled);
    const [manualLocation, setManualLocation] = useState<LatLng | null>(null);

    // Determines the active location: Manual takes precedence if set
    const location = manualLocation || gpsPosition;
    const error = manualLocation ? null : gpsError;
    const isManual = !!manualLocation;

    const resetToGPS = () => {
        setManualLocation(null);
        setTrackingEnabled(true);
    };

    return (
        <LocationContext.Provider value={{
            location,
            error,
            accuracy: isManual ? 0 : accuracy, // Manual is exact
            trackingEnabled,
            setTrackingEnabled,
            setManualLocation,
            isManual,
            resetToGPS
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocationContext must be used within a LocationProvider');
    }
    return context;
};
