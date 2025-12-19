# Crowd Tracking System

A real-time crowd density tracking system using User Location (GPS) without hardware sensors.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Leaflet Maps, WebSocket (STOMP).
- **Backend**: Java 17, Spring Boot, MongoDB (GeoSpatial), Spring Security (JWT).
- **DevOps**: Docker, Docker Compose.

## Features

- 📍 Real-time user tracking on Interactive Map.
- 🚦 Crowd Density Zones (Green, Yellow, Red).
- 🔔 Alerts when entering Heavy Crowd zones.
- 🔐 Secure JWT Authentication (Login/Signup).
- 📊 Admin/History API.

## Prequisites

- Docker and Docker Compose installed.
- OR Java 17, Node.js 18+, MongoDB installed locally.

## How to Run (Docker) - Recommended

1. Clone the repository.
2. Open terminal in the project root.
3. Run:

   ```sh
   docker-compose up --build
   ```

4. Access the application:
   - **Frontend**: <http://localhost:3000>
   - **Backend API**: <http://localhost:8081>

## Manual Setup

### Backend

1. Navigate to `backend`.
2. Ensure MongoDB is running on port 27017.
3. Run:

   ```sh
   mvn spring-boot:run
   ```

### Frontend

1. Navigate to `frontend`.
2. Run:

   ```sh
   npm install
   npm run dev
   ```

3. Open `http://localhost:5173`.

## API Endpoints

- POST `/api/auth/signup` - Register
- POST `/api/auth/signin` - Login
- POST `/api/location/update` - Update GPS
- GET `/api/location/active` - Get active users
- WS `/ws-crowd` - STOMP WebSocket

## Usage

1. Open the app in two different browsers/tabs (Incognito).
2. Sign up as User A and User B.
3. Allow Location Permissions.
4. See markers appear on the map.
5. If users are within 50m, density counts update.
