// import React, { useState, useEffect, useContext } from 'react';
// import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
// import Select from 'react-select';
// import Cookies from 'js-cookie';
// import { supabase } from '../../../supabaseClient';
// import { UserContext } from '../../context/UserContext';

// export default function PaymentEntry() {
//   const getTodayDate = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };
//   const [User, setUser] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [paymentMode, setPaymentMode] = useState(null);
//   const [amount, setAmount] = useState('');
//   const [paymentReference, setPaymentReference] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [adjustMode, setAdjustMode] = useState(null);
//   const [adjustModeOptions, setAdjustModeOptions] = useState([]);
//   const [paymentModes, setPaymentModes] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [otp, setOtp] = useState('');
//  const [remarkValidate, setRemarkValidate ] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState(null);
//   const [isOtpValidated, setIsOtpValidated] = useState(false);
//   const [chequeDate, setChequeDate] = useState(getTodayDate());
//   const [userMobile, setUserMobile] = useState('');
//   const [isValid, setIsValid] = useState(true);
//   const [paymentApprovals, setPaymentApprovals] = useState([]);
//   const [isOTPSent, setIsOTPSent] = useState(false);
//   const [error, setError] = useState(null);
//   const {user} = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(true);
  

//   useEffect(() => {
//     const fetchUserOptions = async () => {
//       try {
//         let userQuery = supabase
//           .from('users')
//           .select('*')
//           .in('role', ['retailer', 'mechanic'])
//           .order('userid', { ascending: true });

//         // if(user?.role === 'representative'){
//         //   userQuery = userQuery
//         //   .eq('representativeid',user?.userid)
//         //   .eq('representativename',user?.name);
//         // }

//         const { data, error } = await userQuery;
    
//         if (error) {
//           console.error('Error fetching Users:', error);
//           return;
//         }
    
//         setUserOptions(data.map(item => ({
//           label: item.shopname,
//           value: item.userid,
//           name: item.name,
//           repname: item.representativename,
//           repid: item.representativeid
//         })));
//       } catch (err) {
//         console.error('Unexpected error:', err);
//       }
//     };

//     const fetchVisiting = async () => {
//       console.log("Punching ID:", Cookies.get('punchingid'));

//       const { data, error } = await supabase
//         .from('represent_visiting1')
//         .select('*')
//         .eq('punchingid', Cookies.get('punchingid'));

//       // console.log(data);

//       if (error) console.error('Error fetching visiting user:', error);
//       else if (data && data.length > 0) {
//         setUserOptions(
//           data.map((visit) => ({
//             value: visit.visitorid,
//             label: visit.shopname,
//             name: visit.visitor,
//             role: visit.role,
//           }))
//         );
//       }
//     };

//     const punchingid = Cookies.get('punchingid');
//     if (user?.role === 'representative') {
//       if (!punchingid) {
//         alert('Please Scan The QR code of User');
//         setIsLoading(true); // Keep loading state if punchingid is not present
//         return;
//       }
//       setIsLoading(false);
//       fetchVisiting();
//     } else {
//     fetchUserOptions();
//     }
//   }, [user]);

//   useEffect(() => {
//     const fetchPaymentModes = async () => {
//       const { data, error } = await supabase.from('payment_mode').select('paymodeid, paymentname');
//       if (!error) {
//         setPaymentModes(data.map(item => ({ label: item.paymentname, value: item.paymodeid })));
//       } else {
//         console.error('Error fetching payment modes:', error);
//       }
//     };

    
//     const fetchPaymentApprovals = async () => {
//       const { data, error } = await supabase
//         .from('payment_approval')
//         .select('*')
//         .eq('active','Y');
  
//       if (error) {
//         console.error('Error fetching payment approvals:', error);
//       } else {
//         // console.log('Fetched payment approvals:', data); // Log data for debugging
//         setPaymentApprovals(data);
//       }
//     };

//     fetchPaymentModes();
//     fetchPaymentApprovals(); 
//   }, []);

//   useEffect(() => {
//     if (User) {
//       const fetchInvoices = async () => {
//         const { data, error } = await supabase.from('invoices1').select('*')
//         .eq('username', User.name)
//         .eq('paymentstatus','Pending')
//         .order('invid',{ascending:true});
//         if (!error) {
//           setInvoices(data);
//         } else {
//           console.error('Error fetching invoices:', error);
//         }
//       };

//       const fetchUserMobile = async () => {
//         const { data, error } = await supabase.from('users').select('mobile').eq('shopname', User.label).single();
//         if (!error) {
//           setUserMobile(data.mobile);
//         } else {
//           console.error('Error fetching user mobile:', error);
//         }
//       };

//       fetchInvoices();
//       fetchUserMobile();
//     }
//   }, [User]);

  

//   useEffect(() => {
//     if (paymentMode && paymentMode.label === 'Adjustment') {
//       const fetchAdjustModes = async () => {
//         const { data, error } = await supabase.from('adjust_mode').select('adjustid, adjusttype');
//         if (!error) {
//           setAdjustModeOptions(data.map(item => ({ label: item.adjusttype, value: item.adjustid })));
//         } else {
//           console.error('Error fetching adjust modes:', error);
//         }
//       };

//       fetchAdjustModes();
//     }
//   }, [paymentMode]);

//   const convertDateFormat = (dateStr) => {
//     if (!dateStr) return '';
  
//     const date = new Date(dateStr);
  
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0');
//     const dd = String(date.getDate()).padStart(2, '0');
  
//     return `${dd}-${mm}-${yyyy}`;
//   };

//   const handleInvoiceSelect = (invid) => {
//     // setSelectedInvoices(prev => {
//     //   if (prev.includes(invid)) {
//     //     return prev.filter(id => id !== invid);
//     //   } else {
//     //     return [...prev, invid];
//     //   }
//     // });
//     setSelectedInvoices([invid]);
//   };

//   const sendOtp = async (mobileNo, otp,amount) => {
    
//     try {
//       const apiKey = '6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2';
//       const tmpid = '1607100000000253031';
//       const sid = 'CENENS';
//       const to = `91${mobileNo}`;
//       const msg = `Dear Customer, OTP to authenticate your cash payment of ${amount} is ${otp}. Please share to complete your transaction. Thank You for doing business with us.S V Agency by CENTROID ENGINEERING SOLUTIONS`;
//   const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(msg)}`;
//   const response = await fetch(url);

//     if (response.ok) {
//       const textResponse = await response.text();
      
//       // Parse the XML response
//       const parser = new DOMParser();
//       const xmlDoc = parser.parseFromString(textResponse, "text/xml");

//       const status = xmlDoc.getElementsByTagName("STATUS")[0].textContent;
//       const message = xmlDoc.getElementsByTagName("MESSAGE")[0].textContent;

//       if (status === 'OK' && message === 'SMS SENT') {
//         setIsOTPSent(true);
//         setError(null);
//         alert('OTP sent successfully!');
//       } else {
//         throw new Error('Failed to send OTP');
//       }
//     } else {
//       throw new Error('Failed to send OTP');
//     }
//   } catch (err) {
//     setError('Failed to send OTP');
//     console.error('Error sending OTP:', err);
//   }
// };

// const handleGenerateOtp = () => {
//   const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//   setGeneratedOtp(newOtp);
//   sendOtp(userMobile,newOtp,'Rs.'+amount);
//   console.log(`new otp is ${newOtp}`);
//   alert(`OTP sent to ${userMobile}`);
// };

// const handleValidateOtp = () => {
//   if (otp === generatedOtp) {
//     setIsOtpValidated(true);
//     alert('OTP validated successfully!');
//     return true;
//   } else {
//     setIsOtpValidated(false);
//     alert('Invalid OTP. Please try again.');
//     return false;
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     console.log('Submitting payment entry...');

//     if (!handleValidateOtp()) {
   
//       return
//     }

//     if (remarks === ""){
//       setRemarkValidate(true)
//     }

