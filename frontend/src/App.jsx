import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import TripDetail from './pages/TripDetail';
import TripBudget from './pages/TripBudget';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import CitySearch from './pages/CitySearch';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import SharedTrip from './pages/SharedTrip';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  return !user ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Public Shared Trip */}
      <Route path="/shared/:slug" element={<SharedTrip />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/create-trip" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
      <Route path="/trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
      <Route path="/trip/:id" element={<PrivateRoute><TripDetail /></PrivateRoute>} />
      <Route path="/trip/:id/budget" element={<PrivateRoute><TripBudget /></PrivateRoute>} />
      <Route path="/trip/:id/packing" element={<PrivateRoute><PackingChecklist /></PrivateRoute>} />
      <Route path="/trip/:id/notes" element={<PrivateRoute><TripNotes /></PrivateRoute>} />
      <Route path="/city-search" element={<PrivateRoute><CitySearch /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
