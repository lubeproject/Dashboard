// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../../supabaseClient';
// import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import norecordfound from "../../../images/norecordfound.gif";
// import "./InvoiceHistory.css";

// export default function InvoiceHistory() {
//   const [retailersOptions, setRetailersOptions] = useState([]);
//   const [paymentStatus, setPaymentStatus] = useState([]);
//   const [selectedRetailer, setSelectedRetailer] = useState(null);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterApplied, setFilterApplied] = useState(false);

//   useEffect(() => {
//     // Fetch mechanics from the users table
//     const fetchRetailers = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, shopname, name, role')
//         .eq('role', 'retailer');

//       if (error) console.error('Error fetching Retailers:', error);
//       else setRetailersOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
//     };

//     // Fetch items from the item_master table
//     const fetchPaymentStatus = async () => {
//       const { data, error } = await supabase
//         .from('payment_status')
//         .select('paystatusid, paymentstatus')

//       if (error) console.error('Error fetching items:', error);
//       else setPaymentStatus(data.map(payment => ({ value: payment.paystatusid, label: payment.paymentstatus})));
//     };

//     fetchRetailers();
//     fetchPaymentStatus();
//   }, []);

//   const handleFilter = () => {
//     let filtered = [];

//     if (startDate && endDate) {
//       if (startDate > endDate) {
//         alert("Pick From Date cannot be later than Pick To Date.");
//         return;
//       }

//       filtered = filtered.filter(data => {
//         const dataDate = new Date(data.date.split('-').reverse().join('-'));
//         return dataDate >= startDate && dataDate <= endDate;
//       });
//     }

//     setFilteredData(filtered);
//     setFilterApplied(true);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`; // Change format as needed
//   };

//   const handleReset = () => {
//     setSelectedRetailer(null);
//     setSelectedPayment(null);
//     setStartDate(null);
//     setEndDate(null);
//     setFilteredData([]);
//     setFilterApplied(false);
//   };

//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: !selectedRetailer ? 'red' : provided.borderColor,
//       '&:hover': {
//         borderColor: !selectedRetailer ? 'red' : provided.borderColor,
//       },
//     }),
//   };

//   useEffect(() => {
//     fetchSegments();
//   }, []);

//   const fetchSegments = async () => {
//     const { data: filteredData, error } = await supabase
//       .from('segment_master')
//       .select('*')
//       .eq('activestatus', 'Y'); // Filter active segments

//     if (error) console.error('Error fetching segments:', error.message);
//     else setFilteredData(filteredData);
//   };

//   return (
//     <main id='main' className='main'>
//       <Container className="mt-3">
//         <Row className="mb-4">
//           <Col>
//             <h4 className="text-center">Invoice History</h4>
//           </Col>
//         </Row>
//         <Row className="mb-2 select-row">
//           <Col md={6} xs={12} className="mb-2">
//             <Form.Group controlId="formRetailer">
//               <Select
//                 value={selectedRetailer}
//                 onChange={setSelectedRetailer}
//                 options={retailersOptions}
//                 placeholder="Select Retailer"
//                 styles={customSelectStyles}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6} xs={12} className="mb-2">
//             <Form.Group controlId="formPaymentStatus">
//               <Select
//                 value={selectedPayment}
//                 onChange={setSelectedPayment}
//                 options={paymentStatus}
//                 placeholder="Select Payment Status"
//                 styles={customSelectStyles}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Row className="mb-2 filter-row">
//           <Col md={3} xs={6} className="mb-2">
//             <DatePicker
//               selected={startDate}
//               onChange={date => setStartDate(date)}
//               dateFormat="dd/MM/yyyy"
//               className="form-control"
//               placeholderText="Pick From Date"
//             />
//           </Col>
//           <Col md={3} xs={6}>
//             <DatePicker
//               selected={endDate}
//               onChange={date => setEndDate(date)}
//               dateFormat="dd/MM/yyyy"
//               className="form-control"
//               placeholderText="Pick To Date"
//             />
//           </Col>
//           <Col md={3} xs={6} className="mb-2">
//             <Button variant="primary" onClick={handleFilter} block>
//               Apply Filter
//             </Button>
//           </Col>
//           <Col md={3} xs={6}>
//             <Button variant="secondary" onClick={handleReset} block>
//               Reset
//             </Button>
//           </Col>
//         </Row>
//         <Row className="mt-2">
//           <Col>
//             {filteredData.length === 0 ? (
//               <div className="text-center">
//                 <img src={norecordfound} alt="No Record Found" className="no-record-img" />
//               </div>
//             ) : (
//               <Table striped bordered hover responsive className="sales-report-table">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Retailer</th>
//                     <th>Payment Mode</th>
//                     <th>Amount</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((data, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{data.segmentname.trim()}</td>
//                       <td>{1}</td>
//                       <td>{3}</td>
//                       <td>{4}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             )}
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../../supabaseClient';
// import { Container, Row, Col, Button, Form, Table, Card } from 'react-bootstrap';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useNavigate } from 'react-router-dom';
// import './InvoiceHistory.css';

