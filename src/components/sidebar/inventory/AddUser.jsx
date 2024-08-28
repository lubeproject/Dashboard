import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient';
import "./addUser.css";

export default function AddUser() {

  const [formData, setFormData] = useState({
    userType: '',
    shopName: '',
    name: '',
    email: '',
    mobileNumber: '',
    address: '',
    password: '',
    rewardPointsApplicable: false,
    qrCode: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'userType':
        if (!value) error = 'User type is required';
        break;
      case 'shopName':
        if (!value) error = 'Shop Name is required';
        break;
      case 'name':
        if (!value) error = 'Name is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        break;
      case 'mobileNumber':
        if (!value) error = 'Mobile Number is required';
        break;
      case 'address':
        if (!value) error = 'Address is required';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Validate the specific field and clear error if valid
    const error = validateField(name, type === 'checkbox' ? checked : value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, userType: e.target.value });

    // Validate the specific field and clear error if valid
    const error = validateField('userType', e.target.value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      userType: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.userType) newErrors.userType = 'User type is required';
    if (!formData.shopName) newErrors.shopName = 'Shop Name is required';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile Number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Handle form submission
      try {
        // Check if the mobile number is already registered
        const { data: existingUsers, error: existingUsersError } = await supabase
          .from('users')
          .select('mobile')
          .eq('mobile', formData.mobileNumber);

        if (existingUsersError) {
          console.error('Error checking mobile number:', existingUsersError.message);
          return;
        }

        if (existingUsers.length > 0) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            mobileNumber: 'This mobile number is already registered',
          }));
          return;
        }

        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              shopname: formData.shopName,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobileNumber,
              address: formData.address,
              password: formData.password,
              role: formData.userType,
              enablecheck: formData.rewardPointsApplicable ? 'Y' : 'N',
              qrcode: formData.qrCode,
              cginno: formData.qrCode,
              updatedby: 0,  // Insert Updated userid
              lastupdatedtime: new Date().toISOString(),
              createdtime: new Date().toISOString(),
              updatedtime: new Date().toISOString(),
            }
          ]);

        if (error) {
          console.error('Error:', error.message);
        } else {
          console.log('User added:', data);
          window.location.reload();
          setFormData({
            userType: '',
            shopName: '',
            name: '',
            email: '',
            mobileNumber: '',
            address: '',
            password: '',
            rewardPointsApplicable: false,
            qrCode: ''
          });
          setErrors({});
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const HighlightedLabel = ({ text, highlight }) => {
    const escapedHighlight = escapeRegExp(highlight);
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

    return (
      <label>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ color: 'blue' }}>{part}</span>
          ) : (
            part
          )
        )}
      </label>
    );
  };

  return (
//     <main id='main' className='main'>
//       <Container>
//         <Row>
//           <Col>
//             <h4 style={{ textAlign: "center" }}>Register User</h4>
//           </Col>
//         </Row>
//         <Row className="justify-content-md-center mt-4">
//           <Col md={6}>
//             <Form onSubmit={handleSubmit}>
//               <Form.Group controlId="formUserType" className="mb-3">
//                 <Form.Label>Select One</Form.Label>
//                 <div>
//                   <Form.Check
//                     id="formUserTypeRetailer"
//                     inline
//                     label="Retailer"
//                     name="userType"
//                     type="radio"
//                     value="retailer"
//                     onChange={handleRadioChange}
//                     isInvalid={!!errors.userType}
//                   />
//                   <Form.Check
//                     id="formUserTypeRepresentative"
//                     inline
//                     label="Representative"
//                     name="userType"
//                     type="radio"
//                     value="representative"
//                     onChange={handleRadioChange}
//                     isInvalid={!!errors.userType}
//                   />
//                   <Form.Check
//                     id="formUserTypeMechanic"
//                     inline
//                     label="Mechanic"
//                     name="userType"
//                     type="radio"
//                     value="mechanic"
//                     onChange={handleRadioChange}
//                     isInvalid={!!errors.userType}
//                   />
//                 </div>
//                 <Form.Control.Feedback type="invalid">
//                   {errors.userType}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               <Form.Group controlId="formShopName" className="mb-3">
//                 <Form.Label>Shop Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="shopName"
//                   value={formData.shopName}
//                   onChange={handleChange}
//                   isInvalid={!!errors.shopName}
//                   placeholder="Shop Name"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.shopName}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               <Form.Group controlId="formName" className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   isInvalid={!!errors.name}
//                   placeholder="Name"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.name}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               <Form.Group controlId="formEmail" className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   isInvalid={!!errors.email}
//                   placeholder="Email"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.email}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               {(formData.userType !== 'mechanic') && (
//                 <Form.Group controlId="formMobileNumber" className="mb-3">
//                   <Form.Label>Mobile Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="mobileNumber"
//                     value={formData.mobileNumber}
//                     maxLength={10}
//                     onChange={handleChange}
//                     isInvalid={!!errors.mobileNumber}
//                     placeholder="Mobile Number"
//                   />
//                   <Form.Control.Feedback type="invalid">
//                   {errors.mobileNumber}
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}

