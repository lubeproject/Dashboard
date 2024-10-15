import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Card, Table } from 'react-bootstrap';
import { useParams, useNavigate ,useLocation} from 'react-router-dom';

export default function InvoiceDetails() {
  const location = useLocation();
  const { invoiceId, selectedUser, startDate, endDate } = location.state || {};
  const [invoice, setInvoice] = useState(null);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [userAddress, setUserAddress] = useState(''); // State for user's address
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      // Fetch invoice details
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices1')
        .select('*')
        .eq('invid', invoiceId)
        .single();

      if (invoiceError) {
        console.error('Error fetching invoice details:', invoiceError);
      } else {
        setInvoice(invoiceData);

        // Fetch user address using userid from invoice
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('address')
          .eq('userid', invoiceData.userid)
          .single();

        if (userError) {
          console.error('Error fetching user address:', userError);
        } else {
          setUserAddress(userData.address);
        }
      }

      // Fetch invoice items
    //   const { data: itemsData, error: itemsError } = await supabase
    //     .from('invoice_items')
    //     .select('*')
    //     .eq('invid', invoiceId);

    //   if (itemsError) {
    //     console.error('Error fetching invoice items:', itemsError);
    //   } else {
    //     setInvoiceItems(itemsData);
    //   }
    // };

    const { data: itemsData, error: itemsError } = await supabase
        .from('invoice_items1')
        .select('*')
        .eq('invid', invoiceId);

      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError);
      } else {
        setInvoiceItems(itemsData);
      }
    };




    fetchInvoiceDetails();
  }, [invoiceId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Change format as needed
  };

  const handleBack = () => {
    navigate('/portal/invoicehistory', {
      state: {
        selectedUser,
        startDate,
        endDate,
      },
    });
  };

  // Calculate total litres and total amount
  const totalLitres = invoiceItems.reduce((acc, item) => acc + item.liters, 0);
  const totalAmount = invoice?.amount || 0; // Amount is taken from invoice

  return (
    <main id='main' className='main'>
      <Container className="mt-3">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Invoice Details</h4>
          </Col>
        </Row>
        {invoice ? (
          <>
            <Row className="mb-3">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Invoice No: {invoice.tallyrefinvno} / {formatDate(invoice.paymentdate)}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Request Id: {invoice.reqid} / {formatDate(invoice.invdate)}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>User:</strong> {invoice.usershopname} <br />
                      {invoice.username} <br />
                      <strong>Address:</strong> {userAddress} <br /> {/* Display the user's address here */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Slno.</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Box(es)</th>
                      <th>Litres</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">No items found</td>
                      </tr>
                    ) : (
                      invoiceItems.map((item, index) => (
                        <tr key={item.invitemid}>
                          <td>{index + 1}</td>
                          <td>{item.itemname}</td>
                          <td>{item.qty}</td>
                          <td>{item.noofboxes.toFixed(2)}</td>
                          <td>{item.liters}</td>
                        </tr>
                      ))
                    )}
                    {/* Add a row for totals */}
                    <tr>
                      <td colSpan="2" className="text-start"><strong>Total Litres: {totalLitres.toFixed(2)}</strong></td>
                      <td colSpan="3" className="text-end"><strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <Button variant="secondary" onClick={handleBack}>
                  Back to Invoice History
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col className="text-center">
              <p>Loading invoice details...</p>
            </Col>
          </Row>
        )}
      </Container>
    </main>
  );
}