// export default function InvoiceHistory() {
//   const [usersOptions, setUsersOptions] = useState([]);
//   const [paymentStatus, setPaymentStatus] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [invoices, setInvoices] = useState([]);
//   // const [filterApplied, setFilterApplied] = useState(false);
//   const [paymentApprovals, setPaymentApprovals] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch users from the users table
//     const fetchUsers = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .in('role', ['retailer','mechanic'])
//         .order('userid', { ascending: true });

//       if (error) console.error('Error fetching Users:', error);
//       else setUsersOptions(data.map(user => ({ value: user.userid, label: user.shopname, name: user.name,role: user.role})));
//     };

//     // Fetch payment statuses
//     const fetchPaymentStatus = async () => {
//       const { data, error } = await supabase
//         .from('payment_status')
//         .select('paystatusid, paymentstatus');

//       if (error) console.error('Error fetching Payment Statuses:', error);
//       else setPaymentStatus(data.map(status => ({ value: status.paystatusid, label: status.paymentstatus })));
//     };

//     fetchUsers();
//     fetchPaymentStatus();
//   }, []);

//   useEffect(() => {
//     if (selectedUser) {
//       fetchPaymentApprovals(selectedUser.value);
//     } else {
//       setPaymentApprovals([]);
//     }
//   }, [selectedUser]);

//   const fetchPaymentApprovals = async (userId) => {
//     const { data, error } = await supabase
//       .from('payment_approval')
//       .select('*')
//       .eq('active', 'Y')
//       .eq('userid', userId);

//     if (error) {
//       console.error('Error fetching payment approvals:', error);
//     } else {
//       console.log('Fetched payment approvals:', data);
//       setPaymentApprovals(data);
//     }
//   };

//   const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = date.getDate().toString().padStart(2, '0');
//         const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//         const month = monthNames[date.getMonth()];
//         const year = date.getFullYear();
//         return `${day}-${month}-${year}`; // Change format as needed
//       };

//       const handleFilter = async () => {
//         if (!selectedUser) {
//           alert('Please select a user');
//           return;
//         }
//         let query = supabase.from('invoices1').select('*');
      
//         if (selectedUser) {
//           query = query.eq('userid', selectedUser.value);
//         }
      
//         if (selectedPayment) {
//           // Handle the case where "All" is selected
//           if (selectedPayment.label === 'All') { // Assuming "All" has value 3
//             query = query.in('paymentstatus', ['Approved', 'Pending']);
//           } else {
//             query = query.eq('paymentstatus', selectedPayment.label);
//           }
//         }
      
//         if (startDate && endDate) {
//           if (startDate > endDate) {
//             alert("Pick From Date cannot be later than Pick To Date.");
//             return;
//           }
      
//           query = query.gte('invdate', startDate.toISOString().split('T')[0])
//                        .lte('invdate', endDate.toISOString().split('T')[0]);
//         }
      
//         const { data, error } = await query;
      
//         if (error) console.error('Error fetching invoices:', error);
//         else {
//           setInvoices(data);
//           // setFilterApplied(true);  
//         }
//       };
      

//   const handleReset = () => {
//     setSelectedUser(null);
//     setSelectedPayment(null);
//     setStartDate(null);
//     setEndDate(null);
//     setInvoices([]);
//     // setFilterApplied(false);
//   };

//   const handleInvoiceClick = (invoiceId) => {
//     // Navigate to another page with the invoice details
//     navigate(`/portal/invoicedetails/${invoiceId}`);
//   };

