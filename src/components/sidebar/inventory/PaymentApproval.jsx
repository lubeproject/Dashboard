import "./paymentApproval.css";
import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Row, Col, Modal } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { supabase } from "../../../supabaseClient"; 
import "./paymentApproval.css";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PaymentApproval() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayApproveId, setSelectedPayApproveId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);


  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data: payments, error } = await supabase
        .from('payment_approval')
        .select(`*`)
        .eq('active', 'Y') // Assuming you want to display only pending approvals
        .order('payapproveid', { ascending: true });

      if (error) {
        throw error;
      }

      setData(payments);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (payapproveid) => {
  //   try {
  //     const { data: paymentApproval, error: paymentApprovalError } = await supabase
  //       .from('payment_approval')
  //       .select('*')
  //       .eq('payapproveid', payapproveid)
  //       .single();
  
  //     if (paymentApprovalError || !paymentApproval) {
  //       throw new Error("Payment approval not found or error fetching it.");
  //     }
  
  //     console.log('Payment Approval Data:', paymentApproval); // Log the data
  
  //     const { payid, invid, amount: approvedAmount } = paymentApproval;
  
  //     if (!payid || !invid) {
  //       throw new Error("Invalid payid or invid. Make sure they are correctly defined.");
  //     }
  
  //     // Fetch the invoice based on invid
  //     const { data: invoice, error: invoiceError } = await supabase
  //       .from('invoices')
  //       .select('*')
  //       .eq('invid', invid)
  //       .single();
  
  //     if (invoiceError || !invoice) {
  //       throw new Error("Invoice not found or error fetching it.");
  //     }
  
  //     const updatedPaidAmount = invoice.paidamount + approvedAmount;
  //     const paymentStatus = updatedPaidAmount >= invoice.amount ? 'Approved' : invoice.paymentstatus;
  //     let paymentMode = invoice.paymode;
  
  //       const { error: updateInvoiceError } = await supabase
  //       .from('invoices')
  //       .update({
  //         paidamount: updatedPaidAmount,
  //         paymentstatus: paymentStatus,
  //         paymode: paymentMode,
  //         updatedtime: new Date().toISOString(),
  //       })
  //       .eq('invid', invid);
  
  
  //     if (updateInvoiceError) {
  //       throw new Error("Error updating the invoice.");
  //     }

  //     if (updatedPaidAmount >= invoice.amount) {
  //       const { error: insertPaidInvoiceError } = await supabase
  //         .from('paid_invoices')
  //         .insert([{
  //           payid: payid,
  //           invid: invid,
  //           amount: invoice.amount,
  //           paidamount: updatedPaidAmount,
  //           createdtime: new Date().toISOString()
  //         }]);
  
  //       if (insertPaidInvoiceError) {
  //         console.error("Error inserting into paid_invoices:", insertPaidInvoiceError);
  //         throw new Error(insertPaidInvoiceError.message);
  //       }
  //     }  

  //     const { error: updatePaymentReferenceError } = await supabase
  //     .from('payment_reference')
  //     .update({
  //       paymentstatus: 'Approved',
  //       updatedtime: new Date().toISOString(),
  //     })
  //     .eq('payid', payid);

  //   if (updatePaymentReferenceError) {
  //     throw new Error("Error updating payment status in payment_reference.");
  //   }
  
  //     const { error: updatePaymentApprovalError } = await supabase
  //       .from('payment_approval')
  //       .update({
  //         paymentstatus: 'Approved',
  //         updatedtime: new Date().toISOString(),
  //         active: 'N'
  //       })
  //       .eq('payapproveid', payapproveid);
  
  //     if (updatePaymentApprovalError) {
  //       throw new Error("Error updating payment approval status.");
  //     }
  
  //     fetchPayments();
  //   } catch (error) {
  //     console.error("Error approving payment:", error.message);
  //     setError(error.message);
  //   }
  // };

  // const handleApprove = async (payapproveid) => {
  //   try {
  //     // 1. Fetch payment approval entry
  //     const { data: paymentApproval, error: paymentApprovalError } = await supabase
  //       .from('payment_approval')
  //       .select('*')
  //       .eq('payapproveid', payapproveid)
  //       .single();
  
  //     if (paymentApprovalError || !paymentApproval) {
  //       throw new Error("Payment approval not found or error fetching it.");
  //     }
  
  //     const { payid, invid, amount: approvedAmount,punchingid: punchingId } = paymentApproval;
  //     // console.log('Payment Approval Data:', paymentApproval);
  
  //     if (!payid || !invid) {
  //       throw new Error("Invalid payid or invid. Make sure they are correctly defined.");
  //     }
  
  //     // 2. Update the payment_approval entry first to mark it as 'Approved' and set active to 'N'
  //     const { error: updatePaymentApprovalError } = await supabase
  //       .from('payment_approval')
  //       .update({
  //         paymentstatus: 'Approved',
  //         updatedtime: new Date().toISOString(),
  //         active: 'N' // Mark as inactive after approval
  //       })
  //       .eq('payapproveid', payapproveid);
  
  //     if (updatePaymentApprovalError) {
  //       throw new Error("Error updating payment approval status.");
  //     }
  
  //     // 3. Fetch the corresponding invoice based on invid
  //     const { data: invoice, error: invoiceError } = await supabase
  //       .from('invoices1')
  //       .select('*')
  //       .eq('invid', invid)
  //       .single();
  
  //     if (invoiceError || !invoice) {
  //       throw new Error("Invoice not found or error fetching it.");
  //     }
  
  //     // 4. Calculate updated paid amount and determine payment status
  //     const updatedPaidAmount = (invoice.paidamount || 0) + approvedAmount;
  //     const paymentStatus = updatedPaidAmount >= invoice.amount ? 'Approved' : invoice.paymentstatus;
  
  //     // 5. Fetch all distinct approved payment modes for this invoice from the updated payment_approval table
  //     const { data: approvedPayments, error: approvedPaymentsError } = await supabase
  //       .from('payment_approval')
  //       .select('paymode')
  //       .eq('invid', invid)
  //       .eq('paymentstatus', 'Approved');
  
  //     if (approvedPaymentsError) {
  //       throw new Error("Error fetching approved payment modes.");
  //     }
  
  //     // Collect distinct payment modes and join them as a string
  //     const distinctPaymentModes = [...new Set(approvedPayments.map(payment => payment.paymode))].join(', ');
  //     // console.log("Distinct Payment Modes...");
  //     // console.log(distinctPaymentModes);
  
  //     // 6. Update the invoice with the new paid amount, payment status, and distinct payment modes
  //     const { error: updateInvoiceError } = await supabase
  //       .from('invoices1')
  //       .update({
  //         paidamount: updatedPaidAmount,
  //         paymentstatus: paymentStatus,
  //         paymentmode: distinctPaymentModes,  // Set distinct payment modes
  //         paymentdate: updatedPaidAmount>= invoice.amount? new Date().toISOString().split('T')[0]:null,
  //         updatedtime: new Date().toISOString(),
  //         updatedby: user?.userid
  //       })
  //       .eq('invid', invid);
  
  //     if (updateInvoiceError) {
  //       throw new Error("Error updating the invoice.");
  //     }
  
  //     // 7. If the invoice is fully paid, insert it into the paid_invoices table
  //     if (updatedPaidAmount >= invoice.amount) {
  //       const { error: insertPaidInvoiceError } = await supabase
  //         .from('paid_invoices')
  //         .insert([{
  //           payid: payid,
  //           invid: invid,
  //           amount: invoice.amount,
  //           paidamount: updatedPaidAmount,
  //           createdtime: new Date().toISOString(),
  //           createdby: user?.userid,
  //         }]);
  
  //       if (insertPaidInvoiceError) {
  //         throw new Error(`Error inserting into paid_invoices: ${insertPaidInvoiceError.message}`);
  //       }
  //     }
  
  //     // 8. Update the payment_reference status to 'Approved' for the payid
  //     const { error: updatePaymentReferenceError } = await supabase
  //       .from('payment_reference')
  //       .update({
  //         paymentstatus: 'Approved',
  //         updatedtime: new Date().toISOString(),
  //         updatedby: user?.userid
  //       })
  //       .eq('payid', payid);
  
  //     if (updatePaymentReferenceError) {
  //       throw new Error("Error updating payment status in payment_reference.");
  //     }
      
  //     // 9. Fetch the current amount from represent_visiting1 table first
  //     if (punchingId){
  //       const { data: representVisiting, error: fetchRepresentVisitingError } = await supabase
  //       .from('represent_visiting1')
  //       .select('amount')
  //       .eq('punchingid', punchingId)
  //       .single();

  //     if (fetchRepresentVisitingError || !representVisiting) {
  //       throw new Error("Error fetching the current amount from represent_visiting1.");
  //     }

  //     // Calculate the new amount
  //     const updatedAmount = (representVisiting.amount || 0) + approvedAmount;

  //     // Update the represent_visiting1 table with the approved amount
  //     const { error: updateRepresentVisitingError } = await supabase
  //       .from('represent_visiting1')
  //       .update({
  //         amount: updatedAmount,
  //         lastupdatetime: new Date().toISOString(),
  //         updatedby: user?.userid
  //       })
  //       .eq('punchingid', punchingId);

  //     if (updateRepresentVisitingError) {
  //       throw new Error(`Error updating represent_visiting1 table: ${updateRepresentVisitingError.message}`);
  //     }
  //   }
  //   // 10. Fetch updated payment records after approval
  //     fetchPayments(); 
  
  //   } catch (error) {
  //     // Handle any errors that occur during the approval process
  //     console.error("Error approving payment:", error.message);
  //     setError(error.message);
  //   }
  // };
  const handleApprove = async (payapproveid) => {
    try {
      setIsApproving(true);
      // 1. Fetch payment approval entry
      const { data: paymentApproval, error: paymentApprovalError } = await supabase
        .from('payment_approval')
        .select('*')
        .eq('payapproveid', payapproveid)
        .single();
  
      if (paymentApprovalError || !paymentApproval) {
        throw new Error("Payment approval not found or error fetching it.");
      }
  
      const { payid, invoices, amount: approvedAmount, punchingid: punchingId, userid } = paymentApproval;
      if (!payid || !invoices) {
        throw new Error("Invalid payid or invoices. Make sure they are correctly defined.");
      }
  
      // 2. Update the payment_approval entry first to mark it as 'Approved' and set active to 'N'
      const { error: updatePaymentApprovalError } = await supabase
        .from('payment_approval')
        .update({
          paymentstatus: 'Approved',
          updatedtime: new Date().toISOString(),
          active: 'N' // Mark as inactive after approval
        })
        .eq('payapproveid', payapproveid);
  
      if (updatePaymentApprovalError) {
        throw new Error("Error updating payment approval status.");
      }

      setIsApproved(true);
      toast.success('Payment Approved Successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      // 3. Split invoice IDs and process each
      const invoiceIds = invoices.split(',').map(id => id.trim());
      let totalAllocatedAmount = 0; // To track total amount allocated to invoices
  
      for (const invid of invoiceIds) {
        
        // Fetch the corresponding invoice
        const { data: invoice, error: invoiceError } = await supabase
          .from('invoices1')
          .select('*')
          .eq('invid', invid)
          .single();
  
        if (invoiceError || !invoice) {
          throw new Error(`Invoice not found or error fetching it for invoice ID ${invid}.`);
        }
  
        // Calculate how much can be allocated to this invoice without exceeding its total amount
        const remainingBalance = invoice.amount - (invoice.paidamount || 0);
        const allocatableAmount = Math.min(remainingBalance, approvedAmount - totalAllocatedAmount);
  
        // Calculate updated paid amount for each invoice
        const updatedPaidAmount = (invoice.paidamount || 0) + allocatableAmount;
        const paymentStatus = updatedPaidAmount >= invoice.amount ? 'Approved' : invoice.paymentstatus;
  
        // Fetch all distinct approved payment modes for this invoice from the updated payment_approval table
        const { data: approvedPayments, error: approvedPaymentsError } = await supabase
            .from('payment_approval')
            .select('paymode')
            .like('invoices', `%${invid}%`) // Check if invid is part of the invoices string
            .eq('paymentstatus', 'Approved');

          if (approvedPaymentsError) {
            throw new Error("Error fetching approved payment modes.");
          }
  
        // Collect distinct payment modes and join them as a string
        const distinctPaymentModes = [...new Set(approvedPayments.map(payment => payment.paymode))].join(', ');
  
        // Update the invoice with the new paid amount, payment status, and distinct payment modes
        const { error: updateInvoiceError } = await supabase
          .from('invoices1')
          .update({
            paidamount: updatedPaidAmount,
            paymentstatus: paymentStatus,
            paymentmode: distinctPaymentModes,  // Set distinct payment modes
            paymentdate: updatedPaidAmount >= invoice.amount ? new Date().toISOString().split('T')[0] : null,
            updatedtime: new Date().toISOString(),
            updatedby: user?.userid
          })
          .eq('invid', invid);
  
        if (updateInvoiceError) {
          throw new Error(`Error updating the invoice for invoice ID ${invid}.`);
        }
  
        // Accumulate allocated amount
        totalAllocatedAmount += allocatableAmount;
  
        // If the invoice is fully paid, insert it into the paid_invoices table
        if (updatedPaidAmount >= invoice.amount) {
          const { error: insertPaidInvoiceError } = await supabase
            .from('paid_invoices')
            .insert([{
              payid: payid,
              invid: invid,
              amount: invoice.amount,
              paidamount: updatedPaidAmount,
              createdtime: new Date().toISOString(),
              createdby: user?.userid,
            }]);
  
          if (insertPaidInvoiceError) {
            throw new Error(`Error inserting into paid_invoices for invoice ID ${invid}: ${insertPaidInvoiceError.message}`);
          }
        }
      }
  
      // Calculate remaining amount after processing invoices
      const remainingAmount = approvedAmount - totalAllocatedAmount;
  
      if (remainingAmount > 0) {
        // Fetch user's current prepaid balance
        const { data: userRecord, error: fetchUserError } = await supabase
          .from('users')
          .select('prepaid')
          .eq('userid', userid)
          .single();
  
        if (fetchUserError || !userRecord) {
          throw new Error("Error fetching user's current prepaid balance.");
        }
  
        const updatedPrepaid = (userRecord.prepaid || 0) + remainingAmount;
  
        // Update user's prepaid balance
        const { error: updateUserError } = await supabase
          .from('users')
          .update({ prepaid: updatedPrepaid })
          .eq('userid', userid);
  
        if (updateUserError) {
          throw new Error("Error updating user's prepaid balance.");
        }
      }
  
      // 8. Update the payment_reference status to 'Approved' for the payid
      const { error: updatePaymentReferenceError } = await supabase
        .from('payment_reference')
        .update({
          paymentstatus: 'Approved',
          updatedtime: new Date().toISOString(),
          updatedby: user?.userid
        })
        .eq('payid', payid);
  
      if (updatePaymentReferenceError) {
        throw new Error("Error updating payment status in payment_reference.");
      }
  
      // 9. Update the represent_visiting1 table with the approved amount
      if (punchingId) {
        const { data: representVisiting, error: fetchRepresentVisitingError } = await supabase
          .from('represent_visiting1')
          .select('amount')
          .eq('punchingid', punchingId)
          .single();
  
        if (fetchRepresentVisitingError || !representVisiting) {
          throw new Error("Error fetching the current amount from represent_visiting1.");
        }
  
        // Calculate the new amount
        const updatedAmount = (representVisiting.amount || 0) + approvedAmount;
  
        // Update the represent_visiting1 table with the approved amount
        const { error: updateRepresentVisitingError } = await supabase
          .from('represent_visiting1')
          .update({
            amount: updatedAmount,
            lastupdatetime: new Date().toISOString(),
            updatedby: user?.userid
          })
          .eq('punchingid', punchingId);
  
        if (updateRepresentVisitingError) {
          throw new Error(`Error updating represent_visiting1 table: ${updateRepresentVisitingError.message}`);
        }
      }
      
      // 10. Fetch updated payment records after approval
      fetchPayments();
  
    } catch (error) {
      // Handle any errors that occur during the approval process
      console.error("Error approving payment:", error.message);
      setError(error.message);
      toast.error("Error approving payment: " + error.message);
    }finally{
      setIsApproving(false);
      setIsApproved(false)
    }
  };

  const handleShowConfirm = (payapproveid) => {
    setSelectedPayApproveId(payapproveid);
    setShowModal(true);
  };

  // Handle approving after confirmation
  const handleConfirmApprove = () => {
    setShowModal(false);
    if (selectedPayApproveId) {
      handleApprove(selectedPayApproveId);
    }
    setSelectedPayApproveId(null);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayApproveId(null);
  };


  if (error) {
    return <div>An error occurred: {error}</div>;
  }
  
    
  const convertDateFormat = (dateStr) => {
    if (!dateStr) return '';
  
    const date = new Date(dateStr);
  
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
  
    return `${dd}-${mm}-${yyyy}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main id="main" className="main">
      <Container className="mt-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Payment Approval</h4>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ backgroundColor: "darkorange", color: "white" }}>
              <th>Date</th>
              <th>User</th>
              <th>Payment Mode</th>
              <th>Payref</th>
              <th>Amount(in ₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{convertDateFormat(item.chequedate)}</td>
                  <td>
                    <span>{item.usershopname}</span><br/>
                    <span>{item.username}</span>
                  </td>
                  <td>{item.paymode}</td>
                  <td>
                    <span>{item.payref}</span><br/>
                    <span>Remarks: {item.remarks}</span>
                  </td>
                  <td>₹{item.amount.toFixed(2)}</td>
                  <td className="d-flex flex-row">
                  {!isApproved && !isApproving && (
                    <Button
                      variant="success"
                      onClick={() => handleShowConfirm(item.payapproveid)}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaCheck />
                      <span style={{ marginLeft: "10px" }}>Approve</span>
                    </Button>
                  )}
                  {isApproving && <p>Approving...</p>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No Payments Found</td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* Confirmation Modal */}
        <Modal show={showModal} onHide={handleCloseModal} className="d-flex justify-content-between">
          <Modal.Header closeButton>
            <Modal.Title className="text-center">Confirm Approval</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to approve this payment?</Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button variant="primary" className="me-auto" style={{ width: '100px'}} onClick={handleConfirmApprove}>
              Confirm
            </Button>
            <Button variant="danger" style={{ width: '100px'}} onClick={handleCloseModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  );
}
