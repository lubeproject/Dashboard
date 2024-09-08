import React, {useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";

export default function NavItem({nav}) {

  
  const navigate = useNavigate()

  const clear = () =>{
    
    localStorage.removeItem("access")
    localStorage.removeItem("sb-uvbxeltzguqqdoyrqwwi-auth-token")
  
  }

  const handleToggleSideBar = () => {
    if (window.innerWidth < 1199) {
      document.body.classList.toggle("toggle-sidebar");
    }
  };

  const handleResize = () => {
    if (window.innerWidth < 1199) {
      handleToggleSideBar();
    } else {
      // Ensure sidebar is open if the window is resized back to larger screens
      document.body.classList.remove("toggle-sidebar");
    }
  };

  useEffect(() => {
    // Call handleResize on component mount to check the initial window size
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Combined function
  const handleCombinedClick = () => {
    clear()
    handleToggleSideBar()
    navigate("/")
  };


  return (
    <i className='nav-item' >
        {
          nav.path === "/" ? (
            <>
            <a className='nav-link collapsed'  style={{ textDecoration:"none"}} 
            onClick={handleCombinedClick}>
            <i className={nav.icon}></i>
            <span>{nav.name}</span>
        </a>
            </>
          ) : (
<>
<Link className='nav-link collapsed' to={`${nav.path}`} style={{ textDecoration:"none"}} onClick={handleToggleSideBar}>
            <i className={nav.icon}></i>
            <span>{nav.name}</span>
        </Link>
</>

          )
        }
    </i>
  )
}
