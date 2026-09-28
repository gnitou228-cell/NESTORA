import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Role check
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Determine fallback dashboard based on their actual role
    if (role === 'SEEKER') return <Navigate to="/dashboard/seeker" replace />;
    if (role === 'OWNER') return <Navigate to="/dashboard/owner" replace />;
    if (role === 'AGENCY') return <Navigate to="/dashboard/agency" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
