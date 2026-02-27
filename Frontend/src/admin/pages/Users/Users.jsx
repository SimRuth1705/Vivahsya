import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import {
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiOutlineRefresh,
} from "react-icons/hi";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  // --- 1. Fetch Users with Token ---
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // <--- THE FIX
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        toast.error(data.message || "Unauthorized access");
      }
    } catch (error) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. Add New User ---
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success("New team member added!");
        setShowAddModal(false);
        fetchUsers(); // Refresh list
      } else {
        const err = await response.json();
        toast.error(err.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  // --- 3. Toggle Status (Active/Inactive) ---
  const toggleStatus = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/status/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        toast.info("User status updated");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Could not update status");
    }
  };

  // --- 4. Delete User ---
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/users/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        toast.success("User removed from system");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="loading">Loading Team...</div>;

  return (
    <div className="users-page">
      <Toaster position="top-right" richColors />

      <div className="users-header">
        <div>
          <h1>Team Management</h1>
          <p>Control who can access the Vivahasya Admin Panel</p>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <HiOutlineUserAdd /> Add Member
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="user-name">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-tag ${u.role}`}>{u.role}</span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(u._id)}
                    className={`status-btn ${u.status.toLowerCase()}`}
                  >
                    {u.status}
                  </button>
                </td>
                <td className="actions">
                  {u.role !== "owner" && (
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="delete-icon"
                    >
                      <HiOutlineTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="user-modal">
            <h2>Add New Team Member</h2>
            <form onSubmit={handleAddUser}>
              <input
                placeholder="Full Name"
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Initial Password"
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
              <div className="field-wrapper" style={{ marginTop: "15px" }}>
                <label
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748b",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Assign Role
                </label>
                <CustomDropdown
                  options={["employee", "owner"]}
                  selected={newUser.role}
                  onSelect={(val) => setNewUser({ ...newUser, role: val })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
