import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const loggedInUser = localStorage.getItem('authToken');

  return loggedInUser ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