//           {(formData.userType === 'mechanic') && (
//             <Form.Group controlId="formMobileNumber" className="mb-3">
//               <Form.Label><HighlightedLabel text="Mobile Number (**Unnathi Registered Number)" highlight="(**Unnathi Registered Number)" /></Form.Label>
//               <Form.Control
//                 type="text"
//                 name="mobileNumber"
//                 value={formData.mobileNumber}
//                 maxLength={10}
//                 onChange={handleChange}
//                 isInvalid={!!errors.mobileNumber}
//                 placeholder="Mobile Number"
//               />
//               <Form.Control.Feedback type="invalid">
//                 {errors.mobileNumber}
//               </Form.Control.Feedback>
//             </Form.Group>
//           )}
          
//           <Form.Group controlId="formAddress" className="mb-3">
//             <Form.Label>Address</Form.Label>
//             <Form.Control
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               isInvalid={!!errors.address}
//               placeholder="Address"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.address}
//             </Form.Control.Feedback>
//           </Form.Group>

//           <Form.Group controlId="formPassword" className="mb-3">
//             <Form.Label>Password</Form.Label>
//             <InputGroup>
//               <Form.Control
//                 type={showPassword ? 'text' : 'password'}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 isInvalid={!!errors.password}
//                 placeholder="Password"
//               />
//               <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
//                 <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//               </InputGroup.Text>
//               <Form.Control.Feedback type="invalid">
//                 {errors.password}
//               </Form.Control.Feedback>
//             </InputGroup>
//           </Form.Group>

//           {(formData.userType === 'retailer' || formData.userType === 'mechanic') && (
//             <Form.Group controlId="formQRCode" className="mb-3">
//               <Form.Label>QR Code</Form.Label>
//               <InputGroup>
//                 <FormControl
//                   type="text"
//                   name="qrCode"
//                   value={formData.qrCode}
//                   onChange={handleChange}
//                   placeholder="QR Code"
//                 />
//                 <InputGroup.Text>
//                   <FontAwesomeIcon icon={faQrcode} />
//                 </InputGroup.Text>
//               </InputGroup>
//             </Form.Group>
//           )}

//           {formData.userType === 'retailer' && (
//             <Form.Group controlId="formRewardPoints" className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 label="Reward Points Applicable"
//                 name="rewardPointsApplicable"
//                 checked={formData.rewardPointsApplicable}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           )}

//           <Button variant="primary" type="submit" block>
//             Submit
//           </Button>
//         </Form>
//       </Col>
//     </Row>
//   </Container>
// </main>
<main id="main" className="main">
  <Container>
    <Row>
      <Col>
        <h4 style={{ textAlign: "center" }}>Register User</h4>
      </Col>
    </Row>
    <Row className="justify-content-md-center mt-4">
      <Col md={8}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUserType" className="mb-3">
            <Form.Label>Select One</Form.Label>
            <div>
              <Form.Check
                id="formUserTypeRetailer"
                inline
                label="Retailer"
                name="userType"
                type="radio"
                value="retailer"
                onChange={handleRadioChange}
                isInvalid={!!errors.userType}
              />
              <Form.Check
                id="formUserTypeRepresentative"
                inline
                label="Representative"
                name="userType"
                type="radio"
                value="representative"
                onChange={handleRadioChange}
                isInvalid={!!errors.userType}
              />
              <Form.Check
                id="formUserTypeMechanic"
                inline
                label="Mechanic"
                name="userType"
                type="radio"
                value="mechanic"
                onChange={handleRadioChange}
                isInvalid={!!errors.userType}
              />
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.userType}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formShopName" className="mb-3">
                <Form.Label>Shop Name</Form.Label>
                <Form.Control
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  isInvalid={!!errors.shopName}
                  placeholder="Shop Name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.shopName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="Name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="Email"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              {(formData.userType !== 'mechanic') && (
                <Form.Group controlId="formMobileNumber" className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    maxLength={10}
                    onChange={handleChange}
                    isInvalid={!!errors.mobileNumber}
                    placeholder="Mobile Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobileNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
              {(formData.userType === 'mechanic') && (
                <Form.Group controlId="formMobileNumber" className="mb-3">
                  <Form.Label><HighlightedLabel text="Mobile Number (**Unnathi Registered Number)" highlight="(**Unnathi Registered Number)" /></Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    maxLength={10}
                    onChange={handleChange}
                    isInvalid={!!errors.mobileNumber}
                    placeholder="Mobile Number"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobileNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
            </Col>
          </Row>

          <Form.Group controlId="formAddress" className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
              placeholder="Address"
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder="Password"
              />
              <InputGroup.Text onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {(formData.userType === 'retailer' || formData.userType === 'mechanic') && (
            <Form.Group controlId="formQRCode" className="mb-3">
              <Form.Label>QR Code</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  name="qrCode"
                  value={formData.qrCode}
                  onChange={handleChange}
                  placeholder="QR Code"
                />
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faQrcode} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          )}

          {formData.userType === 'retailer' && (
            <Form.Group controlId="formRewardPoints" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Reward Points Applicable"
                name="rewardPointsApplicable"
                checked={formData.rewardPointsApplicable}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit" block>
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  </Container>
</main>

);
}