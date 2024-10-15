// ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./resetPassword.css"

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate()

  // Extract token and userId from the URL
  const token = new URLSearchParams(window.location.search).get('token');
  const userId = new URLSearchParams(window.location.search).get('userId'); // Add this line

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Include userId in the request payload
      const response = await axios.post('https://sv-agencys-backend.vercel.app/reset-password', { 
        token, 
        userId,      // Add userId here
        newPassword 
      });
      toast.success(response.data.message);
      navigate("/")
      // Optionally redirect the user after successful password reset
    } catch (err) {
      toast.error(err.response?.data?.error || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2>Reset Password</h2>
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
};

export default ResetPassword;
