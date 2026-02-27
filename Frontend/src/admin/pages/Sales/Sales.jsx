import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import './Sales.css';

// --- 1. INDIVIDUAL INVOICE GENERATOR ---
const generateInvoice = (booking) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(98, 0, 234); 
  doc.text("VIVAHASYA", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium Event Management & Decor", 14, 28);
  doc.text(`Invoice ID: #INV-${booking._id.slice(-6).toUpperCase()}`, 14, 35);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("BILL TO:", 14, 50);
  doc.setFont(undefined, 'bold');
  doc.text(booking.title || "Client Name", 14, 56);
  doc.setFont(undefined, 'normal');
  doc.text(`Event Type: ${booking.type || 'Event'}`, 14, 62);
  doc.text(`Event Date: ${booking.date || 'TBD'}`, 14, 68);

  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: [
      [`${booking.type || 'Event'} Management & Coordination`, "1", booking.amount || "0", booking.amount || "0"],
      ["Venue Decoration & Theme Setup", "1", "Included", "-"],
      ["Professional Consultation Fee", "1", "Included", "-"],
    ],
    headStyles: { fillColor: [98, 0, 234] },
    theme: 'striped'
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont(undefined, 'bold');
  doc.text(`Grand Total: ${booking.amount || '0'}`, 14, finalY);
  doc.save(`Invoice_${(booking.title || 'Client').replace(/\s+/g, '_')}.pdf`);
  toast.success(`Invoice for ${booking.title} downloaded.`);
};

