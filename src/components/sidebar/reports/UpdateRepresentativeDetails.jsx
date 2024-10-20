import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './updateRepresentativeDetails.css';
import { supabase } from '../../../supabaseClient';
import { UserContext } from '../../context/UserContext';

const UpdateRepresentativeDetails = () => {
  const location = useLocation();
  const { rep } = location.state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    mobileNumber: '',
  });
  const {user} = useContext(UserContext);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if submission is in progress


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

    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setShowModal(true); // Show confirmation modal
    } else {
      setErrors(formErrors);
    }
  };


    const handleConfirmUpdate = async () => {
      setIsSubmitting(true);
      setShowModal(false);
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
            updatedby: user?.userid,
          })
          .eq('userid', rep.userid);

        if (error) {
          throw error;
        }

        if (error) {
          throw error;
        }
  
        // Redirect or show success message
        console.log('Representative details updated successfully');
        navigate('/portal/representativelist'); // Redirect after successful update
      } catch (error) {
        console.error('Error updating Representative details:', error);
        setErrors({ ...errors, submit: 'Failed to update details. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleCancel= () => {
    navigate('/portal/representativelist');
  }

  // return (
  //   <main id='main' className='main'>
  //     <Container>
  //       <Row>
  //         <Col>
  //           <h4 style={{ textAlign: "center" }}>Update Representative Details</h4>
  //         </Col>
  //       </Row>
  //       <Form onSubmit={handleSubmit} className="update-representative-form">
  //         <Row>
  //           <Col md={6}>
  //             <Form.Group controlId="name">
  //               <Form.Label>Representative Name</Form.Label>
  //               <Form.Control
  //                 type="text"
  //                 name="name"
  //                 placeholder="Enter Representative Name"
  //                 value={formData.name}
  //                 onChange={handleInputChange}
  //                 isInvalid={!!errors.name}
  //               />
  //               <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
  //             </Form.Group>
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col md={6}>
  //             <Form.Group controlId="email">
  //               <Form.Label>Email</Form.Label>
  //               <Form.Control
  //                 type="email"
  //                 name="email"
  //                 placeholder="Enter Email ID"
  //                 value={formData.email}
  //                 onChange={handleInputChange}
  //                 isInvalid={!!errors.email}
  //               />
  //               <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  
  //         <Row>
  //           <Col md={6}>
  //             <Form.Group controlId="mobileNumber">
  //               <Form.Label>Mobile Number</Form.Label>
  //               <Form.Control
  //                 type="text"
  //                 name="mobileNumber"
  //                 placeholder="Enter Mobile Number"
  //                 value={formData.mobileNumber}
  //                 onChange={handleInputChange}
  //                 isInvalid={!!errors.mobileNumber}
  //               />
  //               <Form.Control.Feedback type="invalid">{errors.mobileNumber}</Form.Control.Feedback>
  //             </Form.Group>
  //           </Col>
  //         </Row>
  
  //         <Row>
  //           <Col md={6}>
  //             <Form.Group controlId="address">
  //               <Form.Label>Address</Form.Label>
  //               <Form.Control
  //                 as="textarea"
  //                 name="address"
  //                 placeholder="Enter Address"
  //                 value={formData.address}
  //                 onChange={handleInputChange}
  //                 isInvalid={!!errors.address}
  //               />
  //               <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
  //             </Form.Group>
  //           </Col>
  //         </Row>

  //         <Button type="submit" style={{ minWidth: '100%', alignItems: 'center' }}>
  //           Submit
  //         </Button>
  //       </Form>
  //     </Container>
  //   </main>
  // );
  return (
    <main id='main' className='main'>
      <Container className="mt-5"> {/* Added mt-5 for top margin */}
        <Row className="justify-content-center"> {/* Center the Row */}
          <Col md={6} lg={4}> {/* Adjust column width for responsiveness */}
            <h4 className="text-center mb-4">Update Representative Details</h4> {/* Added mb-4 for bottom margin */}
            <Form onSubmit={handleSubmit} className="update-representative-form">
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

              <Button type="submit" className="mt-3 w-100" disabled={isSubmitting}>
                Submit
              </Button>
              <Button variant="secondary" className="w-48" onClick={handleCancel} style={{ alignItems: 'center',backgroundColor:'red' }}>
                Cancel
              </Button>
            </Form>
          </Col>
        </Row>
        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Update Representative Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update the details of <br/>{formData.name}?</Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="primary" className="me-auto" style={{ width: '100px'}} onClick={handleConfirmUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Confirm'}
            </Button>
            <Button variant="danger" style={{ width: '100px'}} onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
};

export default UpdateRepresentativeDetails;
