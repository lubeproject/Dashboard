import React, { useState, useEffect } from 'react';
import "./addRetailerStock.css";
import { Form, Button, Container, Row, Col, Table } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';
import { Category } from '@mui/icons-material';

export default function AddRetailerStock() {
  const [retailers, setRetailers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requestItems, setRequestItems] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [errors, setErrors] = useState({});
  const [tempRequestItems, setTempRequestItems] = useState([]);

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('userid, shopname, name')
      .eq('active', 'Y')
      .eq('role', 'retailer');

    if (error) {
      console.error('Error fetching retailers:', error);
    } else {
      const retailerOptions = data.map(retailer => ({
        label: retailer.shopname,
        value: retailer.userid,
        name: retailer.name
      }));
      setRetailers(retailerOptions);
    }
  };

  const fetchRequests = async (retailerId) => {
    const { data, error } = await supabase
      .from('retailer_request')
      .select('reqid, createdtime')
      .eq('retailerid', retailerId);

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
      .from('retailer_request_items')
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

  const handleRetailerChange = (selectedOption) => {
    setSelectedRetailer(selectedOption);
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
  
    if (isNaN(newQty) || newQty < 0) {
      newItems[index].tempDeliveredQty = 0;
    } else if (newQty > newItems[index].pendingqty + newItems[index].deliveredqty) {
      newItems[index].tempDeliveredQty = newItems[index].pendingqty + newItems[index].deliveredqty;
    } else {
      newItems[index].tempDeliveredQty = newQty;
    }
  
    newItems[index].calculatedTotalLitres = (newItems[index].totalliters * newItems[index].tempDeliveredQty) / newItems[index].qty;
    newItems[index].calculatednoofboxes = (newItems[index].noofboxes * newItems[index].tempDeliveredQty) / newItems[index].qty;
  
    setTempRequestItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!selectedRetailer) newErrors.selectedRetailer = 'Retailer is required';
    if (!selectedRequest) newErrors.selectedRequest = 'Request is required';
    if (!invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
    if (!invoiceAmount) newErrors.invoiceAmount = 'Invoice Amount is required';
    if (!invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
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
          calculatedTotalLitres, // Make sure these are calculated correctly
          calculatednoofboxes,
      };
  });

    try {
        // Update request items
        for (const item of updatedItems) {
            const { error: updateError } = await supabase
                .from('retailer_request_items')
                .update({
                    pendingqty: item.pendingqty,
                    deliveredqty: item.deliveredqty,
                    updatedtime: item.updatedtime,
                })
                .eq('reqitemid', item.reqitemid);

            if (updateError) {
                console.error('Error updating request item:', updateError);
                return;
            }
        }
        const totalDeliveredQty = updatedItems.reduce((sum, item) => sum + item.deliveredqty, 0);
        const { error: updateRequestError } = await supabase
            .from('retailer_request')
            .update({ deliveredqty: totalDeliveredQty,updatedtime: new Date() })
            .eq('reqid', selectedRequest.value);

        if (updateRequestError) {
            console.error('Error updating retailer request:', updateRequestError);
            return;
        }

        // Insert invoice
        const { data: insertedInvoice, error: insertError } = await supabase
            .from('invoices')
            .insert([{
                retailerid: selectedRetailer.value,
                retailername: selectedRetailer.name,
                retailershopname: selectedRetailer.label,
                invdate: invoiceDate,
                reqid: selectedRequest.value,
                tallyrefinvno: invoiceNo,
                amount: parseFloat(invoiceAmount),
                role: 'Retailer',
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
        for (const item of updatedItems) {
          const { error: updateError } = await supabase
              .from('retailer_request_items')
              .update({
                  pendingqty: item.pendingqty,
                  deliveredqty: item.deliveredqty,
                  updatedtime: item.updatedtime,
              })
              .eq('reqitemid', item.reqitemid);
            
              if (updateError) {
                console.error('Error updating request item:', updateError);
                return;
            }

            const { error: insertItemError } = await supabase
                .from('invoice_items')
                .insert([{
                    invid: invid,
                    itemid:item.itemid,
                    itemname:item.itemname,
                    categoryid: item.categoryid,
                    categoryname: item.categoryname,
                    segmentid: item.segmentid,
                    segmentname: item.segmentname,
                    itemweight: item.itemweight,
                    noofboxes: item.calculatedTotalLitres,
                    noofitemsinbox: item.noofitemsinbox,
                    price: item.price,
                    qty: item.qty,
                    liters: item.calculatedTotalLitres,
                    pendingqty: item.pendingqty,
                    deliveredqty: item.deliveredqty,
                    orderstatus: item.orderstatus,
                    totalprice: item.totalprice,
                    createdtime: new Date(),
                    updatedtime: new Date(),
                }]);

            if (insertItemError) {
                console.error('Error inserting invoice item:', insertItemError);
                return;
            }
            
            }

        

    //     const { error: insertionError } = await supabase
    //     .from('invoice_items')
    //     .insert([{
    //         invid: ,
    //         itemid: ,
    //         itemname: ,
    //         categoryid: ,
    //         categoryname:,
    //         segmentid:,
    //         segmentname:,
    //         itemweight:,
    //         noofboxes:,
    //         noofitemsinbox:,
    //         litres:,
    //         price:,
    //         qty:,
    //         createdtime: new Date(),
    //         updatedtime: new Date(),

    //     }]);

    // if (insertionError) {
    //     console.error('Error inserting invoice_items:', insertionError);
    //     return;
    // }

    
    
        console.log('Submit successful');
    } catch (err) {
        console.error('Error handling submit:', err);
    }

    setErrors({});
};

  return (
    <main id='main' className='main'>
      <Container>
        <Row className="justify-content-md-center mt-4">
          <Col md={12}>
            <h2><center>Billing To Retailer</center></h2>
            <Form onSubmit={handleSubmit}>
            <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Form.Group controlId="formRetailer" className="mb-3">
                <Form.Label>Select Retailers</Form.Label>
                <Select
                  value={selectedRetailer}
                  onChange={handleRetailerChange}
                  options={retailers}
                  placeholder="Select Retailers"
                  isInvalid={!!errors.selectedRetailer}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selectedRetailer}
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
                              value={item.tempDeliveredQty}
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

