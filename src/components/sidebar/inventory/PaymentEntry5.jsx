import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Modal, Badge } from 'react-bootstrap';
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
      <Container className="mt-4">
        <Row className="justify-content-md-center mt-4">
          <Col>
            <h4 style={{ textAlign: "center" }}>Payment Reference</h4>
          </Col>
        </Row>
        <Row>
          <Col>
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
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formRetailer">
                <Form.Label>Select Retailer</Form.Label>
                <Select
                  value={retailer}
                  onChange={setRetailer}
                  options={retailerOptions}
                  placeholder="Select Retailer"
                  className={!isValid && !retailer ? 'is-invalid' : ''}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: !isValid && !retailer ? 'red' : base.borderColor,
                    }),
                  }}
                />
                {!isValid && !retailer && <div className="invalid-feedback d-block">Please select a retailer.</div>}
              </Form.Group>

              <Form.Group controlId="formInvoice">
                <Form.Label>Select Invoice</Form.Label>
                <Button variant="secondary" onClick={() => setShowInvoiceModal(true)}>Select Invoice(s)</Button>
                <div className="mt-2">
                  {selectedInvoices.map((invoiceId) => (
                    <Badge pill variant="primary" key={invoiceId} className="mr-2">
                      Invoice No: {invoiceId}
                    </Badge>
                  ))}
                </div>
                {!isValid && !selectedInvoices.length && <div className="invalid-feedback d-block">Please select at least one invoice.</div>}
              </Form.Group>

              <Form.Group controlId="formPaymentMode">
                <Form.Label>Select Payment Mode</Form.Label>
                <Select
                  value={paymentMode}
                  onChange={setPaymentMode}
                  options={paymentModes}
                  placeholder="Select Payment Mode"
                  className={!isValid && !paymentMode ? 'is-invalid' : ''}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: !isValid && !paymentMode ? 'red' : base.borderColor,
                    }),
                  }}
                />
                {!isValid && !paymentMode && <div className="invalid-feedback d-block">Please select a payment mode.</div>}
              </Form.Group>

              {paymentMode && paymentMode.label === 'Cheque' && (
                <Form.Group controlId="formChequeDate">
                  <Form.Label>Cheque Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    className={!isValid && !chequeDate ? 'is-invalid' : ''}
                  />
                  {!isValid && !chequeDate && <div className="invalid-feedback">Please enter a cheque date.</div>}
                </Form.Group>
              )}

              {/* Conditional Rendering for Adjust Mode */}
              {paymentMode && paymentMode.label === 'Adjustment' && (
                <Form.Group controlId="formAdjustMode">
                  <Form.Label>Select Adjust Mode</Form.Label>
                  <Select
                    value={adjustMode}
                    onChange={setAdjustMode}
                    options={adjustModeOptions}
                    placeholder="Select Adjust Mode"
                    className={!isValid && !adjustMode ? 'is-invalid' : ''}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: !isValid && !adjustMode ? 'red' : base.borderColor,
                      }),
                    }}
                  />
                  {!isValid && !adjustMode && <div className="invalid-feedback d-block">Please select an adjust mode.</div>}
                </Form.Group>
              )}

              {paymentMode && paymentMode.label === 'Cash' && (
                <div>
                  <Form.Group controlId="formOtp">
                    <Form.Label>OTP</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={!isValid && !otp ? 'is-invalid' : ''}
                    />
                    {!isValid && !otp && <div className="invalid-feedback">Please enter the OTP.</div>}
                  </Form.Group>
                  <Button variant="primary" onClick={handleGenerateOtp}>Generate OTP</Button>
                  <Button variant="secondary" onClick={handleValidateOtp}>Validate OTP</Button>
                </div>
              )}

            {paymentMode && (paymentMode.label === 'UPI' || paymentMode.label === 'Cheque') && (
            <div>
             <Form.Group controlId="formPaymentReference">
               <Form.Label>Payment Reference</Form.Label>
               <Form.Control
                 type="text"
                 value={paymentReference}
                 onChange={e => setPaymentReference(e.target.value)}
                 placeholder="Payment Ref / Cheque No / UPI No"
                 className={!isValid && !paymentReference ? 'is-invalid' : ''}
               />
               {!isValid && !paymentReference && <div className="invalid-feedback">Please enter a payment reference.</div>}
             </Form.Group>
             </div>
              )}

              <Form.Group controlId="formAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={!isValid && !amount ? 'is-invalid' : ''}
                />
                {!isValid && !amount && <div className="invalid-feedback">Please enter an amount.</div>}
              </Form.Group>

              <Form.Group controlId="formRemarks">
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={!isValid && !remarks ? 'is-invalid' : ''}
                />
                {!isValid && !remarks && <div className="invalid-feedback">Please enter remarks.</div>}
              </Form.Group>

              <Button variant="primary" type="submit" disabled={paymentMode && paymentMode.label === 'Cash' && !isOtpValidated}>Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>

      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Invoice(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {invoices.length > 0 ? (
              invoices.map((invoice) => {
                const toBeClearedAmount = invoice.paymentstatus === 'To be cleared'
                  ? invoice.amount - invoice.paidamount
                  : 0;
                
                return (
                  <Form.Check
                    type="checkbox"
                    key={invoice.invid}
                    id={`invoice-${invoice.invid}`}
                    label={`Invoice ID: ${invoice.tallyrefinvno}, Date: ${invoice.invdate}, To be cleared: ${toBeClearedAmount}, Balance: ${invoice.amount - invoice.paidamount}, Days: ${Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(invoice.createdtime).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))}`}
                    checked={selectedInvoices.includes(invoice.tallyrefinvno)}
                    onChange={() => handleInvoiceSelect(invoice.tallyrefinvno)}
                  />
                );
              })
            ) : (
              <p>No invoices available for the selected retailer.</p>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowInvoiceModal(false);
            }}
          >
            Save Selections
          </Button>
        </Modal.Footer>
      </Modal>

    </main>
  );
}
