// import React, {useState} from 'react';
// import "./paymentEntry.css";
// import { Button, Form, Container, Row, Col } from 'react-bootstrap';
// import Select from 'react-select';

// const retailerOptions = [
//    'Star Lubricants Spares- K R Puram' ,
//     'A R AUTOMBILES-SIRA' ,
//     'ARB Automobile- Tmk' ,
//     'ATN Automobiles- Turuvekere' 
//   ].map(option => ({ label: option, value: option }));
  
//   const invoiceOptions = [
//     'Star Lubricants Spares- K R Puram' ,
//     'A R AUTOMBILES-SIRA' ,
//    'ARB Automobile- Tmk' ,
//    'ATN Automobiles- Turuvekere'
//   ].map(option => ({ label: option, value: option }));
  
//   const paymentModeOptions = [
//     'Adjustment' ,
//     'Cash' ,
//     'Cheque' ,
//     'UPI' 
//   ].map(option => ({ label: option, value: option }));

// export default function PaymentEntry() {

//     const [retailer, setRetailer] = useState(null);
//     const [invoice, setInvoice] = useState(null);
//     const [paymentMode, setPaymentMode] = useState(null);
//     const [amount, setAmount] = useState('');
//     const [paymentReference, setPaymentReference] = useState('');
//     const [remarks, setRemarks] = useState('');
//     const [isValid, setIsValid] = useState(true);
  
//     const handleSubmit = (e) => {
//       e.preventDefault();
//       if (!retailer || !invoice || !paymentMode || !amount || !paymentReference || !remarks) {
//         setIsValid(false);
//       } else {
//         // Handle form submission logic
//         console.log({
//           retailer: retailer.value,
//           invoice: invoice.value,
//           paymentMode: paymentMode.value,
//           amount,
//           paymentReference,
//           remarks
//         });
//         // Reset form or redirect as needed
//       }
//     };


//   return (
//     <main id='main' className='main'>
//     <Container className="mt-4">
//       <Row className="justify-content-md-center mt-4">

    
//         <Row>
//             <Col>
//             <h4 style={{textAlign:"center"}}>Payment Reference</h4>
//             </Col>
//         </Row>
//       <Row>
//         <Col>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group controlId="formRetailer">
//               <Form.Label>Select Retailer</Form.Label>
//               <Select
//                 value={retailer}
//                 onChange={setRetailer}
//                 options={retailerOptions}
//                 placeholder="Select Retailer"
//                 className={!isValid && !retailer ? 'is-invalid' : ''}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     borderColor: !isValid && !retailer ? 'red' : base.borderColor,
//                     '&:hover': {
//                       borderColor: !isValid && !retailer ? 'red' : base.borderColor
//                     }
//                   })
//                 }}
//               />
//               {!isValid && !retailer && <div className="invalid-feedback d-block">Please select a retailer.</div>}
//             </Form.Group>

//             <Form.Group controlId="formInvoice">
//               <Form.Label>Select Invoice</Form.Label>
//               <Select
//                 value={invoice}
//                 onChange={setInvoice}
//                 options={invoiceOptions}
//                 placeholder="Select Invoice"
//                 className={!isValid && !invoice ? 'is-invalid' : ''}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     borderColor: !isValid && !invoice ? 'red' : base.borderColor,
//                     '&:hover': {
//                       borderColor: !isValid && !invoice ? 'red' : base.borderColor
//                     }
//                   })
//                 }}
//               />
//               {!isValid && !invoice && <div className="invalid-feedback d-block">Please select an invoice.</div>}
//             </Form.Group>

//             <Form.Group controlId="formPaymentMode">
//               <Form.Label>Select Payment Mode</Form.Label>
//               <Select
//                 value={paymentMode}
//                 onChange={setPaymentMode}
//                 options={paymentModeOptions}
//                 placeholder="Select Payment Mode"
//                 className={!isValid && !paymentMode ? 'is-invalid' : ''}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     borderColor: !isValid && !paymentMode ? 'red' : base.borderColor,
//                     '&:hover': {
//                       borderColor: !isValid && !paymentMode ? 'red' : base.borderColor
//                     }
//                   })
//                 }}
//               />
//               {!isValid && !paymentMode && <div className="invalid-feedback d-block">Please select a payment mode.</div>}
//             </Form.Group>

