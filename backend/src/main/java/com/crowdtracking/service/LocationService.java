package com.crowdtracking.service;

import com.crowdtracking.model.LocationLog;
import com.crowdtracking.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LocationService {

    @Autowired
    LocationRepository locationRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    // Radius in meters for crowd density (50 meters) / Earth Radius for degrees
    // calculation roughly
    // MongoDB uses meters if using 2dsphere and nearSphere.
    // For manual calculation with Haversine, we can do it in Java.

    private static final double CROWD_RADIUS_METERS = 50.0;

    public void updateLocation(String userId, double lat, double lng) {
        GeoJsonPoint point = new GeoJsonPoint(lng, lat);
        LocationLog log = new LocationLog(userId, point);
        locationRepository.save(log);

        // Check density and notify user if in heavy crowd
        int density = calculateDensity(lat, lng);
        String zone = getZoneLevel(density);

        // Send update to specific user/topic if needed, or broadcast map updates
        // For simplicity, we broadcast the new location to everyone (filtered by
        // frontend?)
        // Or simpler: Frontend polls or subscribes to global updates.

        // Also send personal alert if Red zone
        if ("HEAVY".equals(zone)) {
            messagingTemplate.convertAndSendToUser(userId, "/queue/alerts", "WARNING: You are in a HEAVY crowd zone!");
        }
    }

    public List<LocationLog> getActiveUsers() {
        // Active users in last 2 minutes
        Instant twoMinutesAgo = Instant.now().minus(2, ChronoUnit.MINUTES);
        return locationRepository.findByTimestampAfter(twoMinutesAgo);
    }

    private int calculateDensity(double lat, double lng) {
        // Naive implementation: fetch all active users and calculate distance
        // Better: use MongoDB $near or $geoWithin, but repository logic required.
        // For project scale, in-memory filtering of "active users" is fast enough.

        List<LocationLog> activeUsers = getActiveUsers();
        int count = 0;
        for (LocationLog user : activeUsers) {
            double distance = distance(lat, lng, user.getLocation().getY(), user.getLocation().getX());
            if (distance <= CROWD_RADIUS_METERS) {
                count++;
            }
        }
        return count;
    }

    private String getZoneLevel(int count) {
        if (count > 35)
            return "HEAVY"; // 36+
        if (count > 15)
            return "MEDIUM"; // 16-35
        return "NORMAL"; // 0-15
    }

    // Haversine formula
    private double distance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters
        return distance;
    }
}
