import { Navigate } from "react-router-dom";
import AccessDenied from "../../pages/AccessDenied";
import { useAuth } from "../../context/AuthContext";

type Props = {
  children: React.ReactNode;
  requiredRole: "Admin" | "User";
};

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
    const payload = JSON.parse(atob(padded));
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { token, role, logout } = useAuth();

  if (!token || isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "Admin" && role !== "Admin") return <AccessDenied />;
  if (requiredRole === "User" && role === "Admin") return <AccessDenied />;

  return <>{children}</>;
}
