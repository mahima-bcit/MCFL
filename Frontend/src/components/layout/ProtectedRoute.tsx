import { Navigate } from "react-router-dom";
import AccessDenied from "../../pages/AccessDenied";
import { clearAuthStorage } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

type Props = {
  children: React.ReactNode;
  requiredRole: "Admin" | "User";
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { token, role } = useAuth();

  if (!token || isTokenExpired(token)) {
    clearAuthStorage();
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "Admin" && role !== "Admin") return <AccessDenied />;
  if (requiredRole === "User" && role === "Admin") return <AccessDenied />;

  return <>{children}</>;
}
