import { useAuth } from "./useAuth";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>; 
  }

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}
