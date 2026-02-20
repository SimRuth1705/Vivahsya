import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Leads from './pages/Leads/Leads';
import CRM from './pages/CRM/CRM';
import Bookings from './pages/Bookings/Bookings';
import Events from './pages/Events/Events';
import Vendors from './pages/Vendors/Vendors';
import Sales from './pages/Sales/Sales';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="crm" element={<CRM />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="events" element={<Events />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="sales" element={<Sales />} />
      </Route>
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;