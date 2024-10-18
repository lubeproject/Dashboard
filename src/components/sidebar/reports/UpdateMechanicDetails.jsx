// UpdateMechanicDetails.jsx
import React, { useContext, useState} from 'react';
import { Form, Button, Container, Row, Col,Modal } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './updateMechanicDetails.css';
import {supabase} from '../../../supabaseClient';
import { UserContext } from '../../context/UserContext';

const UpdateMechanicDetails = () => {
  const location = useLocation();
  const { mechanic } = location.state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shopName: mechanic?.shopname?.trim() || '',
    address: mechanic?.address?.trim() || '',
    email: mechanic?.email?.trim() || '',
    mobileNumber: mechanic?.mobile?.trim() || '',
    qrCode: mechanic?.qrcode?.trim() || '',
    ownerName: mechanic?.name?.trim() || '',
    space: mechanic?.space?.trim() || '',
    dob: mechanic?.dob || '',
    locateddate : mechanic?.locateddate || '' ,
    noofemployees:mechanic?.noofemployees || '',
    monthlyPotential: mechanic?.monthlypotential?.trim() || '',
    totalarea: mechanic?.totalarea?.trim() || '',
    geoLocation: mechanic?.latitude && mechanic?.longitude
    ? `${mechanic.latitude}, ${mechanic.longitude}`
    : '',
    shopImage1: mechanic?.shopimgurl?.trim() || '',
    shopImage2: mechanic?.shopimgurl2?.trim() || '',
    shopImageFile: null,
    shopImage2File: null,
  });

  const [errors, setErrors] = useState({});
  const {user} = useContext(UserContext);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track if submission is in progress

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

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: URL.createObjectURL(file),
        [`${fieldName}File`]: file,
      });
      setErrors({ ...errors, [fieldName]: '' });
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
    if (!formData.qrCode) newErrors.qrCode = 'QR Code is required';
    if (!formData.ownerName) newErrors.ownerName = 'Owner Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.monthlyPotential) newErrors.monthlyPotential = 'Monthly Potential is required';
    if (!formData.geoLocation) newErrors.geoLocation = 'Geo Location is required';
    if (!formData.shopImage1) newErrors.shopImage1 = 'Shop Image is required';
    
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

  const uploadImage = async (file, folderName) => {
    const mobileNumber = formData.mobileNumber;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${mobileNumber}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from('shopimages')
      .upload(`${folderName}/${fileName}`, file, {
        upsert: true, // This option allows replacing the existing file
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: publicData, error: urlError } = supabase
      .storage
      .from('shopimages')
      .getPublicUrl(`${folderName}/${fileName}`);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return null;
    }

    return publicData.publicUrl;
  };
  const handleSubmit = (e) => {
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
    const formattedDob = convertDateFormat(formData.dob);
    const formattedlocateddate = convertDateFormat(formData.locateddate);
    try {
      let shopImageUrl = formData.shopImage1;
      let shopImage2Url = formData.shopImage2;

      if (formData.shopImageFile) {
        shopImageUrl = await uploadImage(formData.shopImageFile, 'Image1');
        if (!shopImageUrl) {
          setErrors({ ...errors, shopImage: 'Failed to upload image' });
          return;
        }
      }

      if (formData.shopImage2File) {
        shopImage2Url = await uploadImage(formData.shopImage2File, 'Image2');
        if (!shopImage2Url) {
          setErrors({ ...errors, shopImage2: 'Failed to upload image' });
          return;
        }
      }
      const { error } = await supabase
        .from('users')
        .update({
          shopname: formData.shopName,
          name: formData.ownerName,
          mobile: formData.mobileNumber,
          email: formData.email,
          address: formData.address,
          qrcode: formData.qrCode,
          shopimgurl: shopImageUrl,
          shopimgurl2: shopImage2Url,
          totalarea: formData.totalarea,
          noofemployees: formData.noofemployees,
          monthlypotential: formData.monthlyPotential,
          longitude: formData.geoLocation.split(',')[1]?.trim() || '',
          latitude: formData.geoLocation.split(',')[0]?.trim() || '',
          spacetype: formData.spacetype,
          dob: formattedDob,
          locateddate:formattedlocateddate,
          updatedtime: new Date().toISOString(),
          lastupdatedtime: new Date().toISOString(), // Adjust if needed
          updatedby: user?.userid,
        })
        .eq('userid', mechanic.userid); // Ensure you update the correct mechanic

      if (error) {
        throw error;
      }

      // Redirect or show success message
      console.log('mechanic details updated successfully');
      navigate('/portal/mechaniclist');
      // Example: redirect to another page or show a success message
    } catch (error) {
      console.error('Error updating mechanic details:', error);
      setErrors({ ...errors, submit: 'Failed to update details. Please try again.' });
    }finally {
      setIsSubmitting(false);
    }
  };


  const handleCancel= () => {
    navigate('/portal/mechaniclist');
  }

  return (
    <main id='main' className='main'>
      <Container>
        <Row>
          <Col>
            <h4 style={{ textAlign: "center" }}>Update Mechanic Details</h4>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit} className="update-mechanic-form">
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
              <Form.Group controlId="ownerName">
                <Form.Label>Name</Form.Label>
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
                <Form.Label>Mobile Number (**Unnati Registered)</Form.Label>
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
            <Col md={6}>
              <Form.Group controlId="totalarea">
                <Form.Label>totalarea</Form.Label>
                <Form.Control
                  type="text"
                  name="totalarea"
                  placeholder="Total Area of Workshop in Sq.Ft."
                  value={formData.totalarea}
                  onChange={handleInputChange}
                  isInvalid={!!errors.totalarea}
                />
                <Form.Control.Feedback type="invalid">{errors.totalarea}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
          <Col md={6}>
              <Form.Group controlId="noofemployees">
                <Form.Label>No. of Employees</Form.Label>
                <Form.Control
                  type="text"
                  name="noofemployees"
                  placeholder="Enter No. of Employees"
                  value={formData.noofemployees}
                  onChange={handleInputChange}
                  isInvalid={!!errors.noofemployees}
                />
                <Form.Control.Feedback type="invalid">{errors.noofemployees}</Form.Control.Feedback>
              </Form.Group>
            </Col>
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
          </Row>
  
          <Row>
            <Col md={6}>
              <Form.Group controlId="locateddate">
                <Form.Label>Locate Date</Form.Label>
                <Form.Control
                  type="date"
                  name="locateddate"
                  placeholder="Enter Date from when on this location (YYYY-MM-DD)"
                  value={formData.locateddate}
                  onChange={handleInputChange}
                  isInvalid={!!errors.locateddate}
                />
                <Form.Control.Feedback type="invalid">{errors.locateddate}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="space">
                <Form.Label>Space Type</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    name="space"
                    label="Owned"
                    value="Owned"
                    checked={formData.space === 'Owned'}
                    onChange={handleInputChange}
                    inline
                  />
                  <Form.Check
                    type="radio"
                    name="space"
                    label="Rent"
                    value="Rent"
                    checked={formData.space === 'Rent'}
                    onChange={handleInputChange}
                    inline
                  />
                </div>
                <Form.Control.Feedback type="invalid">{errors.space}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <center>
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
            </center>

          </Row>
  
          <Row>
            <h6><center> Shop Images</center></h6>
            <Col md={6}>
              <Form.Group controlId="shopImage1">
                {/* <Form.Label>Shop Image</Form.Label> */}
                <Form.Control
                  type="file"
                  name="shopImage1"
                  onChange={(e) => handleImageChange(e, 'shopImage')}
                  isInvalid={!!errors.shopImage}
                />
                {formData.shopImageFile && (
                  <div className="shop-image-preview">
                    <img src={formData.shopImage} alt="Shop Preview" className="rounded-circle" />
                  </div>
                )}
                <Form.Control.Feedback type="invalid">{errors.shopImage1}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="shopImage2">
                {/* <Form.Label>Shop Images</Form.Label> */}
                <Form.Control
                  type="file"
                  name="shopImage2"
                  onChange={(e) => handleImageChange(e, 'shopImage')}
                  isInvalid={!!errors.shopImage2}
                />
                {formData.shopImage2File && (
                  <div className="shop-image-preview 2">
                    <img src={formData.shopImage2} alt="Shop Preview" className="rounded-circle" />
                  </div>
                )}
                <Form.Control.Feedback type="invalid">{errors.shopImage2}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="mt-3 w-100" disabled={isSubmitting}>
            Submit
          </Button>
          <Button variant="secondary" className="w-48" onClick={handleCancel} style={{ alignItems: 'center',backgroundColor:'red' }}>
            Cancel
          </Button>
        </Form>
        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Update Mechanic Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to update the details of <br/> {formData.shopName}?</Modal.Body>
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

export default UpdateMechanicDetails;
