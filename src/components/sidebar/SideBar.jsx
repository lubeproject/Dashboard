import React, { useState, useEffect } from 'react';
import "./sideBar.css";
import navList from "../../data/navItem";
import NavItem from "../header/NavItem";
import { Link, useNavigate } from "react-router-dom";

export default function SideBar() {


  const handleToggleSideBar = () => {
    if (window.innerWidth < 1199) {
      document.body.classList.toggle("toggle-sidebar");
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 1199) {
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


  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        
        <li className="nav-item">
          <Link className="nav-link" to="/portal/dashboard"  onClick={handleToggleSideBar}>
            <i className="bi bi-grid" ></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i className="bi bi-menu-button-wide" ></i>
            <span>Inventory</span>
            <i className="bi bi-chevron-down ms-auto"  ></i>
          </a>
          <ul
            id="components-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link
                to="/portal/useractivatedeactivate"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i className="bi bi-person-bounding-box" style={{fontSize:"20px"}}></i>
                <span>User Activate/Deactivate</span>
              </Link>
            </li>
            <li>
              <Link to="/portal/adduser" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-person-plus-fill" style={{fontSize:"20px"}}></i>
                <span>Add User</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/assignrepresentative"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
               <i class="bi bi-person-vcard-fill" style={{fontSize:"20px"}}></i>
                <span>Assign Representative</span>
              </Link>
            </li>
            <li>
              <Link to="/portal/itemmaster" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-collection-fill" style={{fontSize:"20px"}}></i>
                <span>Item Master</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/categorywithpoints"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-opencollective" style={{fontSize:"20px"}}></i>
                <span>Category with Points</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/segmentmaster"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
               <i class="bi bi-person-fill-gear" style={{fontSize:"20px"}}></i>
                <span>Segment Master</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/credittermmaster"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
               <i class="bi bi-credit-card-fill" style={{fontSize:"20px"}}></i>
                <span>Credit Term Master</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/addretailerstock"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
               <i class="bi bi-database-fill-add" style={{fontSize:"20px"}}></i>
                <span>Add Retailer Stock</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/paymentapproval"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
             <i class="bi bi-check-square-fill" style={{fontSize:"20px"}}></i>
                <span>Payment Approval</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/giftitemmaster"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-tags-fill" style={{fontSize:"20px"}}></i>
              
                <span>Gift Item Master</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/redeemgiftapproval"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
             <i class="bi bi-gift-fill" style={{fontSize:"20px"}}></i>
                <span>Redeem Gift Approval</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/allDSRdaykeyroute"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-calendar2-check-fill" style={{fontSize:"20px"}}></i>
                <span>All DSR Day Key Route</span>
              </Link>
            </li>
            <li>
              <Link to="/portal/itemrequest" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-send-check-fill" style={{fontSize:"20px"}}></i>
                <span>Item Request</span>
              </Link>
            </li>
            <li>
              <Link to="/portal/visiting" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-qr-code-scan" style={{fontSize:"20px"}}></i>
                <span>Visiting</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/paymententry"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-cash-coin"  style={{fontSize:"20px"}}></i>
                <span>Payment Entry</span>
              </Link>
            </li>
            <li>
              <Link
                to="/portal/billingtomechanic"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
           <i class="bi bi-receipt" style={{fontSize:"20px"}}></i>
                <span>Billing to Mechanic</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <a
            className="nav-link collapsed"
            data-bs-target="#reports-nav"
            data-bs-toggle="collapse"
            href="#"
          >
           <i class="bi bi-clipboard-minus-fill"></i>
            <span>Reports</span>
            <i className="bi bi-chevron-down ms-auto" ></i>
          </a>
          <ul
            id="reports-nav"
            className="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to="representativelist" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-layout-sidebar-inset"  style={{fontSize:"20px"}}></i>
                <span>Representative List</span>
              </Link>
            </li>
            <li>
              <Link to="retailerslist" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-person-lines-fill" style={{fontSize:"20px"}}></i>
                <span>Retailers List</span>
              </Link>
            </li>
            <li>
              <Link to="mechaniclist" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-tools" style={{fontSize:"20px"}}></i>
                <span>Mechanic List</span>
              </Link>
            </li>
            <li>
              <Link
                to="DSRwiseretailersoutstandingreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-list-columns" style={{fontSize:"20px"}}></i>
                <span>DSRwise Retailers Outstanding Report</span>
              </Link>
            </li>
            <li>
              <Link to="salesreport" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-collection-fill" style={{fontSize:"20px"}}></i>
                <span>Sales Report</span>
              </Link>
            </li>
            <li>
              <Link to="receiptreport" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-receipt-cutoff" style={{fontSize:"20px"}}></i>
                <span>Receipt Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="linesperdealerreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
               <i class="bi bi-person-workspace" style={{fontSize:"20px"}}></i>
                <span>Lines per Dealer Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="retailersaccountstatement"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-card-list" style={{fontSize:"20px"}}></i>
                <span>Retailers Account Statement</span>
              </Link>
            </li>
            <li>
              <Link
                to="representativevisitinghistory"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-collection"  style={{fontSize:"20px"}}></i>
                <span>Representative Visiting History</span>
              </Link>
            </li>
            <li>
              <Link to="DSRdayreport" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-calendar2-event" style={{fontSize:"20px"}}></i>
                <span>DSR Day Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="DSRdaywisecollectionreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-collection-fill" style={{fontSize:"20px"}}></i>
                <span>DSR Daywise Collection Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="DSRdaywisesalesreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-layout-text-window" style={{fontSize:"20px"}}></i>
                <span>DSR Daywise Sales Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="retailerrequestreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-send-exclamation"  style={{fontSize:"20px"}}></i>
                <span>Retailer Request Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="itemwiseretailerrequestreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-list-nested" style={{fontSize:"20px"}}></i>
                <span>Itemwise Retailer Request Report</span>
              </Link>
            </li>
            <li>
              <Link to="invoicehistory" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-view-list"  style={{fontSize:"20px"}}></i>
                <span>Invoice History</span>
              </Link>
            </li>
            <li>
              <Link to="paymenthistory" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-wallet2" style={{fontSize:"20px"}}></i>
                <span>Payment History</span>
              </Link>
            </li>
            <li>
              <Link to="mechanicsalesreport" style={{ textDecoration: "none" }} onClick={handleToggleSideBar}>
              <i class="bi bi-gear-fill" style={{fontSize:"20px"}}></i>
                <span>Mechanic Sales Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="mechanicttemwisesalesreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-wrench-adjustable-circle" style={{fontSize:"20px"}}></i>
                <span>Mechanic Itemwise Sales Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="loyaltymechanicsalesreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
             <i class="bi bi-wrench" style={{fontSize:"20px"}}></i>
                <span>Loyalty Mechanic Sales Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="mechanicloyaltyreport"
                style={{ textDecoration: "none" }}
                onClick={handleToggleSideBar}
              >
                <i class="bi bi-pencil-square" style={{fontSize:"20px"}}></i>
                <span>Mechanic Loyalty Report</span>
              </Link>
            </li>
          </ul>
        </li>
       
        <li className="nav-heading">PAGES</li>
        {navList.map((nav) => (
          <NavItem key={nav._id} nav={nav} />
        ))}
        
      </ul>
    </aside>
  );
}
