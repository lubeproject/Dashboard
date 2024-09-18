import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import bcrypt from "bcryptjs";
import "./Login.css";

// export default function Login() {
//   const [email, setEmail] = useState();
//   const [password, setPassword] = useState("");
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [error, setError] = useState(null);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);

//     try {
//       // Fetch the user by email from the "users" table
//       const { data, error } = await supabase
//         .from("users")
//         .select("*") // Only select the email and hashed password
//         .eq("email", email); // Match email

//       if (error) throw error;

//       if (data && data.length > 0) {
//         const user = data[0]; // Get the user data

//         // Compare the input password with the hashed password in the database
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (passwordMatch) {
//           // Password is correct, proceed with login
//           // console.log("Login successful:", user);
//           localStorage.setItem("access", user.email);
//           alert("Login successful!");
//           navigate("/portal/homepage");
//         } else {
//           // Password doesn't match
//           console.log("Invalid email or password");
//           setError("Invalid email or password");
//         }
//       } else {
//         // No user found with that email
//         console.log("Invalid email or password");
//         setError("Invalid email or password");
//       }
//     } catch (error) {
//       console.error("Error logging in:", error.message);
//       setError(error.message);
//     }
//   };

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setError(null);

//   //   try {
//   //          // Query your "users" table to check if the user exists
//   //          const { data, error } = await supabase
//   //          .from('users')
//   //          .select('*')// Select all columns or only the required ones
//   //          .eq('email', email)  // Match email
//   //          .eq('password', password); // Match password

//   //        console.log('Data:', data);  // Debugging data
//   //        console.log('Error:', error);  // Debugging error

//   //        if (error) throw error; // If there's an error, throw it to catch block

//   //        if (data && data.length > 0) {
//   //          // User found, proceed with login (e.g., store session, redirect, etc.)
//   //          console.log('Login successful:', data[0]);
//   //        } else {
//   //          // User not found
//   //          console.log('Invalid email or password');
//   //          setError('Invalid email or password');
//   //        }

//   //     // console.log('Login successful!', data);
//   //     // localStorage.setItem("access",data.session.user.email )
//   //     // alert('Login successful!');
//   //     // navigate('/portal/homepage')
//   //   } catch (error) {
//   //     console.error('Error logging in:', error.message);
//   //     setError(error.message);
//   //   }
//   // };

//   const handleChangePassword = async (event) => {
//     event.preventDefault();

//     if (!email) {
//       setError("Email is required.");
//       return;
//     }

//     const { error } = await supabase.auth.resetPasswordForEmail(email);

//     if (error) {
//       setError("Failed to send password reset email.");
//       setMessage("");
//     } else {
//       setMessage("Password reset email sent!");
//       setError("");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-box">
//         <h2>
//           <b>Login to Lube</b>
//         </h2>
//         {error && <p>{error}</p>}
//         <form onSubmit={handleLogin}>
//           <div className="form-group">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="text"
//               id="email"
//               name="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="password">Password:</label>
//             <div className="password-container">
//               <input
//                 type={passwordVisible ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               <FontAwesomeIcon
//                 icon={passwordVisible ? faEyeSlash : faEye}
//                 className="eye-icon"
//                 onClick={togglePasswordVisibility}
//               />
//             </div>
//           </div>
//           <div className="form-group">
//             <a className="forgot-password-link" onClick={handleChangePassword}>
//               Forgot Password?
//             </a>
//           </div>
//           <button type="submit">Login</button>
//         </form>
//         <p>
//           New User? <Link to="/register">Please Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
export default function Login() {
  const [emailOrMobile, setEmailOrMobile] = useState(""); // Can be email or mobile
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Check if the user is an Admin (via Supabase Auth)
      const { data: adminData, error: adminError } = await supabase.auth.signInWithPassword({
        email: emailOrMobile, // For admin, we use the email (since admins are in Supabase Auth)
        password,
      });

      if (adminData?.user) {
        // Admin login successful, redirect
        alert("Admin login successful!");
        localStorage.setItem("access", adminData.user.email);
        localStorage.setItem("role", "admin");
        navigate("/portal/homepage");
        return;
      }

      // If not an admin (adminError occurs), proceed to check users table for non-admin login
      if (adminError) {
        console.log("Not an admin, checking users table for non-admin roles.");

        // Check users table for either email or mobile number
        const { data: userData, error: userTableError } = await supabase
          .from("users")
          .select("*")
          .or(`email.eq.${emailOrMobile},mobile.eq.${emailOrMobile}`); // Match either email or mobile

        if (userTableError) throw userTableError;

        if (userData.length > 0) {
          const user = userData[0]; // Get the user data

          // Compare the input password with the hashed password in the database
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) {
            // Non-admin login successful
            localStorage.setItem("access", user.email || user.mobile);
            localStorage.setItem("role", user.role);
            alert("Login successful!");
            navigate("/portal/homepage");
          } else {
            // Password doesn't match
            setError("Invalid email, mobile number, or password");
          }
        } else {
          // No user found with that email or mobile
          setError("Invalid email, mobile number, or password");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Invalid email, mobile number, or password");
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
