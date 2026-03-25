import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

  const user = localStorage.getItem("user");

  // If not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If logged in → allow page
  return children;
}

export default PrivateRoute;