//   return (
//     <main id='main' className='main'>
//       <Container className="mt-3">
//         <Row className="mb-4">
//           <Col>
//             <h4 className="text-center">Invoice History</h4>
//           </Col>
//         </Row>
//         <Row className="mb-2 select-row">
//           <Col md={6} xs={12} className="mb-2">
//             <Form.Group controlId="formUser">
//               <Select
//                 value={selectedUser}
//                 onChange={setSelectedUser}
//                 options={usersOptions}
//                 placeholder="Select User"
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6} xs={12} className="mb-2">
//             <Form.Group controlId="formPaymentStatus">
//               <Select
//                 value={selectedPayment}
//                 onChange={setSelectedPayment}
//                 options={paymentStatus}
//                 placeholder="Select Payment Status"
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Row className="mb-2 filter-row">
//           <Col md={3} xs={6} className="mb-2">
//             <DatePicker
//               selected={startDate}
//               onChange={date => setStartDate(date)}
//               dateFormat="dd/MM/yyyy"
//               className="form-control"
//               placeholderText="Pick From Date"
//             />
//           </Col>
//           <Col md={3} xs={6}>
//             <DatePicker
//               selected={endDate}
//               onChange={date => setEndDate(date)}
//               dateFormat="dd/MM/yyyy"
//               className="form-control"
//               placeholderText="Pick To Date"
//             />
//           </Col>
//           <Col md={3} xs={6} className="mb-2">
//             <Button variant="primary" onClick={handleFilter} block>
//               Apply Filter
//             </Button>
//           </Col>
//           <Col md={3} xs={6}>
//             <Button variant="secondary" onClick={handleReset} block>
//               Reset
//             </Button>
//           </Col>
//         </Row>
//         <Row className="mt-2">
//           <Col>
//             {invoices.length === 0 ? (
//               <div className="text-center">
//                 <p>No Invoices Found</p>
//               </div>
//             ) : (
//               <Row>
//                 {invoices.map((invoice) => {
//                   const balance = invoice.amount - invoice.paidamount;
//                   const toBeCleared = paymentApprovals
//                     .filter(pa => pa.invid === invoice.invid)
//                     .reduce((total, pa) => total + (pa.amount || 0), 0);
//                   const payDate = invoice.paymentdate || new Date();
//                   const days = Math.floor(
//                     (new Date(payDate).setHours(0, 0, 0, 0) - new Date(invoice.invdate).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
//                   );
//                   return (
//                     <Col md={6} key={invoice.invid} className="mb-3">
//                       <Card className="invoice-card position-relative" onClick={() => handleInvoiceClick(invoice.invid)}>
//                         <div className="status-bubble">{invoice.paymentstatus}</div>
//                         <div className="days">{days} Days</div>
//                         <Card.Body>
//                           <Card.Title>Invoice No: {invoice.tallyrefinvno} - {formatDate(invoice.invdate)}</Card.Title>
//                           <Table bordered size="sm">
//                             <tbody>
//                               <tr>
//                                 <td>Invoice Value</td>
//                                 <td>₹{invoice.amount}</td>
//                               </tr>
//                               <tr>
//                                 <td>Paid</td>
//                                 <td>₹{invoice.paidamount}</td>
//                               </tr>
//                               <tr>
//                                 <td>To be Cleared</td>
//                                 <td>₹{toBeCleared}</td>
//                               </tr>
//                               <tr>
//                                 <td>Balance</td>
//                                 <td>₹{balance}</td>
//                               </tr>
//                             </tbody>
//                           </Table>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   );
//                 })}
//               </Row>
//             )}
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// }

import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table, Card } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import './InvoiceHistory.css';
import { UserContext } from '../../context/UserContext';

