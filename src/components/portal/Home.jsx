import React, { useEffect } from 'react';
import welcome from "../../images/welcome.gif";
import "./home.css";
import { Navigate } from 'react-router-dom';

export default function Home() {

if (localStorage.getItem("access") === null) {
  return <Navigate to="/" replace />; 
}

  return (
    <main id="main" className="main">
      <div className="home-container">
        <img src={welcome} alt="Welcome" className="home-image" />
        <div className="agency-name">
          <span className="agency-text">to</span>
        </div>
        <div className="agency-name">
          <span className="agency-text">SV Agency</span>
        </div>
        {/* <div className="user-info">
          <p>Logged in as: SVL Agency</p>
        </div> */}
      </div>
    </main>
  );
}
