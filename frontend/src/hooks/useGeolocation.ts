import { useState, useEffect } from 'react';

interface Position {
    lat: number;
    lng: number;
}

export const useGeolocation = (enabled: boolean) => {
    const [position, setPosition] = useState<Position | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [accuracy, setAccuracy] = useState<number | null>(null);

    useEffect(() => {
        if (!enabled) return;
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        const handleSuccess = (pos: GeolocationPosition) => {
            setPosition({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
            setAccuracy(pos.coords.accuracy);
        };

        const handleError = (err: GeolocationPositionError) => {
            setError(err.message);
        };

        // Watch position
        const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
        });

        return () => navigator.geolocation.clearWatch(watcher);
    }, [enabled]);

    return { position, error, accuracy };
};
