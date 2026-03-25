import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import "./AdminDashboard.css";
import API_BASE_URL from "../../config/apiConfig";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function AdminDashboard() {

  const [stats,setStats] = useState({});
  const [chartData,setChartData] = useState([]);

  useEffect(()=>{

    axios.get(`${API_BASE_URL}/api/admin/stats`)
    .then(res=>{
      setStats(res.data);
    });

    setChartData([
      {month:"Jan",sales:4000},
      {month:"Feb",sales:3000},
      {month:"Mar",sales:5000},
      {month:"Apr",sales:3500},
      {month:"May",sales:6000},
      {month:"Jun",sales:4500}
    ]);

  },[]);

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Admin Dashboard</h1>

      {/* STAT CARDS */}
      <div className="admin-stats">

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Users</span>
            <div className="stat-card-icon gold">
              <i className="fas fa-users"></i>
            </div>
          </div>
          <div className="stat-card-value">{stats.users ?? "—"}</div>
          <div className="stat-card-change up">
            <i className="fas fa-arrow-up"></i> Active members
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Products</span>
            <div className="stat-card-icon blue">
              <i className="fas fa-box"></i>
            </div>
          </div>
          <div className="stat-card-value">{stats.products ?? "—"}</div>
          <div className="stat-card-change up">
            <i className="fas fa-arrow-up"></i> In catalogue
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Orders</span>
            <div className="stat-card-icon purple">
              <i className="fas fa-shopping-bag"></i>
            </div>
          </div>
          <div className="stat-card-value">{stats.orders ?? "—"}</div>
          <div className="stat-card-change up">
            <i className="fas fa-arrow-up"></i> All time
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">Total Revenue</span>
            <div className="stat-card-icon green">
              <i className="fas fa-rupee-sign"></i>
            </div>
          </div>
          <div className="stat-card-value">₹ {stats.revenue ?? "—"}</div>
          <div className="stat-card-change up">
            <i className="fas fa-arrow-up"></i> Lifetime
          </div>
        </div>

      </div>

      {/* SALES CHART */}
      <div className="admin-charts">

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Monthly Sales</span>
          </div>
          <div className="admin-card-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="#D4AF37"
                  radius={[6,6,0,0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <span className="admin-card-title">Quick Actions</span>
          </div>
          <div className="admin-quick-actions">
            <a href="/admin/add-product" className="admin-quick-action">
              <span className="qa-icon"><i className="fas fa-plus-circle"></i></span>
              <span className="qa-label">Add Product</span>
            </a>
            <a href="/admin/orders" className="admin-quick-action">
              <span className="qa-icon"><i className="fas fa-clipboard-list"></i></span>
              <span className="qa-label">View Orders</span>
            </a>
            <a href="/admin/users" className="admin-quick-action">
              <span className="qa-icon"><i className="fas fa-users"></i></span>
              <span className="qa-label">Manage Users</span>
            </a>
            <a href="/admin/payments" className="admin-quick-action">
              <span className="qa-icon"><i className="fas fa-wallet"></i></span>
              <span className="qa-label">Payments</span>
            </a>
          </div>
        </div>

      </div>

    </AdminLayout>
  );

}

export default AdminDashboard;