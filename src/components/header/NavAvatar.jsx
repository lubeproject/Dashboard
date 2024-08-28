import React from "react";
import userImg from "../../images/user.png";
import { Link, useNavigate } from "react-router-dom";


export default function NavAvatar() {
  return (
    <li className="nav-item dropdown pe-3">
      <a
        className="nav-link nav-profile d-flex align-items-center pe-0"
        href="/portal/dashboard"
        data-bs-toggle="dropdown"
      >
        <img src={userImg} alt="Profile" className="rounded-circle" />

        <span className="d-none d-md-block dropdown-toggle ps-2">SVL</span>
      </a>

      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
        <li className="dropdown-header">
          <h6>SVL</h6>
          <span>Website</span>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <a className="dropdown-item d-flex align-items-center" href="/portal/myprofile" >
          <i className="bi bi-person"></i>
          <span>My Profile</span>
        </a>
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

        {/* <li>
          <a className="dropdown-item d-flex align-items-center" href="/portal/workinprogress" >
            <i className="bi bi-question-circle"></i>
            <span>Need Help?</span>
          </a>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li> */}
        <li>
          <a className="dropdown-item d-flex align-items-center" href="/">
            <i className="bi bi-box-arrow-right"></i>
            <span>Sign Out</span>
          </a>
        </li>
      </ul>
    </li>
  );
}
