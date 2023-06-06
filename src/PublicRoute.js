import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const loggedInUser = localStorage.getItem('authToken');

  return loggedInUser ? <Navigate to="/dashboard" replace /> : children;
}

export default PublicRoute;
