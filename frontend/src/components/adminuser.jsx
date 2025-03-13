import React, { useState, useEffect } from "react";
import '../asset/css/adduser.css';
import { fetchUsers, addUser, deleteUser, saveUser } from "../services/api";
import { useNavigate } from 'react-router-dom';
const Adminuser = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    role: "member",
    adress: "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); 
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedForm = { ...form };
  
      if (!updatedForm.password.trim()) {
        delete updatedForm.password;
      }
  
      if (editing) {
        await saveUser(updatedForm, editing);
      } else {
        await addUser(updatedForm);
      }
  
      loadUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      adress: user.adress,
    });
    setEditing(true);
    setShowForm(true);
  };
  

  const resetForm = () => {
    setForm({ id: null, username: "", email: "", password: "", role: "member", adress: "" });
    setEditing(false);
    setShowForm(false);
  };

  return (
    <div className="admin-panel">
      <button className="back-btn-pd" onClick={() => navigate(-1)}>Back</button>
      <h2>Admin User Panel</h2>
      
      {!showForm && (
        <button className="show-form-btn" onClick={() => setShowForm(true)}><div tabindex="0" class="plusButton">
        <svg class="plusIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
          <g mask="url(#mask0_21_345)">
            <path d="M13.75 23.75V16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75Z"></path>
          </g>
        </svg>
      </div></button>
      )}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!editing}
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <input type="text" placeholder="Address" value={form.adress} onChange={(e) => setForm({ ...form, adress: e.target.value })} />
          <button className='btn-submit-user' type="submit">{editing ? "Update User" : "Add User"}</button>
          <button  className='btn-cancle-user' type="button" onClick={resetForm}>Cancel</button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(users) ? users : []).map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.adress}</td>
              <td className="action-buttons">
                <button className="admin-edit-btn" onClick={() => handleEdit(user)}>Edit</button>
                <button className="admin-delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Adminuser;
