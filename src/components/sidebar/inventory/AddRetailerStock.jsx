// import React, { useState, useEffect } from 'react';
// import "./addRetailerStock.css";
// import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import { supabase } from '../../../supabaseClient';
// // import { Category } from '@mui/icons-material';

// export default function AddRetailerStock() {
//   const [retailers, setRetailers] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [requestItems, setRequestItems] = useState([]);
//   const [selectedRetailer, setSelectedRetailer] = useState(null);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [invoiceNo, setInvoiceNo] = useState('');
//   const [invoiceAmount, setInvoiceAmount] = useState('');
//   const [invoiceDate, setInvoiceDate] = useState('');
//   const [errors, setErrors] = useState({});
//   const [tempRequestItems, setTempRequestItems] = useState([]);

//   useEffect(() => {
//     fetchRetailers();
//   }, []);

//   const fetchRetailers = async () => {
//     const { data, error } = await supabase
//       .from('users')
//       .select('userid, shopname, name,representativeid')
//       .eq('active', 'Y')
//       .eq('role', 'retailer');

//     if (error) {
//       console.error('Error fetching retailers:', error);
//     } else {
//       const retailerOptions = data.map(retailer => ({
//         label: retailer.shopname,
//         value: retailer.userid,
//         name: retailer.name,
//         repid: retailer.representativeid,
//       }));
//       setRetailers(retailerOptions);
//     }
//   };

//   const fetchRequests = async (retailerId) => {
//     const { data, error } = await supabase
//       .from('retailer_request')
//       .select('reqid, createdtime')
//       .eq('retailerid', retailerId);

//     if (error) {
//       console.error('Error fetching requests:', error);
//     } else {
//       const requestOptions = data.map(request => ({
//         label: `${request.reqid}/${convertDateFormat(request.createdtime)}`,
//         value: request.reqid,
//       }));
//       setRequests(requestOptions);
//     }
//   };

//   const fetchRequestItems = async (reqid) => {
//     const { data, error } = await supabase
//       .from('retailer_request_items')
//       .select('*')
//       .eq('reqid', reqid);

//     if (error) {
//       console.error('Error fetching request items:', error);
//     } else {
//       setRequestItems(data);
//       setTempRequestItems(data.map(item => ({
//         ...item,
//         tempDeliveredQty: item.deliveredqty,
//         calculatedTotalLitres: (item.totalliters * item.deliveredqty) / item.qty,
//         calculatednoofboxes: (item.noofboxes * item.deliveredqty) / item.qty
//       })));
//     }
//   };

//   const handleRetailerChange = (selectedOption) => {
//     // const updatedSelectedRetailer = {
//     //   ...selectedOption,
//     //   repid: selectedOption.repid !== undefined ? selectedOption.repid : -1
//     // };
//     // console.log('Selected Retailer:', selectedOption);
//     setSelectedRetailer(selectedOption);
//     setSelectedRequest(null);
//     setRequestItems([]);
//     setTempRequestItems([]);
//     fetchRequests(selectedOption.value);
//   };

//   const handleRequestChange = (selectedOption) => {
//     setSelectedRequest(selectedOption);
//     fetchRequestItems(selectedOption.value);
//   };

//   const convertDateFormat = (dateStr) => {
//     if (!dateStr) return '';
//     const date = new Date(dateStr);
//     if (isNaN(date)) return '';

//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0');
//     const dd = String(date.getDate()).padStart(2, '0');

//     return `${dd}-${mm}-${yyyy}`;
//   };

//   // const handleQtyChange = (index, value) => {
//   //   const newItems = [...tempRequestItems];
//   //   const newQty = parseFloat(value);
  
//   //   if (isNaN(newQty) || newQty < 0) {
//   //     newItems[index].tempDeliveredQty = 0;
//   //   } else if (newQty > newItems[index].pendingqty + newItems[index].deliveredqty) {
//   //     newItems[index].tempDeliveredQty = newItems[index].pendingqty + newItems[index].deliveredqty;
//   //   } else {
//   //     newItems[index].tempDeliveredQty = newQty;
//   //   }
  
//   //   newItems[index].calculatedTotalLitres = (newItems[index].totalliters * newItems[index].tempDeliveredQty) / newItems[index].qty;
//   //   newItems[index].calculatednoofboxes = (newItems[index].noofboxes * newItems[index].tempDeliveredQty) / newItems[index].qty;
  
