import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    // e.preventDefault();
    // setError(null);
    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   });
    //   if (error) throw error;
    //   console.log('Login successful!', data);
    //   alert('Login successful!');
      navigate('/portal/homepage');
    // } catch (error) {
    //   console.error('Error logging in:', error.message);
    //   setError(error.message);
    // }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2><b>Login to Lube</b></h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
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
                onChange={(e) => setPassword(e.target.value)}
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
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          New User? <Link to="/register">Please Register</Link>
        </p>
      </div>
    </div>
  );
}