//      // Validate input
//      if (!User || !selectedInvoices.length || !amount || 
//       (!paymentReference && !otp) || !remarks ||  (paymentMode.label === 'Adjustment' && !adjustMode)) {
//     setIsValid(false);
//     console.log('Validation failed.');
//     return;
//   }

//   if (!paymentMode || !paymentMode.label) {
//     alert("Please select a payment mode");
//     return;
// }
  
//     try {
//       // Fetch invoice data
//       const { data: invoiceData, error: invoiceError } = await supabase
//         .from('invoices1')
//         .select('*')
//         .in('invid', selectedInvoices);
  
//       if (invoiceError) throw new Error(`Error fetching invoice data: ${invoiceError.message}`);
  
//       // Prepare payment data for insertion
//       const paymentData = {
//         userid: User.value,
//         repid: User.repid,
//         repname: User.repname,
//         username: User.name,
//         usershopname: User.label,
//         invoices: selectedInvoices.join(', '),
//         paymode: paymentMode.label,
//         amount: parseFloat(amount),
//         remarks: remarks,
//         paymentstatus: 'Pending',
//         payref: paymentReference || null,
//         chequedate: chequeDate || null,
//         createdtime: new Date().toISOString(),
//         updatedtime: new Date().toISOString(),
//         updatedby: user?.userid,
//         createdby: user?.userid,
//       };
  
//       if (paymentMode.label === 'Adjustment') {
//         paymentData.adjustmode = adjustMode.label;
//       }
  
//       // Insert payment data
//       const { data: pay, error: insertError } = await supabase
//         .from('payment_reference')
//         .insert([paymentData])
//         .select('payid')
//         .single();
  
//       if (insertError) throw new Error(`Error inserting payment data: ${insertError.message}`);
      
//       if (!pay || !pay.payid) throw new Error('Failed to retrieve payid from inserted data.');
  
//       // Insert payment approval for all payment modes
//       const invoiceId = invoiceData.length > 0 ? invoiceData[0].invid : null;
//       const punchingId = Cookies.get('punchingid');
//       const { error: insertPaymentApproveError } = await supabase
//         .from('payment_approval')
//         .insert({
//           payid: pay.payid,
//           punchingid: punchingId,
//           repid: User.repid,
//           invid: invoiceId,
//           userid: User.value,
//           username: User.name,
//           usershopname: User.label,
//           paymode: paymentMode.label,
//           paymentstatus: 'To be cleared',
//           payref: paymentReference || paymentData.adjustmode || null,
//           remarks: remarks,
//           amount: parseFloat(amount),
//           active: 'Y',
//           chequedate: chequeDate || new Date().toISOString().split('T')[0],
//           createdtime: new Date().toISOString(),
//           updatedtime: new Date().toISOString(),
//           createdby: user?.userid
//         });
  
//       if (insertPaymentApproveError) throw new Error(`Error inserting payment approve data: ${insertPaymentApproveError.message}`);
  
//       alert('Payment recorded successfully!');
//       window.location.reload();
//     } catch (err) {
//       console.error('Unexpected error:', err);
//       alert('There was an unexpected error. Please try again.');
//     }
//   };  

// return (
//   <main id='main' className='main'>
//     <Container className="mt-2">
//       <Row className="justify-content-md-center mt-2">
//         <Col>
//           <h4 style={{ textAlign: "center" }}>Payment Reference</h4>
//         </Col>
//       </Row>
//       <br />
//       <br />
//       <Form onSubmit={handleSubmit}>
//         <Row className="justify-content-md-center">
//           <Col xs lg="6">
//             <Form.Group controlId="formUser">
//               <Form.Label>User</Form.Label>
//               <Select options={userOptions} value={User} onChange={setUser} placeholder="Select User" />
//             </Form.Group>
//           </Col>
//           <Col xs lg="6">
//             <Form.Group controlId="formAmount">
//               <Form.Label>Amount</Form.Label>
//               <Form.Control
//                 type="number"
//                 placeholder="Enter amount"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />
//             </Form.Group>
//           </Col>  
//         </Row>
        
//         {/* Amount input field */}
//         <Row className="justify-content-md-center">
          
//           <Col xs lg="12">
//             <Button
//               variant="outline-primary"
//               style={{ marginTop: '31px' }}
//               onClick={() => setShowInvoiceModal(true)}
//               disabled={!user}
//             >
//               Pending Invoices
//             </Button>
//           </Col>
//         </Row>
        
//         {/* Payment Mode and Reference */}
//         <Row className="justify-content-md-center">
//           <Col xs lg="6">
//             <Form.Group controlId="formPaymentMode">
//               <Form.Label>Payment Mode</Form.Label>
//               <Select options={paymentModes} value={paymentMode} onChange={setPaymentMode} />
//             </Form.Group>
//           </Col>
//           <Col xs lg="6">
//             <Form.Group controlId="formPaymentReference">
//               <Form.Label>Payment Reference</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter payment reference"
//                 value={paymentReference}
//                 onChange={(e) => setPaymentReference(e.target.value)}
//                 disabled={paymentMode && (paymentMode.label === 'Cash' || paymentMode.label === 'Adjustment')}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
        
//         {/* Conditional Fields based on Payment Mode */}
//         {paymentMode && paymentMode.label === 'Cheque' && (
//           <Row className="justify-content-md-center">
//             <Col xs lg="6">
//               <Form.Group controlId="formChequeDate">
//                 <Form.Label>Cheque Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   placeholder="Enter cheque date"
//                   value={chequeDate}
//                   onChange={(e) => setChequeDate(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//         )}
//         {paymentMode && paymentMode.label === 'Adjustment' && (
//           <Row className="justify-content-md-center">
//             <Col xs lg="6">
//               <Form.Group controlId="formAdjustMode">
//                 <Form.Label>Adjust Mode</Form.Label>
//                 <Select options={adjustModeOptions} value={adjustMode} onChange={setAdjustMode} />
//               </Form.Group>
//             </Col>
//           </Row>
//         )}
//         {paymentMode && paymentMode.label === 'Cash' && (
//           <Row className="justify-content-md-center">
//             <Col xs lg="6">
//               <Form.Group controlId="formOtp">
//                 <Form.Label>OTP</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otp}
//                   disabled={isOtpValidated} 
//                   onChange={(e) => setOtp(e.target.value)}
//                 />
//               </Form.Group>
//               <Button onClick={handleGenerateOtp} disabled={isOtpValidated} className={`${generatedOtp ? 'btn-secondary' : "btn-primary"}`}> {generatedOtp ? "Resend OTP": "Generate OTP" }</Button>
              
//             </Col>
//           </Row>
//         )}
//         <br/>
//         {/* Remarks and Submit */}
//         <Row className="justify-content-md-center">
//           <Col xs lg="12">
//             <Form.Group controlId="formRemarks">
//               <Form.Label>Remarks</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Enter remarks"
//                 className={`${remarkValidate ? 'border border-danger' : ""}`}
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <br />
//         <Row className="justify-content-md-center">
//           <Col xs lg="12">
//             <Button type="submit" variant="primary" disabled={!isValid && !remarks}>
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </Container>

//     {/* Invoice Preview modal */}
//     <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg">
//   <Modal.Header closeButton>
//     <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Invoice Details</Modal.Title>
//   </Modal.Header>
//   <Modal.Body>
//   <div style={{ float: 'right', color: 'red', marginBottom: '10px' }}>Total Balance: <b>{invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidamount), 0)}</b></div>
//     <table>
//       <thead>
//         <tr>
//           <th>Invoice No.</th>
//           <th>Date</th>
//           <th>To be Cleared</th>
//           <th>Balance</th>
//           <th>Days</th>
//         </tr>
//       </thead>
//       <tbody>
//         {invoices.map(invoice => {
//           const balance = invoice.amount - invoice.paidamount;
//           const toBeCleared = paymentApprovals
//             .filter(pa => pa.invid === invoice.invid)
//             .reduce((total, pa) => total + (pa.amount || 0), 0);
//           const days = Math.floor(
//             (new Date().getTime() - new Date(invoice.createdtime).getTime()) / (1000 * 60 * 60 * 24)
//           );
//           return (
//             <tr key={invoice.invid}>
//               <td>{invoice.tallyrefinvno}</td>
//               <td>{convertDateFormat(invoice.invdate)}</td>
//               <td>{toBeCleared}</td>
//               <td>{balance}</td>
//               <td>{days}</td>
//             </tr>
//           );
//         })}
//       </tbody>
//     </table>
//   </Modal.Body>
// </Modal>
//   </main>
// );
// }