//   //   setTempRequestItems(newItems);
//   // };

//   const handleQtyChange = (index, value) => {
//     const newItems = [...tempRequestItems];
//     const newQty = parseFloat(value);

//     // Check if the entered value is valid
//     if (isNaN(newQty) || newQty < 0) {
//         newItems[index].tempDeliveredQty = 0;
//     } else if (newQty > (newItems[index].pendingqty + newItems[index].deliveredqty)) {
//         newItems[index].tempDeliveredQty = newItems[index].pendingqty + newItems[index].deliveredqty;
//     } else {
//         newItems[index].tempDeliveredQty = newQty;
//     }

//     console.log(`Updated Qty for item ${index}:`, newItems[index].tempDeliveredQty);  // Log tempDeliveredQty

//     // Calculate the derived values and update the object
//     newItems[index].calculatedTotalLitres = (newItems[index].totalliters * newItems[index].tempDeliveredQty) / newItems[index].qty;
//     newItems[index].calculatednoofboxes = (newItems[index].noofboxes * newItems[index].tempDeliveredQty) / newItems[index].qty;

//     setTempRequestItems(newItems);  // Update state correctly
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!selectedRetailer) newErrors.selectedRetailer = 'Retailer is required';
//     if (!selectedRequest) newErrors.selectedRequest = 'Request is required';
//     if (!invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
//     if (!invoiceAmount) newErrors.invoiceAmount = 'Invoice Amount is required';
//     if (!invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';

//     if (Object.keys(newErrors).length > 0) {
//         setErrors(newErrors);
//         return;
//     }

//     if (!selectedRetailer.repid) {
//       newErrors.selectedRetailer = 'Representative ID is missing for the selected retailer.';
//     }
  
//     const updatedItems = requestItems.map((item, index) => {
//       const tempDeliveredQty = tempRequestItems[index]?.tempDeliveredQty || 0;
//       const calculatedTotalLitres = tempRequestItems[index]?.calculatedTotalLitres || 0;
//       const calculatednoofboxes = tempRequestItems[index]?.calculatednoofboxes || 0;

//       return {
//           ...item,
//           pendingqty: item.pendingqty - tempDeliveredQty,
//           deliveredqty: item.deliveredqty + tempDeliveredQty,
//           updatedtime: new Date(),
//           reqitemid: item.reqitemid,
//           reqid: item.reqid,
//           calculatedTotalLitres, // Make sure these are calculated correctly
//           calculatednoofboxes,
//       };
//   });

//     try {
//         // Update request items
//         for (const item of updatedItems) {
//             const { error: updateError } = await supabase
//                 .from('retailer_request_items')
//                 .update({
//                     pendingqty: item.pendingqty,
//                     deliveredqty: item.deliveredqty,
//                     orderstatus: item.deliveredqty>=item.qty?'Completed':'Pending',
//                     updatedtime: item.updatedtime,
//                 })
//                 .eq('reqitemid', item.reqitemid);

//             if (updateError) {
//                 console.error('Error updating request item:', updateError);
//                 return;
//             }
//         }
//         const totalDeliveredQty = updatedItems.reduce((sum, item) => sum + item.deliveredqty, 0);
//         const totalQty = updatedItems.reduce((sum, item) => sum + item.qty, 0);
//         const { error: updateRequestError } = await supabase
//             .from('retailer_request')
//             .update({
//               deliveredqty: totalDeliveredQty,
//               orderstatus: totalDeliveredQty >= totalQty ? 'Completed' : 'Pending',
//               updatedtime: new Date(),
//             })
//             .eq('reqid', selectedRequest.value);

//         if (updateRequestError) {
//             console.error('Error updating retailer request:', updateRequestError);
//             return;
//         }

//         // Insert invoice
//         const { data: insertedInvoice, error: insertError } = await supabase
//             .from('invoices')
//             .insert([{
//                 retailerid: selectedRetailer.value,
//                 repid: selectedRetailer.repid,
//                 retailername: selectedRetailer.name,
//                 retailershopname: selectedRetailer.label,
//                 invdate: invoiceDate,
//                 reqid: selectedRequest.value,
//                 tallyrefinvno: invoiceNo,
//                 amount: parseFloat(invoiceAmount),
//                 role: 'Retailer',
//                 paidamount: 0,
//                 paymentmode: '',
//                 paymentstatus: 'Pending',
//                 totalliters: updatedItems.reduce((sum, item) => sum + (item.calculatedTotalLitres || 0), 0),
//                 createdtime: new Date(),
//                 updatedtime: new Date(),
//             }]).select();

