import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import './NavAvatar.css'; // Ensure to create this CSS file for styling

export default function NavAvatar() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getUsername = (email) => {
    if (!email) return '';
    return email.split('@')[0]; // Get everything before '@'
  };

  const clear = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sb-uvbxeltzguqqdoyrqwwi-auth-token");
    navigate("/");
  };

  // Get initials - first letter and any subsequent uppercase letters
  const getInitials = (name) => {
    if (!name) return '';
    name = name.split(' ').join('');
    const initials = [name.charAt(0).toUpperCase()]; // Start with the first letter of the first word

    // Loop through the rest of the words to find uppercase initials
    for (let i = 1; i < Math.min(3,name.length); i++) {
      const char = name.charAt(i);
      if (char === char.toUpperCase()) {
        initials.push(char.toUpperCase());
      }
    }

    return initials.join(''); // Join the initials into a single string
  };

  return (
    <li className="nav-item dropdown pe-3">
      <a
        className="nav-link nav-profile d-flex align-items-center pe-0"
        href="/portal/dashboard"
        data-bs-toggle="dropdown"
      >
        {/* Display the initials instead of an image */}
        <div className="user-initials">
          {getInitials(user.shopname || getUsername(user.email))}
        </div>
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        <li className="dropdown-header">
          <h6>{user.name || getUsername(user.email)}!</h6>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <Link className="dropdown-item d-flex align-items-center" to="/portal/myprofile">
          <i className="bi bi-person"></i>
          <span>My Profile</span>
        </Link>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link className="dropdown-item d-flex align-items-center" to="/portal/changePassword">
            <i className="bi bi-file-earmark-lock"></i>
            <span>Change Password</span>
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <a className="dropdown-item d-flex align-items-center" onClick={clear}>
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </a>
        </li>
      </ul>
    </li>
  );
}
