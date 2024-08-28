import React, {useState} from 'react';
import "./paymentEntry.css";
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

const retailerOptions = [
   'Star Lubricants Spares- K R Puram' ,
    'A R AUTOMBILES-SIRA' ,
    'ARB Automobile- Tmk' ,
    'ATN Automobiles- Turuvekere' 
  ].map(option => ({ label: option, value: option }));
  
  const invoiceOptions = [
    'Star Lubricants Spares- K R Puram' ,
    'A R AUTOMBILES-SIRA' ,
   'ARB Automobile- Tmk' ,
   'ATN Automobiles- Turuvekere'
  ].map(option => ({ label: option, value: option }));
  
  const paymentModeOptions = [
    'Adjustment' ,
    'Cash' ,
    'Cheque' ,
    'UPI' 
  ].map(option => ({ label: option, value: option }));

export default function PaymentEntry() {

    const [retailer, setRetailer] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null);
    const [amount, setAmount] = useState('');
    const [paymentReference, setPaymentReference] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isValid, setIsValid] = useState(true);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!retailer || !invoice || !paymentMode || !amount || !paymentReference || !remarks) {
        setIsValid(false);
      } else {
        // Handle form submission logic
        console.log({
          retailer: retailer.value,
          invoice: invoice.value,
          paymentMode: paymentMode.value,
          amount,
          paymentReference,
          remarks
        });
        // Reset form or redirect as needed
      }
    };


  return (
    <main id='main' className='main'>
    <Container className="mt-4">
      <Row className="justify-content-md-center mt-4">

    
        <Row>
            <Col>
            <h4 style={{textAlign:"center"}}>Payment Reference</h4>
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
                  control: (base, state) => ({
                    ...base,
                    borderColor: !isValid && !retailer ? 'red' : base.borderColor,
                    '&:hover': {
                      borderColor: !isValid && !retailer ? 'red' : base.borderColor
                    }
                  })
                }}
              />
              {!isValid && !retailer && <div className="invalid-feedback d-block">Please select a retailer.</div>}
            </Form.Group>

            <Form.Group controlId="formInvoice">
              <Form.Label>Select Invoice</Form.Label>
              <Select
                value={invoice}
                onChange={setInvoice}
                options={invoiceOptions}
                placeholder="Select Invoice"
                className={!isValid && !invoice ? 'is-invalid' : ''}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: !isValid && !invoice ? 'red' : base.borderColor,
                    '&:hover': {
                      borderColor: !isValid && !invoice ? 'red' : base.borderColor
                    }
                  })
                }}
              />
              {!isValid && !invoice && <div className="invalid-feedback d-block">Please select an invoice.</div>}
            </Form.Group>

            <Form.Group controlId="formPaymentMode">
              <Form.Label>Select Payment Mode</Form.Label>
              <Select
                value={paymentMode}
                onChange={setPaymentMode}
                options={paymentModeOptions}
                placeholder="Select Payment Mode"
                className={!isValid && !paymentMode ? 'is-invalid' : ''}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: !isValid && !paymentMode ? 'red' : base.borderColor,
                    '&:hover': {
                      borderColor: !isValid && !paymentMode ? 'red' : base.borderColor
                    }
                  })
                }}
              />
              {!isValid && !paymentMode && <div className="invalid-feedback d-block">Please select a payment mode.</div>}
            </Form.Group>

            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount"
                className={!isValid && !amount ? 'is-invalid' : ''}
              />
              {!isValid && !amount && <div className="invalid-feedback">Please enter an amount.</div>}
            </Form.Group>

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

            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Remarks"
                className={!isValid && !remarks ? 'is-invalid' : ''}
              />
              {!isValid && !remarks && <div className="invalid-feedback">Please enter remarks.</div>}
            </Form.Group>
 <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
      </Row>
    </Container>
</main>
  )
}
