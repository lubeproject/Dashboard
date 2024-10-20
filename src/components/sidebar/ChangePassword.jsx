import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import "./changePassword.css"; // Ensure to create or update this CSS file
import { UserContext } from "../context/UserContext";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { supabase } from "../../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitAdmin = async (e) => {
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


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');
    setIsLoading(true);
    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    } else if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      setIsLoading(false);
      return;
    } else if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    // Hash the new password using bcryptjs
    const salt = 10;
    const hashedPassword = await bcrypt.hash(newPassword, salt);
   
    // Update the user's password in the 'users' table
    try {
      const { data, error: updateError } = await supabase
        .from('users') // Make sure this is the correct table name in your schema
        .update({ password: hashedPassword })
        .eq('userid', user.userid); // Assuming `user.id` is the user's unique ID in the `users` table

      if (updateError) {
        setError('Failed to update password. Please try again.');
        setIsLoading(false);
        console.error(updateError);
        return;
      }

      setSuccess('Password changed successfully!');
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error(error);
    }finally {
      setIsLoading(false); // Stop loading when finished
    }
  };


  return (
    <main id='main' className='main'>
      { user.role === "admin"  ?<>
<br/>
<br/>
        <Container>
        <Row className="justify-content-center">
        <Col md={8} lg={6} xl={4} >
      <h2 className='text-center'>Admin Password change</h2>
      <form onSubmit={handleSubmitAdmin} className="mt-4">
      <br/>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={user.email} 
            onChange={(e) => setEmail(e.target.value)} 
            maxLength={50} // Limit to 50 characters
            required 
            disabled
          />
        </div>
        <button type="submit" disabled={isLoading} className='btn btn-primary'>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      <ToastContainer/>
<br/>
   
</Col>
        </Row>
        </Container>
</>  : <>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={4} >
            <h2 className="text-center">Change Password</h2>

            <br/>
            <br/>
            <Form onSubmit={handleSubmit} className="mt-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group controlId="formNewPassword"  className="form-group">
                <Form.Label>New Password</Form.Label>
                <div className="password-container">
                <Form.Control
                 type={passwordVisible ? "text" : "password"} 
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={error && !newPassword ? 'error-border' : ''}
                />
                 <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
                </div>
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="form-group">
                <Form.Label>Confirm New Password</Form.Label>
                <div className="password-container">
                <Form.Control
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={error && !confirmPassword ? 'error-border' : ''}
                />
                  <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="eye-icon"
                onClick={togglePasswordVisibility}
              />
                </div>
              </Form.Group>

              <Button variant="primary" type="submit" className=" mt-3">
              {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      </>
      }
    </main>
  );
}
