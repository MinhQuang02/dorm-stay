import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}
