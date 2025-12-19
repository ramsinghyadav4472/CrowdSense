package com.crowdtracking.controller;

import com.crowdtracking.model.LocationLog;
import com.crowdtracking.service.LocationService;
import com.crowdtracking.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    LocationService locationService;

    @PostMapping("/update")
    public ResponseEntity<?> updateLocation(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody LocationUpdateRequest request) {
        locationService.updateLocation(userDetails.getId(), request.getLat(), request.getLng());
        return ResponseEntity.ok("Location updated");
    }

    @GetMapping("/active")
    public List<LocationLog> getActiveUsers() {
        return locationService.getActiveUsers();
    }

    // WebSocket endpoint: /app/sendLocation
    @MessageMapping("/sendLocation")
    public void sendLocation(@Payload LocationUpdateRequest request) { // In real app, extract user from principal
        // For simplicity assuming request has userId or handled via interceptor
        // Using HTTP for location updates is easier for Auth context in simple setup
    }

    // DTO for update
    public static class LocationUpdateRequest {
        private double lat;
        private double lng;
        private String userId; // Optional for admin or debug

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }
    }
}
