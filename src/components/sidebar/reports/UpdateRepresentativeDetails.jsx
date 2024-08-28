import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './updateRepresentativeDetails.css';
import { supabase } from '../../../supabaseClient';

const UpdateRepresentativeDetails = () => {
  const location = useLocation();
  const { rep } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({});

  // Populate form data with representative data when rep changes
  useEffect(() => {
    if (rep) {
      setFormData({
        name: rep.name?.trim() || '',
        address: rep.address?.trim() || '',
        email: rep.email?.trim() || '',
        mobileNumber: rep.mobile?.trim() || '',
      });
    }
  }, [rep]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            shopname: formData.name,
            name: formData.name,
            mobile: formData.mobileNumber,
            email: formData.email,
            address: formData.address,
            updatedtime: new Date().toISOString(),
            lastupdatedtime: new Date().toISOString(),
          })
          .eq('userid', rep.userid);

        if (error) {
          throw error;
        }

        // Redirect or show success message
        console.log('Representative details updated successfully');
        // Example: redirect to another page or show a success message
      } catch (error) {
        console.error('Error updating Representative details:', error);
        setErrors({ ...errors, submit: 'Failed to update details. Please try again.' });
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <main id='main' className='main'>
      <Container>
        <Row>
          <Col>
            <h4 style={{ textAlign: "center" }}>Update Representative Details</h4>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit} className="update-representative-form">
          <Row>
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Representative Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter Representative Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter Email ID"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="mobileNumber">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  isInvalid={!!errors.mobileNumber}
                />
                <Form.Control.Feedback type="invalid">{errors.mobileNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" style={{ minWidth: '100%', alignItems: 'center' }}>
            Submit
          </Button>
        </Form>
      </Container>
    </main>
  );
};

export default UpdateRepresentativeDetails;
