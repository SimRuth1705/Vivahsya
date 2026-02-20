import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after login
import { Toaster, toast } from 'sonner';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 👇 Connect to your Backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Save the "Badge"
        localStorage.setItem('user', JSON.stringify(data.user)); // Save user info
        
        toast.success("Welcome back!");
        
        // Update App state (if you have one)
        if(setIsAuthenticated) setIsAuthenticated(true);

        // Redirect to Dashboard
        setTimeout(() => navigate('/admin/dashboard'), 800); 
      } else {
        // ❌ Error (Wrong password, etc)
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Server error. Is the backend running?");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" richColors />
      
      <div className="login-card">
        <div className="login-header">
          <h1>Vivahasya Admin</h1>
          <p>Enter your credentials to access the panel.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@eventapp.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Forgot password? Contact the Owner.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;