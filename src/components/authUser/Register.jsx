import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

export default function Register() {
  const [role, setRole] = useState('admin');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    try {
      // Register user with Supabase
      const { user, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) throw signupError;

      // Prepare user data for insertion
      const userData = {
        userId: user.id,
        role,
        mobile,
        name,
        address,
        email,
        password, // Avoid storing plain passwords in real applications
        shopName: '', // Default or input field
        enableCheck: 'N',
        qrcode: '', // Generate or provide a default value
        active: 'N', // Set to 'N' or appropriate value for pending approval
        updatedBy: 0, // Set appropriate value
        visitingDay: '', // Set appropriate value
        shopimgUrl: '', // Default or input field
        shippingAddress: '', // Default or input field
        segment: '', // Default or input field
        rewardPoints: 0,
        representativeName: '', // Default or input field
        representativeId: 0, // Set appropriate value
        monthlyPotential: '', // Default or input field
        longitude: '', // Default or input field
        latitude: '', // Default or input field
        creditTerm: '', // Default or input field
        creditDays: '', // Default or input field
        cGinNo: '', // Default or input field
        dob: null, // Default or input field
        lastUpdatedTime: new Date().toISOString(),
        locatedDate: new Date().toISOString(),
        noOfEmployees: '', // Default or input field
        shopimgUrl2: '', // Default or input field
        spaceType: '', // Default or input field
        totalArea: '', // Default or input field
        workshopArea: '', // Default or input field
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString(),
        deviceToken: '', // Default or input field
      };

      // Insert user data into the "pending approvals" table
      const { data, error: insertError } = await supabase
        .from('pending_users')
        .insert([userData]);

      if (insertError) throw insertError;

      // Show alert and redirect
      alert('Registration successful! Your account is waiting for admin approval.');
      navigate('/'); // Navigate to login page on successful registration
    } catch (error) {
      console.error('Error registering:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2><b>Register to Lube</b></h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="inline-group">
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="retailer">Retailer</option>
                <option value="mechanic">Mechanic</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number:</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
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
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-container">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
              <FontAwesomeIcon
                icon={confirmPasswordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={toggleConfirmPasswordVisibility}
              />
            </div>
            {!passwordMatch && <p className="error-message">Passwords didn't match</p>}
          </div>
          <button type="submit">Register</button>
        </form>
        <p>
          Already registered user? <Link to="/">Please Login</Link>
        </p>
      </div>
    </div>
  );
}
