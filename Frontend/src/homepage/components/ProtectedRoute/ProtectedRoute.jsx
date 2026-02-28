import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useContext(AuthContext);

    // 1. Wait for the "vibe check" (checking if a token exists in localStorage)
    if (loading) {
        return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;
    }

    // 2. If no user is logged in, kick them to the login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    // 3. If the route is for admins ONLY and the user isn't an admin, send them home
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // 4. If everything is cool, let them through to the page!
    return children;
};

export default ProtectedRoute;