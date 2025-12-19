import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../utils/iconManager'; // Fix for leafet default icons

// Custom generator for markers
const createIcon = (color: string) => {
    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

const userIcon = createIcon('#3b82f6'); // Blue for current user

interface MapComponentProps {
    users: any[];
    userLocation: { lat: number; lng: number } | null;
    className?: string; // Enhanced with className support
    radius?: number; // Feature 3: Dynamic Radius
    safeZoneLocation?: { lat: number; lng: number } | null; // Feature 5: Safe Zone
}

import { useMapContext } from '../context/MapContext';

// ... MapUpdater component ...

// Component to handle map center updates smoothly
const MapUpdater = ({ userLocation }: { userLocation: { lat: number; lng: number } | null }) => {
    // ... existing MapUpdater logic ...
    const map = useMap();
    const { flyToLocation } = useMapContext();
    const [hasFlownToUser, setHasFlownToUser] = React.useState(false);

    // Effect for user location updates - Fly to user ONLY if we haven't manually searched or panned away (simple logic for now: fly on first valid location)
    useEffect(() => {
        if (userLocation && !hasFlownToUser) {
            map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 2 });
            setHasFlownToUser(true);
        }
    }, [userLocation, map, hasFlownToUser]);

    // Effect for Search Context
    useEffect(() => {
        if (flyToLocation) {
            map.flyTo([flyToLocation.lat, flyToLocation.lng], 16, { duration: 2 });
        }
    }, [flyToLocation, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ users, userLocation, className, radius = 50, safeZoneLocation }) => {
    // Default to London if no location found yet
    const defaultPosition = { lat: 51.505, lng: -0.09 };
    const center = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : defaultPosition;

    const getZoneColor = (_density: number) => {
        // Mock logic for color
        return '#22c55e';
    };

    return (
        <div className={`relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 ${className}`} style={{ minHeight: '400px' }}>
            <MapContainer
                center={center}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false} // Cleaner look, maybe add custom later
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Street View">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite View">
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>

                <MapUpdater userLocation={userLocation} />

                {/* Safe Zone Highlight */}
                {safeZoneLocation && (
                    <>
                        <Circle
                            center={[safeZoneLocation.lat, safeZoneLocation.lng]}
                            radius={40}
                            pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.3, weight: 2, dashArray: '5, 5' }}
                        />
                        <Marker position={[safeZoneLocation.lat, safeZoneLocation.lng]} icon={createIcon('#16a34a')}>
                            <Popup>Safe Zone (Recommended)</Popup>
                        </Marker>
                    </>
                )}

                {/* Current User */}
                {userLocation && (
                    <>
                        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                            <Popup className="font-sans font-semibold">You are here</Popup>
                        </Marker>
                        {/* Feature 3: Radius Visualization */}
                        <Circle
                            center={[userLocation.lat, userLocation.lng]}
                            radius={radius}
                            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 1, dashArray: '4' }}
                        />
                    </>
                )}

                {/* Crowd Markers */}
                {users.map((user: any, idx: number) => {
                    if (!user.location || !user.location.y || !user.location.x) return null;
                    if (userLocation && user.username === 'me') return null;

                    return (
                        <Marker
                            key={user.id || idx}
                            position={[user.location.y, user.location.x]}
                            icon={createIcon(getZoneColor(user.density || 1))}
                        >
                            <Popup className="font-sans">User: {user.username || 'Anonymous'}</Popup>
                        </Marker>
                    );
                })}

                {/* Safe Zone Highlight - Feature 5 */}
                {safeZoneLocation && (
                    <>
                        <Circle
                            center={[safeZoneLocation.lat, safeZoneLocation.lng]}
                            radius={radius * 0.8}
                            pathOptions={{
                                color: '#22c55e',
                                fillColor: '#22c55e',
                                fillOpacity: 0.2,
                                weight: 2,
                                dashArray: '5, 10'
                            }}
                        />
                        <Marker position={[safeZoneLocation.lat, safeZoneLocation.lng]} icon={createIcon('#22c55e')}>
                            <Popup>Safe Zone (Recommended)</Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>

            {/* Overlay Gradient for modern feel */}
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-[400]"></div>
        </div>
    );
};

export default MapComponent;