export default function InvoiceHistory() {
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [paymentApprovals, setPaymentApprovals] = useState([]);
  const navigate = useNavigate();
  const {user} = useContext(UserContext);
  const location = useLocation();  

  useEffect(() => {
    // Check if there's relevant state to apply filters automatically
    if (location.state && location.state.selectedUser) {
      const { selectedUser, startDate, endDate } = location.state;
      
      // Update local state with these values
      setSelectedUser(selectedUser);
      setStartDate(startDate ? new Date(startDate) : null);
      setEndDate(endDate ? new Date(endDate) : null);
  
      // Convert dates to appropriate format or use as is if already in Date format
    }
  }, [location.state]);


  useEffect(() => {
    // Fetch users from the users table
    const fetchUsers = async () => {

      let userQuery = supabase
          .from('users')
          .select('*')
          .in('role', ['retailer', 'mechanic'])
          .order('userid', { ascending: true });

        if(user?.role === 'representative'){
          userQuery = userQuery
          .eq('representativeid',user?.userid)
          .eq('representativename',user?.name);
        }
      const { data, error } = await userQuery

      if (error) console.error('Error fetching Users:', error);
      else
        setUsersOptions(
          data.map(user => ({
            value: user.userid,
            label: user.shopname,
            name: user.name,
            role: user.role,
          }))
        );
    };
    if (user?.role === 'retailer'|| user?.role === 'mechanic'){
      setUsersOptions([
         {
          value: user?.userid,
          label: user?.shopname,
          name: user?.name,
          role: user?.role,
        }
      ]);
    }else{
      fetchUsers();
    }
    
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      fetchPaymentApprovals(selectedUser.value);
    } else {
      setPaymentApprovals([]);
    }
  }, [selectedUser]);

  const fetchPaymentApprovals = async userId => {
    const { data, error } = await supabase
      .from('payment_approval')
      .select('*')
      .eq('active', 'Y')
      .eq('userid', userId);

    if (error) {
      console.error('Error fetching payment approvals:', error);
    } else {
      console.log('Fetched payment approvals:', data);
      setPaymentApprovals(data);
    }
  };

  // useEffect(() => {
  //   // Call handleFilter whenever selectedUser, startDate or endDate changes
  //   if (selectedUser || (startDate && endDate)) {
  //     handleFilter();
  //   }
  // }, [selectedUser, startDate, endDate]);



  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Change format as needed
  };

  const setStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);  // Set hours, minutes, seconds, and milliseconds to 0
    return newDate;
  };
  
  // Set end date to 23:59:59 (end of the day) if needed
  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);  // Set hours, minutes, seconds, and milliseconds to the end of the day
    return newDate;
  };

  const formatDateForSQL = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted date in 'YYYY-MM-DD HH:MM:SS' format
    return `${year}-${month}-${day}`;
  };

  const handleFilter = async () => {
    if (!selectedUser) {
      alert('No selected user to filter.');
      return;
    }
    let query = supabase.from('invoices1')
      .select('*')
      .eq('userid', selectedUser.value)
      .order('invid',{ascending:false});

    // if (selectedUser) {
    //   query = query.eq('userid', selectedUser.value);
    // }

    if (startDate && endDate) {
      if (startDate > endDate) {
        alert('Pick From Date cannot be later than Pick To Date.');
        return;
      }
    }
    if(startDate){
      const startOfDay = formatDateForSQL(setStartOfDay(startDate));
      query = query
        .gte('invdate', startOfDay);
    }
    if(endDate){
      const endOfDay = formatDateForSQL(setEndOfDay(endDate));
      query = query
        .lte('invdate', endOfDay);
    }

    const { data, error } = await query;

    if (error) console.error('Error fetching invoices:', error);
    else {
      setInvoices(data);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setStartDate(null);
    setEndDate(null);
    setInvoices([]);
  };

  const handleInvoiceClick = (invoiceId) => {
    navigate('/portal/invoicedetails', {
      state: {
        invoiceId,
        selectedUser,
        startDate,
        endDate,
      },
    });
  };

  return (
    <main id="main" className="main">
      <Container className="mt-3">
        <Row className="mb-4 ">
          <Col>
            <h4 className="text-center">Invoice History</h4>
          </Col>
        </Row>
        <Row className="mb-2 select-row justify-content-md-center">
          <Col md={6} xs={12} className="mb-2">
            <Form.Group controlId="formUser">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={usersOptions}
                placeholder="Select User"
              />
              {!selectedUser && (
                <p className="text-danger">Please select a User</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-2 filter-row justify-content-md-center">
          <Col md={3} xs={6} className="mb-2">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Pick From Date"
            />
          </Col>
          <Col md={3} xs={6}>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Pick To Date"
            />
          </Col>
          </Row>
          <br/>
          <Row className='justify-content-md-center'>
          <Col md={3} xs={6} className="mb-2">
            <Button variant="primary" onClick={handleFilter} block>
              Apply Filter
            </Button>
          </Col>
          <Col md={3} xs={6}>
            <Button variant="secondary" onClick={handleReset} block>
              Reset
            </Button>
          </Col>
        </Row>
        <br/>
        <Row className="mt-2">
          <Col>
            {invoices.length === 0 ? (
              <div className="text-center">
                <p>No Invoices Found</p>
              </div>
            ) : (
              <Row>
                {invoices.map(invoice => {
                  const balance = invoice.amount - invoice.paidamount;
                  const toBeCleared = paymentApprovals
                    .filter(pa => pa.invid === invoice.invid)
                    .reduce((total, pa) => total + (pa.amount || 0), 0);
                  const payDate = invoice.paymentdate || new Date();
                  const days = Math.floor(
                    (new Date(payDate).setHours(0, 0, 0, 0) -
                      new Date(invoice.invdate).setHours(0, 0, 0, 0)) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <Col md={6} key={invoice.invid} className="mb-3">
                      <Card
                        className="invoice-card position-relative"
                        onClick={() => handleInvoiceClick(invoice.invid)}
                      >
                        <div className="status-bubble">
                          {invoice.paymentstatus}
                        </div>
                        <div className="days">{days} Days</div>
                        <Card.Body>
                          <Card.Title>
                            Invoice No: {invoice.tallyrefinvno} -{' '}
                            {formatDate(invoice.invdate)}
                          </Card.Title>
                          <Table bordered size="sm">
                            <tbody>
                              <tr>
                                <td>Invoice Value</td>
                                <td>₹{invoice.amount}</td>
                              </tr>
                              <tr>
                                <td>Paid</td>
                                <td>₹{invoice.paidamount}</td>
                              </tr>
                              <tr>
                                <td>To be Cleared</td>
                                <td>₹{toBeCleared}</td>
                              </tr>
                              <tr>
                                <td>Balance</td>
                                <td>₹{balance}</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
