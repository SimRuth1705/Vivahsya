import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  HiOutlineUsers, HiOutlineCurrencyDollar, HiOutlineCalendar, 
  HiOutlineDownload, HiOutlineReceiptTax, HiOutlineTrendingUp,
  HiOutlineBadgeCheck 
} from "react-icons/hi";
import { Toaster, toast } from "sonner";
import "./Dashboard.css";

const Dashboard = () => {
  // ✅ Combined state for data management
  const [data, setData] = useState({ leads: [], bookings: [], chart: [] });
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem("user")) || { name: "Admin", role: "owner" };
  const isOwner = user?.role === 'owner';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Using 127.0.0.1 for stability over 'localhost'
        const [leadsRes, bookingsRes] = await Promise.all([
          fetch("http://127.0.0.1:5000/api/leads", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:5000/api/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (leadsRes.status === 401 || bookingsRes.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }

        const leadsData = await leadsRes.json();
        const bookingsData = await bookingsRes.json();

        // --- CHART DATA GENERATION ---
        // Groups bookings by date to create the revenue trend line
        const chartMap = bookingsData.reduce((acc, curr) => {
          const date = curr.date || "TBD";
          acc[date] = (acc[date] || 0) + (parseInt(curr.amount) || 0);
          return acc;
        }, {});

        const chartData = Object.entries(chartMap).map(([name, val]) => ({ name, val }));

        // ✅ THE FIX: Use setData to update the entire object at once
        setData({
          leads: Array.isArray(leadsData) ? leadsData : [],
          bookings: Array.isArray(bookingsData) ? bookingsData : [],
          chart: chartData.sort((a, b) => new Date(a.name) - new Date(b.name))
        });

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOwner]);

  const parseVal = (v) => parseInt(v?.toString().replace(/[^0-9]/g, "")) || 0;

  // --- SAFE CALCULATIONS ---
  const safeBookings = data.bookings;

  const sourceTotals = safeBookings.reduce((acc, b) => {
    const type = b.type || 'Wedding';
    const amount = parseVal(b.amount);
    if (acc[type]) {
      acc[type].count += 1;
      acc[type].total += amount;
    }
    return acc;
  }, { Wedding: {count:0, total:0}, Haldi: {count:0, total:0}, Engagement: {count:0, total:0}, Reception: {count:0, total:0} });

  const totalRevenue = safeBookings
    .filter(b => b.status === "Confirmed" || b.status === "Completed")
    .reduce((s, b) => s + parseVal(b.amount), 0);

  const closedDeals = safeBookings
    .filter(b => b.status === "Confirmed" || b.status === "Completed").length;

  if (loading) return <div className="loading-state">Syncing Dashboard...</div>;

  return (
    <div className="unified-container">
      <Toaster richColors />
      
      <header className="unified-header">
        <div className="welcome">
          <h1>Dashboard</h1>
          <p>Logged in as: <strong>{user?.name}</strong></p>
        </div>
        {isOwner && (
          <button className="export-btn" onClick={() => toast.success("Ledger Exported")}>
            <HiOutlineDownload /> Export Financials
          </button>
        )}
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon purple"><HiOutlineUsers /></div>
          <div className="kpi-data"><span>Total Leads</span><strong>{data.leads.length}</strong></div>
        </div>

        {isOwner && (
          <>
            <div className="kpi-card">
              <div className="kpi-icon green"><HiOutlineCurrencyDollar /></div>
              <div className="kpi-data"><span>Total Revenue</span><strong>₹{totalRevenue.toLocaleString('en-IN')}</strong></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-icon gold"><HiOutlineBadgeCheck /></div>
              <div className="kpi-data"><span>Closed Deals</span><strong>{closedDeals}</strong></div>
            </div>
          </>
        )}

        <div className="kpi-card">
          <div className="kpi-icon blue"><HiOutlineCalendar /></div>
          <div className="kpi-data"><span>Active Events</span><strong>{data.bookings.length}</strong></div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="glass-card graph-area">
          <h3><HiOutlineTrendingUp /> {isOwner ? "Revenue Trend" : "Booking Growth"}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={0.1} fill="#6366f1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card source-area">
          <h3>{isOwner ? "Revenue by Source" : "Bookings by Category"}</h3>
          <div className="source-list">
            {Object.entries(sourceTotals).map(([type, stats]) => (
              <div key={type} className="source-item">
                <div className="source-label">
                  <span>{type}</span>
                  <strong>{isOwner ? `₹${stats.total.toLocaleString()}` : `${stats.count} Events`}</strong>
                </div>
                <div className="progress-bg">
                  <div 
                    className={`progress-fill ${type.toLowerCase()}`} 
                    style={{ width: `${(stats.count / (data.bookings.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card ledger-area">
        <div className="card-header-flex">
          <h3><HiOutlineReceiptTax /> Transaction History</h3>
          <span className="count-tag">{data.bookings.length} Records</span>
        </div>
        <div className="table-responsive">
          <table className="unified-table">
            <thead>
              <tr>
                <th>TXN ID</th>
                <th>Client</th>
                <th>Event Date</th>
                {isOwner && <th>Amount</th>}
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {safeBookings.map((b) => (
                <tr key={b._id}>
                  <td className="mono">#VX-{b._id.toString().slice(-5).toUpperCase()}</td>
                  <td className="client-cell">{b.title}</td>
                  <td>{b.date || 'TBD'}</td>
                  {isOwner && <td className="price-cell">₹{parseVal(b.amount).toLocaleString()}</td>}
                  <td><span className={`type-tag ${b.type?.toLowerCase()}`}>{b.type}</span></td>
                  <td><span className={`pill ${b.status?.toLowerCase()}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;