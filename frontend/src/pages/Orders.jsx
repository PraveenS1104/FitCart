import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    fetch(`http://localhost:5000/api/orders/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'delivered': return '#10b981';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  if (!user) {
    return (
      <div className="orders-login-required">
        <div className="login-prompt">
          <i className="fas fa-shopping-bag"></i>
          <h3>View Your Orders</h3>
          <p>Please login to view your order history</p>
          <a href="/login" className="login-redirect-btn">
            <i className="fas fa-sign-in-alt"></i>
            Login to Continue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1 className="orders-title">
            <i className="fas fa-clipboard-list"></i>
            My Orders
          </h1>
          <p className="orders-subtitle">Track and manage all your orders in one place</p>
        </div>
        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-box"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-rupee-sign"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number">
                {formatCurrency(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
              </div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-tab ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-tab ${filter === 'shipped' ? 'active' : ''}`}
            onClick={() => setFilter('shipped')}
          >
            Shipped
          </button>
          <button 
            className={`filter-tab ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="search-input"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start shopping to see your orders here!</p>
            <a href="/product" className="shop-now-btn">
              <i className="fas fa-store"></i>
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">Order #{order.id}</h3>
                    <div className="order-date">
                      <i className="far fa-calendar"></i>
                      {formatDate(order.created_at || new Date())}
                    </div>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                  >
                    <span className="status-dot" style={{ backgroundColor: getStatusColor(order.status) }}></span>
                    {order.status || 'Processing'}
                  </div>
                </div>

                {/* Order Details */}
                <div className="order-details">
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-rupee-sign"></i>
                      Total Amount
                    </div>
                    <div className="detail-value amount">
                      {formatCurrency(order.total)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-box"></i>
                      Items
                    </div>
                    <div className="detail-value">
                      {order.items_count || '1'} item{order.items_count > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className="fas fa-truck"></i>
                      Delivery
                    </div>
                    <div className="detail-value">
                      {order.delivery_date || 'Estimated: 3-5 days'}
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                {order.items && order.items.length > 0 && (
                  <div className="order-items-preview">
                    <div className="preview-title">Items in this order:</div>
                    <div className="preview-items">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="preview-item">
                          <div className="item-image">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="image-placeholder">
                                <i className="fas fa-box"></i>
                              </div>
                            )}
                          </div>
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-qty">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="more-items">+{order.items.length - 3} more</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Actions */}
                <div className="order-actions">
                  <a
                    href={`http://localhost:5000/api/orders/invoice/${order.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="action-btn invoice-btn"
                  >
                    <i className="fas fa-file-invoice"></i>
                    Download Invoice
                  </a>
                  <button className="action-btn track-btn">
                    <i className="fas fa-shipping-fast"></i>
                    Track Order
                  </button>
                  <button className="action-btn reorder-btn">
                    <i className="fas fa-redo"></i>
                    Reorder
                  </button>
                  {order.status === 'delivered' && (
                    <button className="action-btn review-btn">
                      <i className="fas fa-star"></i>
                      Write Review
                    </button>
                  )}
                </div>

                {/* Order Timeline */}
                <div className="order-timeline">
                  <div className="timeline-step active">
                    <div className="step-icon">
                      <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="step-info">
                      <div className="step-title">Order Placed</div>
                      <div className="step-date">{formatDate(order.created_at)}</div>
                    </div>
                  </div>
                  <div className="timeline-step active">
                    <div className="step-icon">
                      <i className="fas fa-cog"></i>
                    </div>
                    <div className="step-info">
                      <div className="step-title">Processing</div>
                      <div className="step-date">In progress</div>
                    </div>
                  </div>
                  <div className={`timeline-step ${order.status === 'shipped' || order.status === 'delivered' ? 'active' : ''}`}>
                    <div className="step-icon">
                      <i className="fas fa-shipping-fast"></i>
                    </div>
                    <div className="step-info">
                      <div className="step-title">Shipped</div>
                      <div className="step-date">{order.status === 'shipped' ? 'Today' : 'Pending'}</div>
                    </div>
                  </div>
                  <div className={`timeline-step ${order.status === 'delivered' ? 'active' : ''}`}>
                    <div className="step-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="step-info">
                      <div className="step-title">Delivered</div>
                      <div className="step-date">{order.status === 'delivered' ? 'Completed' : 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="orders-help">
        <div className="help-card">
          <div className="help-icon">
            <i className="fas fa-question-circle"></i>
          </div>
          <div className="help-content">
            <h4>Need Help with Your Order?</h4>
            <p>Contact our support team for any order-related queries</p>
            <button className="help-btn">
              <i className="fas fa-headset"></i>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;