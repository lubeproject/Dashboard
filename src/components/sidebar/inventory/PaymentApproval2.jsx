import "./paymentApproval.css";
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { supabase } from "../../../supabaseClient"; 
import "./paymentApproval.css";

export default function PaymentApproval() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        .order('createdtime', { ascending: false });

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

  const handleApprove = async (payapproveid) => {
    try {
      const { data: paymentApproval, error: paymentApprovalError } = await supabase
        .from('payment_approval')
        .select('*')
        .eq('payapproveid', payapproveid)
        .single();
  
      if (paymentApprovalError || !paymentApproval) {
        throw new Error("Payment approval not found or error fetching it.");
      }
  
      console.log('Payment Approval Data:', paymentApproval); // Log the data
  
      const { payid, invid, amount: approvedAmount } = paymentApproval;
  
      if (!payid || !invid) {
        throw new Error("Invalid payid or invid. Make sure they are correctly defined.");
      }
  
      // Fetch the invoice based on invid
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('invid', invid)
        .single();
  
      if (invoiceError || !invoice) {
        throw new Error("Invoice not found or error fetching it.");
      }
  
      const updatedPaidAmount = invoice.paidamount + approvedAmount;
      const paymentStatus = updatedPaidAmount >= invoice.amount ? 'Paid' : invoice.paymentstatus;
      let paymentMode = invoice.paymode;
  
        const { error: updateInvoiceError } = await supabase
        .from('invoices')
        .update({
          paidamount: updatedPaidAmount,
          paymentstatus: paymentStatus,
          paymode: paymentMode,
          updatedtime: new Date().toISOString(),
        })
        .eq('invid', invid);
  
  
      if (updateInvoiceError) {
        throw new Error("Error updating the invoice.");
      }
  
      // Log the data to be inserted into paid_invoices
      // console.log({
      //   payid,
      //   invid,
      //   amount: approvedAmount,
      //   paidamount: updatedPaidAmount,
      //   // createdby: 'system',
      //   createdtime: new Date().toISOString(),
      // });
  
      // Insert into paid_invoices table
      if (updatedPaidAmount >= invoice.amount) {
        const { error: insertPaidInvoiceError } = await supabase
          .from('paid_invoices')
          .insert([{
            payid: payid,
            invid: invid,
            amount: invoice.amount,
            paidamount: updatedPaidAmount,
            // createdby: 'system',
            createdtime: new Date().toISOString()
          }]);
  
        if (insertPaidInvoiceError) {
          console.error("Error inserting into paid_invoices:", insertPaidInvoiceError);
          throw new Error(insertPaidInvoiceError.message);
        }
      }  

      const { error: updatePaymentReferenceError } = await supabase
      .from('payment_reference')
      .update({
        paymentstatus: 1,
        updatedtime: new Date().toISOString(),
      })
      .eq('payid', payid);

    if (updatePaymentReferenceError) {
      throw new Error("Error updating payment status in payment_reference.");
    }
  
      const { error: updatePaymentApprovalError } = await supabase
        .from('payment_approval')
        .update({
          paymentstatus: 'Paid',
          updatedtime: new Date().toISOString(),
          active: 'N'
        })
        .eq('payapproveid', payapproveid);
  
      if (updatePaymentApprovalError) {
        throw new Error("Error updating payment approval status.");
      }
  
      fetchPayments();
    } catch (error) {
      console.error("Error approving payment:", error.message);
      setError(error.message);
    }
  };
  
  
  
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
              <th>Retailer</th>
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
                  <td>{item.retailername}</td>
                  <td>{item.paymode}</td>
                  <td>{item.payref}</td>
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
