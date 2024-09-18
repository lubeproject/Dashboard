import React, { useState, useEffect } from 'react';
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "remixicon/fonts/remixicon.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Header from "./components/header/Header";
import SideBar from "./components/sidebar/SideBar";
import Main from "./components/dashboard/Main";
import { Routes, Route } from "react-router-dom";
import Portal from "./components/portal/Portal";
import Customers from "./components/sidebar/documents/Customers";
import Dashboard from "./components/dashboard/Dashboard";
import Suppliers from "./components/sidebar/documents/Suppliers";
import Logistic from "./components/sidebar/documents/Logistic";
import { supabase } from './supabaseClient';
import Login from "./components/authUser/Login";
import Register from "./components/authUser/Register";
import UserActivateDeactivate from "./components/sidebar/inventory/UserActivateDeactivate";
import AddUser from "./components/sidebar/inventory/AddUser";
import AssignRepresentative from "./components/sidebar/inventory/AssignRepresentative";
import ItemMaster from "./components/sidebar/inventory/ItemMaster";
import CategoryWithPoints from "./components/sidebar/inventory/CategoryWithPoints";
import SegmentMaster from "./components/sidebar/inventory/SegmentMaster";
import CreditTermMaster from "./components/sidebar/inventory/CreditTermItemMaster";
import AddRetailerStock from "./components/sidebar/inventory/AddRetailerStock";
import PaymentApproval from "./components/sidebar/inventory/PaymentApproval";
import GiftItemMaster from "./components/sidebar/inventory/GiftItemMaster";
import RedeemGiftApproval from "./components/sidebar/inventory/RedeemGiftApproval";
import AllDsrDayKeyRoute from "./components/sidebar/inventory/AllDsrDayKeyRoute";
import ItemRequest from "./components/sidebar/inventory/ItemRequest";
import Visiting from "./components/sidebar/inventory/Visiting";
import PaymentEntry from "./components/sidebar/inventory/PaymentEntry";
import BillingToMechanic from "./components/sidebar/inventory/BillingToMechanic";
import RetailerSummary from "./components/sidebar/inventory/RetailerSummary";
import RetailerRequestReport from "./components/sidebar/reports/RetailerRequestReport";
import 'react-datepicker/dist/react-datepicker.css';
import RetailerAccountStatement from "./components/sidebar/reports/RetailerAccountStatement";
import SalesReport from "./components/sidebar/reports/SalesReport";
import MyProfile from "./components/header/MyProfile";
import WorkProgress from "./components/portal/WorkProgress";
import RetailerList from "./components/sidebar/reports/RetailerList";
import RepresentativeList from "./components/sidebar/reports/RepresentativeList";
import MechanicList from "./components/sidebar/reports/MechanicList";
import ReceiptReport from "./components/sidebar/reports/ReceiptReport";
import LinesperDealerReport from "./components/sidebar/reports/LinesperDealerReport";
import RepresentativeVisitingHistory from "./components/sidebar/reports/RepresentativeVisitingHistory";

import SalesReportMechanicwise from "./components/sidebar/reports/SalesReportMechanicwise";
import SalesReportMechanicwiseItemwise from "./components/sidebar/reports/SalesReportMechanicwiseItemwise";
import LoyaltyMechanicSalesReport from "./components/sidebar/reports/LoyaltyMechanicSalesReport";
import MechanicLoyalPointsHistory from "./components/sidebar/reports/MechanicLoyalPointsHistory";
import DSRDaywiseCollectionReport from "./components/sidebar/reports/DSRDaywiseCollectionReport";
import DSRDaywiseSalesReport from "./components/sidebar/reports/DSRDaywiseSalesReport";
import PaymentHistory from "./components/sidebar/reports/PaymentHistory";
import InvoiceHistory from "./components/sidebar/reports/InvoiceHistory";
import ItemwiseRetailerRequestReport from "./components/sidebar/reports/ItemwiseRetailerRequestReport";
import DSRDayReport from "./components/sidebar/reports/DSRDayReport";
import UpdateRetailerDetails from "./components/sidebar/reports/UpdateRetailerDetails";
import UpdateMechanicDetails from "./components/sidebar/reports/UpdateMechanicDetails";
import UpdateRepresentativeDetails from "./components/sidebar/reports/UpdateRepresentativeDetails";
import DSRwiseRetailersOutstandingReport from "./components/sidebar/reports/DSRwiseRetailersOutstandingReport";
import ChangePassword from "./components/sidebar/ChangePassword";
import FilterAssignRepresentative from "./components/sidebar/inventory/FilterAssignRepresentative";
import Home from "./components/portal/Home";
import InvoiceDetails from "./components/sidebar/reports/InvoiceDetails";
import DsrKeyRouteOnDay from "./components/sidebar/inventory/DsrKeyRouteOnDay";
import ViewQrCode from "./components/sidebar/inventory/ViewQrCode";