// import React, { useState, useEffect, useContext, useMemo } from 'react';
// import { Button, Form, Container, Row, Col, Toast, Table, Modal, Spinner } from 'react-bootstrap';
// import Select from 'react-select';
// import Cookies from 'js-cookie';
// import { supabase } from '../../../supabaseClient';
// import { UserContext } from '../../context/UserContext';

// export default function PaymentEntry() {
//   // Helper to get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // State Variables
//   const [User, setUser] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   const [paymentAllocations, setPaymentAllocations] = useState([]); // Tracks allocation details
//   const [paymentMode, setPaymentMode] = useState(null);
//   const [amount, setAmount] = useState('');
//   const [paymentReference, setPaymentReference] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [adjustMode, setAdjustMode] = useState(null);
//   const [adjustModeOptions, setAdjustModeOptions] = useState([]);
//   const [paymentModes, setPaymentModes] = useState([]);
//   const [userOptions, setUserOptions] = useState([]);
//   const [otp, setOtp] = useState('');
//   const [remarkValidate, setRemarkValidate] = useState(false);
//   const [generatedOtp, setGeneratedOtp] = useState(null);
//   const [isOtpValidated, setIsOtpValidated] = useState(false);
//   const [chequeDate, setChequeDate] = useState(getTodayDate());
//   const [userMobile, setUserMobile] = useState('');
//   const [isValid, setIsValid] = useState(true);
//   const [paymentApprovals, setPaymentApprovals] = useState([]);
//   const [isOTPSent, setIsOTPSent] = useState(false);
//   const [error, setError] = useState(null);
//   const { user } = useContext(UserContext);
//   const [isLoading, setIsLoading] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [showToast, setShowToast] = useState(false);

//   // State for Pending Invoices Modal
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);

//   // Fetch Users or Visiting Users based on role
//   useEffect(() => {
//     const fetchUserOptions = async () => {
//       try {
//         let userQuery = supabase
//           .from('users')
//           .select('*')
//           .in('role', ['retailer', 'mechanic'])
//           .order('userid', { ascending: true });

//         const { data, error } = await userQuery;

//         if (error) {
//           console.error('Error fetching Users:', error);
//           setToastMessage('Failed to fetch users.');
//           setShowToast(true);
//           return;
//         }

//         setUserOptions(
//           data.map(item => ({
//             label: item.shopname,
//             value: item.userid,
//             name: item.name,
//             repname: item.representativename,
//             repid: item.representativeid,
//           }))
//         );
//       } catch (err) {
//         console.error('Unexpected error:', err);
//         setToastMessage('An unexpected error occurred while fetching users.');
//         setShowToast(true);
//       }
//     };

//     const fetchVisiting = async () => {
//       console.log('Punching ID:', Cookies.get('punchingid'));
//       const { data, error } = await supabase
//         .from('represent_visiting1')
//         .select('*')
//         .eq('punchingid', Cookies.get('punchingid'));

//       if (error) {
//         console.error('Error fetching visiting user:', error);
//         setToastMessage('Failed to fetch visiting users.');
//         setShowToast(true);
//       } else if (data && data.length > 0) {
//         setUserOptions(
//           data.map(visit => ({
//             value: visit.visitorid,
//             label: visit.shopname,
//             name: visit.visitor,
//             role: visit.role,
//           }))
//         );
//       }
//     };

//     const punchingid = Cookies.get('punchingid');
//     if (user?.role === 'representative') {
//       if (!punchingid) {
//         alert('Please Scan The QR code of User');
//         setIsLoading(true); // Keep loading state if punchingid is not present
//         return;
//       }
//       setIsLoading(false);
//       fetchVisiting();
//     } else {
//       fetchUserOptions();
//     }
//   }, [user]);

//   // Fetch Payment Modes and Approvals
//   useEffect(() => {
//     const fetchPaymentModes = async () => {
//       try {
//         const { data, error } = await supabase.from('payment_mode').select('paymodeid, paymentname');
//         if (!error) {
//           setPaymentModes(data.map(item => ({ label: item.paymentname, value: item.paymodeid })));
//         } else {
//           console.error('Error fetching payment modes:', error);
//           setToastMessage('Failed to fetch payment modes.');
//           setShowToast(true);
//         }
//       } catch (err) {
//         console.error('Unexpected error:', err);
//         setToastMessage('An unexpected error occurred while fetching payment modes.');
//         setShowToast(true);
//       }
//     };

//     const fetchPaymentApprovals = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('payment_approval')
//           .select('*')
//           .eq('active', 'Y');

//         if (error) {
//           console.error('Error fetching payment approvals:', error);
//           setToastMessage('Failed to fetch payment approvals.');
//           setShowToast(true);
//         } else {
//           setPaymentApprovals(data);
//         }
//       } catch (err) {
//         console.error('Unexpected error:', err);
//         setToastMessage('An unexpected error occurred while fetching payment approvals.');
//         setShowToast(true);
//       }
//     };

//     fetchPaymentModes();
//     fetchPaymentApprovals();
//   }, []);

//   // Fetch Invoices and User Mobile when User changes
//   useEffect(() => {
//     if (User) {
//       const fetchInvoices = async () => {
//         try {
//           const { data, error } = await supabase
//             .from('invoices1')
//             .select('*')
//             .eq('username', User.name)
//             .eq('paymentstatus', 'Pending')
//             .order('invid', { ascending: true });
//           if (!error) {
//             setInvoices(data);
//           } else {
//             console.error('Error fetching invoices:', error);
//             setToastMessage('Failed to fetch invoices.');
//             setShowToast(true);
//           }
//         } catch (err) {
//           console.error('Unexpected error:', err);
//           setToastMessage('An unexpected error occurred while fetching invoices.');
//           setShowToast(true);
//         }
//       };

//       const fetchUserMobile = async () => {
//         try {
//           const { data, error } = await supabase
//             .from('users')
//             .select('mobile')
//             .eq('shopname', User.label)
//             .single();
//           if (!error) {
//             setUserMobile(data.mobile);
//           } else {
//             console.error('Error fetching user mobile:', error);
//             setToastMessage('Failed to fetch user mobile.');
//             setShowToast(true);
//           }
//         } catch (err) {
//           console.error('Unexpected error:', err);
//           setToastMessage('An unexpected error occurred while fetching user mobile.');
//           setShowToast(true);
//         }
//       };

//       fetchInvoices();
//       fetchUserMobile();
//     }
//   }, [User]);

//   // Fetch Adjust Modes based on Payment Mode
//   useEffect(() => {
//     if (paymentMode && paymentMode.label === 'Adjustment') {
//       const fetchAdjustModes = async () => {
//         try {
//           const { data, error } = await supabase.from('adjust_mode').select('adjustid, adjusttype');
//           if (!error) {
//             setAdjustModeOptions(data.map(item => ({ label: item.adjusttype, value: item.adjustid })));
//           } else {
//             console.error('Error fetching adjust modes:', error);
//             setToastMessage('Failed to fetch adjust modes.');
//             setShowToast(true);
//           }
//         } catch (err) {
//           console.error('Unexpected error:', err);
//           setToastMessage('An unexpected error occurred while fetching adjust modes.');
//           setShowToast(true);
//         }
//       };

//       fetchAdjustModes();
//     } else {
//       setAdjustMode(null); // Reset adjust mode when not needed
//     }
//   }, [paymentMode]);