//         if (insertError) {
//             console.error('Error inserting invoice:', insertError);
//             return;
//         }

//         const invid = insertedInvoice[0].invid;
//         for (const item of updatedItems) {
//           console.log("Inserting item:", {
//             qty: item.tempDeliveredQty,
//             itemname: item.itemname,
            
//         });
    
//             const { error: insertItemError } = await supabase
//                 .from('invoice_items1')
//                 .insert([{
//                     invid: invid,
//                     reqid: selectedRequest.value,
//                     repid: selectedRetailer.repid,
//                     itemid:item.itemid,
//                     retailerid:selectedRetailer.value,
//                     itemname:item.itemname,
//                     categoryid: item.categoryid,
//                     categoryname: item.categoryname,
//                     segmentid: item.segmentid,
//                     segmentname: item.segmentname,
//                     // itemweight: item.itemweight,
//                     noofboxes: item.calculatednoofboxes,
//                     // noofitemsinbox: item.noofitemsinbox,
//                     // price: item.price,
//                     qty: item.tempDeliveredQty,
//                     liters: item.calculatedTotalLitres,
//                     // pendingqty: item.pendingqty,
//                     // deliveredqty: item.deliveredqty,
//                     // orderstatus: item.orderstatus,
//                     // totalprice: item.totalprice,
//                     createdtime: new Date(),
//                     updatedtime: new Date(),
//                 }]);

//             if (insertItemError) {
//                 console.error('Error inserting invoice item:', insertItemError);
//                 return;
//             }
            
//             }

        

//     //     const { error: insertionError } = await supabase
//     //     .from('invoice_items')
//     //     .insert([{
//     //         invid: ,
//     //         itemid: ,
//     //         itemname: ,
//     //         categoryid: ,
//     //         categoryname:,
//     //         segmentid:,
//     //         segmentname:,
//     //         itemweight:,
//     //         noofboxes:,
//     //         noofitemsinbox:,
//     //         litres:,
//     //         price:,
//     //         qty:,
//     //         createdtime: new Date(),
//     //         updatedtime: new Date(),

//     //     }]);

//     // if (insertionError) {
//     //     console.error('Error inserting invoice_items:', insertionError);
//     //     return;
//     // }

    
    
//         console.log('Submit successful');
//     } catch (err) {
//         console.error('Error handling submit:', err);
//     }

//     setErrors({});
// };

//   return (
//     <main id='main' className='main'>
//       <Container>
//         <Row className="justify-content-md-center mt-4">
//           <Col md={12}>
//             <h2><center>Billing To Retailer</center></h2>
//             <Form onSubmit={handleSubmit}>
//             <Row className="justify-content-md-center">
//             <Col xs lg="6">
//               <Form.Group controlId="formRetailer" className="mb-3">
//                 <Form.Label>Select Retailers</Form.Label>
//                 <Select
//                   value={selectedRetailer}
//                   onChange={handleRetailerChange}
//                   options={retailers}
//                   placeholder="Select Retailers"
//                   isInvalid={!!errors.selectedRetailer}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.selectedRetailer}
//                 </Form.Control.Feedback>
//               </Form.Group>
//               </Col>
//               <Col xs lg="6">
//               <Form.Group controlId="formRequest" className="mb-3">
//                 <Form.Label>Select Request</Form.Label>
//                 <Select
//                   value={selectedRequest}
//                   onChange={handleRequestChange}
//                   options={requests}
//                   placeholder="Select Request"
//                   isInvalid={!!errors.selectedRequest}
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.selectedRequest}
//                 </Form.Control.Feedback>
//               </Form.Group>
//               </Col>
//               </Row>
//               <Row className="justify-content-md-center">
//               <Col xs lg="6">
//               <Form.Group controlId="formInvoiceNo" className="mb-3">
//                 <Form.Label>Tally Reference Invoice No</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={invoiceNo}
//                   onChange={(e) => setInvoiceNo(e.target.value)}
//                   isInvalid={!!errors.invoiceNo}
//                   placeholder="Tally Reference Invoice No"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.invoiceNo}
//                 </Form.Control.Feedback>
//               </Form.Group>
//               </Col>
//               <Col xs lg="6">
//               <Form.Group controlId="formInvoiceAmount" className="mb-3">
//                 <Form.Label>Invoice Amount</Form.Label>
//                 <Form.Control
//                   type="number"
//                   value={invoiceAmount}
//                   onChange={(e) => setInvoiceAmount(e.target.value)}
//                   isInvalid={!!errors.invoiceAmount}
//                   placeholder="Invoice Amount"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.invoiceAmount}
//                 </Form.Control.Feedback>
//               </Form.Group>
//               </Col>
//               </Row>
//               <Form.Group controlId="formInvoiceDate" className="mb-3">
//                 <Form.Label>Invoice Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   value={invoiceDate}
//                   onChange={(e) => setInvoiceDate(e.target.value)}
//                   isInvalid={!!errors.invoiceDate}
//                   placeholder="Invoice Date"
//                 />
//                 <Form.Control.Feedback type="invalid">
//                   {errors.invoiceDate}
//                 </Form.Control.Feedback>
//               </Form.Group>

