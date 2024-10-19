import React, { useState, useEffect, useContext } from 'react';
import "./addRetailerStock.css";
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';
import { UserContext } from '../../context/UserContext';

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
  const {user} = useContext(UserContext);
  const [isSubmitted,setIsSubmitted] = useState(false);
  const [remarks, setRemarks] = useState('');

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
      .eq('userid', userId)
      .order('reqid',{ascending:false});
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
      .eq('reqid', reqid)
      .order('reqitemid',{ascending:true});

    if (error) {
      console.error('Error fetching request items:', error);
    } else {
      setRequestItems(data);
      setTempRequestItems(data.map(item => ({
        ...item,
        tempDeliveredQty: item.pendingqty === 0 ? 0 : item.deliveredqty, // Set to 0 if pendingqty is 0
        calculatedTotalLitres: (item.totalliters * (item.pendingqty === 0 ? 0 : item.deliveredqty)) / item.qty,
        calculatednoofboxes: (item.noofboxes * (item.pendingqty === 0 ? 0 : item.deliveredqty)) / item.qty
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
    const itemWeight = newItems[index].itemweight;
    // Validate the quantity input
    if (isNaN(newQty) || newQty < 0) {
        newItems[index].tempDeliveredQty = 0;
    } else if (newItems[index].pendingqty === 0) {
      newItems[index].tempDeliveredQty = 0;
    } else if (newQty > (newItems[index].pendingqty)) {
        newItems[index].tempDeliveredQty = newItems[index].pendingqty;
    } else if (newQty % itemWeight !== 0) {
      alert(`Please check the entered quantity for ${newItems[index].itemname}. Quantity must be in multiples of ${itemWeight}.`);
      return;
  } else {
      newItems[index].tempDeliveredQty = newQty;
  }
    // Calculate new values for total litres and boxes
    newItems[index].calculatedTotalLitres = (newItems[index].totalliters * newItems[index].tempDeliveredQty) / newItems[index].qty;
    newItems[index].calculatednoofboxes = (newItems[index].noofboxes * newItems[index].tempDeliveredQty) / newItems[index].qty;

    setTempRequestItems(newItems);
  };

  const fetchCategoryMasterData = async (items) => {
    const categoryIds = items.map(item => item.categoryid);
    const uniqueCategoryIds = Array.from(new Set(categoryIds));

    const { data, error } = await supabase
      .from('category_master')
      .select('categoryid, pointsperltr')
      .in('categoryid', uniqueCategoryIds);

    if (error) {
      console.error('Error fetching category master data:', error);
      return {};
    }

    return data.reduce((acc, item) => {
      acc[item.categoryid] = item;
      return acc;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form inputs
    const newErrors = {};
    if (!selectedUser) newErrors.selectedUser = 'User is required';
    if (!selectedRequest) newErrors.selectedRequest = 'Request is required';
    if (!invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
    if (!invoiceAmount) newErrors.invoiceAmount = 'Invoice Amount is required';
    if (!invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';
  
    if (tempRequestItems.every(item => item.tempDeliveredQty === 0)) {
      if (!remarks) {
        newErrors.remarks = 'Remarks are required when all quantities are zero.';
      }
    }

    if (parseFloat(invoiceAmount) === 0 && !remarks) {
      newErrors.remarks = 'Remarks are required when the invoice amount is zero.';
    }
    
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    if (!selectedUser.repid) {
      newErrors.selectedUser = 'Representative ID is missing for the selected user.';
    }
  
    setIsSubmitted(true);
  
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
      // Fetch user's prepaid balance
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('prepaid')
        .eq('userid', selectedUser.value)
        .single();
  
      if (userError) {
        console.error('Error fetching user prepaid balance:', userError);
        return;
      }
  
      let prepaidBalance = userData.prepaid || 0;
      const invoiceAmountValue = parseFloat(invoiceAmount).toFixed(2);
      let initialPaidAmount = 0;
      let paymentModeDescription = '';
      let paymentStatus = 'Pending';
      let invoiceRemarks = '';
  
      if (prepaidBalance > 0) {
        initialPaidAmount = Math.min(prepaidBalance, invoiceAmountValue);
        paymentModeDescription = 'Adjustment';
  
        // Check if the invoice can be fully paid using prepaid
        if (initialPaidAmount === invoiceAmountValue) {
          paymentStatus = 'Approved';
          invoiceRemarks = 'Paid from previous payments';
        }
      }
  
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
          pendingqty: totalQty - totalDeliveredQty,
          deliveredqty: totalDeliveredQty,
          orderstatus: totalDeliveredQty >= totalQty ? 'Completed' : 'Pending',
          updatedtime: new Date(),
          updatedby: user?.userid,
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
          amount: invoiceAmountValue,
          role: selectedUser.role,
          paidamount: initialPaidAmount, // Set initial paid amount using prepaid balance
          paymentmode: paymentModeDescription, // Set payment mode if prepaid is used
          paymentstatus: paymentStatus,
          paymentdate: initialPaidAmount === invoiceAmountValue ? new Date().toISOString().split('T')[0] : null,
          totalliters: updatedItems.reduce((sum, item) => sum + (item.calculatedTotalLitres || 0), 0),
          createdtime: new Date(),
          updatedtime: new Date(),
          createdby: user?.userid,
          updatedby: user?.userid,
          rewardpoints: 0,
          remarks: invoiceRemarks,
        }]).select();
  
      if (insertError) {
        console.error('Error inserting invoice:', insertError);
        return;
      }
  
      // Reduce prepaid balance
      if (initialPaidAmount > 0) {
        const remainingPrepaid = prepaidBalance - initialPaidAmount;
        const { error: updateUserError } = await supabase
          .from('users')
          .update({ prepaid: remainingPrepaid })
          .eq('userid', selectedUser.value);
  
        if (updateUserError) {
          console.error('Error updating user prepaid balance:', updateUserError);
          return;
        }
      }
  
      const invid = insertedInvoice[0].invid;
      const categoryMasterData = await fetchCategoryMasterData(updatedItems);
      const invoiceItemsWithRewardPoints = updatedItems.map((item, index) => {
        const pointsperliter = categoryMasterData[item.categoryid]?.pointsperltr || 0;
        const rewardpoints = (item.calculatedTotalLitres || 0) * pointsperliter;
  
        return {
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
          noofboxes: parseFloat(item.calculatednoofboxes.toFixed(2)),
          qty: item.tempDeliveredQty,
          liters: parseFloat(item.calculatedTotalLitres.toFixed(2)),
          rewardpoints: parseFloat(rewardpoints.toFixed(2)),
          createdtime: new Date(),
          updatedtime: new Date(),
        };
      });
  
      // Insert invoice items
      for (const item of invoiceItemsWithRewardPoints) {
        const { error: insertItemError } = await supabase
          .from('invoice_items1')
          .insert([item]);
  
        if (insertItemError) {
          console.error('Error inserting invoice item:', insertItemError);
          return;
        }
      }
  
      // Sum the rewardpoints of all items
      const totalRewardPoints = parseFloat(invoiceItemsWithRewardPoints.reduce((sum, item) => sum + item.rewardpoints, 0).toFixed(2));
      // Update the total rewardpoints in invoices1
      const { error: updateInvoiceError } = await supabase
        .from('invoices1')
        .update({ rewardpoints: totalRewardPoints })
        .eq('invid', invid);
  
      if (updateInvoiceError) {
        console.error('Error updating invoice with total rewardpoints:', updateInvoiceError);
        return;
      }
  
      const { data: userPointsData, error: userPointsError } = await supabase
        .from('users')
        .select('rewardpoints')
        .eq('userid', selectedUser.value)
        .single(); // Assuming userid is unique and you only expect one result
  
      if (userPointsError) {
        console.error('Error fetching user reward points:', userPointsError);
        return;
      }
  
      // Calculate the new reward points
      const currentRewardPoints = userPointsData?.rewardpoints || 0; // Ensure it's a number
      const newRewardPoints = parseFloat((currentRewardPoints + totalRewardPoints).toFixed(2));
  
      // Update the user's reward points
      const { error } = await supabase
        .from('users')
        .update({
          rewardpoints: newRewardPoints,
          updatedby: user?.userid,
          updatedtime: new Date().toISOString(),
          lastupdatedtime: new Date().toISOString(),
        })
        .eq('userid', selectedUser.value);

    if (error) {
      console.error('Error updating reward points:', error);
    }

    // If the invoice is fully paid using prepaid, insert it into the paid_invoices table
    if (initialPaidAmount === invoiceAmountValue) {
      const { error: insertPaidInvoiceError } = await supabase
        .from('paid_invoices')
        .insert([{
          payid: insertedInvoice[0].invid, // Assuming payid is the invoice ID for paid_invoices
          invid: invid,
          amount: invoiceAmountValue,
          paidamount: initialPaidAmount,
          createdtime: new Date().toISOString(),
          createdby: user?.userid,
        }]);

      if (insertPaidInvoiceError) {
        console.error('Error inserting into paid_invoices:', insertPaidInvoiceError);
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
      setRemarks('');


      console.log('Stock added and invoice created successfully!');
      alert('Invoice Created Successfully!');
      setIsSubmitted(false);
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
                  onWheel={(e) => e.target.blur()}
                  isInvalid={!!errors.invoiceAmount}
                  placeholder="Invoice Amount"
                  min = "0"
                  step="0.01"
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
                        <th>Qty/Items in Box</th>
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
                            <span>No of Boxes: {item.noofboxes}</span> <br/>
                            <span>Required Qty: {item.qty}</span><br />
                            <span>Delivered Qty: {item.deliveredqty}</span><br />
                            <span>Pending Qty: {item.pendingqty}</span>
                          </td>
                          <td>
                          <Form.Control
                            type="number"
                            value={item.pendingqty === 0 ? 0 : (item.tempDeliveredQty !== undefined ? item.tempDeliveredQty : '')}
                            onChange={(e) => handleQtyChange(index, item.pendingqty === 0 ? 0 : e.target.value)}
                            onWheel={(e) => e.target.blur()}
                            readOnly={item.pendingqty === 0}
                            min="0"
                            step= "1"
                          />
                          </td>
                          <td>{item.calculatedTotalLitres.toFixed(2)}</td>
                          <td>{item.calculatednoofboxes.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {(tempRequestItems.every(item => item.tempDeliveredQty === 0) || (parseFloat(invoiceAmount)===0)) &&(
                    <Form.Group controlId="formRemarks" className="mb-3">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        isInvalid={!!errors.remarks}
                        placeholder="Enter remarks"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.remarks}
                      </Form.Control.Feedback>
                    </Form.Group>
                  )}
                </>
              )}

              <Button variant="primary" type="submit" disabled={isSubmitted} >
                {isSubmitted? 'Submitting': 'Submit'}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
