package com.crowdtracking.repository;

import com.crowdtracking.model.LocationLog;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface LocationRepository extends MongoRepository<LocationLog, String> {
    // Find latest location for a user
    LocationLog findTopByUserIdOrderByTimestampDesc(String userId);

    // Find active users within a timestamp
    List<LocationLog> findByTimestampAfter(Instant timestamp);
}