//               {selectedRequest && (
//                 <>
//                   <Table striped bordered hover>
//                     <thead>
//                       <tr>
//                         <th>Sl No</th>
//                         <th>Item Details</th>
//                         <th>Qty</th>
//                         <th>Total Litres</th>
//                         <th>Box(es)</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {tempRequestItems.map((item, index) => (
//                         <tr key={item.reqitemid}>
//                           <td>{index + 1}</td>
//                           <td>
//                             {item.itemname}<br />
//                             <span>Required Qty: {item.qty}</span><br />
//                             <span>Delivered Qty: {item.deliveredqty}</span><br />
//                             <span>Pending Qty: {item.pendingqty}</span>
//                           </td>
//                           <td>
//                           <Form.Control
//                                 type="number"
//                                 value={item.tempDeliveredQty !== undefined ? item.tempDeliveredQty : ''}
//                                 onChange={(e) => handleQtyChange(index, e.target.value)}
//                               />
//                           </td>
//                           <td>{item.calculatedTotalLitres.toFixed(2)}</td>
//                           <td>{item.calculatednoofboxes.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </>
//               )}

//               <Button variant="primary" type="submit">
//                 Submit
//               </Button>
//             </Form>
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// }

import React, { useState, useEffect } from 'react';
import "./addRetailerStock.css";
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';

