// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(API_URL, {
        ...formData,
        id: Date.now() // Temporary ID for demo
      });
      
      setUsers(prev => [...prev, response.data]);
      setFormData({ name: '', email: '', phone: '', website: '' });
      setError('');
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/${editingUser.id}`, formData);
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? response.data : user
      ));
      
      setEditingUser(null);
      setFormData({ name: '', email: '', phone: '', website: '' });
      setError('');
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set user for editing
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', website: '' });
  };

  return (
    <div className="App">
      <div className="container">
        <h1>React CRUD Application</h1>
        
        {error && <div className="error">{error}</div>}
        
        {/* User Form */}
        <div className="form-container">
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={editingUser ? handleUpdate : handleCreate}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <input
                type="url"
                name="website"
                placeholder="Website"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : (editingUser ? 'Update' : 'Create')}
              </button>
              {editingUser && (
                <button type="button" onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="users-container">
          <h2>Users List</h2>
          {loading && !users.length ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-users">No users found</div>
          ) : (
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                  <p>Website: {user.website}</p>
                  <div className="user-actions">
                    <button 
                      onClick={() => handleEdit(user)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;