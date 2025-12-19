import { createContext, useContext, useState, type ReactNode } from 'react';

interface LatLng {
    lat: number;
    lng: number;
}

interface MapContextType {
    flyToLocation: LatLng | null;
    triggerFlyTo: (location: LatLng) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
    const [flyToLocation, setFlyToLocation] = useState<LatLng | null>(null);

    const triggerFlyTo = (location: LatLng) => {
        setFlyToLocation(location);
        // Reset after a short delay so same location can be triggered again if needed
        // or just rely on value change. For simplicity, just set it.
    };

    return (
        <MapContext.Provider value={{ flyToLocation, triggerFlyTo }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    const context = useContext(MapContext);
    if (!context) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
};