export default function AddRetailerStock() {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(today.getDate()).padStart(2, '0');        // Add leading zero
    return `${year}-${month}-${day}`;
  };

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestItems, setRequestItems] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(getTodayDate());
  const [errors, setErrors] = useState({});
  const [tempRequestItems, setTempRequestItems] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('role', ['retailer','mechanic'])
        .order('userid', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      const userOptions = data.map(user => ({
        label: user.shopname,
        value: user.userid,
        name: user.name,
        repid: user.representativeid,
        role: user.role
      }));
      setUsers(userOptions);
    }
  };

  const fetchRequests = async (userId) => {
    const { data, error } = await supabase
      .from('user_request')
      .select('reqid, createdtime')
      .eq('userid', userId);

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      const requestOptions = data.map(request => ({
        label: `${request.reqid}/${convertDateFormat(request.createdtime)}`,
        value: request.reqid,
      }));
      setRequests(requestOptions);
    }
  };

  const fetchRequestItems = async (reqid) => {
    const { data, error } = await supabase
      .from('user_request_items')
      .select('*')
      .eq('reqid', reqid);

    if (error) {
      console.error('Error fetching request items:', error);
    } else {
      setRequestItems(data);
      setTempRequestItems(data.map(item => ({
        ...item,
        tempDeliveredQty: item.deliveredqty,
        calculatedTotalLitres: (item.totalliters * item.deliveredqty) / item.qty,
        calculatednoofboxes: (item.noofboxes * item.deliveredqty) / item.qty
      })));
    }
  };

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    setSelectedRequest(null);
    setRequestItems([]);
    setTempRequestItems([]);
    fetchRequests(selectedOption.value);
  };

  const handleRequestChange = (selectedOption) => {
    setSelectedRequest(selectedOption);
    fetchRequestItems(selectedOption.value);
  };

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${dd}-${mm}-${yyyy}`;
  };

  const handleQtyChange = (index, value) => {
    const newItems = [...tempRequestItems];
    const newQty = parseFloat(value);

    // Validate the quantity input
    if (isNaN(newQty) || newQty < 0) {
        newItems[index].tempDeliveredQty = 0;
    } else if (newQty > (newItems[index].pendingqty + newItems[index].deliveredqty)) {
        newItems[index].tempDeliveredQty = newItems[index].pendingqty + newItems[index].deliveredqty;
    } else {
        newItems[index].tempDeliveredQty = newQty;
    }

    // Calculate new values for total litres and boxes
    newItems[index].calculatedTotalLitres = (newItems[index].totalliters * newItems[index].tempDeliveredQty) / newItems[index].qty;
    newItems[index].calculatednoofboxes = (newItems[index].noofboxes * newItems[index].tempDeliveredQty) / newItems[index].qty;

    setTempRequestItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!selectedUser) newErrors.selectedUser = 'User is required';
    if (!selectedRequest) newErrors.selectedRequest = 'Request is required';
    if (!invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
    if (!invoiceAmount) newErrors.invoiceAmount = 'Invoice Amount is required';
    if (!invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!selectedUser.repid) {
      newErrors.selectedUser = 'Representative ID is missing for the selected user.';
    }

    const updatedItems = requestItems.map((item, index) => {
      const tempDeliveredQty = tempRequestItems[index]?.tempDeliveredQty || 0;
      const calculatedTotalLitres = tempRequestItems[index]?.calculatedTotalLitres || 0;
      const calculatednoofboxes = tempRequestItems[index]?.calculatednoofboxes || 0;

      return {
        ...item,
        pendingqty: item.pendingqty - tempDeliveredQty,
        deliveredqty: item.deliveredqty + tempDeliveredQty,
        updatedtime: new Date(),
        reqitemid: item.reqitemid,
        reqid: item.reqid,
        calculatedTotalLitres,
        calculatednoofboxes,
        tempDeliveredQty
      };
    });

    try {
      // Update request items
      for (const item of updatedItems) {
        const { error: updateError } = await supabase
          .from('user_request_items')
          .update({
            pendingqty: item.pendingqty,
            deliveredqty: item.deliveredqty,
            orderstatus: item.deliveredqty >= item.qty ? 'Completed' : 'Pending',
            updatedtime: item.updatedtime,
          })
          .eq('reqitemid', item.reqitemid);

        if (updateError) {
          console.error('Error updating request item:', updateError);
          return;
        }
      }

      // Update the user request
      const totalDeliveredQty = updatedItems.reduce((sum, item) => sum + item.deliveredqty, 0);
      const totalQty = updatedItems.reduce((sum, item) => sum + item.qty, 0);
      const { error: updateRequestError } = await supabase
        .from('user_request')
        .update({
          pendingqty: totalQty-totalDeliveredQty,
          deliveredqty: totalDeliveredQty,
          orderstatus: totalDeliveredQty >= totalQty ? 'Completed' : 'Pending',
          updatedtime: new Date(),
        })
        .eq('reqid', selectedRequest.value);

      if (updateRequestError) {
        console.error('Error updating user request:', updateRequestError);
        return;
      }

      // Insert invoice
      const { data: insertedInvoice, error: insertError } = await supabase
        .from('invoices1')
        .insert([{
          userid: selectedUser.value,
          repid: selectedUser.repid,
          username: selectedUser.name,
          usershopname: selectedUser.label,
          invdate: invoiceDate,
          reqid: selectedRequest.value,
          tallyrefinvno: invoiceNo,
          amount: parseFloat(invoiceAmount),
          role: selectedUser.role,
          paidamount: 0,
          paymentmode: '',
          paymentstatus: 'Pending',
          totalliters: updatedItems.reduce((sum, item) => sum + (item.calculatedTotalLitres || 0), 0),
          createdtime: new Date(),
          updatedtime: new Date(),
        }]).select();

      if (insertError) {
        console.error('Error inserting invoice:', insertError);
        return;
      }

      const invid = insertedInvoice[0].invid;
      // Insert invoice items
      for (const item of updatedItems) {
        const { error: insertItemError } = await supabase
          .from('invoice_items1')
          .insert([{
            invid: invid,
            reqid: selectedRequest.value,
            repid: selectedUser.repid,
            itemid: item.itemid,
            userid: selectedUser.value,
            itemname: item.itemname,
            categoryid: item.categoryid,
            categoryname: item.categoryname,
            segmentid: item.segmentid,
            segmentname: item.segmentname,
            noofboxes: item.calculatednoofboxes,
            qty: item.tempDeliveredQty,
            liters: item.calculatedTotalLitres,
            createdtime: new Date(),
            updatedtime: new Date(),
          }]);

        if (insertItemError) {
          console.error('Error inserting invoice item:', insertItemError);
          return;
        }
      }

      // Reset form and items after successful submission
      setSelectedUser(null);
      setSelectedRequest(null);
      setInvoiceNo('');
      setInvoiceAmount('');
      setInvoiceDate(getTodayDate());
      setRequestItems([]);
      setTempRequestItems([]);

      console.log('Stock added and invoice created successfully!');
    } catch (error) {
      console.error('Error during submission:', error);
    }
  };

    return (
    <main id='main' className='main'>
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Col md={12}>
            <h2><center>Billing To User</center></h2>
            <Form onSubmit={handleSubmit}>
            <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Form.Group controlId="formUser" className="mb-3">
                <Form.Label>Select Users</Form.Label>
                <Select
                  value={selectedUser}
                  onChange={handleUserChange}
                  options={users}
                  placeholder="Select Users"
                  isInvalid={!!errors.selectedUser}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selectedUser}
                </Form.Control.Feedback>
              </Form.Group>
              </Col>
              <Col xs lg="6">
              <Form.Group controlId="formRequest" className="mb-3">
                <Form.Label>Select Request</Form.Label>
                <Select
                  value={selectedRequest}
                  onChange={handleRequestChange}
                  options={requests}
                  placeholder="Select Request"
                  isInvalid={!!errors.selectedRequest}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selectedRequest}
                </Form.Control.Feedback>
              </Form.Group>
              </Col>
              </Row>
              <Row className="justify-content-md-center">
              <Col xs lg="6">
              <Form.Group controlId="formInvoiceNo" className="mb-3">
                <Form.Label>Tally Reference Invoice No</Form.Label>
                <Form.Control
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  isInvalid={!!errors.invoiceNo}
                  placeholder="Tally Reference Invoice No"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.invoiceNo}
                </Form.Control.Feedback>
              </Form.Group>
              </Col>
              <Col xs lg="6">
              <Form.Group controlId="formInvoiceAmount" className="mb-3">
                <Form.Label>Invoice Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  isInvalid={!!errors.invoiceAmount}
                  placeholder="Invoice Amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.invoiceAmount}
                </Form.Control.Feedback>
              </Form.Group>
              </Col>
              </Row>
              <Form.Group controlId="formInvoiceDate" className="mb-3">
                <Form.Label>Invoice Date</Form.Label>
                <Form.Control
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  isInvalid={!!errors.invoiceDate}
                  placeholder="Invoice Date"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.invoiceDate}
                </Form.Control.Feedback>
              </Form.Group>

              {selectedRequest && (
                <>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Sl No</th>
                        <th>Item Details</th>
                        <th>Qty</th>
                        <th>Total Litres</th>
                        <th>Box(es)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempRequestItems.map((item, index) => (
                        <tr key={item.reqitemid}>
                          <td>{index + 1}</td>
                          <td>
                            {item.itemname}<br />
                            <span>Required Qty: {item.qty}</span><br />
                            <span>Delivered Qty: {item.deliveredqty}</span><br />
                            <span>Pending Qty: {item.pendingqty}</span>
                          </td>
                          <td>
                          <Form.Control
                                type="number"
                                value={item.tempDeliveredQty !== undefined ? item.tempDeliveredQty : ''}
                                onChange={(e) => handleQtyChange(index, e.target.value)}
                              />
                          </td>
                          <td>{item.calculatedTotalLitres.toFixed(2)}</td>
                          <td>{item.calculatednoofboxes.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </main>
  );
}