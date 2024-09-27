import "./paymentApproval.css";
import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { supabase } from "../../../supabaseClient"; 
import "./paymentApproval.css";
import { UserContext } from "../../context/UserContext";

export default function PaymentApproval() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useContext(UserContext);

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

  const handleApprove = async (payapproveid) => {
    try {
      // 1. Fetch payment approval entry
      const { data: paymentApproval, error: paymentApprovalError } = await supabase
        .from('payment_approval')
        .select('*')
        .eq('payapproveid', payapproveid)
        .single();
  
      if (paymentApprovalError || !paymentApproval) {
        throw new Error("Payment approval not found or error fetching it.");
      }
  
      const { payid, invid, amount: approvedAmount,punchingid: punchingId } = paymentApproval;
      // console.log('Payment Approval Data:', paymentApproval);
  
      if (!payid || !invid) {
        throw new Error("Invalid payid or invid. Make sure they are correctly defined.");
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
  
      // 3. Fetch the corresponding invoice based on invid
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices1')
        .select('*')
        .eq('invid', invid)
        .single();
  
      if (invoiceError || !invoice) {
        throw new Error("Invoice not found or error fetching it.");
      }
  
      // 4. Calculate updated paid amount and determine payment status
      const updatedPaidAmount = (invoice.paidamount || 0) + approvedAmount;
      const paymentStatus = updatedPaidAmount >= invoice.amount ? 'Approved' : invoice.paymentstatus;
  
      // 5. Fetch all distinct approved payment modes for this invoice from the updated payment_approval table
      const { data: approvedPayments, error: approvedPaymentsError } = await supabase
        .from('payment_approval')
        .select('paymode')
        .eq('invid', invid)
        .eq('paymentstatus', 'Approved');
  
      if (approvedPaymentsError) {
        throw new Error("Error fetching approved payment modes.");
      }
  
      // Collect distinct payment modes and join them as a string
      const distinctPaymentModes = [...new Set(approvedPayments.map(payment => payment.paymode))].join(', ');
      // console.log("Distinct Payment Modes...");
      // console.log(distinctPaymentModes);
  
      // 6. Update the invoice with the new paid amount, payment status, and distinct payment modes
      const { error: updateInvoiceError } = await supabase
        .from('invoices1')
        .update({
          paidamount: updatedPaidAmount,
          paymentstatus: paymentStatus,
          paymentmode: distinctPaymentModes,  // Set distinct payment modes
          paymentdate: updatedPaidAmount>= invoice.amount? new Date().toISOString().split('T')[0]:null,
          updatedtime: new Date().toISOString(),
          updatedby: user?.userid
        })
        .eq('invid', invid);
  
      if (updateInvoiceError) {
        throw new Error("Error updating the invoice.");
      }
  
      // 7. If the invoice is fully paid, insert it into the paid_invoices table
      if (updatedPaidAmount >= invoice.amount) {
        const { error: insertPaidInvoiceError } = await supabase
          .from('paid_invoices')
          .insert([{
            payid: payid,
            invid: invid,
            amount: invoice.amount,
            paidamount: updatedPaidAmount,
            createdtime: new Date().toISOString(),
          }]);
  
        if (insertPaidInvoiceError) {
          throw new Error(`Error inserting into paid_invoices: ${insertPaidInvoiceError.message}`);
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
      
      // 9. Fetch the current amount from represent_visiting1 table first
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

    // 10. Fetch updated payment records after approval
      fetchPayments(); 
  
    } catch (error) {
      // Handle any errors that occur during the approval process
      console.error("Error approving payment:", error.message);
      setError(error.message);
    }
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
                    <Button
                      variant="success"
                      onClick={() => handleApprove(item.payapproveid)}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <FaCheck />
                      <span style={{ marginLeft: "10px" }}>Approve</span>
                    </Button>
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
      </Container>
    </main>
  );
}
