import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [stats, setStats] = useState({
    orders: 0,
    reviews: 0,
    cartItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditedUser(parsedUser);
      
      // Simulate loading user stats
      setTimeout(() => {
        setStats({
          orders: 12,
          reviews: 8,
          cartItems: 3
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [navigate]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    // In a real app, you would save to backend
    localStorage.setItem("user", JSON.stringify(editedUser));
    setUser(editedUser);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedUser(user);
    setIsEditing(false);
  }

  function handleInputChange(e) {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  }

  function getInitials(name) {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  }

  if (!user) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1 className="profile-title">
            <i className="fas fa-user-circle"></i>
            My Profile
          </h1>
          <p className="profile-subtitle">
            Manage your account settings and view your activity
          </p>
        </div>
        <div className="header-actions">
          <button className="action-btn edit-btn" onClick={handleEdit}>
            <i className="fas fa-edit"></i>
            Edit Profile
          </button>
          <button className="action-btn logout-btn" onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-container">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          {/* User Avatar */}
          <div className="user-avatar-large">
            <div className="avatar-circle">
              {getInitials(user.name)}
            </div>
            <div className="avatar-status"></div>
          </div>

          {/* User Stats */}
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.orders}</div>
                <div className="stat-label">Orders</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.reviews}</div>
                <div className="stat-label">Reviews</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stats.cartItems}</div>
                <div className="stat-label">Cart Items</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="quick-links">
            <h3 className="links-title">
              <i className="fas fa-link"></i>
              Quick Access
            </h3>
            <a href="/orders" className="quick-link">
              <i className="fas fa-clipboard-list"></i>
              My Orders
            </a>
            <a href="/cart" className="quick-link">
              <i className="fas fa-shopping-cart"></i>
              Shopping Cart
            </a>
            <a href="/wishlist" className="quick-link">
              <i className="fas fa-heart"></i>
              Wishlist
            </a>
            <a href="/settings" className="quick-link">
              <i className="fas fa-cog"></i>
              Settings
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Personal Info Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-user"></i>
                Personal Information
              </h2>
              <div className="card-actions">
                {isEditing ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>
                      <i className="fas fa-check"></i>
                      Save Changes
                    </button>
                    <button className="cancel-btn" onClick={handleCancel}>
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={handleEdit}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="card-content">
              {/* Name Field */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-user-tag"></i>
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="info-value">{user.name}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="info-value">{user.email}</div>
                )}
              </div>

              {/* Phone Field */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-phone"></i>
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedUser.phone || ""}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="info-value">{user.phone || "Not provided"}</div>
                )}
              </div>

              {/* Address Field */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-map-marker-alt"></i>
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editedUser.address || ""}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Enter your address"
                    rows="3"
                  />
                ) : (
                  <div className="info-value">{user.address || "Not provided"}</div>
                )}
              </div>

              {/* Member Since */}
              <div className="form-group">
                <label className="form-label">
                  <i className="fas fa-calendar-alt"></i>
                  Member Since
                </label>
                <div className="info-value">
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-shield-alt"></i>
                Account Security
              </h2>
            </div>
            <div className="card-content">
              <div className="security-item">
                <div className="security-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="security-content">
                  <h4>Password</h4>
                  <p>Last changed 30 days ago</p>
                </div>
                <button className="security-btn">
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
              </div>
              <div className="security-item">
                <div className="security-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="security-content">
                  <h4>Email Verification</h4>
                  <p>Verified on {new Date().toLocaleDateString()}</p>
                </div>
                <button className="security-btn">
                  <i className="fas fa-redo"></i>
                  Resend Verification
                </button>
              </div>
              <div className="security-item">
                <div className="security-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="security-content">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="security-btn">
                  <i className="fas fa-plus"></i>
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-history"></i>
                Recent Activity
              </h2>
              <a href="/activity" className="view-all-link">
                View All
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon success">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="activity-content">
                    <h4>Order Placed</h4>
                    <p>You placed a new order #ORD789</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon info">
                    <i className="fas fa-star"></i>
                  </div>
                  <div className="activity-content">
                    <h4>Review Added</h4>
                    <p>You reviewed "Wireless Headphones"</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon warning">
                    <i className="fas fa-shipping-fast"></i>
                  </div>
                  <div className="activity-content">
                    <h4>Order Shipped</h4>
                    <p>Your order #ORD456 has been shipped</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Health */}
      <div className="account-health">
        <div className="health-card">
          <div className="health-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          <div className="health-content">
            <h3>Account Health</h3>
            <p>Your account is in good standing. Keep up the great activity!</p>
            <div className="health-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%' }}></div>
              </div>
              <span className="progress-text">85% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;