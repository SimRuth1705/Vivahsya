import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    bookings: 0,
    revenue: 0,
    pendingAmount: 0,
    topSource: "None"
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [leadsRes, bookingsRes] = await Promise.all([
          fetch("http://localhost:5000/api/leads"),
          fetch("http://localhost:5000/api/bookings"),
        ]);

        const leadsData = await leadsRes.json();
        const bookingsData = await bookingsRes.json();

        // 1. GENERATE RECENT ACTIVITY LOG
        const notifications = bookingsData
          .slice(0, 5)
          .map((b) => ({
            id: b._id,
            text: `Converted: ${b.title}`,
            desc: `New ${b.type} added to calendar`,
            time: new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
        setRecentActivity(notifications);

        // 2. CALCULATE MARKETING SOURCE ANALYTICS
        const sourceCounts = bookingsData.reduce((acc, b) => {
          const src = b.source || 'Website';
          acc[src] = (acc[src] || 0) + 1;
          return acc;
        }, {});

        const topSrc = Object.keys(sourceCounts).length > 0 
          ? Object.keys(sourceCounts).reduce((a, b) => sourceCounts[a] > sourceCounts[b] ? a : b)
          : "None";

        // 3. CALCULATE REVENUE STATS
        const totalRevenue = bookingsData
          .filter((b) => b.status === "Completed" || b.status === "Confirmed")
          .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, "")) || 0), 0);

        const pending = bookingsData
          .filter((b) => b.status === "Pending")
          .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, "")) || 0), 0);

        setStats({
          totalLeads: leadsData.length,
          bookings: bookingsData.filter((b) => b.status === "Confirmed").length,
          revenue: totalRevenue,
          pendingAmount: pending,
          topSource: topSrc
        });

        setUpcomingEvents(bookingsData.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error("Database sync error:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <div className="loading-screen">Syncing with Vivahasya DB...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Live business analytics for your event management.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="icon-box purple"><i className="fas fa-users"></i></div>
          <div className="stat-info">
            <h3>Total Leads</h3>
            <p className="stat-number">{stats.totalLeads}</p>
            <span className="stat-trend positive">From CRM</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box pink"><i className="fas fa-calendar-check"></i></div>
          <div className="stat-info">
            <h3>Top Source</h3>
            <p className="stat-number" style={{ fontSize: '1.4rem' }}>{stats.topSource}</p>
            <span className="stat-desc">Marketing MVP</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box green"><i className="fas fa-wallet"></i></div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.revenue)}</p>
            <span className="stat-trend positive">Confirmed Earned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box orange"><i className="fas fa-clock"></i></div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">{formatCurrency(stats.pendingAmount)}</p>
            <span className="stat-desc">Awaiting Payment</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        <div className="content-card large">
          <h3>Recent Bookings</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Event</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.type}</td>
                  <td><span className={`status-badge ${event.status.toLowerCase()}`}>{event.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="content-card small">
          <h3>Live Activity</h3>
          <ul className="activity-list">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-details">
                  <strong>{activity.text}</strong>
                  <p>{activity.desc}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;