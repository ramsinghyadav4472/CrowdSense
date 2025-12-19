import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import NearbyStatus from './pages/NearbyStatus';
import SafeRoutes from './pages/SafeRoutes';
import Settings from './pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './context/MapContext';
import PrivateRoute from './context/PrivateRoute';
import { LocationProvider } from './context/LocationContext';

import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <MapProvider>
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/nearby"
                  element={
                    <PrivateRoute>
                      <NearbyStatus />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/routes"
                  element={
                    <PrivateRoute>
                      <SafeRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MapProvider>
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