//   // Helper to Convert Date Format
//   const convertDateFormat = dateStr => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0');
//     const dd = String(date.getDate()).padStart(2, '0');
//     return `${dd}-${mm}-${yyyy}`;
//   };

//   // Send OTP Function
//   const sendOtp = async (mobileNo, otp, amount) => {
//     try {
//       const apiKey = '6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2';
//       const tmpid = '1607100000000253031';
//       const sid = 'CENENS';
//       const to = `91${mobileNo}`;
//       const msg = `Dear Customer, OTP to authenticate your cash payment of ${amount} is ${otp}. Please share to complete your transaction. Thank You for doing business with us.S V Agency by CENTROID ENGINEERING SOLUTIONS`;
//       const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(msg)}`;
//       const response = await fetch(url);

//       if (response.ok) {
//         const textResponse = await response.text();

//         // Parse the XML response
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(textResponse, 'text/xml');

//         const status = xmlDoc.getElementsByTagName('STATUS')[0]?.textContent;
//         const message = xmlDoc.getElementsByTagName('MESSAGE')[0]?.textContent;

//         if (status === 'OK' && message === 'SMS SENT') {
//           setIsOTPSent(true);
//           setError(null);
//           setToastMessage('OTP sent successfully!');
//           setShowToast(true);
//         } else {
//           throw new Error('Failed to send OTP');
//         }
//       } else {
//         throw new Error('Failed to send OTP');
//       }
//     } catch (err) {
//       setError('Failed to send OTP');
//       setToastMessage('Failed to send OTP.');
//       setShowToast(true);
//       console.error('Error sending OTP:', err);
//     }
//   };

//   // Generate OTP Handler
//   const handleGenerateOtp = () => {
//     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//     setGeneratedOtp(newOtp);
//     sendOtp(userMobile, newOtp, `₹${amount}`);
//     // Remove sensitive logs in production
//     console.log(`new otp is ${newOtp}`);
//     // Optional: Replace alert with toast if preferred
//     // alert(`OTP sent to ${userMobile}`);
//   };

//   // Validate OTP
//   const handleValidateOtp = () => {
//     if (otp === generatedOtp) {
//       setIsOtpValidated(true);
//       setToastMessage('OTP validated successfully!');
//       setShowToast(true);
//       return true;
//     } else {
//       setIsOtpValidated(false);
//       setToastMessage('Invalid OTP. Please try again.');
//       setShowToast(true);
//       return false;
//     }
//   };

//   // Handle Form Submission with Automatic Allocation
//   const handleSubmit = async e => {
//     e.preventDefault();

//     // Reset validation states
//     setIsValid(true);
//     setRemarkValidate(false);

//     console.log('Submitting payment entry...');

//     // Validate OTP if Payment Mode is Cash
//     if (paymentMode?.label === 'Cash' && !isOtpValidated) {
//       if (!handleValidateOtp()) {
//         return;
//       }
//     }

//     // Validate remarks
//     if (remarks.trim() === '') {
//       setRemarkValidate(true);
//       setIsValid(false);
//     }

//     // Validate required fields
//     if (
//       !User ||
//       !amount ||
//       (!paymentReference && paymentMode?.label !== 'Cash' && paymentMode?.label !== 'Adjustment') ||
//       (paymentMode?.label === 'Adjustment' && !adjustMode)
//     ) {
//       setIsValid(false);
//       setToastMessage('Please fill all required fields.');
//       setShowToast(true);
//       return;
//     }

//     if (!paymentMode || !paymentMode.label) {
//       setToastMessage('Please select a payment mode.');
//       setShowToast(true);
//       return;
//     }

//     try {
//       setIsLoading(true);

//       // Fetch invoice data
//       const { data: invoiceData, error: invoiceError } = await supabase
//         .from('invoices1')
//         .select('*')
//         .eq('username', User.name)
//         .eq('paymentstatus', 'Pending')
//         .order('invid', { ascending: true });

//       if (invoiceError) throw new Error(`Error fetching invoice data: ${invoiceError.message}`);

//       if (!invoiceData || invoiceData.length === 0) {
//         setToastMessage('No pending invoices found for the selected user.');
//         setShowToast(true);
//         return;
//       }

//       // Initialize remaining amount
//       let remainingAmount = parseFloat(amount);
//       const allocations = []; // Temporary array to store allocations

//       // Iterate through invoices and allocate amounts
//       for (const invoice of invoiceData) {
//         const balance = invoice.amount - invoice.paidamount;
//         if (balance <= 0) continue; // Skip if no balance

//         const toBeCleared = paymentApprovals
//         .filter(pa => pa.invid === invoice.invid)
//         .reduce((total, pa) => total + (pa.amount || 0), 0);

//         const allocatedAmount = remainingAmount >= balance ? (balance>=toBeCleared)? balance-toBeCleared : balance : remainingAmount;

//         allocations.push({
//           invid: invoice.invid,
//           allocatedAmount: allocatedAmount,
//           toBeCleared: toBeCleared,
//           toBeClearedAfterPayment: toBeCleared + allocatedAmount,
//         });

//         remainingAmount -= allocatedAmount;

//         if (remainingAmount <= 0) break; // Payment fully allocated
//       }

//       // Handle overpayment by updating the user's prepaid balance
//       if (remainingAmount > 0) {
//         // Fetch current prepaid balance
//         const { data: userData, error: userError } = await supabase
//           .from('users')
//           .select('prepaid')
//           .eq('userid', User.value)
//           .single();

//         if (userError) {
//           throw new Error(`Error fetching user data: ${userError.message}`);
//         }

//         const currentPrepaid = parseFloat(userData.prepaid) || 0;
//         const newPrepaid = currentPrepaid + remainingAmount;

//         // Update the user's prepaid balance
//         const { error: updatePrepaidError } = await supabase
//           .from('users')
//           .update({ prepaid: newPrepaid })
//           .eq('userid', User.value);

//         if (updatePrepaidError) {
//           throw new Error(`Error updating prepaid amount: ${updatePrepaidError.message}`);
//         }

//         setToastMessage(`Payment allocated. ₹ ${remainingAmount.toFixed(2)} added to prepaid balance.`);
//         setShowToast(true);
//       } else {
//         setToastMessage('Payment allocated successfully!');
//         setShowToast(true);
//       }

//       if (allocations.length === 0) {
//         setToastMessage('No eligible invoices to allocate payment.');
//         setShowToast(true);
//         return;
//       }

//       // Prepare payment reference data
//       const paymentData = {
//         userid: User.value,
//         repid: User.repid,
//         repname: User.repname,
//         username: User.name,
//         usershopname: User.label,
//         invoices: allocations.map(a => a.invid).join(', '), // List of invoice IDs
//         paymode: paymentMode.label,
//         amount: parseFloat(amount),
//         remarks: remarks.trim(),
//         paymentstatus: 'Pending',
//         payref: paymentReference || null,
//         chequedate: chequeDate || null,
//         createdtime: new Date().toISOString(),
//         updatedtime: new Date().toISOString(),
//         updatedby: user?.userid,
//         createdby: user?.userid,
//       };

//       if (paymentMode.label === 'Adjustment') {
//         paymentData.adjustmode = adjustMode.label;
//       }

//       // Insert payment reference
//       const { data: pay, error: insertError } = await supabase
//         .from('payment_reference')
//         .insert([paymentData])
//         .select('payid')
//         .single();

//       if (insertError) throw new Error(`Error inserting payment data: ${insertError.message}`);

//       if (!pay || !pay.payid) throw new Error('Failed to retrieve payid from inserted data.');

