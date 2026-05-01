import AccessDenied from "../../pages/AccessDenied";

type Props = {
  children: React.ReactNode;
  requiredRole: "Admin" | "User";
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const token = localStorage.getItem("token") ?? sessionStorage.getItem("token");
  const role = localStorage.getItem("role") ?? sessionStorage.getItem("role");

  if (!token) return <AccessDenied unauthenticated />;
  if (requiredRole === "Admin" && role !== "Admin") return <AccessDenied />;
  if (requiredRole === "User" && role === "Admin") return <AccessDenied />;

  return <>{children}</>;
}
