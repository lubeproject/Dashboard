// ResetPassword.js
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import 'react-toastify/dist/ReactToastify.css';
import { supabase } from "../../supabaseClient";

export default function AdminResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate()
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation: length check
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Check if both passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Update password using Supabase's auth.updateUser method
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      // Handle success or error from Supabase
      if (error) {
        throw new Error(error.message);
      }

      toast.success("Password has been updated successfully!");
      // Optionally, redirect the user after successful password reset
      // For example: 
      window.location.href = "/";

    } catch (err) {
      toast.error(err.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2>Admin Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <div className="password-container">
          <input 
            type={passwordVisible ? "text" : "password"} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            maxLength={50} // Limit to 50 characters
            required 
          />
          <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
              </div>
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <div className="password-container">
          
          <input 
            type={passwordVisible ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            maxLength={50} // Limit to 50 characters
            required 
          />
          <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
        </div>

        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <ToastContainer style={{ width: "fit-content"}}/>
      <br/>
      <h6>Go to Login Page <Link to="/">👇 Click here</Link></h6>
     
      </div>
    </div>
  );
}
