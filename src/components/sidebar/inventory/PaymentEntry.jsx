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
<<<<<<< HEAD
 const [remarkValidate, setRemarkValidate ] = useState(false);
=======
  const [remarkValidate, setRemarkValidate] = useState(false);
>>>>>>> f6ae15f1cf9e3d3086b1dd6689204ad314466580
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
  const [distributedApprovals, setDistributedApprovals] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);

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

    fetchPaymentModes();
    
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

      const fetchPaymentApprovals = async () => {
        try {
          const { data, error } = await supabase
            .from('payment_approval')
            .select('*')
            .eq('active', 'Y')
            .eq('userid',User.value);
    
          if (error) {
            console.error('Error fetching payment approvals:', error);
            setToastMessage('Failed to fetch payment approvals.');
            setShowToast(true);
          } else {
            setPaymentApprovals(data); // Only set payment approvals, not calculating "to be cleared" here
          }
        } catch (err) {
          console.error('Error fetching payment approvals:', err);
        }
      };

      fetchInvoices();
      fetchUserMobile();
      fetchPaymentApprovals();
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
<<<<<<< HEAD
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
=======
  };
>>>>>>> f6ae15f1cf9e3d3086b1dd6689204ad314466580

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsValid(true);
    setRemarkValidate(false);
  
<<<<<<< HEAD
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
=======
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
>>>>>>> f6ae15f1cf9e3d3086b1dd6689204ad314466580
  
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
  
        // Calculate the 'To Be Cleared' amount from distributedApprovals
        const toBeCleared = distributedApprovals[invoice.invid] || 0;
  
        // console.log('Calculated toBeCleared:', toBeCleared);
  
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
  
  // const totalBalance = useMemo(() => {
  //   return invoices.reduce((total, invoice) => total + (invoice.amount - invoice.paidamount), 0);
  // }, [invoices]);

  // useEffect(() => {
  //   let remainingAmount = parseFloat(amount); // Payment amount entered
  //   let newDistributedApprovals = {};
  //   let totalBalance = 0;

<<<<<<< HEAD
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
=======
  //   invoices.forEach((invoice) => {
  //     const balance = invoice.amount - invoice.paidamount; // Balance remaining for the invoice
  //     totalBalance += balance;

  //     if (remainingAmount > 0) {
  //       const toBeCleared = Math.min(remainingAmount, balance); // Allocate as much as possible without exceeding balance
  //       newDistributedApprovals[invoice.invid] = toBeCleared;
  //       remainingAmount -= toBeCleared; // Subtract allocated amount from remaining amount
  //     } else {
  //       newDistributedApprovals[invoice.invid] = 0; // No more payment to allocate
  //     }
  //   });

  //   setDistributedApprovals(newDistributedApprovals);
  //   setTotalBalance(totalBalance); // Set total balance of all invoices
  // }, [invoices, amount]);

  useEffect(() => {
    const calculateToBeCleared = async () => {
      if (!invoices || invoices.length === 0) return;
  
      try {
        let remainingAmount = 0; // This will be the total amount available for distribution
        let newDistributedApprovals = {}; // To store the "To Be Cleared" amounts per invoice
        let totalBalance = 0; // To store total balance across invoices
  
        // First, we calculate the total amount to be distributed from the payment_approval table
        paymentApprovals.forEach((approval) => {
          remainingAmount += approval.amount; // Add up all approval amounts for this user
        });
  
        // Now, calculate "To Be Cleared" for each invoice in order
        invoices.forEach((invoice) => {
          const balance = invoice.amount - invoice.paidamount; // Calculate the balance for each invoice
          totalBalance += balance; // Add to total balance
  
          // Allocate the amount to this invoice, capped by the invoice's balance and remaining amount
          if (remainingAmount > 0) {
            const toBeCleared = Math.min(balance, remainingAmount); // Allocate amount
            newDistributedApprovals[invoice.invid] = toBeCleared;
            remainingAmount -= toBeCleared; // Subtract allocated amount from the total remaining
          } else {
            newDistributedApprovals[invoice.invid] = 0; // If no remaining amount, no "To Be Cleared"
          }
        });
  
        setDistributedApprovals(newDistributedApprovals); // Set the "To Be Cleared" values for each invoice
        setTotalBalance(totalBalance); // Set total balance for all invoices
      } catch (err) {
        console.error('Error calculating To Be Cleared:', err);
      }
    };
  
    if (paymentApprovals && paymentApprovals.length > 0) {
      calculateToBeCleared(); // Trigger the calculation when payment approvals are available
    }
  }, [paymentApprovals, invoices]); // Re-run when payment approvals or invoices change
  

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
                    const toBeCleared = distributedApprovals[invoice.invid] || 0; // Get allocated amount from distributedApprovals
                    const days = Math.floor(
                      (new Date().getTime() - new Date(invoice.createdtime).getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <tr key={invoice.invid}>
                        <td>{invoice.tallyrefinvno}</td>
                        <td>{convertDateFormat(invoice.invdate)}</td>
                        <td style={{ textAlign: 'right' }}>₹ {invoice.amount.toFixed(2)}</td>
                        <td style={{ textAlign: 'right' }}>₹ {toBeCleared.toFixed(2)}</td> {/* Allocated amount */}
                        <td style={{ textAlign: 'right' }}>₹ {(balance).toFixed(2)}</td> {/* Remaining balance */}
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
>>>>>>> f6ae15f1cf9e3d3086b1dd6689204ad314466580
