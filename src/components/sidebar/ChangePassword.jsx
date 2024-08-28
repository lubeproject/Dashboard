import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import "./changePassword.css"; // Ensure to create or update this CSS file

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      hasError = true;
    } else if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      hasError = true;
    }

    if (hasError) return;

    // Clear previous errors and set success message
    setSuccess('Password changed successfully!');
    
    // Here you would typically send the form data to your server
    console.log({
      newPassword
    });
  };

  return (
    <main id='main' className='main'>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={4} >
            <h2 className="text-center">Change Password</h2>

            <br/>
            <br/>
            <Form onSubmit={handleSubmit} className="mt-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form.Group controlId="formNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={error && !newPassword ? 'error-border' : ''}
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={error && !confirmPassword ? 'error-border' : ''}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className=" mt-3">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