//       // Insert payment approvals per allocation
//       const punchingId = Cookies.get('punchingid');
//       const paymentApprovalInserts = allocations.map(allocation => ({
//         payid: pay.payid,
//         punchingid: punchingId,
//         repid: User.repid,
//         invid: allocation.invid,
//         userid: User.value,
//         username: User.name,
//         usershopname: User.label,
//         paymode: paymentMode.label,
//         paymentstatus: 'To be cleared',
//         payref:
//           paymentReference ||
//           (paymentMode.label === 'Adjustment' ? adjustMode.label : null),
//         remarks: remarks.trim(),
//         amount: allocation.allocatedAmount,
//         active: 'Y',
//         chequedate: chequeDate || new Date().toISOString().split('T')[0],
//         createdtime: new Date().toISOString(),
//         updatedtime: new Date().toISOString(),
//         createdby: user?.userid,
//       }));

//       const { error: insertPaymentApproveError } = await supabase
//         .from('payment_approval')
//         .insert(paymentApprovalInserts);

//       if (insertPaymentApproveError) {
//         throw new Error(`Error inserting payment approval data: ${insertPaymentApproveError.message}`);
//       }

//       // Reset form fields instead of reloading
//       resetForm();
//     } catch (err) {
//       console.error('Unexpected error:', err);
//       setToastMessage('There was an unexpected error. Please try again.');
//       setShowToast(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Function to reset form fields after successful submission
//   const resetForm = () => {
//     setUser(null);
//     setInvoices([]);
//     setPaymentMode(null);
//     setAmount('');
//     setPaymentReference('');
//     setRemarks('');
//     setAdjustMode(null);
//     setOtp('');
//     setIsOtpValidated(false);
//     setGeneratedOtp(null);
//     setPaymentAllocations([]);
//   };

//   // Calculate Total Balance using useMemo for optimization
//   const totalBalance = useMemo(() => {
//     return invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidamount), 0);
//   }, [invoices]);

//   // Allocate payment and set paymentAllocations state
//   useEffect(() => {
//     if (User && amount) {
//       // Fetch invoices again to ensure latest data
//       const allocatePayment = () => {
//         let remainingAmount = parseFloat(amount);
//         const allocations = [];

//         for (const invoice of invoices) {
//           const balance = invoice.amount - invoice.paidamount;
//           if (balance <= 0) continue; // Skip if no balance

//           const toBeCleared = paymentApprovals
//         .filter(pa => pa.invid === invoice.invid)
//         .reduce((total, pa) => total + (pa.amount || 0), 0);

//         const allocatedAmount = remainingAmount >= balance ? (balance>=toBeCleared)? balance-toBeCleared : balance : remainingAmount;

//           allocations.push({
//             invid: invoice.invid,
//             tallyrefinvno: invoice.tallyrefinvno,
//             allocatedAmount: allocatedAmount,
//             toBeCleared: toBeCleared,
//             balance: balance,
//             toBeClearedAfterPayment : toBeCleared + allocatedAmount,
//           });

//           remainingAmount -= allocatedAmount;

//           if (remainingAmount <= 0) break; // Payment fully allocated
//         }

//         setPaymentAllocations(allocations);
//       };

//       allocatePayment();
//     } else {
//       setPaymentAllocations([]);
//     }
//   }, [User, amount, invoices, paymentApprovals]);

//   // Optional: Display how the payment amount is allocated
//   const displayAllocations = useMemo(() => {
//     return paymentAllocations.map((alloc, index) => (
//       <tr key={index}>
//         <td>{alloc.tallyrefinvno}</td>
//         <td>{convertDateFormat(invoices.find(inv => inv.invid === alloc.invid)?.invdate)}</td>
//         <td>₹{alloc.toBeCleared.toFixed(2)}</td>
//         <td>₹{alloc.toBeClearedAfterPayment.toFixed(2)}</td>
//         <td>₹{alloc.balance}</td>
//         <td>₹{alloc.allocatedAmount.toFixed(2)}</td>
//       </tr>
//     ));
//   }, [paymentAllocations, invoices]);

//   // Handle fetching and displaying prepaid balance
//   const [prepaidBalance, setPrepaidBalance] = useState(0);

//   useEffect(() => {
//     const fetchPrepaid = async () => {
//       if (User) {
//         const { data, error } = await supabase
//           .from('users')
//           .select('prepaid')
//           .eq('userid', User.value)
//           .single();
//         if (!error) {
//           setPrepaidBalance(parseFloat(data.prepaid) || 0);
//         } else {
//           console.error('Error fetching prepaid balance:', error);
//           setToastMessage('Failed to fetch prepaid balance.');
//           setShowToast(true);
//         }
//       } else {
//         setPrepaidBalance(0);
//       }
//     };
//     fetchPrepaid();
//   }, [User]);

//   return (
//     <main id='main' className='main'>
//       <Container className="mt-2">
//         <Row className="justify-content-md-center mt-2">
//           <Col>
//             <h4 style={{ textAlign: 'center' }}>Payment Reference</h4>
//           </Col>
//         </Row>
//         <br />
//         <br />
//         <Form onSubmit={handleSubmit}>
//           {/* User and Amount Selection */}
//           <Row className="justify-content-md-center">
//             <Col xs lg="6">
//               <Form.Group controlId="formUser">
//                 <Form.Label>User</Form.Label>
//                 <Select
//                   options={userOptions}
//                   value={User}
//                   onChange={setUser}
//                   placeholder="Select User"
//                   isClearable
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col xs lg="6">
//               <Form.Group controlId="formAmount">
//                 <Form.Label>Amount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter amount"
//                   value={amount}
//                   onChange={e => setAmount(e.target.value)}
//                   min="0"
//                   step="0.01"
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Prepaid Balance Display */}
//           {User && (
//             <Row className="justify-content-md-center mt-3">
//               <Col xs lg="6">
//                 <Form.Group controlId="formPrepaid">
//                   <Form.Label>Prepaid Balance</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={`₹ ${prepaidBalance.toFixed(2)}`}
//                     readOnly
//                     isInvalid={parseFloat(prepaidBalance) < 0}
//                     isValid={prepaidBalance >= 0}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     Prepaid balance cannot be negative.
//                   </Form.Control.Feedback>
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}

//           {/* Payment Allocation Summary */}
//           {paymentAllocations.length > 0 && (
//             <Row className="justify-content-md-center mt-3">
//               <Col xs lg="12">
//                 <h5>Payment Allocation</h5>
//                 <Table striped bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Invoice ID</th>
//                       <th>Date</th>
//                       <th>To be Cleared</th>
//                       <th>To be Cleared After Payment</th>
//                       <th>Balance</th>
//                       <th>Allocated Amount</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayAllocations}
//                   </tbody>
//                 </Table>
//               </Col>
//             </Row>
//           )}

//           {/* Payment Mode and Reference */}
//           <Row className="justify-content-md-center mt-3">
//             <Col xs lg="6">
//               <Form.Group controlId="formPaymentMode">
//                 <Form.Label>Payment Mode</Form.Label>
//                 <Select
//                   options={paymentModes}
//                   value={paymentMode}
//                   onChange={setPaymentMode}
//                   placeholder="Select Payment Mode"
//                   isClearable
//                   required
//                 />
//               </Form.Group>
//             </Col>
//             <Col xs lg="6">
//               <Form.Group controlId="formPaymentReference">
//                 <Form.Label>Payment Reference</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter payment reference"
//                   value={paymentReference}
//                   onChange={e => setPaymentReference(e.target.value)}
//                   disabled={paymentMode?.label === 'Cash' || paymentMode?.label === 'Adjustment'}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* Conditional Fields based on Payment Mode */}
//           {paymentMode && paymentMode.label === 'Cheque' && (
//             <Row className="justify-content-md-center mt-3">
//               <Col xs lg="6">
//                 <Form.Group controlId="formChequeDate">
//                   <Form.Label>Cheque Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     placeholder="Enter cheque date"
//                     value={chequeDate}
//                     onChange={e => setChequeDate(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}
//           {paymentMode && paymentMode.label === 'Adjustment' && (
//             <Row className="justify-content-md-center mt-3">
//               <Col xs lg="6">
//                 <Form.Group controlId="formAdjustMode">
//                   <Form.Label>Adjust Mode</Form.Label>
//                   <Select
//                     options={adjustModeOptions}
//                     value={adjustMode}
//                     onChange={setAdjustMode}
//                     placeholder="Select Adjust Mode"
//                     isClearable
//                     required
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           )}
//           {paymentMode && paymentMode.label === 'Cash' && (
//             <Row className="justify-content-md-center mt-3">
//               <Col xs lg="6">
//                 <Form.Group controlId="formOtp">
//                   <Form.Label>OTP</Form.Label>
//                   <Form.Control
//                     type="text"
//                     placeholder="Enter OTP"
//                     value={otp}
//                     disabled={isOtpValidated}
//                     onChange={e => setOtp(e.target.value)}
//                     required={!isOtpValidated}
//                   />
//                 </Form.Group>
//                 <Button
//                   onClick={handleGenerateOtp}
//                   disabled={isOtpValidated}
//                   className="mt-2"
//                   variant={generatedOtp ? 'secondary' : 'primary'}
//                 >
//                   {generatedOtp ? 'Resend OTP' : 'Generate OTP'}
//                 </Button>
//               </Col>
//             </Row>
//           )}

