// AdminApproval.jsx
import React, { useState, useEffect } from 'react';
import { getUsersForApproval, approveUser, declineUser } from '../auth/userService'; // Assuming this file handles pending user data
import { supabase } from '../../supabaseClient';
import './AdminApproval.css';

const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    // Fetch pending users
    getUsersForApproval().then((data) => {
      setPendingUsers(data);
    });
  }, []);

  // Function to approve a user
  const handleApprove = async (userId) => {
    try {
      const userToApprove = pendingUsers.find(user => user.userId === userId);
      const { data, error } = await supabase
        .from('users')
        .insert([userToApprove]);

      if (error) throw error;

      // Remove from pending users
      setPendingUsers(pendingUsers.filter(user => user.userId !== userId));
    } catch (error) {
      console.error('Error approving user:', error.message);
    }
  };

  // Function to decline a user
  const handleDecline = async (userId) => {
    try {
      // Remove from pending users
      setPendingUsers(pendingUsers.filter(user => user.userId !== userId));
    } catch (error) {
      console.error('Error declining user:', error.message);
    }
  };

  return (
    <div className="admin-approval-container">
      <h2>Pending User Approvals</h2>
      <div className="pending-users-list">
        {pendingUsers.map(user => (
          <div key={user.userId} className="user-item">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <div className="action-buttons">
              <button onClick={() => handleApprove(user.userId)}>Approve</button>
              <button onClick={() => handleDecline(user.userId)}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApproval;
