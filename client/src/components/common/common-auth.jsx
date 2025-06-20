import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/") {
    if (!isAuthenticated) return <Navigate to="/auth/login" />;
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/shop/home" />
    );
  }

  if (
    !isAuthenticated &&
    !["/login", "/register"].some((route) => path.includes(route))
  ) {
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    ["/login", "/register"].some((route) => path.includes(route))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" />
    ) : (
      <Navigate to="/shop/home" />
    );
  }

  if (isAuthenticated && user?.role !== "admin" && path.includes("admin")) {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && user?.role === "admin" && path.includes("shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