//           <br />

//           {/* Remarks */}
//           <Row className="justify-content-md-center">
//             <Col xs lg="12">
//               <Form.Group controlId="formRemarks">
//                 <Form.Label>Remarks</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Enter remarks"
//                   className={`${remarkValidate ? 'border border-danger' : ''}`}
//                   value={remarks}
//                   onChange={e => setRemarks(e.target.value)}
//                   required
//                 />
//                 {remarkValidate && <Form.Text className="text-danger">Remarks are required.</Form.Text>}
//               </Form.Group>
//             </Col>
//           </Row>

//           <br />

//           {/* Pending Invoices Button */}
//           <Row className="justify-content-md-center">
//             <Col xs lg="12" className="d-flex justify-content-center">
//               <Button
//                 variant="outline-primary"
//                 style={{ marginTop: '20px' }}
//                 onClick={() => setShowInvoiceModal(true)}
//                 disabled={!User}
//               >
//                 Pending Invoices
//               </Button>
//             </Col>
//           </Row>

//           {/* Submit Button */}
//           <Row className="justify-content-md-center mt-3">
//             <Col xs lg="12" className="d-flex justify-content-center">
//               <Button type="submit" variant="primary" disabled={!isValid || isLoading}>
//                 {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//       </Container>

//       {/* Pending Invoices Modal */}
//       <Modal
//         show={showInvoiceModal}
//         onHide={() => setShowInvoiceModal(false)}
//         size="lg"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Pending Invoices</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {invoices.length === 0 ? (
//             <p>No pending invoices for this user.</p>
//           ) : (
//             <div>
//               <div style={{ float: 'right', color: 'red', marginBottom: '10px' }}>
//                 Total Balance: <b>₹ {invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidamount), 0).toFixed(2)}</b>
//               </div>
//               <Table striped bordered hover responsive>
//                 <thead>
//                   <tr>
//                     <th>Invoice No.</th>
//                     <th>Date</th>
//                     <th>Amount</th>
//                     <th>Paid Amount</th>
//                     <th>Balance</th>
//                     <th>Days</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {invoices.map(invoice => {
//                     const balance = invoice.amount - invoice.paidamount;
//                     const days = Math.floor(
//                       (new Date().getTime() - new Date(invoice.createdtime).getTime()) / (1000 * 60 * 60 * 24)
//                     );
//                     return (
//                       <tr key={invoice.invid}>
//                         <td>{invoice.tallyrefinvno}</td>
//                         <td>{convertDateFormat(invoice.invdate)}</td>
//                         <td>₹ {invoice.amount.toFixed(2)}</td>
//                         <td>₹ {invoice.paidamount.toFixed(2)}</td>
//                         <td>₹ {balance.toFixed(2)}</td>
//                         <td>{days}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Toast Notification */}
//       <Toast
//         onClose={() => setShowToast(false)}
//         show={showToast}
//         delay={3000}
//         autohide
//         style={{
//           position: 'fixed',
//           top: 20,
//           right: 20,
//           minWidth: '200px',
//         }}
//       >
//         <Toast.Header>
//           <strong className="me-auto">Notification</strong>
//         </Toast.Header>
//         <Toast.Body>{toastMessage}</Toast.Body>
//       </Toast>
//     </main>
//   );
// }

import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Button, Form, Container, Row, Col, Toast, Table, Modal, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import Cookies from 'js-cookie';
import { supabase } from '../../../supabaseClient';
import { UserContext } from '../../context/UserContext';

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const convertDateFormat = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy}`;
};

const sendOtp = async (mobileNo, otp, amount) => {
  try {
    const apiKey = '6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2';
    const tmpid = '1607100000000253031';
    const sid = 'CENENS';
    const to = `91${mobileNo}`;
    const msg = `Dear Customer, OTP to authenticate your cash payment of ${amount} is ${otp}. Please share to complete your transaction. Thank You for doing business with us.S V Agency by CENTROID ENGINEERING SOLUTIONS`;
    const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(msg)}`;
    const response = await fetch(url);

    if (response.ok) {
      const textResponse = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textResponse, 'text/xml');
      const status = xmlDoc.getElementsByTagName('STATUS')[0]?.textContent;
      const message = xmlDoc.getElementsByTagName('MESSAGE')[0]?.textContent;

      if (status === 'OK' && message === 'SMS SENT') {
        return true;
      } else {
        throw new Error('Failed to send OTP');
      }
    } else {
      throw new Error('Failed to send OTP');
    }
  } catch (err) {
    throw new Error('Failed to send OTP');
  }
};

