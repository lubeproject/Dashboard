import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';

export default function PaymentEntry() {
  const [retailer, setRetailer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [remarks, setRemarks] = useState('');
  const [adjustMode, setAdjustMode] = useState(null);
  const [adjustModeOptions, setAdjustModeOptions] = useState([]);
  const [paymentModes, setPaymentModes] = useState([]);
  const [retailerOptions, setRetailerOptions] = useState([]);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [chequeDate, setChequeDate] = useState('');
  const [retailerMobile, setRetailerMobile] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [paymentApprovals, setPaymentApprovals] = useState([]);
  

  useEffect(() => {
    const fetchPaymentModes = async () => {
      const { data, error } = await supabase.from('payment_mode').select('paymodeid, paymentname');
      if (!error) {
        setPaymentModes(data.map(item => ({ label: item.paymentname, value: item.paymodeid })));
      } else {
        console.error('Error fetching payment modes:', error);
      }
    };

    const fetchRetailerOptions = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('userid, shopname, name, representativename, representativeid')
          .eq('role', 'retailer');
    
        if (error) {
          console.error('Error fetching retailers:', error);
          return;
        }
    
        setRetailerOptions(data.map(item => ({
          label: item.shopname,
          value: item.userid,
          name: item.name,
          repname: item.representativename,
          repid: item.representativeid
        })));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    const fetchPaymentApprovals = async () => {
      const { data, error } = await supabase
        .from('payment_approval')
        .select('*')
        .eq('active','Y');
  
      if (error) {
        console.error('Error fetching payment approvals:', error);
      } else {
        console.log('Fetched payment approvals:', data); // Log data for debugging
        setPaymentApprovals(data);
      }
    };

    fetchPaymentModes();
    fetchRetailerOptions();
    fetchPaymentApprovals(); 
  }, []);

  useEffect(() => {
    if (retailer) {
      const fetchInvoices = async () => {
        const { data, error } = await supabase.from('invoices').select('invid, retailername, tallyrefinvno, invdate, amount, paidamount, createdtime').eq('retailername', retailer.label)
        .eq('paymentstatus','Pending');
        if (!error) {
          setInvoices(data);
        } else {
          console.error('Error fetching invoices:', error);
        }
      };

      const fetchRetailerMobile = async () => {
        const { data, error } = await supabase.from('users').select('mobile').eq('shopname', retailer.label).single();
        if (!error) {
          setRetailerMobile(data.mobile);
        } else {
          console.error('Error fetching retailer mobile:', error);
        }
      };

      fetchInvoices();
      fetchRetailerMobile();
    }
  }, [retailer]);

  

  useEffect(() => {
    if (paymentMode && paymentMode.label === 'Adjustment') {
      const fetchAdjustModes = async () => {
        const { data, error } = await supabase.from('adjust_mode').select('adjustid, adjusttype');
        if (!error) {
          setAdjustModeOptions(data.map(item => ({ label: item.adjusttype, value: item.adjustid })));
        } else {
          console.error('Error fetching adjust modes:', error);
        }
      };

      fetchAdjustModes();
    }
  }, [paymentMode]);

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
  
    const date = new Date(dateStr);
  
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleInvoiceSelect = (invid) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invid)) {
        return prev.filter(id => id !== invid);
      } else {
        return [...prev, invid];
      }
    });
  };

  const handleGenerateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`OTP sent to ${retailerMobile}: ${newOtp}`);
  };

  const handleValidateOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpValidated(true);
      alert('OTP validated successfully!');
    } else {
      setIsOtpValidated(false);
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting payment entry...');
    
    if (!retailer || !selectedInvoices.length || !paymentMode || !amount || (!paymentReference && !otp && !adjustMode) || !remarks || (paymentMode.label === 'Cash' && !isOtpValidated)) {
      setIsValid(false);
      // console.log('Retailer:', retailer);
      // console.log('Selected Invoices:', selectedInvoices);
      // console.log('Payment Mode:', paymentMode);
      // console.log('Amount:', amount);
      // console.log('Payment Reference:', paymentReference);
      // console.log('Remarks:', remarks);
      // console.log('Is OTP Validated:', isOtpValidated);

      console.log('Validation failed.');
      return;
    }

    try {
      console.log('Fetching invoice data...');
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .in('invid', selectedInvoices);

      if (invoiceError) {
        console.error('Error fetching invoice data:', invoiceError);
        throw new Error(`Error fetching invoice data: ${invoiceError.message}`);
      }

      

      console.log('Preparing data for insertion...');
      const dataToInsert = {
        retailerid: retailer.value,
        repid: retailer.repid,
        repname: retailer.repname,
        retailername: retailer.name,
        retailershopname: retailer.label,
        invoices: selectedInvoices.join(', '),
        paymode: paymentMode.value,
        amount: parseFloat(amount),
        remarks: remarks,
        paymentstatus: paymentMode.label === 'Cheque' ? 4 : 2,
        payref: paymentReference || null,
        chequedate: chequeDate || null,
        createdtime: new Date().toISOString(),
        updatedtime: new Date().toISOString(),
      };

      if (paymentMode.label === 'Adjustment') {
        dataToInsert.adjustid = adjustMode.value;
      }

      console.log('Inserting payment data...');
      const { data: pay, error: insertError } = await supabase
        .from('payment_reference')
        .insert([dataToInsert])
        .select('payid')
        .single();


      if (insertError) {
        console.error('Error inserting payment data:', insertError);
        throw new Error(`Error inserting payment data: ${insertError.message}`);
      }

      console.log('Inserted payment data:', pay);

      // Ensure pay contains the payid
      if (!pay || !pay.payid) {
        throw new Error('Failed to retrieve payid from inserted data.');
      }
      if(paymentMode.label!=='Cheque'){
      for (const invoice of invoiceData) {
        const updatedPaidAmount = invoice.paidamount + parseFloat(amount);
        const isPaidInFull = updatedPaidAmount >= invoice.amount;
  
        const { data: updatedInvoice, error: updateInvoiceError } = await supabase
          .from('invoices')
          .update({
            paymentdate: new Date(),
            paymentmode: paymentMode.label,
            paidamount: updatedPaidAmount,
            paymentstatus: isPaidInFull ? 'Paid' : 'Pending',
            updatedtime: new Date(),
          })
          .eq('invid', invoice.invid)
          .select();  // Select to return updated data for verification
  
          if (updateInvoiceError) {
            console.error(`Error updating invoice with invid ${invoice.invid}:`, updateInvoiceError);
            throw new Error(`Error updating invoice with invid ${invoice.invid}: ${updateInvoiceError.message}`);
          }
    
          if (isPaidInFull) {
            const { error: updatePaymentReferenceError } = await supabase
              .from('payment_reference')
              .update({
                paymentstatus: 1,
                updatedtime: new Date().toISOString(),
              })
              .eq('payid', pay.payid);
    
            if (updatePaymentReferenceError) {
              console.error(
                `Error updating payment reference for payid ${pay.payid}:`,
                updatePaymentReferenceError
              );
              throw new Error(
                `Error updating payment reference for payid ${pay.payid}: ${updatePaymentReferenceError.message}`
              );
            }
          }
          console.log(`Updated invoice data:`, updatedInvoice);
    }
  }

      if (paymentMode.label === 'Cheque') {
        console.log('Inserting payment approval data...');
        const invoiceId = invoiceData.length > 0 ? invoiceData[0].invid : null;
        const { error: insertPaymentApproveError } = await supabase
          .from('payment_approval')
          .insert({
            payid:pay.payid,
            repid: dataToInsert.repid,
            invid: invoiceId,
            retailerid: retailer.value,
            retailername: retailer.name,
            paymode: paymentMode.label,
            paymentstatus: 'To be cleared',
            payref: paymentReference || null,
            amount: parseFloat(amount),
            active: 'Y',
            chequedate: chequeDate || null,
            createdtime: new Date().toISOString(),
            updatedtime: new Date().toISOString(),
          });

        if (insertPaymentApproveError) {
          console.error('Error inserting payment approve data:', insertPaymentApproveError);
          throw new Error(`Error inserting payment approve data: ${insertPaymentApproveError.message}`);
        }
      }

      alert('Payment recorded successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('There was an unexpected error. Please try again.');
    }
  };

return (
  <main id='main' className='main'>
    <Container className="mt-2">
      <Row className="justify-content-md-center mt-2">
        <Col>
          <h4 style={{ textAlign: "center" }}>Payment Reference</h4>
        </Col>
      </Row>
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form.Group controlId="formRetailer">
              <Form.Label>Retailer</Form.Label>
              <Select options={retailerOptions} value={retailer} onChange={setRetailer} />
            </Form.Group>
          </Col>
          <Col xs lg="6">
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
          </Col>  
        </Row>
        
        {/* Amount input field */}
        <Row className="justify-content-md-center">
          
          <Col xs lg="12">
            <Button
              variant="outline-primary"
              style={{ marginTop: '31px' }}
              onClick={() => setShowInvoiceModal(true)}
              disabled={!retailer}
            >
              Select Invoices
            </Button>
          </Col>

          <Col xs lg="6">
            {/* Display selected invoices as round bubbles */}
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '31px' }}>
              {selectedInvoices.map(invoiceId => {
                const invoice = invoices.find(inv => inv.invid === invoiceId);
                return (
                  <div
                    key={invoiceId}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '50px',
                      margin: '2px',
                      fontSize: '0.9rem',
                    }}
                  >
                    Invoice No: {invoice?.tallyrefinvno}
                  </div>
                );
              })}
            </div>
          </Col>
        </Row>
        
        {/* Payment Mode and Reference */}
        <Row className="justify-content-md-center">
          <Col xs lg="6">
            <Form.Group controlId="formPaymentMode">
              <Form.Label>Payment Mode</Form.Label>
              <Select options={paymentModes} value={paymentMode} onChange={setPaymentMode} />
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
                disabled={paymentMode && (paymentMode.label === 'Cash' || paymentMode.label === 'Adjustment') && !isOtpValidated}
              />
            </Form.Group>
          </Col>
        </Row>
        
        {/* Conditional Fields based on Payment Mode */}
        {paymentMode && paymentMode.label === 'Cheque' && (
          <Row className="justify-content-md-center">
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
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Form.Group controlId="formAdjustMode">
                <Form.Label>Adjust Mode</Form.Label>
                <Select options={adjustModeOptions} value={adjustMode} onChange={setAdjustMode} />
              </Form.Group>
            </Col>
          </Row>
        )}
        {paymentMode && paymentMode.label === 'Cash' && (
          <Row className="justify-content-md-center">
            <Col xs lg="6">
              <Form.Group controlId="formOtp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleGenerateOtp}>Generate OTP</Button>
              <Button onClick={handleValidateOtp}>Validate OTP</Button>
            </Col>
          </Row>
        )}
        
        {/* Remarks and Submit */}
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Button type="submit" variant="primary" disabled={!isValid}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>

    {/* Invoice selection modal */}
    <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Invoices</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <h5>Available Invoices</h5>
              {invoices.map(invoice => {
                const balance = invoice.amount - invoice.paidamount;
                const toBeCleared = paymentApprovals
                .filter(pa => pa.invid === invoice.invid)
                .reduce((total, pa) => total + (pa.amount || 0), 0);
                const days = Math.floor(
                  (new Date().setHours(0, 0, 0, 0) - new Date(invoice.createdtime).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={invoice.invid}>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.includes(invoice.invid)}
                      onChange={() => handleInvoiceSelect(invoice.invid)}
                    />
                    <span style={{ marginLeft: '10px' }}>
                      {`Invoice: ${invoice.tallyrefinvno}, Date: ${convertDateFormat(invoice.invdate)}, To be Cleared: ${toBeCleared}, Balance: ${balance}, Days: ${days}`}
                    </span>
                  </div>
                );
              })}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => setShowInvoiceModal(false)}>
          Save Selections
        </Button>
      </Modal.Footer>
    </Modal>
  </main>
);
}