function App() {


//  const [access, setAccess] = useState()

//  useEffect(() => {

//   const dataCheck = async () => {
//     // Step 2: Perform the query
//     const { data, error } = await supabase
//       .from('users')
//       .select('email, role')
//       .eq('email', localStorage.getItem("access")); // Using exact match with `eq` instead of `ilike`

//     // Step 3: Handle the query result
//     if (error) {
//       throw error;
//     }

//     if (data && data.length > 0) {
//       const user = data[0]; // Expecting only one result, take the first one
//       setAccess(user.role);
//     } else {
//       console.log("No matching email found");
//     }

// };
// dataCheck()
//  },[])

const [access, setAccess] = useState("");

useEffect(() => {
  // Mock function to simulate fetching access (could be from localStorage, API, etc.)
  const fetchAccess = () => {
    const storedAccess = localStorage.getItem("role"); // or from an API
    setAccess(storedAccess);
  };

  fetchAccess();
}, []);

  return (
<>
   
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/portal" element={<Portal />}>
      {access === "admin"  ? <>
        <Route path="homepage" element={<Home/>} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="customer" element={<Customers/>} />
        <Route path="supplier" element={<Suppliers/>} />
        <Route path="logistic" element={<Logistic/>} />

        <Route path="myprofile" element={<MyProfile/>} />
        <Route path="workinprogress" element={<WorkProgress/>} />

        <Route path="useractivatedeactivate" element={<UserActivateDeactivate/>} />
        <Route path="adduser" element={<AddUser/>} />
        <Route path="assignrepresentative" element={<AssignRepresentative/>} />
        <Route path="filterAssignRepresentative" element={<FilterAssignRepresentative/>} />
        <Route path="itemmaster" element={<ItemMaster/>} />
        <Route path="categorywithpoints" element={<CategoryWithPoints/>} />
        <Route path="segmentmaster" element={<SegmentMaster/>} />
        <Route path="credittermmaster" element={<CreditTermMaster/>} />
        <Route path="addretailerstock" element={<AddRetailerStock/>} />
        <Route path="paymentapproval" element={<PaymentApproval/>} />
        <Route path="giftitemmaster" element={<GiftItemMaster/>} />
        <Route path="redeemgiftapproval" element={<RedeemGiftApproval/>} />
        <Route path="allDSRdaykeyroute" element={<AllDsrDayKeyRoute/>} />
        <Route path="retailer-summary" element={<RetailerSummary/>} />
        <Route path="itemrequest" element={<ItemRequest/>} />
        <Route path="visiting" element={<Visiting/>} />
        <Route path="paymententry" element={<PaymentEntry/>} />
        <Route path="billingtomechanic" element={<BillingToMechanic/>} />

        {/* Under Report components */}

        <Route path="representativelist" element={<RepresentativeList/>} />
        <Route path="updateRepresentativeDetails" element={<UpdateRepresentativeDetails/>} />
        <Route path="retailerslist" element={<RetailerList/>} />
        <Route path="updateRetailerDetails" element={<UpdateRetailerDetails/>} />
        <Route path="mechaniclist" element={<MechanicList/>} />
        <Route path="updateMechanicDetails" element={<UpdateMechanicDetails/>} />
        <Route path="DSRwiseretailersoutstandingreport" element={<DSRwiseRetailersOutstandingReport/>} />
        <Route path="salesreport" element={<SalesReport/>} />
        <Route path="receiptreport" element={<ReceiptReport/>} />
        <Route path="linesperdealerreport" element={<LinesperDealerReport/>} />
        <Route path="retailersaccountstatement" element={<RetailerAccountStatement/>} />
        <Route path="representativevisitinghistory" element={<RepresentativeVisitingHistory/>} />
        <Route path="DSRdayreport" element={<DSRDayReport/>} />
        <Route path="DSRdaywisecollectionreport" element={<DSRDaywiseCollectionReport/>} />
        <Route path="DSRdaywisesalesreport" element={<DSRDaywiseSalesReport/>} />
        <Route path="retailerrequestreport" element={<RetailerRequestReport/>} />
        <Route path="itemwiseretailerrequestreport"  element={<ItemwiseRetailerRequestReport/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="paymenthistory" element={<PaymentHistory/>} />
        <Route path="mechanicsalesreport" element={<SalesReportMechanicwise/>} />
        <Route path="mechanicttemwisesalesreport" element={<SalesReportMechanicwiseItemwise/>} />
        <Route path="loyaltymechanicsalesreport" element={<LoyaltyMechanicSalesReport/>} />
        <Route path="mechanicloyaltyreport" element={<MechanicLoyalPointsHistory/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="invoicedetails/:invoiceId" element={<InvoiceDetails/>} />
        
        <Route path="changePassword" element={<ChangePassword/>} />
      </> :  access === "representative" ? <> 
        <Route path="homepage" element={<Home/>} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="customer" element={<Customers/>} />
        <Route path="supplier" element={<Suppliers/>} />
        <Route path="logistic" element={<Logistic/>} />

        <Route path="myprofile" element={<MyProfile/>} />
        <Route path="workinprogress" element={<WorkProgress/>} />

        <Route path="dsrKeyRouteOnDay" element={<DsrKeyRouteOnDay />} />
        <Route path="itemrequest" element={<ItemRequest/>} />
        <Route path="visiting" element={<Visiting/>} />
        <Route path="paymententry" element={<PaymentEntry/>} />


        {/* Under Report components */}

        <Route path="retailerslist" element={<RetailerList/>} />
        <Route path="updateRetailerDetails" element={<UpdateRetailerDetails/>} />
        <Route path="mechaniclist" element={<MechanicList/>} />
        <Route path="updateMechanicDetails" element={<UpdateMechanicDetails/>} />
        <Route path="retailersaccountstatement" element={<RetailerAccountStatement/>} />
        <Route path="DSRdayreport" element={<DSRDayReport/>} />
        <Route path="DSRdaywisecollectionreport" element={<DSRDaywiseCollectionReport/>} />
        <Route path="DSRdaywisesalesreport" element={<DSRDaywiseSalesReport/>} />
        <Route path="retailerrequestreport" element={<RetailerRequestReport/>} />
        <Route path="itemwiseretailerrequestreport" element={<ItemwiseRetailerRequestReport/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="paymenthistory" element={<PaymentHistory/>} />
        <Route path="mechanicsalesreport" element={<SalesReportMechanicwise/>} />
        <Route path="mechanicttemwisesalesreport" element={<SalesReportMechanicwiseItemwise/>} />
        <Route path="loyaltymechanicsalesreport" element={<LoyaltyMechanicSalesReport/>} />
        <Route path="mechanicloyaltyreport" element={<MechanicLoyalPointsHistory/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="invoicedetails/:invoiceId" element={<InvoiceDetails/>} />
        
        <Route path="changePassword" element={<ChangePassword/>} />
      </> : <>
      <Route path="homepage" element={<Home/>} />
        <Route path="dashboard" element={<Dashboard/>} />
        <Route path="customer" element={<Customers/>} />
        <Route path="supplier" element={<Suppliers/>} />
        <Route path="logistic" element={<Logistic/>} />

        <Route path="myprofile" element={<MyProfile/>} />
        <Route path="workinprogress" element={<WorkProgress/>} />

      <Route path="itemrequest" element={<ItemRequest/>} />
      <Route path="billingtomechanic" element={<BillingToMechanic/>} />
      <Route path="viewQrCode" element={<ViewQrCode />} />

   {/* Under Report components */}

      <Route path="mechaniclist" element={<MechanicList/>} />
        <Route path="updateMechanicDetails" element={<UpdateMechanicDetails/>} />
        <Route path="retailersaccountstatement" element={<RetailerAccountStatement/>} /><Route path="retailerrequestreport" element={<RetailerRequestReport/>} />
        <Route path="itemwiseretailerrequestreport" element={<ItemwiseRetailerRequestReport/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="paymenthistory" element={<PaymentHistory/>} />
        <Route path="mechanicsalesreport" element={<SalesReportMechanicwise/>} />
        <Route path="mechanicttemwisesalesreport" element={<SalesReportMechanicwiseItemwise/>} />
        <Route path="invoicehistory" element={<InvoiceHistory/>} />
        <Route path="invoicedetails/:invoiceId" element={<InvoiceDetails/>} />
        
        <Route path="changePassword" element={<ChangePassword/>} />
      </> 
      
      }
        
      </Route>
    </Routes>

    </>
  );
}

export default App;
