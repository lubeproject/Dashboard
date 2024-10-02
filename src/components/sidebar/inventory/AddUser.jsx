import React, { useContext, useState } from 'react';
import { Form, Button, Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../../../supabaseClient';
import "./addUser.css";
import bcrypt from 'bcryptjs';
import { UserContext } from '../../context/UserContext';

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
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState({});
  const [resendDisabled, setResendDisabled] = useState(false);
  const [mobile, setMobile] = useState("");
  const {user} = useContext(UserContext);

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

  const handleValidateOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpValidated(true);
    
      alert("OTP validated successfully!");
      return true; // Return true when OTP is valid
    } else {
      setIsOtpValidated(false);
      alert("Invalid OTP. Please try again.");
      return false; // Return false when OTP is invalid
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidateOtp()) {
      alert('The OTP entered is Invalid!!!');
      return;
    }

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
        if (formData.password.length < 6) {
          setErrors('Password must be at least 6 characters long');
          return;
        }
        
// Step 1: Hash the password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

        const { data, error } = await supabase
          .from('users')
          .insert([
            {
              shopname: formData.shopName,
              name: formData.name,
              email: formData.email,
              mobile: formData.mobileNumber,
              address: formData.address,
              password: hashedPassword,
              role: formData.userType,
              enablecheck: formData.rewardPointsApplicable ? 'Y' : 'N',
              qrcode: formData.qrCode,
              cginno: formData.qrCode,
              updatedby: user?.userid,
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

  const sendOtp = async (mobileNo, otp) => {
    try {
      const apiKey =
        "6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2";
      const tmpid = "1607100000000253030";
      const sid = "CENENS";
      const to = `91${mobileNo}`;
      const msg = `Dear Customer, OTP to authenticate your profile update is ${otp}. Please share to complete your registration process. Thank You for joining us.
S V Agency 
by CENTROID ENGINEERING SOLUTIONS`;

      const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(
        msg
      )}`;

      console.log(url);
      const response = await fetch(url);

      if (response.ok) {
        const textResponse = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textResponse, "text/xml");

        const status = xmlDoc.getElementsByTagName("STATUS")[0].textContent;
        const message = xmlDoc.getElementsByTagName("MESSAGE")[0].textContent;

        if (status === "OK" && message === "SMS SENT") {
          setIsOTPSent(true);
          setError(null);
          setResendDisabled(false);
          alert("OTP sent successfully!");
        } else {
          throw new Error("Failed to send OTP");
        }
      } else {
        throw new Error("Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP");
      console.error("Error sending OTP:", err);
    }
  };

  async function checkMobileNumberExists(mobileNumber) {
    const { data, error } = await supabase
      .from("users")
      .select("mobile")
      .eq("mobile", mobileNumber);

    if (error) {
      console.error("Error fetching user:", error);
      return false;
    }

    // If data is not empty, the mobile number exists
    return data.length > 0;
  }

  const handleGenerateOtp = async () => {
    if (!validateField()) return;

    const mobileExists = await checkMobileNumberExists(mobile);

    if (mobileExists) {
      // Alert the user that the mobile number is already registered
      alert("User with this mobile number already exists.");
      return; // Prevent registration
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    sendOtp(mobile, newOtp);
    setResendDisabled(false);
    alert(`OTP sent to ${mobile}`);
    setIsOTPSent(true)
  };

  const handleResendOtp = () => {
    sendOtp(mobile, generatedOtp);
    setResendDisabled(true);
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

{
            <div className="form-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isRegistering || isOtpValidated}
                required
              />
              <button
                type="button"
                onClick={handleGenerateOtp}
                disabled={isOTPSent}
              >
                {isOTPSent ? "Resend OTP" : "Generate OTP"}
              </button>
              {error.otp && <p className="error-message">{error.otp}</p>}
            </div>
          }

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