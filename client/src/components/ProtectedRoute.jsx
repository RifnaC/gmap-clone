import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component }) => {
  const authStatus = useSelector((state) => state.auth.status);
  const isAuthenticated = authStatus === 'succeeded';

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
