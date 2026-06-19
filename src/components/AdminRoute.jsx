import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingPage } from './UI';

export function AdminRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <LoadingPage />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
}
