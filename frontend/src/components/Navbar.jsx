import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch (error) { console.error("Error parsing user data:", error); }
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }

  function toggleDropdown(dropdown) {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  }

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">

          {/* ── Logo ── */}
          <div className="navbar-brand">
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <div className="logo-mark">
                <span className="logo-mark-inner"></span>
              </div>
              <span className="logo-text">
                <span className="logo-name">DB YARN Textiles</span>
              </span>
            </Link>
          </div>

          {/* ── Desktop Nav ── */}
          <div className="navbar-desktop">
            <div className="nav-links-group">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/product">
                Products
                <span className="nav-badge">New</span>
              </NavLink>
              <NavLink to="/cart">
                Cart
                {user && <span className="nav-cart-dot"></span>}
              </NavLink>
            </div>
          </div>

          {/* ── User Section ── */}
          <div className="navbar-user-section" ref={dropdownRef}>
            {!user && (
              <div className="auth-buttons">
                <Link to="/login" className="login-btn" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="register-btn" onClick={closeMenu}>
                  Get Started
                </Link>
              </div>
            )}

            {user && (
              <>
                {/* Cart icon */}
                <Link to="/cart" className="nav-icon-btn" title="Cart">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <span className="icon-badge">3</span>
                </Link>

                {/* User avatar + dropdown */}
                <div className="user-profile">
                  <button
                    className="user-avatar-container"
                    onClick={() => toggleDropdown('user')}
                    aria-label="User menu"
                  >
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="user-status"></div>
                  </button>

                  <div className={`user-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">{user.name || "User"}</div>
                        <div className="dropdown-user-email">{user.email || "user@example.com"}</div>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      <span>Profile</span>
                    </Link>

                    <Link to="/preferences" className="dropdown-item" onClick={closeMenu}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                      <span>Preferences</span>
                    </Link>

                    <Link to="/orders" className="dropdown-item" onClick={closeMenu}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                      <span>Orders</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    {user?.role === "admin" && (
                      <Link to="/admin" className="dropdown-item admin-item" onClick={closeMenu}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className={`navbar-toggle ${isMenuOpen ? "open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="toggle-line toggle-line-1"></span>
            <span className="toggle-line toggle-line-2"></span>
            <span className="toggle-line toggle-line-3"></span>
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={`navbar-mobile ${isMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-header">
            {user ? (
              <div className="mobile-user-info">
                <div className="mobile-user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="mobile-user-details">
                  <div className="mobile-user-name">{user.name || "User"}</div>
                  <div className="mobile-user-email">{user.email || ""}</div>
                </div>
              </div>
            ) : (
              <div className="mobile-guest-message">Welcome to YARN Textiles</div>
            )}
          </div>

          <div className="mobile-menu-content">
            <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
            <Link to="/product" className="mobile-nav-link" onClick={closeMenu}>
              Products
              <span className="mobile-badge">New</span>
            </Link>
            <Link to="/cart" className="mobile-nav-link" onClick={closeMenu}>Cart</Link>

            {!user ? (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="mobile-nav-link mobile-register-btn" onClick={closeMenu}>Create Account</Link>
              </>
            ) : (
              <>
                <div className="mobile-section-divider">Account</div>
                <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>Profile</Link>
                <Link to="/preferences" className="mobile-nav-link" onClick={closeMenu}>Preferences</Link>
                <Link to="/orders" className="mobile-nav-link" onClick={closeMenu}>Orders</Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="mobile-nav-link" onClick={closeMenu}>Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </>
            )}
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-copyright">© 2026 YARN Textiles. All rights reserved.</div>
          </div>
        </div>
      </nav>

      {isMenuOpen && <div className="navbar-overlay" onClick={closeMenu}></div>}
    </>
  );
}

// Desktop NavLink helper
function NavLink({ to, children }) {
  return (
    <Link to={to} className="nav-link">
      {children}
    </Link>
  );
}

export default Navbar;