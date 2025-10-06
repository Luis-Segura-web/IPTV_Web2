import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Loading from './pages/Loading';
import Menu from './pages/Menu';
import Channels from './pages/Channels';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Series from './pages/Series';
import SeriesDetails from './pages/SeriesDetails';
import CacheService from './services/cacheService';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const credentials = CacheService.getItem(CacheService.CACHE_KEYS.CREDENTIALS);
  
  if (!credentials) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/loading" 
          element={
            <ProtectedRoute>
              <Loading />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/channels" 
          element={
            <ProtectedRoute>
              <Channels />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies" 
          element={
            <ProtectedRoute>
              <Movies />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movies/:id" 
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/series" 
          element={
            <ProtectedRoute>
              <Series />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/series/:id" 
          element={
            <ProtectedRoute>
              <SeriesDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