export default function PaymentEntry() {
  const [User, setUser] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentMode, setPaymentMode] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [remarks, setRemarks] = useState('');
  const [adjustMode, setAdjustMode] = useState(null);
  const [adjustModeOptions, setAdjustModeOptions] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [otp, setOtp] = useState('');
  const [remarkValidate, setRemarkValidate] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [chequeDate, setChequeDate] = useState(getTodayDate());
  const [userMobile, setUserMobile] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [paymentApprovals, setPaymentApprovals] = useState([]);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [prepaidBalance, setPrepaidBalance] = useState(0); 
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        let userQuery = supabase
          .from('users')
          .select('*')
          .in('role', ['retailer', 'mechanic'])
          .order('userid', { ascending: true });

        const { data, error } = await userQuery;

        if (error) {
          console.error('Error fetching Users:', error);
          setToastMessage('Failed to fetch users.');
          setShowToast(true);
          return;
        }

        setUserOptions(
          data.map((item) => ({
            label: item.shopname,
            value: item.userid,
            name: item.name,
            repname: item.representativename,
            repid: item.representativeid,
          }))
        );
      } catch (err) {
        console.error('Unexpected error:', err);
        setToastMessage('An unexpected error occurred while fetching users.');
        setShowToast(true);
      }
    };

    const fetchVisiting = async () => {
      console.log('Punching ID:', Cookies.get('punchingid'));
      const { data, error } = await supabase
        .from('represent_visiting1')
        .select('*')
        .eq('punchingid', Cookies.get('punchingid'));

      if (error) {
        console.error('Error fetching visiting user:', error);
        setToastMessage('Failed to fetch visiting users.');
        setShowToast(true);
      } else if (data && data.length > 0) {
        setUserOptions(
          data.map((visit) => ({
            value: visit.visitorid,
            label: visit.shopname,
            name: visit.visitor,
            role: visit.role,
          }))
        );
      }
    };

    const punchingid = Cookies.get('punchingid');
    if (user?.role === 'representative') {
      if (!punchingid) {
        alert('Please Scan The QR code of User');
        setIsLoading(true); 
        return;
      }
      setIsLoading(false);
      fetchVisiting();
    } else {
      fetchUserOptions();
    }
  }, [user]);

  useEffect(() => {
    const fetchPrepaid = async () => {
      if (User) {
        const { data, error } = await supabase
          .from('users')
          .select('prepaid')
          .eq('userid', User.value)
          .single();
        if (!error) {
          // console.log(data);
          const prepaid = parseFloat(data.prepaid) || 0; // Handle invalid values
          setPrepaidBalance(prepaid);
        } else {
          console.error('Error fetching prepaid balance:', error);
          setToastMessage('Failed to fetch prepaid balance.');
          setShowToast(true);
          setPrepaidBalance(0); // Set to 0 in case of error
        }
      } else {
        setPrepaidBalance(0); // Set to 0 if no user is selected
      }
    };
  
    fetchPrepaid();
  }, [User]);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const { data, error } = await supabase.from('payment_mode').select('paymodeid, paymentname');
        if (!error) {
          setPaymentModes(data.map((item) => ({ label: item.paymentname, value: item.paymodeid })));
        } else {
          console.error('Error fetching payment modes:', error);
          setToastMessage('Failed to fetch payment modes.');
          setShowToast(true);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setToastMessage('An unexpected error occurred while fetching payment modes.');
        setShowToast(true);
      }
    };

    const fetchPaymentApprovals = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_approval')
          .select('*')
          .eq('active', 'Y');
    
        if (error) {
          console.error('Error fetching payment approvals:', error);
          setToastMessage('Failed to fetch payment approvals.');
          setShowToast(true);
        } else {
          // Process data to map invoice allocations and handle undefined invoices
          const processedData = data.map((approval) => {
            const invoiceIds = approval.invoices
              ? approval.invoices.split(',').map((id) => id.trim()) // Split if not empty/undefined
              : []; // Default to empty array if invoices is undefined or empty
            console.log('Processing payment approval:', approval); // Debugging: log approval record
            console.log('Invoice IDs:', invoiceIds); // Debugging: log processed invoice IDs
            return { ...approval, invoiceIds };
          });
          setPaymentApprovals(processedData);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setToastMessage('An unexpected error occurred while fetching payment approvals.');
        setShowToast(true);
      }
    };

    fetchPaymentModes();
    fetchPaymentApprovals();
  }, []);

  useEffect(() => {
    if (User) {
      const fetchInvoices = async () => {
        try {
          const { data, error } = await supabase
            .from('invoices1')
            .select('*')
            .eq('username', User.name)
            .eq('paymentstatus', 'Pending')
            .order('invid', { ascending: true });
          if (!error) {
            setInvoices(data);
          } else {
            console.error('Error fetching invoices:', error);
            setToastMessage('Failed to fetch invoices.');
            setShowToast(true);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setToastMessage('An unexpected error occurred while fetching invoices.');
          setShowToast(true);
        }
      };

      const fetchUserMobile = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('mobile')
            .eq('shopname', User.label)
            .single();
          if (!error) {
            setUserMobile(data.mobile);
          } else {
            console.error('Error fetching user mobile:', error);
            setToastMessage('Failed to fetch user mobile.');
            setShowToast(true);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setToastMessage('An unexpected error occurred while fetching user mobile.');
          setShowToast(true);
        }
      };

      fetchInvoices();
      fetchUserMobile();
    }
  }, [User]);

  useEffect(() => {
    if (paymentMode && paymentMode.label === 'Adjustment') {
      const fetchAdjustModes = async () => {
        try {
          const { data, error } = await supabase.from('adjust_mode').select('adjustid, adjusttype');
          if (!error) {
            setAdjustModeOptions(data.map((item) => ({ label: item.adjusttype, value: item.adjustid })));
          } else {
            console.error('Error fetching adjust modes:', error);
            setToastMessage('Failed to fetch adjust modes.');
            setShowToast(true);
          }
        } catch (err) {
          console.error('Unexpected error:', err);
          setToastMessage('An unexpected error occurred while fetching adjust modes.');
          setShowToast(true);
        }
      };

      fetchAdjustModes();
    } else {
      setAdjustMode(null); 
    }
  }, [paymentMode]);

  const handleGenerateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    sendOtp(userMobile, newOtp, `₹${amount}`).then(() => {
      setToastMessage('OTP sent successfully!');
      setShowToast(true);
    }).catch(() => {
      setToastMessage('Failed to send OTP.');
      setShowToast(true);
    });
  };

  const handleValidateOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpValidated(true);
      setToastMessage('OTP validated successfully!');
      setShowToast(true);
      return true;
    } else {
      setIsOtpValidated(false);
      setToastMessage('Invalid OTP. Please try again.');
      setShowToast(true);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValid(true);
    setRemarkValidate(false);
  
    // Handle OTP validation for cash payments
    if (paymentMode?.label === 'Cash' && !isOtpValidated) {
      if (!handleValidateOtp()) {
        return;
      }
    }
  
    if (remarks.trim() === '') {
      setRemarkValidate(true);
      setIsValid(false);
    }
  
    if (
      !User ||
      !amount ||
      (!paymentReference && paymentMode?.label !== 'Cash' && paymentMode?.label !== 'Adjustment') ||
      (paymentMode?.label === 'Adjustment' && !adjustMode)
    ) {
      setIsValid(false);
      setToastMessage('Please fill all required fields.');
      setShowToast(true);
      return;
    }
  
    if (!paymentMode || !paymentMode.label) {
      setToastMessage('Please select a payment mode.');
      setShowToast(true);
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Fetch invoice data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices1')
        .select('*')
        .eq('username', User.name)
        .eq('paymentstatus', 'Pending')
        .order('invid', { ascending: true });
  
      if (invoiceError) throw new Error(`Error fetching invoice data: ${invoiceError.message}`);
  
      if (!invoiceData || invoiceData.length === 0) {
        // Leave the amount unallocated (no prepaid addition)
        setToastMessage('No pending invoices found for the selected user.');
        setShowToast(true);
        return;
      }
  
      let remainingAmount = parseFloat(amount);
      const invoiceIds = [];
      let totalAllocatedAmount = 0;
  
      for (const invoice of invoiceData) {
        const balance = invoice.amount - invoice.paidamount;
        if (balance <= 0) continue;
  
        // Calculate the 'To Be Cleared' amount from payment_approval table
        // const toBeCleared = paymentApprovals
        //   .filter((pa) => pa.invid === invoice.invid)
        //   .reduce((total, pa) => total + (pa.amount || 0), 0);
        const toBeCleared = paymentApprovals
  .filter((pa) => {
    console.log('Matching invoice:', invoice.invid); // Debugging: log current invoice id
    console.log('Checking in invoiceIds:', pa.invoiceIds); // Debugging: log invoiceIds to be checked
    return Array.isArray(pa.invoiceIds) && pa.invoiceIds.includes(invoice.invid.toString());
  })
  .reduce((total, pa) => total + (pa.amount || 0), 0);

console.log('Calculated toBeCleared:', toBeCleared);

  
        if (toBeCleared === balance) {
          // Skip allocation if "To Be Cleared" is equal to the balance
          continue;
        }
  
        const allocatableAmount = Math.min(remainingAmount, balance - toBeCleared);
  
        invoiceIds.push(invoice.invid);
        totalAllocatedAmount += allocatableAmount;
        remainingAmount -= allocatableAmount;
  
        if (remainingAmount <= 0) break;
      }
  
      if (totalAllocatedAmount === 0) {
        setToastMessage('No eligible invoices to allocate payment.');
        setShowToast(true);
        return;
      }
  
      setToastMessage('Payment allocated successfully!');
      setShowToast(true);
  
      // Insert payment data into the payment_reference table
      const paymentData = {
        userid: User.value,
        repid: User.repid,
        repname: User.repname,
        username: User.name,
        usershopname: User.label,
        invoices: invoiceIds.join(', '), // Combine all invoice IDs as a single string
        paymode: paymentMode.label,
        amount: parseFloat(amount), // Use original amount here
        remarks: remarks.trim(),
        paymentstatus: 'Pending',
        payref: paymentReference || null,
        chequedate: chequeDate || null,
        createdtime: new Date().toISOString(),
        updatedtime: new Date().toISOString(),
        updatedby: user?.userid,
        createdby: user?.userid,
      };
  
      if (paymentMode.label === 'Adjustment') {
        paymentData.adjustmode = adjustMode.label;
      }
  
      const { data: pay, error: insertError } = await supabase
        .from('payment_reference')
        .insert([paymentData])
        .select('payid')
        .single();
  
      if (insertError) throw new Error(`Error inserting payment data: ${insertError.message}`);
  
      if (!pay || !pay.payid) throw new Error('Failed to retrieve payid from inserted data.');
  
      const punchingId = Cookies.get('punchingid');
      const paymentApprovalInsert = {
        payid: pay.payid,
        punchingid: punchingId,
        repid: User.repid,
        invoices: invoiceIds.join(', '), // Store all invoice IDs as a comma-separated string
        userid: User.value,
        username: User.name,
        usershopname: User.label,
        paymode: paymentMode.label,
        paymentstatus: 'To be cleared',
        payref: paymentReference || (paymentMode.label === 'Adjustment' ? adjustMode.label : null),
        remarks: remarks.trim(),
        amount: parseFloat(amount), // Use the original amount entered
        active: 'Y',
        chequedate: chequeDate || new Date().toISOString().split('T')[0],
        createdtime: new Date().toISOString(),
        updatedtime: new Date().toISOString(),
        createdby: user?.userid,
      };
  
      const { error: insertPaymentApproveError } = await supabase
        .from('payment_approval')
        .insert(paymentApprovalInsert);
  
      if (insertPaymentApproveError) {
        throw new Error(`Error inserting payment approval data: ${insertPaymentApproveError.message}`);
      }
  
      resetForm();
    } catch (err) {
      console.error('Unexpected error:', err);
      setToastMessage('There was an unexpected error. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };  

  const resetForm = () => {
    setUser(null);
    setInvoices([]);
    setPaymentMode(null);
    setAmount('');
    setPaymentReference('');
    setRemarks('');
    setAdjustMode(null);
    setOtp('');
    setIsOtpValidated(false);
    setGeneratedOtp(null);
  };

  const totalBalance = useMemo(() => {
    return invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidamount), 0);
  }, [invoices]);

  return (
    <main id='main' className='main'>
      <Container className="mt-2">
        <Row className="justify-content-md-center mt-2">
          <Col>
            <h4 style={{ textAlign: 'center' }}>Payment Reference</h4>
          </Col>
        </Row>
        <br />
        <br />
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Form.Group controlId="formUser">
                <Form.Label>User</Form.Label>
                <Select
                  options={userOptions}
                  value={User}
                  onChange={setUser}
                  placeholder="Select User"
                  isClearable
                  required
                />
              </Form.Group>
            </Col>
            <Col xs lg="6">
              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* {User && (
            <Row className="justify-content-md-center mt-3">
                <Col xs lg="6">
                  <Form.Group controlId="formPrepaid">
                  <Form.Label>Prepaid Balance</Form.Label>
                  <Form.Control
                    type="text"
                    value={`₹ ${prepaidBalance.toFixed(2)}`}
                    readOnly
                    // isInvalid={parseFloat(prepaidBalance) < 0} // Only show invalid if prepaidBalance is less than 0
                    isValid={prepaidBalance >= 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Prepaid balance cannot be negative.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          )} */}

          <Row className="justify-content-md-center mt-3">
            <Col xs lg="6">
              <Form.Group controlId="formPaymentMode">
                <Form.Label>Payment Mode</Form.Label>
                <Select
                  options={paymentModes}
                  value={paymentMode}
                  onChange={setPaymentMode}
                  placeholder="Select Payment Mode"
                  isClearable
                  required
                />
              </Form.Group>
            </Col>
            <Col xs lg="6">
              <Form.Group controlId="formPaymentReference">
                <Form.Label>Payment Reference</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter payment reference"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  required={paymentMode?.label !== 'Cash' && paymentMode?.label !== 'Adjustment'}
                  disabled={paymentMode?.label === 'Cash' || paymentMode?.label === 'Adjustment'}
                />
              </Form.Group>
            </Col>
          </Row>

          {paymentMode && paymentMode.label === 'Cheque' && (
            <Row className="justify-content-md-center mt-3">
              <Col xs lg="6">
                <Form.Group controlId="formChequeDate">
                  <Form.Label>Cheque Date</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Enter cheque date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          {paymentMode && paymentMode.label === 'Adjustment' && (
            <Row className="justify-content-md-center mt-3">
              <Col xs lg="6">
                <Form.Group controlId="formAdjustMode">
                  <Form.Label>Adjust Mode</Form.Label>
                  <Select
                    options={adjustModeOptions}
                    value={adjustMode}
                    onChange={setAdjustMode}
                    placeholder="Select Adjust Mode"
                    isClearable
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          )}
          {paymentMode && paymentMode.label === 'Cash' && (
            <Row className="justify-content-md-center mt-3">
              <Col xs lg="6">
                <Form.Group controlId="formOtp">
                  <Form.Label>OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    disabled={isOtpValidated}
                    onChange={(e) => setOtp(e.target.value)}
                    required={!isOtpValidated}
                  />
                </Form.Group>
                <Button
                  onClick={handleGenerateOtp}
                  disabled={isOtpValidated}
                  className="mt-2"
                  variant={generatedOtp ? 'secondary' : 'primary'}
                >
                  {generatedOtp ? 'Resend OTP' : 'Generate OTP'}
                </Button>
              </Col>
            </Row>
          )}

          <br />

          <Row className="justify-content-md-center">
            <Col xs lg="12">
              <Form.Group controlId="formRemarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter remarks"
                  className={`${remarkValidate ? 'border border-danger' : ''}`}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                />
                {remarkValidate && <Form.Text className="text-danger">Remarks are required.</Form.Text>}
              </Form.Group>
            </Col>
          </Row>

          <br />

          <Row className="justify-content-md-center">
            <Col xs lg="12" className="d-flex justify-content-center">
              <Button
                variant="outline-primary"
                style={{ marginTop: '20px' }}
                onClick={() => setShowInvoiceModal(true)}
                disabled={!User}
              >
                Pending Invoices
              </Button>
            </Col>
          </Row>

          <Row className="justify-content-md-center mt-3">
            <Col xs lg="12" className="d-flex justify-content-center">
              <Button type="submit" variant="primary" disabled={!isValid || isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Modal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Pending Invoices</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invoices.length === 0 ? (
            <p>No pending invoices for this user.</p>
          ) : (
            <div>
              <div style={{ float: 'right', color: 'red', marginBottom: '10px' }}>
                Total Balance: <b>₹ {totalBalance.toFixed(2)}</b>
              </div>
              <Table striped bordered hover responsive className="table-sm"> 
                {/* Added 'table-sm' class to make table more compact */}
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>To Be Cleared</th>
                    <th>Balance</th>
                    <th>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => {
                    const balance = invoice.amount - invoice.paidamount;
                    const toBeCleared = paymentApprovals
                      .filter((pa) => {
                        return Array.isArray(pa.invoiceIds) && pa.invoiceIds.includes(invoice.invid.toString());
                      })
                      .reduce((total, pa) => total + (pa.amount || 0), 0);
                    const days = Math.floor(
                      (new Date().getTime() - new Date(invoice.createdtime).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <tr key={invoice.invid}>
                        <td>{invoice.tallyrefinvno}</td>
                        <td>{convertDateFormat(invoice.invdate)}</td>
                        <td style={{ textAlign: 'right' }}>₹ {invoice.amount.toFixed(2)}</td> 
                        {/* Aligned amount columns to the right */}
                        <td style={{ textAlign: 'right' }}>₹ {toBeCleared.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>₹ {balance.toFixed(2)}</td>
                        <td>{days}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: '200px',
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </main>
  );
}
