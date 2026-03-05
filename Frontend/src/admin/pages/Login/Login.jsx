import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { toast, Toaster } from "sonner";
  import API_BASE_URL from "../../../../config"; // 👈 1. Import your live config URL
  import "./login.css"

  const Login = () => {
    const [creds, setCreds] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      
      // 👈 2. Replaced hardcoded URL with API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast.success("Login Successful!");
        setTimeout(() => {
          data.user.role === "client" ? navigate("/client") : navigate("/admin/dashboard");
        }, 1200);
      } else {
        toast.error(data.message);
      }
    };

    return (
      <div className="login-container">
        <Toaster richColors />
        <form onSubmit={handleLogin}>
          <h2>Vivahasya Login</h2>
          <input name="username" placeholder="Username/Email" onChange={e => setCreds({...creds, username: e.target.value})} required />
          <input type="password" name="password" placeholder="Password" onChange={e => setCreds({...creds, password: e.target.value})} required />
          <button type="submit">Sign In</button>
        </form>
      </div>
    );
  };

  export default Login;