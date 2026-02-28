import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDemo = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ padding: "120px 20px", textAlign: "center", background: "#fdfaf6", minHeight: "100vh" }}>
            <h1 style={{ color: "#b8860b" }}>👑 Admin Control Center</h1>
            <p>Welcome back, <strong>{user?.username}</strong>!</p>
            <div style={{ marginTop: "30px", border: "2px dashed #ccc", padding: "40px", display: "inline-block" }}>
                <h3>Admin Team Workspace</h3>
                <p>Integration Point: Drop Admin Table components here.</p>
            </div>
        </div>
    );
};

export default AdminDemo;