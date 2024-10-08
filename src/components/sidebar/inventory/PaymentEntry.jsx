import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, Container, Row, Col, Modal } from 'react-bootstrap';
import Select from 'react-select';
import Cookies from 'js-cookie';
import { supabase } from '../../../supabaseClient';
import { UserContext } from '../../context/UserContext';

export default function PaymentEntry() {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(today.getDate()).padStart(2, '0');        // Add leading zero
    return `${year}-${month}-${day}`;
  };
  const [User, setUser] = useState(null);
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
  const [userOptions, setUserOptions] = useState([]);
  const [otp, setOtp] = useState('');
 const [remarkValidate, setRemarkValidate ] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [chequeDate, setChequeDate] = useState(getTodayDate());
  const [userMobile, setUserMobile] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [paymentApprovals, setPaymentApprovals] = useState([]);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const fetchUserOptions = async () => {
      try {
        let userQuery = supabase
          .from('users')
          .select('*')
          .in('role', ['retailer', 'mechanic'])
          .order('userid', { ascending: true });

        // if(user?.role === 'representative'){
        //   userQuery = userQuery
        //   .eq('representativeid',user?.userid)
        //   .eq('representativename',user?.name);
        // }

        const { data, error } = await userQuery;
    
        if (error) {
          console.error('Error fetching Users:', error);
          return;
        }
    
        setUserOptions(data.map(item => ({
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

    const fetchVisiting = async () => {
      console.log("Punching ID:", Cookies.get('punchingid'));

      const { data, error } = await supabase
        .from('represent_visiting1')
        .select('*')
        .eq('punchingid', Cookies.get('punchingid'));

      // console.log(data);

      if (error) console.error('Error fetching visiting user:', error);
      else if (data && data.length > 0) {
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
        setIsLoading(true); // Keep loading state if punchingid is not present
        return;
      }
      setIsLoading(false);
      fetchVisiting();
    } else {
    fetchUserOptions();
    }
  }, [user]);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      const { data, error } = await supabase.from('payment_mode').select('paymodeid, paymentname');
      if (!error) {
        setPaymentModes(data.map(item => ({ label: item.paymentname, value: item.paymodeid })));
      } else {
        console.error('Error fetching payment modes:', error);
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
        // console.log('Fetched payment approvals:', data); // Log data for debugging
        setPaymentApprovals(data);
      }
    };

    fetchPaymentModes();
    fetchPaymentApprovals(); 
  }, []);

  useEffect(() => {
    if (User) {
      const fetchInvoices = async () => {
        const { data, error } = await supabase.from('invoices1').select('invid, username, tallyrefinvno, invdate, amount, paidamount, createdtime').eq('username', User.name)
        .eq('paymentstatus','Pending');
        if (!error) {
          setInvoices(data);
        } else {
          console.error('Error fetching invoices:', error);
        }
      };

      const fetchUserMobile = async () => {
        const { data, error } = await supabase.from('users').select('mobile').eq('shopname', User.label).single();
        if (!error) {
          setUserMobile(data.mobile);
        } else {
          console.error('Error fetching user mobile:', error);
        }
      };

      fetchInvoices();
      fetchUserMobile();
    }
  }, [User]);

  

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
    // setSelectedInvoices(prev => {
    //   if (prev.includes(invid)) {
    //     return prev.filter(id => id !== invid);
    //   } else {
    //     return [...prev, invid];
    //   }
    // });
    setSelectedInvoices([invid]);
  };

  const sendOtp = async (mobileNo, otp,amount) => {
    
    try {
      const apiKey = '6b8e745587e644c9b9d0ee71186c6a4b14aa847dfb334d8fb8af718ca6080ee2';
      const tmpid = '1607100000000253031';
      const sid = 'CENENS';
      const to = `91${mobileNo}`;
      const msg = `Dear Customer, OTP to authenticate your cash payment of ${amount} is ${otp}. Please share to complete your transaction. Thank You for doing business with us.S V Agency by CENTROID ENGINEERING SOLUTIONS`;
      // const url = `https://us-central1-fuelstation-79ae1.cloudfunctions.net/api/send-sms`;
      // const requestData = {
      //   apikey: apiKey,
      //   tempid: tmpid,
      //   senderid: sid,
      //   msg: msg,
      //   phone: to
      // };
      
  // const response = await axios.post(url, {apiKey,tmpid,sid,to, msg});
  
  // console.log('SMS sent successfully:', response.data);
  
  // if (response.data.status === 'success') {
  //   return { status: 'success' };
  // } else {
  //   throw new Error('Failed to send SMS');
  // }
  // } catch (error) {
  // console.error('Error sending SMS:', error);
  // throw error;
  // }
  // };
  const url = `https://api.msg4.cloud.robeeta.com/sms.aspx?apikey=${apiKey}&tmpid=${tmpid}&sid=${sid}&to=${to}&msg=${encodeURIComponent(msg)}`;
  // console.log(url);  
  const response = await fetch(url);

    if (response.ok) {
      const textResponse = await response.text();
      
      // Parse the XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(textResponse, "text/xml");

      const status = xmlDoc.getElementsByTagName("STATUS")[0].textContent;
      const message = xmlDoc.getElementsByTagName("MESSAGE")[0].textContent;

      if (status === 'OK' && message === 'SMS SENT') {
        setIsOTPSent(true);
        setError(null);
        alert('OTP sent successfully!');
      } else {
        throw new Error('Failed to send OTP');
      }
    } else {
      throw new Error('Failed to send OTP');
    }
  } catch (err) {
    setError('Failed to send OTP');
    console.error('Error sending OTP:', err);
  }
};

