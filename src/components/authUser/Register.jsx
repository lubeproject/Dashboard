import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./Register.css";

export default function Register() {
  const [role, setRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [shopname, setShopname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState({});
  const [roleError, setRoleError] = useState(false);
  const [otp, setOtp] = useState("");
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

  const handleInputChange = (field, value) => {
    switch (field) {
      case "role":
        setRole(value);
        if (value) setError((prev) => ({ ...prev, role: null }));
        break;
      case "mobile":
        setMobile(value);
        if (value) setError((prev) => ({ ...prev, mobile: null }));
        break;
      case "name":
        setName(value);
        if (value) setError((prev) => ({ ...prev, name: null }));
        break;
      case "shopname":
        setShopname(value);
        if (value) setError((prev) => ({ ...prev, shopname: null }));
        break;
      case "address":
        setAddress(value);
        if (value) setError((prev) => ({ ...prev, address: null }));
        break;
      case "email":
        setEmail(value);
        if (value) setError((prev) => ({ ...prev, email: null }));
        break;
      default:
        break;
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!role) newErrors.role = "Please select a role";
    if (!mobile) newErrors.mobile = "Please enter your mobile number";
    if (!name) newErrors.name = "Please enter your name";
    if (role !== "representative" && !shopname)
      newErrors.shopname = "Please enter your shop name";
    if (!address) newErrors.address = "Please enter your address";
    if (!email) newErrors.email = "Please enter your email";
    if (!password) newErrors.password = "Please enter your password";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password !== confirmPassword)
      newErrors.passwordMatch = "Passwords do not match";

   // If there are any errors, show an alert
   if (Object.keys(newErrors).length > 0) {
    alert("You missed filling the box");
    setError(newErrors);
    return false;
  }

  setError(newErrors);
  return true;
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
  

  const handleRegister = async (e) => {
    e.preventDefault();
    setError({});

    if (!validateFields()) return;
   
    // Validate OTP before proceeding with registration
    if (!handleValidateOtp()) {
      return; // Stop registration if OTP is invalid
    }

    console.log("OTP validated");
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    try {
      setIsRegistering(true);
      if (!isOtpValidated) {
        alert("Please validate OTP first.");
        setIsRegistering(false);
        return;
      }

      const userData = {
        role: role,
        mobile: mobile,
        name: name,
        address: address,
        email: email,
        password: password,
        shopname: role === "representative" ? name : shopname,
        enablecheck: role === "representative" ? "N" : "Y",
        qrcode: "",
        active: "N",
        updatedby: 0,
        visitingday: "",
        shopimgurl: "",
        shippingaddress: "",
        segment: "",
        rewardpoints: 0,
        representativename: "",
        representativeid: 0,
        monthlypotential: "",
        longitude: "",
        latitude: "",
        creditterm: "",
        creditdays: "",
        cginno: "",
        dob: null,
        lastupdatedtime: new Date().toISOString(),
        locateddate: null,
        noofemployees: "",
        shopimgurl2: "",
        spacetype: "",
        totalarea: "",
        workshoparea: "",
        createdtime: new Date().toISOString(),
        updatedtime: new Date().toISOString(),
        devicetoken: "",
        action: "request"
      };

      // Insert the new user into the pending_users table
      const { data, error } = await supabase
        .from("pending_users")
        .insert([userData]);

      if (error) {
        console.error('Error:', error.message);
      }else {
        alert(
          "Registration successful! Your account is waiting for admin approval."
        );
        navigate("/");
      }
     
    } catch (error) {
      console.error("Error registering:", error.message);
      setError(error.message);
    } finally {
      setIsRegistering(false);
    }
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
    if (!validateFields()) return;

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
    <div className="register-container">
      <div className="register-box">
        <h2>
          <b>Register to Lube</b>
        </h2>
        {error.form && <p className="error-message">{error.form}</p>}
        <form onSubmit={handleRegister}>
          <div className="inline-group">
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  Select Role
                </option>
                <option value="representative">Representative</option>
                <option value="retailer">Retailer</option>
                <option value="mechanic">Mechanic</option>
              </select>
              {error.role && <p className="error-message">{error.role}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number:</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                required
              />
              {error.mobile && <p className="error-message">{error.mobile}</p>}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            {error.name && <p className="error-message">{error.name}</p>}
          </div>
          {role !== "representative" && (
            <div className="form-group">
              <label htmlFor="shopname">Shop Name:</label>
              <input
                type="text"
                id="shopname"
                name="shopname"
                value={shopname}
                onChange={(e) => handleInputChange("shopname", e.target.value)}
                required={role === "retailer" || role === "mechanic"}
              />
              {error.shopname && (
                <p className="error-message">{error.shopname}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
            {error.address && <p className="error-message">{error.address}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
            {error.email && <p className="error-message">{error.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
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
              {error.password && (
                <p className="error-message">{error.password}</p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="password-container">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
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
            {!passwordMatch && (
              <p className="error-message">Passwords didn't match</p>
            )}
            {error.confirmPassword && (
              <p className="error-message">{error.confirmPassword}</p>
            )}
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

          <div className="form-group">
            <button
              type="submit"
              className="button"
              // disabled={isRegistering}
          
            >
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