//             <Form.Group controlId="formAmount">
//               <Form.Label>Amount</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={amount}
//                 onChange={e => setAmount(e.target.value)}
//                 placeholder="Amount"
//                 className={!isValid && !amount ? 'is-invalid' : ''}
//               />
//               {!isValid && !amount && <div className="invalid-feedback">Please enter an amount.</div>}
//             </Form.Group>

//             <Form.Group controlId="formPaymentReference">
//               <Form.Label>Payment Reference</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={paymentReference}
//                 onChange={e => setPaymentReference(e.target.value)}
//                 placeholder="Payment Ref / Cheque No / UPI No"
//                 className={!isValid && !paymentReference ? 'is-invalid' : ''}
//               />
//               {!isValid && !paymentReference && <div className="invalid-feedback">Please enter a payment reference.</div>}
//             </Form.Group>

//             <Form.Group controlId="formRemarks">
//               <Form.Label>Remarks</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 value={remarks}
//                 onChange={e => setRemarks(e.target.value)}
//                 placeholder="Remarks"
//                 className={!isValid && !remarks ? 'is-invalid' : ''}
//               />
//               {!isValid && !remarks && <div className="invalid-feedback">Please enter remarks.</div>}
//             </Form.Group>
//  <br />
//             <Button variant="primary" type="submit">
//               Submit
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//       </Row>
//     </Container>
// </main>
//   )
// }

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
          .select('userid, shopname, name','representativename','representativeid')
          .eq('role', 'retailer');
    
        if (error) {
          console.error('Error fetching retailers:', error);
          return;
        }
    
        // console.log('Retailer data:', data); // Debugging output
        setRetailerOptions(data.map(item => ({ label: item.shopname, value: item.userid, name: item.name,repname: item.representativename,
         repid: item.representativeid })));
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchPaymentModes();
    fetchRetailerOptions();
  }, []);

  useEffect(() => {
    if (retailer) {
      const fetchInvoices = async () => {
        const { data, error } = await supabase.from('invoices').select('invid, retailername,tallyrefinvno,invdate,amount,paidamount,createdtime').eq('retailername', retailer.label);
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

  if (!retailer || !selectedInvoices.length || !paymentMode || !amount || (!paymentReference && !otp) || !remarks || (paymentMode.label === 'Cash' && !isOtpValidated)) {
    setIsValid(false);
    return;
  }

  try {
    // Prepare the data to be inserted
    const dataToInsert = {
      retailerid: retailer.value,
      repid: retailer.repid,
      repname: retailer.repname,
      retailername: retailer.name,
      retailershopname: retailer.label,
      invoices: selectedInvoices.join(', '),  // Join invoices into a comma-separated string
      paymode: paymentMode.value,
      amount: parseFloat(amount),
      remarks: remarks,
      paymentstatus: 2,  // Example status, you can change it as needed
      payref: paymentReference || null, // Use payment reference or OTP based on the mode
      chequedate: chequeDate || null,
      createdtime: new Date().toISOString(),
      updatedtime: new Date().toISOString(),
    };

    if (paymentMode.label === 'Adjustment') {
      dataToInsert.adjustid = adjustMode.value; // Add adjust mode ID if Adjustment is selected
    }

    // Insert the data into the payment_reference table
    const { error: insertError } = await supabase
      .from('payment_reference')
      .insert([dataToInsert]);

      console.log('Selected Invoices for Update:', selectedInvoices);

      const { error: updateError } = await supabase
        .from('invoices')
        .update({
          paymentstatus: 'To be cleared',
          paymentmode: paymentMode.value,
          paymentdate: new Date().toISOString(),
          updatedtime: new Date().toISOString()
        })
        .in('tallyrefinvno', selectedInvoices); // Use .in() to update multiple rows

      if (insertError) {
        console.error('Error inserting payment data:', insertError);
        alert('There was an error processing your payment. Please try again.');
        return;
      }
  
      if (updateError) {
        console.error('Error updating invoices:', updateError);
        alert('Payment recorded, but there was an issue updating the invoices. Please check.');
        return;
      }
  
      alert('Payment recorded successfully!');

    
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
