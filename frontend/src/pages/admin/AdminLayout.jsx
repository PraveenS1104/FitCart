import { Link, useLocation } from "react-router-dom";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  const location = useLocation();

  function isActive(path) {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  }

  return (
    <div className="admin-container">

      <div className="sidebar">

        <div className="logo">
          <div className="admin-logo-text">
            YARN<span>Textiles</span>
          </div>
          <div className="admin-badge">Admin Panel</div>
        </div>

        <div className="sidebar-group-label">Management</div>

        <Link to="/admin" className={isActive("/admin") && location.pathname === "/admin" ? "active" : ""}>
          <i className="fas fa-chart-bar"></i>
          Dashboard
        </Link>
        <Link to="/admin/products" className={isActive("/admin/products") || location.pathname.includes("product") && location.pathname !== "/admin" ? "active" : ""}>
          <i className="fas fa-box"></i>
          Products
        </Link>
        <Link to="/admin/orders" className={isActive("/admin/orders") ? "active" : ""}>
          <i className="fas fa-clipboard-list"></i>
          Orders
        </Link>
        <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
          <i className="fas fa-users"></i>
          Users
        </Link>
        <Link to="/admin/payments" className={isActive("/admin/payments") ? "active" : ""}>
          <i className="fas fa-wallet"></i>
          Payments
        </Link>

        <div className="sidebar-group-label" style={{marginTop:16}}>Store</div>

        <Link to="/" target="_blank">
          <i className="fas fa-external-link-alt"></i>
          View Store
        </Link>

      </div>

      <div className="admin-content">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;