const handleGenerateOtp = () => {
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  setGeneratedOtp(newOtp);
  sendOtp(userMobile,newOtp,'Rs.'+amount);
  console.log(`new otp is ${newOtp}`);
  alert(`OTP sent to ${userMobile}`);
};

const handleValidateOtp = () => {
  if (otp === generatedOtp) {
    setIsOtpValidated(true);
    alert('OTP validated successfully!');
    return true;
  } else {
    setIsOtpValidated(false);
    alert('Invalid OTP. Please try again.');
    return false;
  }
};




  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   console.log('Submitting payment entry...');
    
  //   if (!retailer || !selectedInvoices.length || !paymentMode || !amount || (!paymentReference && !otp && !adjustMode) || !remarks || (paymentMode.label === 'Cash' && !isOtpValidated)) {
  //     setIsValid(false);
  //     console.log('Validation failed.');
  //     return;
  //   }
  
  //   try {
  //     console.log('Fetching invoice data...');
  //     const { data: invoiceData, error: invoiceError } = await supabase
  //       .from('invoices')
  //       .select('*')
  //       .in('invid', selectedInvoices);
  
  //     if (invoiceError) {
  //       console.error('Error fetching invoice data:', invoiceError);
  //       throw new Error(`Error fetching invoice data: ${invoiceError.message}`);
  //     }
  
  //     console.log('Preparing data for insertion...');
  //     const dataToInsert = {
  //       retailerid: retailer.value,
  //       repid: retailer.repid,
  //       repname: retailer.repname,
  //       retailername: retailer.name,
  //       retailershopname: retailer.label,
  //       invoices: selectedInvoices.join(', '),
  //       paymode: paymentMode.label,
  //       amount: parseFloat(amount),
  //       remarks: remarks,
  //       paymentstatus: 'Pending',
  //       payref: paymentReference || null,
  //       chequedate: chequeDate || null,
  //       createdtime: new Date().toISOString(),
  //       updatedtime: new Date().toISOString(),
  //     };
  
  //     if (paymentMode.label === 'Adjustment') {
  //       dataToInsert.adjustid = adjustMode.value;
  //     }
  
  //     console.log('Inserting payment data...');
  //     const { data: pay, error: insertError } = await supabase
  //       .from('payment_reference')
  //       .insert([dataToInsert])
  //       .select('payid')
  //       .single();
  
  //     if (insertError) {
  //       console.error('Error inserting payment data:', insertError);
  //       throw new Error(`Error inserting payment data: ${insertError.message}`);
  //     }
  
  //     console.log('Inserted payment data:', pay);
  
  //     // Ensure pay contains the payid
  //     if (!pay || !pay.payid) {
  //       throw new Error('Failed to retrieve payid from inserted data.');
  //     }
  
  //     // Process invoices and update them
  //     for (const invoice of invoiceData) {
  //       const updatedPaidAmount = invoice.paidamount + parseFloat(amount);
  //       const isPaidInFull = updatedPaidAmount >= invoice.amount;
  
  //       const { data: updatedInvoice, error: updateInvoiceError } = await supabase
  //         .from('invoices')
  //         .update({
  //           paymentdate: new Date(),
  //           paymentmode: paymentMode.label,
  //           // paidamount: updatedPaidAmount,
  //           paymentstatus: isPaidInFull ? 'Approved' : 'Pending',
  //           updatedtime: new Date(),
  //         })
  //         .eq('invid', invoice.invid)
  //         .select(); // Select to return updated data for verification
  
  //       if (updateInvoiceError) {
  //         console.error(`Error updating invoice with invid ${invoice.invid}:`, updateInvoiceError);
  //         throw new Error(`Error updating invoice with invid ${invoice.invid}: ${updateInvoiceError.message}`);
  //       }
  
  //       if (isPaidInFull) {
  //         const { error: updatePaymentReferenceError } = await supabase
  //           .from('payment_reference')
  //           .update({
  //             paymentstatus: "Approved",
  //             paymentdate : new Date().toISOString().split('T')[0],
  //             updatedtime: new Date().toISOString(),
  //           })
  //           .eq('payid', pay.payid);
  
  //         if (updatePaymentReferenceError) {
  //           console.error(
  //             `Error updating payment reference for payid ${pay.payid}:`,
  //             updatePaymentReferenceError
  //           );
  //           throw new Error(
  //             `Error updating payment reference for payid ${pay.payid}: ${updatePaymentReferenceError.message}`
  //           );
  //         }
  //       }
  //       console.log(`Updated invoice data:`, updatedInvoice);
  //     }
  
  //     // Insert payment approval for all payment modes
  //     console.log('Inserting payment approval data...');
  //     const invoiceId = invoiceData.length > 0 ? invoiceData[0].invid : null;
  //     const { error: insertPaymentApproveError } = await supabase
  //       .from('payment_approval')
  //       .insert({
  //         payid: pay.payid,
  //         repid: dataToInsert.repid,
  //         invid: invoiceId,
  //         retailerid: retailer.value,
  //         retailername: retailer.name,
  //         retailershopname: retailer.label,
  //         paymode: paymentMode.label,
  //         paymentstatus: 'To be cleared',
  //         payref: paymentReference || null,
  //         amount: parseFloat(amount),
  //         active: 'Y',
  //         chequedate: chequeDate || new Date().toISOString().split('T')[0],
  //         createdtime: new Date().toISOString(),
  //         updatedtime: new Date().toISOString(),
  //       });
  
  //     if (insertPaymentApproveError) {
  //       console.error('Error inserting payment approve data:', insertPaymentApproveError);
  //       throw new Error(`Error inserting payment approve data: ${insertPaymentApproveError.message}`);
  //     }
  
  //     alert('Payment recorded successfully!');
  //     window.location.reload();
  //   } catch (err) {
  //     console.error('Unexpected error:', err);
  //     alert('There was an unexpected error. Please try again.');
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Submitting payment entry...');

    if (!handleValidateOtp()) {
   
      return
    }

    if (remarks === ""){
      setRemarkValidate(true)
    }

     // Validate input
     if (!User || !selectedInvoices.length || !amount || 
      (!paymentReference && !otp) || !remarks ||  (paymentMode.label === 'Adjustment' && !adjustMode)) {
    setIsValid(false);
    console.log('Validation failed.');
    return;
  }




  // if (!isOtpValidated && paymentMode?.label === 'Cash') {
  //   setIsOtpValidated(false);
  //   alert("Please validate the OTP before submitting.");
  // }

  if (!paymentMode || !paymentMode.label) {
    alert("Please select a payment mode");
    return;
}
  
    try {
      // Fetch invoice data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices1')
        .select('*')
        .in('invid', selectedInvoices);
  
      if (invoiceError) throw new Error(`Error fetching invoice data: ${invoiceError.message}`);
  
      // Prepare payment data for insertion
      const paymentData = {
        userid: User.value,
        repid: User.repid,
        repname: User.repname,
        username: User.name,
        usershopname: User.label,
        invoices: selectedInvoices.join(', '),
        paymode: paymentMode.label,
        amount: parseFloat(amount),
        remarks: remarks,
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
  
      // Insert payment data
      const { data: pay, error: insertError } = await supabase
        .from('payment_reference')
        .insert([paymentData])
        .select('payid')
        .single();
  
      if (insertError) throw new Error(`Error inserting payment data: ${insertError.message}`);
      
      if (!pay || !pay.payid) throw new Error('Failed to retrieve payid from inserted data.');
  
      // Update invoices
      // for (const invoice of invoiceData) {
      //   const updatedPaidAmount = invoice.paidamount + parseFloat(amount);
      //   const isPaidInFull = updatedPaidAmount >= invoice.amount;

      //   let updatedPaymentMode = invoice.paymentmode 
      //   ? `${invoice.paymentmode}, ${paymentMode.label}` 
      //   : paymentMode.label;

      // // Remove duplicate payment modes (in case the same mode is inserted multiple times)
      // updatedPaymentMode = [...new Set(updatedPaymentMode.split(', '))].join(', ');

  
      //   const { error: updateInvoiceError } = await supabase
      //     .from('invoices')
      //     .update({
      //       paymentdate: isPaidInFull ? new Date() : null,
      //       paymentmode: updatedPaymentMode,
      //       paymentstatus: isPaidInFull ? 'Approved' : 'Pending',
      //       updatedtime: new Date(),
      //     })
      //     .eq('invid', invoice.invid);
  
        // if (updateInvoiceError) throw new Error(`Error updating invoice with invid ${invoice.invid}: ${updateInvoiceError.message}`);
        
        // Update payment reference if invoice is paid in full
        // if (isPaidInFull) {
        //   const { error: updatePaymentReferenceError } = await supabase
        //     .from('payment_reference')
        //     .update({
        //       paymentstatus: 'Approved',
        //       // paymentdate: new Date().toISOString().split('T')[0],
        //       updatedtime: new Date().toISOString(),
        //     })
        //     .eq('payid', pay.payid);
  
        //   if (updatePaymentReferenceError) throw new Error(`Error updating payment reference for payid ${pay.payid}: ${updatePaymentReferenceError.message}`);
        // }
      // }
  
      // Insert payment approval for all payment modes
      const invoiceId = invoiceData.length > 0 ? invoiceData[0].invid : null;
      const punchingId = Cookies.get('punchingid');
      const { error: insertPaymentApproveError } = await supabase
        .from('payment_approval')
        .insert({
          payid: pay.payid,
          punchingid: punchingId,
          repid: User.repid,
          invid: invoiceId,
          userid: User.value,
          username: User.name,
          usershopname: User.label,
          paymode: paymentMode.label,
          paymentstatus: 'To be cleared',
          payref: paymentReference || paymentData.adjustmode || null,
          remarks: remarks,
          amount: parseFloat(amount),
          active: 'Y',
          chequedate: chequeDate || new Date().toISOString().split('T')[0],
          createdtime: new Date().toISOString(),
          updatedtime: new Date().toISOString(),
          createdby: user?.userid
        });
  
      if (insertPaymentApproveError) throw new Error(`Error inserting payment approve data: ${insertPaymentApproveError.message}`);
  
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
            <Form.Group controlId="formUser">
              <Form.Label>User</Form.Label>
              <Select options={userOptions} value={User} onChange={setUser} placeholder="Select User" />
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
              disabled={!user}
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
                disabled={paymentMode && (paymentMode.label === 'Cash' || paymentMode.label === 'Adjustment')}
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
                  disabled={isOtpValidated} 
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleGenerateOtp} disabled={isOtpValidated} className={`${generatedOtp ? 'btn-secondary' : "btn-primary"}`}> {generatedOtp ? "Resend OTP": "Generate OTP" }</Button>
              
            </Col>
          </Row>
        )}
        <br/>
        {/* Remarks and Submit */}
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remarks"
                className={`${remarkValidate ? 'border border-danger' : ""}`}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />
        <Row className="justify-content-md-center">
          <Col xs lg="12">
            <Button type="submit" variant="primary" disabled={!isValid && !remarks}>
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
      <Modal.Footer >
       <div style={{display:"flex", width:"100%", }}>
        
        
        <Button variant="primary" className='w-20' onClick={() => setShowInvoiceModal(false)}>
          Save Selections
        </Button>

        <Button variant="secondary" className='w-20' onClick={() => setShowInvoiceModal(false)}>
          Close
        </Button>
        </div>
      </Modal.Footer>
    </Modal>
  </main>
);
}