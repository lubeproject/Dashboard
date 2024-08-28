import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./DSRDayReport.css";

export default function DSRDayReport() {

  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visitCount, setVisitCount] = useState(0);
  const [upiAmount, setUpiAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);
  const [chequeAmount, setChequeAmount] = useState(0);
  const [noOfAccounts, setNoOfAccounts] = useState(0);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Retailers:', error);
      else setDsrOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
    };

    fetchDsr();
  }, []);

  const handleFilter = async () => {
    try {
      // Convert your date to ISO format
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // This will give you the date part only in YYYY-MM-DD format

      // console.log(selectedDate);
      // console.log(formattedDate);
      // // Perform the query using the formatted date
      // const { data: visitCountData, error: visitCountError } = await supabase
      //   .from('represent_visiting')
      //   .select('*')
      //   .eq('representativename', selectedDsr.name)
      //   .eq('visitingdate', formattedDate); // Use the formatted date
      //   console.log(visitCountData);
  
      // if (visitCountError) {
      //   console.error('Error fetching visit count:', visitCountError);
      //   return;
      // }
  
      // // Default visitCount to 0 if undefined
      // const visitCount = visitCountData?.count || 0;
  
      // Fetch payment data for UPI, Cash, and Cheque amounts
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_reference2')
        .select('retailerid, amount, paymode')
        .eq('repname', selectedDsr.name)
        .eq('updatedtime', formattedDate);
  
      if (paymentError) {
        console.error('Error fetching payment data:', paymentError);
        return;
      }
  
      // Calculate the sums for UPI, Cash, and Cheque
      let upiAmount = 0;
      let cashAmount = 0;
      let chequeAmount = 0;
  
      paymentData.forEach((payment) => {
        if (payment.paymode === 'UPI') {
          upiAmount += parseFloat(payment.amount);
        } else if (payment.paymode === 'Cash') {
          cashAmount += parseFloat(payment.amount);
        } else if (payment.paymode === 'Cheque') {
          chequeAmount += parseFloat(payment.amount);
        }
      });
  
      // Calculate unique retailer count
      const uniqueRetailerIds = new Set(paymentData.map((item) => item.retailerid));
      const noOfAccounts = uniqueRetailerIds.size;
  
      // Update state for visit count, payment amounts, and unique retailer count
      setVisitCount(visitCount);
      setUpiAmount(upiAmount);
      setCashAmount(cashAmount);
      setChequeAmount(chequeAmount);
      setNoOfAccounts(noOfAccounts);
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };
  
  
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedDsr ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedDsr ? 'red' : provided.borderColor,
      },
    }),
  };

    
      return (

        <main id='main' className='main'>

<Container className="dsr-day-report">
            <Row className="mb-4">
          <Col>
            <h4 className="text-center">DSR Day Report </h4>
          </Col>
        </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="representative">
                {/* <Form.Label>Select Representative</Form.Label> */}
                <Select
                value={selectedDsr}
                onChange={setSelectedDsr}
                options={dsrOptions}
                placeholder="Select Representative"
                styles={customSelectStyles}
            />
              </Form.Group>
            </Col>
    
            <Col md={3}>
              <Form.Group controlId="date">
                {/* <Form.Label>Pick Date</Form.Label>s */}
                <DatePicker
                  selected={selectedDate}
                  onChange={date => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  placeholderText="Pick Date"
                />
              </Form.Group>
            </Col>
            <Col md={3} xs={6} className="mb-2">
            <Button variant="primary" onClick={handleFilter} block>
              Apply Filter
            </Button>
          </Col>
          </Row>
    
          <Row>
            <Col>
              <ul className="report-list">
                <li>No. of Visits: {visitCount}</li>
                <br/>
                <li className="highlight">No. of Orders</li>
                <li>No. of Accounts: {noOfAccounts}</li>
                <li>Total Litres: 0</li>
                <br/>
                <li className="highlight">No. of Payments</li>
                <li>Cheque: ₹ {chequeAmount}</li>
                <li>UPI: ₹ {upiAmount}</li>
                <li>Cash: ₹ {cashAmount}</li>
                <br/>
                <li className="highlight">Total Amount: ₹ {upiAmount+chequeAmount+cashAmount}</li>
              </ul>
            </Col>
          </Row>
        </Container>
     </main>
       
      );
    }