// --- 2. GLOBAL REPORT GENERATOR ---
const generateGlobalReport = (transactions, stats) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(98, 0, 234);
  doc.text("VIVAHASYA - Global Finance Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  autoTable(doc, {
    startY: 45,
    head: [['Business KPI', 'Value']],
    body: [
      ["Total Revenue Earned", `INR ${stats.revenue.toLocaleString()}`],
      ["Total Pending Payments", `INR ${stats.pending.toLocaleString()}`],
      ["Total Successful Deals", stats.deals.toString()],
      ["Average Deal Size", `INR ${Math.round(stats.avgSize).toLocaleString()}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [40, 40, 40] }
  });

  const tableData = transactions.map(t => [
    t._id.slice(-5).toUpperCase(),
    t.title || 'N/A',
    t.date || 'TBD',
    t.amount || '0',
    t.type || 'Event',
    t.status || 'Pending'
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['ID', 'Client', 'Date', 'Amount', 'Type', 'Status']],
    body: tableData,
    headStyles: { fillColor: [98, 0, 234] }
  });

  doc.save("Vivahasya_Global_Financial_Report.pdf");
  toast.success("Global report generated successfully!");
};

// --- 3. REVENUE CHART COMPONENT ---
const RevenueChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Revenue Overview</h3>
      </div>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-group">
            <div className="bar" style={{ height: `${(item.value / maxVal) * 100}%` }}>
              <div className="tooltip">₹{(item.value / 1000).toFixed(1)}k</div>
            </div>
            <span className="bar-label">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. MAIN SALES COMPONENT ---
const Sales = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [stats, setStats] = useState({
    revenue: 0, pending: 0, deals: 0, avgSize: 0,
    sources: { Wedding: 0, Corporate: 0, Birthday: 0, Anniversary: 0 }
  });

  const fetchFinanceData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();

      const parseAmount = (str) => parseInt(str?.toString().replace(/[^0-9]/g, "")) || 0;

      const totalRev = data
        .filter(b => b.status === "Completed" || b.status === "Confirmed")
        .reduce((sum, b) => sum + parseAmount(b.amount), 0);

      const totalPending = data
        .filter(b => b.status === "Pending")
        .reduce((sum, b) => sum + parseAmount(b.amount), 0);

      const counts = data.reduce((acc, b) => {
        const type = b.type || 'Wedding';
        if (acc[type] !== undefined) acc[type]++;
        return acc;
      }, { Wedding: 0, Corporate: 0, Birthday: 0, Anniversary: 0 });

      setStats({
        revenue: totalRev,
        pending: totalPending,
        deals: data.filter(b => b.status !== "Cancelled").length,
        avgSize: data.length > 0 ? totalRev / data.length : 0,
        sources: counts
      });
      setTransactions(data);
      setLoading(false);
    } catch (err) {
      toast.error("Database connection failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'Paid') return t.status === 'Confirmed' || t.status === 'Completed';
    if (filter === 'Pending') return t.status === 'Pending';
    return true;
  });

  const totalBookings = stats.deals || 1;
  const getPer = (val) => Math.round((val / totalBookings) * 100);

  const revenueData = [
    { month: 'Dec', value: 150000 }, 
    { month: 'Jan', value: 210000 },
    { month: 'Feb', value: stats.revenue }, 
  ];

  if (loading) return <div className="loading-screen">Syncing Financials...</div>;

  return (
    <div className="sales-container">
      <Toaster position="top-right" richColors />
      
      <div className="sales-header">
        <h1>Sales & Finance</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => generateGlobalReport(transactions, stats)}>
            Download Global Report ⬇
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card purple"><span className="kpi-title">Total Revenue</span><div className="kpi-value">{formatCurrency(stats.revenue)}</div></div>
        <div className="kpi-card orange"><span className="kpi-title">Pending</span><div className="kpi-value">{formatCurrency(stats.pending)}</div></div>
        <div className="kpi-card green"><span className="kpi-title">Closed Deals</span><div className="kpi-value">{stats.deals}</div></div>
        <div className="kpi-card blue"><span className="kpi-title">Avg. Ticket</span><div className="kpi-value">{formatCurrency(stats.avgSize)}</div></div>
      </div>

      <div className="charts-section">
        <RevenueChart data={revenueData} />
        <div className="source-card">
          <h3>Revenue Sources</h3>
          <div className="donut-legend">
            <div className="legend-item"><span className="dot dot-wed"></span><div className="l-info"><span>Wed</span><strong>{getPer(stats.sources.Wedding)}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-corp"></span><div className="l-info"><span>Corp</span><strong>{getPer(stats.sources.Corporate)}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-bday"></span><div className="l-info"><span>Bday</span><strong>{getPer(stats.sources.Birthday)}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-anniv"></span><div className="l-info"><span>Aniv</span><strong>{getPer(stats.sources.Anniversary)}%</strong></div></div>
          </div>
          <div className="progress-stack">
            <div className="p-bar wed" style={{width: `${getPer(stats.sources.Wedding)}%`}}></div>
            <div className="p-bar corp" style={{width: `${getPer(stats.sources.Corporate)}%`}}></div>
            <div className="p-bar bday" style={{width: `${getPer(stats.sources.Birthday)}%`}}></div>
            <div className="p-bar anniv" style={{width: `${getPer(stats.sources.Anniversary)}%`}}></div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h3>Transaction History</h3>
          <div className="t-filters">
            {['All', 'Paid', 'Pending'].map(f => (
              <button key={f} className={`t-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="sales-table-wrapper">
          <table className="sales-table">
            <thead>
              <tr><th>TXN ID</th><th>Client Name</th><th>Date</th><th>Amount</th><th>Type</th><th>Status</th><th>Invoice</th></tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t._id}>
                  <td className="mono">#VX-{t._id.slice(-5).toUpperCase()}</td>
                  <td className="fw-600">{t.title || 'N/A'}</td>
                  <td>{t.date || 'TBD'}</td>
                  <td className="amount-cell">{t.amount || '0'}</td>
                  <td>{t.type || 'Event'}</td>
                  <td><span className={`status-badge ${t.status === 'Pending' ? 'badge-pending' : 'badge-paid'}`}>{t.status}</span></td>
                  <td>
                    <button className="invoice-btn" onClick={() => generateInvoice(t)}>📄</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;