import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Standalone import to fix prototype error
import './Sales.css';

// --- 1. INDIVIDUAL INVOICE GENERATOR ---
const generateInvoice = (booking) => {
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.setTextColor(255, 77, 148);
  doc.text("VIVAHASYA", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium Event Management & Decor", 14, 28);
  doc.text(`Invoice ID: #INV-${booking._id.slice(-6).toUpperCase()}`, 14, 35);

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("BILL TO:", 14, 50);
  doc.setFont(undefined, 'bold');
  doc.text(booking.title, 14, 56);
  doc.setFont(undefined, 'normal');
  doc.text(`Event Type: ${booking.type}`, 14, 62);
  doc.text(`Event Date: ${booking.date}`, 14, 68);

  // Updated standalone autoTable call
  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Qty', 'Unit Price', 'Total']],
    body: [
      [`${booking.type} Management & Coordination`, "1", booking.amount, booking.amount],
      ["Venue Decoration & Theme Setup", "1", "Included", "-"],
      ["Professional Consultation Fee", "1", "Included", "-"],
    ],
    headStyles: { fillColor: [255, 77, 148] },
    theme: 'striped'
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFont(undefined, 'bold');
  doc.text(`Grand Total: ${booking.amount}`, 14, finalY);
  doc.save(`Invoice_${booking.title.replace(/\s+/g, '_')}.pdf`);
  toast.success(`Invoice for ${booking.title} downloaded.`);
};

// --- 2. GLOBAL REPORT GENERATOR ---
const generateGlobalReport = (transactions, stats) => {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(255, 77, 148);
  doc.text("VIVAHASYA - Global Finance Report", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  // Overview Table
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

  // Full Transaction List
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text("Transaction History", 14, doc.lastAutoTable.finalY + 15);

  const tableData = transactions.map(t => [
    t._id.slice(-5).toUpperCase(),
    t.title,
    t.date,
    t.amount,
    t.type,
    t.status
  ]);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [['ID', 'Client', 'Date', 'Amount', 'Type', 'Status']],
    body: tableData,
    headStyles: { fillColor: [255, 77, 148] }
  });

  doc.save("Vivahasya_Global_Financial_Report.pdf");
  toast.success("Global report generated successfully!");
};

// --- 3. CUSTOM COMPONENTS ---
const ChartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('This Year');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="chart-dropdown" ref={dropdownRef}>
      <div className="chart-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selected}</span>
        <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
      {isOpen && (
        <ul className="chart-dropdown-menu">
          {['This Year', 'Last Year', 'Last 6 Months'].map((opt) => (
            <li key={opt} onClick={() => { setSelected(opt); setIsOpen(false); }}>{opt}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RevenueChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Revenue Overview</h3>
        <ChartDropdown />
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

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();

        const totalRev = data
          .filter(b => b.status === "Completed" || b.status === "Confirmed")
          .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, "")) || 0), 0);

        const totalPending = data
          .filter(b => b.status === "Pending")
          .reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, "")) || 0), 0);

        const counts = data.reduce((acc, b) => {
          acc[b.type] = (acc[b.type] || 0) + 1;
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
    fetchFinanceData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const filteredTransactions = filter === 'All' ? transactions : transactions.filter(t => {
    if (filter === 'Paid') return t.status === 'Confirmed' || t.status === 'Completed';
    if (filter === 'Pending') return t.status === 'Pending';
    return true;
  });

  const totalBookings = stats.deals || 1;
  const wedPer = Math.round((stats.sources.Wedding / totalBookings) * 100);
  const corpPer = Math.round((stats.sources.Corporate / totalBookings) * 100);
  const bdayPer = Math.round((stats.sources.Birthday / totalBookings) * 100);
  const annivPer = Math.round((stats.sources.Anniversary / totalBookings) * 100);

  const revenueData = [
    { month: 'Oct', value: 120000 }, { month: 'Nov', value: 190000 },
    { month: 'Dec', value: 150000 }, { month: 'Jan', value: stats.revenue },
  ];

  if (loading) return <div className="loading-screen">Syncing Financials...</div>;

  return (
    <div className="sales-container">
      <Toaster position="top-right" richColors />
      
      <div className="sales-header">
        <h1>Sales & Finance</h1>
        <div className="header-actions">
          <button className="btn-secondary">Sync Bank</button>
          <button 
            className="btn-primary" 
            onClick={() => generateGlobalReport(transactions, stats)}
          >
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
            <div className="legend-item"><span className="dot dot-wed"></span><div className="l-info"><span>Wed</span><strong>{wedPer}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-corp"></span><div className="l-info"><span>Corp</span><strong>{corpPer}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-bday"></span><div className="l-info"><span>Bday</span><strong>{bdayPer}%</strong></div></div>
            <div className="legend-item"><span className="dot dot-anniv"></span><div className="l-info"><span>Aniv</span><strong>{annivPer}%</strong></div></div>
          </div>
          <div className="progress-stack">
            <div className="p-bar wed" style={{width: `${wedPer}%`}}></div>
            <div className="p-bar corp" style={{width: `${corpPer}%`}}></div>
            <div className="p-bar bday" style={{width: `${bdayPer}%`}}></div>
            <div className="p-bar anniv" style={{width: `${annivPer}%`}}></div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <h3>Recent Transactions History</h3>
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
                  <td className="fw-600">{t.title}</td>
                  <td>{t.date}</td>
                  <td className="amount-cell">{t.amount}</td>
                  <td>{t.type}</td>
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