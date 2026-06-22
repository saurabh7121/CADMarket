import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Wraps routes that require a logged-in user.
 * Redirects to /login with the current path saved so the user is returned
 * after they authenticate.
 */
export function UserRoute({ children }) {
  const { isLoggedIn, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="text-white animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
