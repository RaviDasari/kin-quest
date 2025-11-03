import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { authenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireProfile && !user?.profileCompleted) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
