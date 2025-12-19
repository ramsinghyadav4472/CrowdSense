package com.crowdtracking.controller;

import com.crowdtracking.model.LocationLog;
import com.crowdtracking.repository.LocationRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/crowd")
public class CrowdController {

    @Autowired
    LocationRepository locationRepository;

    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public List<LocationLog> getCrowdHistory() {
        // Return 1 hour history
        Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
        return locationRepository.findByTimestampAfter(oneHourAgo);
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    public void exportCrowdData(HttpServletResponse response) throws Exception {
        // Export to CSV
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"crowd-data.csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("UserID,Latitude,Longitude,Timestamp");

        List<LocationLog> logs = locationRepository.findAll();
        for (LocationLog log : logs) {
            writer.printf("%s,%f,%f,%s%n",
                    log.getUserId(),
                    log.getLocation().getY(), // Lat
                    log.getLocation().getX(), // Lng
                    log.getTimestamp().toString());
        }
    }
}
