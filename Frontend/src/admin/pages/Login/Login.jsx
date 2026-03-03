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

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role);
        
        toast.success(`Welcome back, ${data.user.name}`);
        if(setIsAuthenticated) setIsAuthenticated(true);

        setTimeout(() => {
          switch (data.user.role) {
            case 'owner':
            case 'admin': navigate('/admin/dashboard'); break;
            case 'client': navigate(`/timeline/${data.user.leadId}`); break;
            default: navigate('/feed'); break;
          }
        }, 800);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Connection failed. Is the server running?");
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
            <label>Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>New here? <span onClick={() => navigate('/register')}>Join our community</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;