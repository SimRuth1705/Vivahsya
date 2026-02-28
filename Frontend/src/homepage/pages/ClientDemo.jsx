import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ClientDemo = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ padding: "120px 20px", textAlign: "center", minHeight: "100vh" }}>
            <h1>❤️ My Wedding Dashboard</h1>
            <p>Hello, <strong>{user?.username}</strong>! We're excited to plan your big day.</p>
            <div style={{ marginTop: "30px", border: "1px solid #eee", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                <h3>Client Team Workspace</h3>
                <p>Integration Point: Drop Client Booking/Inquiry forms here.</p>
            </div>
        </div>
    );
};

export default ClientDemo;