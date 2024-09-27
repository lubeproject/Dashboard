import React, { useContext, useEffect } from 'react';
import welcome from "../../images/welcome.gif";
import "./home.css";
import { Navigate } from 'react-router-dom';
import { UserContext } from "../context/UserContext";

export default function Home() {

  const { user } = useContext(UserContext);

// if (localStorage.getItem("access") === null) {
//   return <Navigate to="/" replace />; 
// }



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
         {user ? (
        <div>
          {/* <p>{user.name}!</p>
          <p>Your role is: {user.role}</p> */}
        </div>
      ) : (
        <p>Please log in to view the dashboard.</p>
      )}
      </div>
    </main>
  );
}
