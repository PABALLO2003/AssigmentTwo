import React from 'react';
import { Navigate } from 'react-router-dom';

const getToken = () => {
  return localStorage.getItem('token');
};

function PrivateRoute({ children }) {
  const token = getToken();

  return token ? children : <Navigate to="/" replace />;
}

export default PrivateRoute;