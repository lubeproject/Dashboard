import React, {useState} from 'react';
import "./addRetailerStock.css";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const retailers = [
  { label: 'Star Lubricants Spares- K R Puram', value: 'Star Lubricants Spares- K R Puram' },
  { label: 'A R AUTOMBILES-SIRA', value: 'A R AUTOMBILES-SIRA' },
  { label: 'ARB Automobile- Tmk', value: 'ARB Automobile- Tmk' },
  { label: 'ATN Automobiles- Turuvekere', value: 'ATN Automobiles- Turuvekere' }
];

const dummyRequests = {
  'Star Lubricants Spares- K R Puram': [
    { label: '2/24-06-2024', value: '2/24-06-2024' },
    { label: '3/25-06-2024', value: '3/25-06-2024' }
  ],
  'A R AUTOMBILES-SIRA': [
    { label: '5/26-06-2024', value: '5/26-06-2024' },
    { label: '6/27-06-2024', value: '6/27-06-2024' }
  ],
  'ARB Automobile- Tmk': [
    { label: '8/28-06-2024', value: '8/28-06-2024' },
    { label: '9/29-06-2024', value: '9/29-06-2024' }
  ],
  'ATN Automobiles- Turuvekere': [
    { label: '11/30-06-2024', value: '11/30-06-2024' },
    { label: '12/01-07-2024', value: '12/01-07-2024' }
  ]
};


export default function AddRetailerStock() {

  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!selectedRetailer) newErrors.selectedRetailer = 'Retailer is required';
    if (!selectedRequest) newErrors.selectedRequest = 'Request is required';
    if (!invoiceNo) newErrors.invoiceNo = 'Invoice No is required';
    if (!invoiceAmount) newErrors.invoiceAmount = 'Invoice Amount is required';
    if (!invoiceDate) newErrors.invoiceDate = 'Invoice Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Handle form submission
      console.log({ selectedRetailer, selectedRequest, invoiceNo, invoiceAmount, invoiceDate });
      setErrors({});
    }
  };

  return (
    <main id='main' className='main'>
     <Container>
      <Row className="justify-content-md-center mt-4">
        <Col md={6}>
          <h2>Billing To Retailer</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formRetailer" className="mb-3">
              <Form.Label>Select Retailers</Form.Label>
              <Select
                value={selectedRetailer}
                onChange={setSelectedRetailer}
                options={retailers}
                placeholder="Select Retailers"
                isInvalid={!!errors.selectedRetailer}
              />
              <Form.Control.Feedback type="invalid">
                {errors.selectedRetailer}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formRequest" className="mb-3">
              <Form.Label>Select Request</Form.Label>
              <Select
                value={selectedRequest}
                onChange={setSelectedRequest}
                options={selectedRetailer ? dummyRequests[selectedRetailer.value] : []}
                placeholder="Select Request"
                isInvalid={!!errors.selectedRequest}
              />
              <Form.Control.Feedback type="invalid">
                {errors.selectedRequest}
              </Form.Control.Feedback>
            </Form.Group>

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

            <Form.Group controlId="formInvoiceDate" className="mb-3">
              <Form.Label>Invoice Date (DD/MM/YYYY)</Form.Label>
              <Form.Control
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                isInvalid={!!errors.invoiceDate}
                placeholder="Invoice Date (DD/MM/YYYY)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.invoiceDate}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" block>
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
</main>
 
  )
}
