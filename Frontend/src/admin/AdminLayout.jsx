import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container" style={{ display: 'flex' }}>
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;