import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import bcrypt from "bcryptjs";
import "./Login.css";
import { UserContext } from "../context/UserContext";


export default function Login() {
  const [emailOrMobile, setEmailOrMobile] = useState(""); // Can be email or mobile
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext); // Access saveUser from context



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // const dataCheck = async () => {
  //   // Step 2: Perform the query in the users table
  //   const { data, error } = await supabase
  //     .from('users')
  //     .select('email')
  //     .eq('email', localStorage.getItem("access")); 
  
  //   // Step 3: Handle the query result
  //   if (error) {
  //     console.error("Error querying users table:", error.message);
  //     return;
  //   }
  
  //   if (data && data.length > 0) {
  //     const user = data[0]; 
  //     setUser({ user });
  //   } else {
  //     console.log("No matching email found in users table.");
  //   }
  // };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      // Step 1: Try to log in as an admin (using Supabase Auth)
      const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
        email: emailOrMobile, 
        password,
      });
  
      if (adminData?.user) {
        // Admin login successful
        alert("Admin login successful!");
        const { data: userData, error: userTableError } = await supabase
        .from("users")
        .select("*") // Select required columns
        .or(`email.eq.${emailOrMobile},mobile.eq.${emailOrMobile}`)
        .eq('active','Y');

        if (userTableError) {
          console.error("Error querying users table:", userTableError.message);
          setError("Error querying users table after admin login.");
          return;
        }
        // console.log(userData);
  
        // Step 3: If user data is found, merge it with admin data
        if (userData && userData.length > 0) {
          const user = userData[0];
  
          // Save user data with additional fields from the users table
          saveUser({
            ...adminData.user,
            role: "admin",
            name: user.name,
            shopname: user.shopname,
            mobile: user.mobile,
            email: user.email,
            userid: user.userid,
            cginno: user.cginno,
          });
        } else {
          // No matching record in users table, just save admin data
          saveUser({ ...adminData.user, role: "admin" });
        }

        navigate("/portal/homepage");
        
        return;
      }
  
      // Step 2: If admin login fails, check if it's a regular user in the users table
      if (adminError) {
        console.log("Admin login failed, checking users table for regular users.");
  
        // Check users table for either email or mobile number
        const { data: userData, error: userTableError } = await supabase
          .from("users")
          .select("*")
          .or(`email.eq.${emailOrMobile},mobile.eq.${emailOrMobile}`)
          .eq('active','Y'); 
  
        if (userTableError) {
          console.error("Error querying users table:", userTableError.message);
          setError("Error querying users table.");
          return;
        }
  
        // Step 3: If a user is found, check the password
        if (userData && userData.length > 0) {
          const user = userData[0]; 
  
          // Compare the input password with the hashed password stored in the database
          const passwordMatch = await bcrypt.compare(password, user.password);
  
          if (passwordMatch) {
            // Non-admin login successful
            saveUser(user); // Save user data
            alert("User login successful!");
            navigate("/portal/homepage");
      
          } else {
            // Password mismatch
            setError("Invalid email, mobile number, or password");
          }
        } else {
          // No user found with the given email or mobile
          setError("No matching user found with the given credentials.");
        }
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("Login failed due to an unexpected error.");
    }
  };
  

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!emailOrMobile) {
      setError("Email or mobile number is required.");
      return;
    }

    // Only allow password reset for email users (not mobile number users)
    if (validateEmail(emailOrMobile)) {
      const { error } = await supabase.auth.resetPasswordForEmail(emailOrMobile);
      if (error) {
        setError("Failed to send password reset email.");
        setMessage("");
      } else {
        setMessage("Password reset email sent!");
        setError("");
      }
    } else {
      setError("Password reset only available for email users.");
    }
  };

  // Utility function to validate if input is an email
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <b>Login to Lube</b>
        </h2>
        {error && <p>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="emailOrMobile">Email or Mobile:</label>
            <input
              type="text"
              id="emailOrMobile"
              name="emailOrMobile"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <a className="forgot-password-link" onClick={handleChangePassword}>
              Forgot Password?
            </a>
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          New User? <Link to="/register">Please Register</Link>
        </p>
      </div>
    </div>
  );
}
