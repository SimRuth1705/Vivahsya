import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // 1. Guard against non-JSON responses (prevents the SyntaxError)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text(); // See what the server actually sent
        console.error("Server returned non-JSON:", text);
        throw new Error("Server configuration error: Expected JSON but received HTML.");
      }

      const data = await response.json();

      if (response.ok) {
        // 2. Successful Login Logic
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);

        if (setIsAuthenticated) setIsAuthenticated(true);
        toast.success(`Welcome back, ${data.user.name}`);

        setTimeout(() => {
          if (data.user.role === 'owner' || data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate(`/client/timeline/${data.user.leadId}`);
          }
        }, 800);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message || "Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neat-login-wrapper">
      <Toaster position="top-right" richColors />
      <div className="login-box">
        <div className="login-header">
          <div className="v-logo">V</div>
          <h1>Vivahasya</h1>
          <p>Login to your portal</p>
        </div>

        <form onSubmit={handleLogin} className="neat-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="admin@vivahasya.com" 
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

          <button type="submit" className="prime-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Need help? Contact system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Login;