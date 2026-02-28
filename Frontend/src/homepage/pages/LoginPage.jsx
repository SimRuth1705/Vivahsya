import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext/AuthContext';
import axios from 'axios';
import './LoginPage.css'; // We'll make this look classy

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Talking to your backend on Port 5000
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            // Save user to context
            login(res.data.token);

            // Redirect logic: Admin goes to dashboard, Client stays home
            if (res.data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong. Vibe check failed!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Welcome to Vivahasya</h2>
                <p>Please login to manage your events</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            required 
                        />
                    </div>
                    <button type="submit" className="login-btn">LOG IN</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;