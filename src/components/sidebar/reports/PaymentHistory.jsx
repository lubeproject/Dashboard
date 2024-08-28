// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../../supabaseClient';
// import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import norecordfound from "../../../images/norecordfound.gif";
// import "./PaymentHistory.css";

// export default function PaymentHistory() {
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
//             <h4 className="text-center">Payment History</h4>
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
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./PaymentHistory.css";

export default function PaymentHistory() {
  const [retailersOptions, setRetailersOptions] = useState([]);
  const [paymentStatusOptions, setPaymentStatusOptions] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [paymentModeMap, setPaymentModeMap] = useState({});
  const [paymentStatusMap, setPaymentStatusMap] = useState({});

  useEffect(() => {
    // Fetch retailers and payment statuses
    const fetchInitialData = async () => {
      const { data: retailersData, error: retailersError } = await supabase
        .from('users')
        .select('userid, shopname,name')
        .eq('role', 'retailer');
  
      const { data: paymentStatusData, error: paymentStatusError } = await supabase
        .from('payment_status')
        .select('paystatusid, paymentstatus');
  
      const { data: paymentModesData, error: paymentModesError } = await supabase
        .from('payment_mode')
        .select('paymodeid, paymentname');
  
      if (retailersError) console.error('Error fetching Retailers:', retailersError);
      else setRetailersOptions(retailersData.map(retailer => ({ value: retailer.userid, label: retailer.shopname })));
  
      if (paymentStatusError) console.error('Error fetching Payment Status:', paymentStatusError);
      else {
        const allValue = paymentStatusData.find(status => status.paymentstatus === 'All')?.paystatusid || null;
  
        setPaymentStatusOptions([
          { value: allValue, label: 'All' },
          ...paymentStatusData.filter(status => status.paymentstatus !== 'All').map(status => ({ value: status.paystatusid, label: status.paymentstatus }))
        ]);
  
        setPaymentStatusMap(paymentStatusData.reduce((acc, status) => {
          acc[status.paystatusid] = status.paymentstatus;
          return acc;
        }, {}));
      }
  
      if (paymentModesError) console.error('Error fetching Payment Modes:', paymentModesError);
      else {
        setPaymentModeMap(paymentModesData.reduce((acc, mode) => {
          acc[mode.paymodeid] = mode.paymentname;
          return acc;
        }, {}));
      }
    };  

    fetchInitialData();
  }, []);

    const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

  const handleFilter = async () => {
    if (!selectedRetailer) {
      alert('Please select a retailer');
      return;
    }
  
    try {
      let approvalData = [];
      let referenceData = [];
  
      // Fetch data based on the selected payment status
      if (selectedPaymentStatus && selectedPaymentStatus.value === paymentStatusOptions.find(option => option.label === 'All')?.value) {
        // Fetch "To be cleared" data from payment_approval
        const { data: approvalDataResponse, error: approvalError } = await supabase
          .from('payment_approval')
          .select('*')
          .eq('retailerid', selectedRetailer.value)
          .eq('paymentstatus', 'To be cleared')
          .gte('createdtime', startDate.toISOString())
          .lte('createdtime', endDate.toISOString());
  
        if (approvalError) throw approvalError;
        approvalData = approvalDataResponse.map(item => ({
          ...item,
          paymentstatus: paymentStatusMap[item.paymentstatus] || item.paymentstatus, // Custom status for payment_approval
          paymentmode: paymentModeMap[item.paymode] || item.paymode, // Map payment mode
        }));
  
        // Fetch "Paid" and "Pending" data from payment_reference
        const { data: referenceDataResponse, error: referenceError } = await supabase
          .from('payment_reference')
          .select('*')
          .eq('retailerid', selectedRetailer.value)
          .in('paymentstatus', [1, 2])
          .gte('createdtime', startDate.toISOString())
          .lte('createdtime', endDate.toISOString()); // Assuming 1 and 2 correspond to Paid and Pending
  
        if (referenceError) throw referenceError;
        referenceData = referenceDataResponse.map(item => ({
          ...item,
          paymentmode: paymentModeMap[item.paymode] || item.paymode, // Map payment mode ID to name
          paymentstatus: paymentStatusMap[item.paymentstatus] || item.paymentstatus, // Map status ID to name
        }));
  
        setFilteredData([...approvalData, ...referenceData]);
  
      } else if (selectedPaymentStatus && selectedPaymentStatus.label === 'To be cleared') {
        // Fetch data only from payment_approval for "To be cleared"
        const { data: approvalDataResponse, error: approvalError } = await supabase
          .from('payment_approval')
          .select('*')
          .eq('retailerid', selectedRetailer.value)
          .eq('paymentstatus', 'To be cleared')
          .gte('createdtime', startDate.toISOString())
          .lte('createdtime', endDate.toISOString());
  
        if (approvalError) throw approvalError;
        const processedApprovalData = approvalDataResponse.map(item => ({
          ...item,
          paymentstatus: 'To be cleared', // Custom status for payment_approval
          paymentmode: paymentModeMap[item.paymode] || item.paymode, // Map payment mode
        }));
  
        setFilteredData(processedApprovalData);
  
      } else {
        // Fetch data from payment_reference for Paid or Pending statuses
        let query = supabase
          .from('payment_reference')
          .select('*')
          .eq('retailerid', selectedRetailer.value);
  
        if (selectedPaymentStatus && selectedPaymentStatus.value) {
          query = query.eq('paymentstatus', selectedPaymentStatus.value);
        }
  
        if (startDate) {
          query = query.gte('createdtime', startDate.toISOString());
        }
  
        if (endDate) {
          query = query.lte('createdtime', endDate.toISOString());
        }
  
        const { data, error } = await query;
  
        if (error) throw error;
  
        const mappedData = data.map(payment => ({
          ...payment,
          paymentmode: paymentModeMap[payment.paymode] || payment.paymode, // Map payment mode ID to name
          paymentstatus: paymentStatusMap[payment.paymentstatus] || payment.paymentstatus, // Map status ID to name
        }));
  
        setFilteredData(mappedData);
      }
  
      setFilterApplied(true);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };
      
  const handleReset = () => {
    setSelectedRetailer(null);
    setSelectedPaymentStatus(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-3">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Payment History</h4>
          </Col>
        </Row>
        <Row className="mb-2 select-row">
          <Col md={6} xs={12} className="mb-2">
            <Form.Group controlId="formRetailer">
              <Select
                value={selectedRetailer}
                onChange={setSelectedRetailer}
                options={retailersOptions}
                placeholder="Select Retailer"
              />
            </Form.Group>
          </Col>
          <Col md={6} xs={12} className="mb-2">
            <Form.Group controlId="formPaymentStatus">
              <Select
                value={selectedPaymentStatus}
                onChange={setSelectedPaymentStatus}
                options={paymentStatusOptions}
                placeholder="Select Payment Status"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-2 filter-row">
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
        <Row className="mt-2">
          <Col>
            {filteredData.length === 0 ? (
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" className="no-record-img" />
              </div>
            ) : (
              <Table striped bordered hover responsive className="sales-report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Retailer</th>
                    <th>Payment Mode</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{formatDate(data.createdtime)}</td>
                      <td>
                            {data.retailershopname}<br />
                            {data.retailername}
                      </td>
                      <td>{data.paymentmode}<br/>
                          {data.payref} 
                      </td>
                      <td>₹{data.amount}</td>
                      <td>{data.paymentstatus}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
