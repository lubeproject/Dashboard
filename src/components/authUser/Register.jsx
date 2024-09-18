import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

export default function Register() {
  const [role, setRole] = useState();
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [shopname, setShopname] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState(null);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
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
      setIsRegistering(true);
      if (!isOtpValidated) {
        alert('Please validate OTP first.');
        setIsRegistering(false);
        return;
      }

      const { user, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        role
      });

      if (signupError) throw signupError;

      const userData = {
        role:role,
        mobile:mobile,
        name:name,
        address:address,
        email:email,
        password:password,
        shopname: role === 'representative' ? name : shopname,
        enablecheck: role === 'representative' ? 'N' : 'Y',
        qrcode: '',
        active: 'N',
        updatedby: 0,
        visitingday: '',
        shopimgurl: '',
        shippingaddress: '',
        segment: '',
        rewardpoints: 0,
        representativename: '',
        representativeid: 0,
        monthlypotential: '',
        longitude: '',
        latitude: '',
        creditterm: '',
        creditdays: '',
        cginno: '',
        dob: null,
        lastupdatedtime: new Date().toISOString(),
        locateddate: null,
        noofemployees: '',
        shopimgurl2: '',
        spacetype: '',
        totalarea: '',
        workshoparea: '',
        createdtime: new Date().toISOString(),
        updatedtime: new Date().toISOString(),
        devicetoken: '',
      };

      const { data, error } = await supabase.from('pending_users').insert([userData]);

      if (error) throw error;

      alert('Registration successful! Your account is waiting for admin approval.');
      navigate('/');
    } catch (error) {
      console.error('Error registering:', error.message);
      setError(error.message);
    } finally {
      setIsRegistering(false);
    }
  };


  const sendOtp = async (mobileNo, otp) => {
    try {
      const apiKey = '6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2';
      const tmpid = '1607100000000253030';
      const sid = 'CENENS';
      const to = `91${mobileNo}`;
      const msg = `Dear Customer, OTP to authenticate your profile update is ${otp}. Please share to complete your registration process. Thank You for joining us.
S V Agency 
by CENTROID ENGINEERING SOLUTIONS`;

      const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(msg)}`;

      console.log(url);
      const response = await fetch(url);

      if (response.ok) {
        const textResponse = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textResponse, "text/xml");

        const status = xmlDoc.getElementsByTagName("STATUS")[0].textContent;
        const message = xmlDoc.getElementsByTagName("MESSAGE")[0].textContent;

        if (status === 'OK' && message === 'SMS SENT') {
          setIsOTPSent(true);
          setError(null);
          setResendDisabled(false);
          alert('OTP sent successfully!');
        } else {
          throw new Error('Failed to send OTP');
        }
      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP');
      console.error('Error sending OTP:', err);
    }
  };

  async function checkMobileNumberExists(mobileNumber) {
    const { data, error } = await supabase
      .from('users')
      .select('mobile')
      .eq('mobile', mobileNumber);
  
    if (error) {
      console.error("Error fetching user:", error);
      return false;
    }
  
    // If data is not empty, the mobile number exists
    return data.length > 0;
  }

  const handleGenerateOtp = async() => {
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
  };

  const handleResendOtp = () => {
    sendOtp(mobile, generatedOtp);
    setResendDisabled(true);
  };

  const handleValidateOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpValidated(true);
      alert('OTP validated successfully!');
    } else {
      setIsOtpValidated(false);
      alert('Invalid OTP. Please try again.');
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
                <option value="representative">Representative</option>
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
          {role !== 'representative' && (
            <div className="form-group">
              <label htmlFor="shopname">Shop Name:</label>
              <input
                type="text"
                id="shopname"
                name="shopname"
                value={shopname}
                onChange={(e) => setShopname(e.target.value)}
                required={role === 'retailer' || role === 'mechanic'}
              />
            </div>
          )}
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
              <button type="button" className="button" onClick={handleGenerateOtp} disabled={isOTPSent || isRegistering || isOtpValidated}>
              Generate OTP
              </button>
              {isOTPSent && (
              <button type="button" className="button" onClick={handleResendOtp} disabled={resendDisabled || isRegistering}>
                Resend OTP
              </button>
            )}
              <button type="button" className="button" onClick={handleValidateOtp} disabled={isRegistering || isOtpValidated}>
                Validate OTP
              </button>
            </div>
          }

          <div className="form-group">
            <button type="submit" className="button" disabled={isRegistering || !isOtpValidated}>
              Register
            </button>
          </div>

        </form>
        <p>
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </div>
    </div>
  );
}
