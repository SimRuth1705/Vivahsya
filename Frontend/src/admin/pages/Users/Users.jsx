import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import { HiOutlineTrash, HiOutlineUserAdd } from "react-icons/hi";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Updated state: 'username' instead of 'email'
  const [newUser, setNewUser] = useState({ 
    name: "", 
    username: "", 
    password: "", 
    role: "employee" 
  });

  const API_URL = "http://127.0.0.1:5000/api/auth";

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
      else toast.error(data.message || "Unauthorized access");
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success("New team member added!");
        setShowAddModal(false);
        setNewUser({ name: "", username: "", password: "", role: "employee" }); // Reset
        fetchUsers();
      } else {
        const err = await response.json();
        toast.error(err.message || "Registration failed");
      }
    } catch (error) { toast.error("Network error"); }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/status/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        toast.info("User status updated");
        fetchUsers();
      }
    } catch (error) { toast.error("Update failed"); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        toast.success("User removed");
        fetchUsers();
      }
    } catch (error) { toast.error("Delete failed"); }
  };

  if (loading) return <div className="loading">Loading Team...</div>;

  return (
    <div className="users-page">
      <Toaster position="top-right" richColors />
      <div className="users-header">
        <h1>Team Management</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}><HiOutlineUserAdd /> Add Member</button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            {/* Table header updated to 'Username' */}
            <tr><th>Name</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                {/* Display username here */}
                <td>{u.username}</td>
                <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                <td>
                  <button onClick={() => toggleStatus(u._id)} className={`status-btn ${u.status.toLowerCase()}`}>
                    {u.status}
                  </button>
                </td>
                <td>
                  {u.role !== "owner" && (
                    <button onClick={() => deleteUser(u._id)} className="delete-icon"><HiOutlineTrash /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <h2>Add New Team Member</h2>
            <form onSubmit={handleAddUser}>
              <input 
                placeholder="Full Name" 
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} 
                required 
              />
              {/* Field changed to Username */}
              <input 
                type="text" 
                placeholder="Username" 
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} 
                required 
              />
              <input 
                type="password" 
                placeholder="Initial Password" 
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                required 
              />
              
              <div className="field-wrapper" style={{ marginTop: "15px" }}>
                <label style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px", display: "block" }}>
                  Assign Role
                </label>
                <CustomDropdown 
                  options={[
                    { label: "Employee", value: "employee" },
                    { label: "Owner", value: "owner" }
                  ]} 
                  selected={newUser.role} 
                  onSelect={(val) => setNewUser({ ...newUser, role: val })} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;