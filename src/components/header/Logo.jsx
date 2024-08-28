// import React from "react";
// import "./logo.css";
// import { useNavigate } from "react-router-dom";
// import company_logo from "../../images/logo.gif";

// export default function Logo() {
 
//   const handleToggleSideBar = () => {
//     document.body.classList.toggle("toggle-sidebar");
//   };

//   const navigate = useNavigate();

//   return (
//     <div className="d-flex align-items-center justify-content-between">
//       <img src={company_logo} style={{ width: "50px" }} />
//       <a
//         href="/"
//         style={{ textDecoration: "none" }}
//         className="logo d-flex align-iems-center"
//       >
//         <span
//           className="d-none d-lg-block"
//           style={{ textShadow: "5px 5px 15px gray" }}
//         >
//           <span
//             style={{ fontSize: "40px", marginLeft: "0px", marginRight: "10px" }}
//           >
//             SVL
//           </span>{" "}
//           India
//         </span>
//       </a>
//       <i
//         className="bi bi-list toggle-sidebar-btn"
//         style={{ color: "white", textShadow: "5px 5px 10px darkorange" }}
//         onClick={handleToggleSideBar}
//       ></i>
//     </div>
//   );
// }
import React from "react";
import "./logo.css";
import { useNavigate } from "react-router-dom";
import company_logo from "../../images/logo.gif";

export default function Logo() {
  const navigate = useNavigate();

  const handleToggleSideBar = () => {
    document.body.classList.toggle("toggle-sidebar");
  };

  const handleNavigateHome = () => {
    navigate('/portal/homepage');
  };

  return (
    <div className="d-flex align-items-center justify-content-between">
      <div
        className="d-flex align-items-center logo-container"
        onClick={handleNavigateHome}
        style={{ cursor: "pointer", textDecoration: "none" }}
      >
        <img src={company_logo} alt="Company Logo" style={{ width: "50px" }} />
        <span
          className="d-none d-lg-block"
          style={{
            
            fontSize: "30px",
            marginLeft: "10px",
            marginRight: "10px",
            // color: "rgb(53, 56, 140)",
            color: "white",
            fontWeight: "bold"
          }}
        > SVL India 
        </span>
      </div>
      <i
        className="bi bi-list toggle-sidebar-btn"
        style={{ color: "White",
          //  textShadow: "5px 5px 10px darkorange"
           }}
        onClick={handleToggleSideBar}
      ></i>
    </div>
  );
}
