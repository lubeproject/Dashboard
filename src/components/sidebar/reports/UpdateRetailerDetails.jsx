// UpdateRetailerDetails.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import './updateRetailerDetails.css';
import {supabase} from '../../../supabaseClient';

const UpdateRetailerDetails = () => {
  const location = useLocation();
  const { retailer } = location.state || {};

  const [formData, setFormData] = useState({
    shopName: retailer?.shopname?.trim() || '',
    address: retailer?.address?.trim() || '',
    email: retailer?.email?.trim() || '',
    mobileNumber: retailer?.mobile?.trim() || '',
    qrCode: retailer?.qrcode?.trim() || '',
    ownerName: retailer?.name?.trim() || '',
    cgin: retailer?.cginno?.trim() || '',
    dob: retailer?.dob || '',
    shippingAddress: retailer?.shippingaddress?.trim() || '',
    monthlyPotential: retailer?.monthlypotential?.trim() || '',
    creditTerm: retailer?.creditterm?.trim() || '',
    segment: retailer?.segment?.trim() || '',
    geoLocation: retailer?.latitude && retailer?.longitude
    ? `${retailer.latitude}, ${retailer.longitude}`
    : '',
    rewardPointApplicable: retailer?.enablecheck === 'Y' || false,
    shopImage: retailer?.shopimgurl?.trim() || ''
  });

  const [creditTerms, setCreditTerms] = useState([]);
  const [segments, setSegments] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  useEffect(() => {
    fetchCreditTerms();
    fetchSegments();
  }, []);

  const fetchCreditTerms = async () => {
    const { data, error } = await supabase
      .from('credititem_master')
      .select('credittermname');
      
    if (error) {
      console.error('Error fetching credit terms:', error);
    } else {
      setCreditTerms(data);
    }
  };

  const fetchSegments = async () => {
    const { data, error } = await supabase
      .from('segment_master') // Assuming there's a segment_master table
      .select('segmentname');
    if (error) {
      console.error('Error fetching segments:', error.message);
    } else {
      const uniqueSegments = [...new Set(data.map(item => item.segmentname))];
      setSegments(uniqueSegments);
    }
  };

  const handleSegmentChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedSegments = prevState.segment.includes(value)
        ? prevState.segment.filter((segment) => segment !== value)
        : [...prevState.segment, value];
      return { ...prevState, segment: updatedSegments };
    });
    setErrors((prevErrors) => ({ ...prevErrors, segment: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, shopImage: URL.createObjectURL(file) });
      setErrors({ ...errors, shopImage: '' });
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          setFormData({ ...formData, geoLocation: location });
          setErrors({ ...errors, geoLocation: '' });
        },
        () => {
          setErrors({ ...errors, geoLocation: 'Location access denied' });
        }
      );
    }
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    
    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-based in JavaScript Date
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  };

  // const convertDateTimeFormat = (dateTimeStr) => {
  //   if (!dateTimeStr) return '';
  
  //   // Split date and time
  //   const [dateStr, timeStr] = dateTimeStr.split(' ');
  //   const [day, month, year] = dateStr.split('-').map(Number);
  //   const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  
  //   // Create Date object
  //   const date = new Date(year, month - 1, day, hours, minutes, seconds); // month is 0-based in JavaScript Date
  
  //   // Format date
  //   const yyyy = date.getFullYear();
  //   const mm = String(date.getMonth() + 1).padStart(2, '0');
  //   const dd = String(date.getDate()).padStart(2, '0');
  
  //   // Format time
  //   const hh = String(date.getHours()).padStart(2, '0');
  //   const min = String(date.getMinutes()).padStart(2, '0');
  //   const ss = String(date.getSeconds()).padStart(2, '0');
  
  //   return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  // };
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shopName) newErrors.shopName = 'Shop Name is required';
    if (!formData.cgin) newErrors.cgin = 'GCIN is required';
    if (!formData.qrCode) newErrors.qrCode = 'QR Code is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';
    if (!formData.address) newErrors.address = 'Billing Address is required';
    if (!formData.shippingAddress) newErrors.shippingAddress = 'Shipping Address is required';
    if (!formData.monthlyPotential) newErrors.monthlyPotential = 'Monthly Potential is required';
    if (!formData.creditTerm) newErrors.creditTerm = 'Credit Term is required';
    if (formData.segment.length === 0) newErrors.segment = 'At least one segment is required';
    if (!formData.geoLocation) newErrors.geoLocation = 'Geo Location is required';
    if (!formData.shopImage) newErrors.shopImage = 'Shop Image is required';

    return newErrors;
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formErrors = validateForm();
  //   if (Object.keys(formErrors).length === 0) {
  //     // Submit the form (e.g., send data to server)
  //     console.log('Form submitted:', formData);
  //   } else {
  //     setErrors(formErrors);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDob = convertDateFormat(formData.dob);
    // const formattedDob = convertDateTimeFormat(formData.dob);
    
    // Validate form data
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const { error } = await supabase
          .from('users')
          .update({
            shopname: formData.shopName,
            name: formData.ownerName,
            mobile: formData.mobileNumber,
            email: formData.email,
            address: formData.address,
            qrcode: formData.qrCode,
            shopimgurl: formData.shopImage,
            shippingaddress: formData.shippingAddress,
            segment: formData.segment.join(', '),
            enablecheck: formData.rewardPointApplicable ? 'Y' : 'N',
            monthlypotential: formData.monthlyPotential,
            longitude: formData.geoLocation.split(',')[1]?.trim() || '',
            latitude: formData.geoLocation.split(',')[0]?.trim() || '',
            creditterm: formData.creditTerm,
            cginno: formData.cgin,
            dob: formattedDob,
            updatedtime: new Date().toISOString(),
            lastupdatedtime: new Date().toISOString(), // Adjust if needed
          })
          .eq('userid', retailer.userid); // Ensure you update the correct retailer
  
        if (error) {
          throw error;
        }
  
        // Redirect or show success message
        console.log('Retailer details updated successfully');
        // Example: redirect to another page or show a success message
      } catch (error) {
        console.error('Error updating retailer details:', error);
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
            <h4 style={{ textAlign: "center" }}>Update Retailer Details</h4>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit} className="update-retailer-form">
          <Row>
            <Col md={6}>
              <Form.Group controlId="shopName">
                <Form.Label>Shop Name</Form.Label>
                <Form.Control
                  type="text"
                  name="shopName"
                  placeholder="Enter Shop Name"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.shopName}
                />
                <Form.Control.Feedback type="invalid">{errors.shopName}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="gcin">
                <Form.Label>GCIN</Form.Label>
                <Form.Control
                  type="text"
                  name="gcin"
                  placeholder="Enter GCIN"
                  value={formData.cgin}
                  onChange={handleInputChange}
                  isInvalid={!!errors.cgin}
                />
                <Form.Control.Feedback type="invalid">{errors.cgin}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="qrCode">
                <Form.Label>QR Code</Form.Label>
                <Form.Control
                  type="text"
                  name="qrCode"
                  placeholder="Enter QR Code"
                  value={formData.qrCode}
                  onChange={handleInputChange}
                  isInvalid={!!errors.qrCode}
                />
                <Form.Control.Feedback type="invalid">{errors.qrCode}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="ownerName">
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ownerName"
                  placeholder="Enter Owner Name"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  isInvalid={!!errors.ownerName}
                />
                <Form.Control.Feedback type="invalid">{errors.ownerName}</Form.Control.Feedback>
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
              <Form.Group controlId="dob">
                <Form.Label>DOB</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  placeholder="Enter DOB (YYYY-MM-DD)"
                  value={formData.dob}
                  onChange={handleInputChange}
                  isInvalid={!!errors.dob}
                />
                <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="address">
                <Form.Label>Billing Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  placeholder="Enter Billing Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  isInvalid={!!errors.address}
                />
                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="shippingAddress">
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                  as="textarea"
                  name="shippingAddress"
                  placeholder="Enter Shipping Address"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  isInvalid={!!errors.shippingAddress}
                />
                <Form.Control.Feedback type="invalid">{errors.shippingAddress}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="monthlyPotential">
                <Form.Label>Monthly Potential</Form.Label>
                <Form.Control
                  type="text"
                  name="monthlyPotential"
                  placeholder="Enter Monthly Potential"
                  value={formData.monthlyPotential}
                  onChange={handleInputChange}
                  isInvalid={!!errors.monthlyPotential}
                />
                <Form.Control.Feedback type="invalid">{errors.monthlyPotential}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="creditTerm">
                <Form.Label>Credit Term</Form.Label>
                <Form.Control
                  as="select"
                  name="creditTerm"
                  value={formData.creditTerm}
                  onChange={handleInputChange}
                  isInvalid={!!errors.creditTerm}
                >
                  <option value="">Select Credit Term</option>
                  {creditTerms.map((term, index) => (
                    <option key={index} value={term.credittermname}>
                      {term.credittermname}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.creditTerm}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="segment">
                <Form.Label>Segment</Form.Label>
                <div className="segment-checkboxes">
                  {segments.map((segment, index) => (
                    <Form.Check
                      inline
                      key={index}
                      type="checkbox"
                      label={segment}
                      value={segment}
                      checked={formData.segment.includes(segment)}
                      onChange={handleSegmentChange}
                      isInvalid={!!errors.segment}
                    />
                  ))}
                </div>
                <Form.Control.Feedback type="invalid">{errors.segment}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="geoLocation">
                <Form.Label>Shop Geo Location</Form.Label>
                <div className="geo-location">
                  <Button variant="outline-secondary" onClick={handleLocationClick}>
                    <FaMapMarkerAlt /> Take Current Location
                  </Button>
                  <Form.Control
                    type="text"
                    name="geoLocation"
                    placeholder="Enter Shop Geo Location"
                    value={formData.geoLocation}
                    onChange={handleInputChange}
                    isInvalid={!!errors.geoLocation}
                    readOnly
                  />
                </div>
                <Form.Control.Feedback type="invalid">{errors.geoLocation}</Form.Control.Feedback>
              </Form.Group>
            </Col>
  
            <Col md={6}>
              <Form.Group controlId="rewardPointApplicable">
                <Form.Label>Reward Point Applicable</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="rewardPointApplicable"
                  label="Reward Point Applicable"
                  checked={formData.rewardPointApplicable}
                  onChange={handleInputChange}
                  isInvalid={!!errors.rewardPointApplicable}
                />
                <Form.Control.Feedback type="invalid">{errors.rewardPointApplicable}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="shopImage">
                <Form.Label>Shop Image</Form.Label>
                <Form.Control
                  type="file"
                  name="shopImage"
                  onChange={handleImageChange}
                  isInvalid={!!errors.shopImage}
                />
                {formData.shopImage && (
                  <div className="shop-image-preview">
                    <img src={formData.shopImage} alt="Shop Preview" className="rounded-circle" />
                  </div>
                )}
                <Form.Control.Feedback type="invalid">{errors.shopImage}</Form.Control.Feedback>
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

export default UpdateRetailerDetails;