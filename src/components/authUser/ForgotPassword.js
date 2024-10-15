// ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "./forgotPassword.css"
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.length > 50) {
      toast.error("Email must be 50 characters or less.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('https://sv-agencys-backend.vercel.app/forgot-password', { email });
      toast.success(response.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            maxLength={50} // Limit to 50 characters
            required 
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <ToastContainer/>
<br/>
      <h6>Go to Login Page <Link to="/">👇 Click here</Link></h6>
      </div>
    </div>
  );
};

export default ForgotPassword;
