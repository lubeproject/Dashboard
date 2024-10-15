import React, { useEffect, useState, useContext} from "react";
import { supabase } from '../../../supabaseClient';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import "./DSRDayReport.css";
import {UserContext} from '../../context/UserContext';
import { queryByAltText } from "@testing-library/react";
 
export default function DSRDayReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cheque: 0,
    upi: 0,
    cash: 0,
    adjustment:0,
    totalAmounts: 0,
});
const { user } = useContext(UserContext);
  const [visitData, setVisitData] = useState({ numberOfVisits: 0, numberOfAccounts: 0, totalLitres: 0 });

  useEffect(() => {
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Representatives:', error);
      else setDsrOptions(data.map(rep => ({ value: rep.userid, label: rep.shopname, name: rep.name, role: rep.role })));
    };

    if (user?.role === 'representative') {
      setDsrOptions([
        {
          value: user.userid,
          label: user.shopname,
          name: user.name,
          role: user.role,
        },
      ]);
    } else {
      fetchDsr();
    }
  }, [user]);

  const fetchVisitData = async () => {
    const visitingDate = new Date(selectedDate).toISOString().split('T')[0];
    try {
        // Fetch total visits for the current representative on the current date
        const { data: visitsData, error: visitsError } = await supabase
            .from('represent_visiting1')
            .select('*') // Get all data to filter unique shop names later
            .eq('createdby', selectedDsr.value) // Filter by current representative ID
            .eq('visitingdate', visitingDate); // Filter by today's date using visitingdate

        if (visitsError) throw visitsError;

        const numberOfVisits = visitsData.length; // Total number of visits

        // Use a Set to collect unique shop names
        const uniqueShopNames = new Set(visitsData.map(visit => visit.shopname));

        const numberOfAccounts = uniqueShopNames.size; // Count of unique shop names

        //   const totalLitres = visitsData.reduce((sum, visit) => {
        //     return sum + (visit.orders || 0); // Ensure to handle cases where orders might be undefined
        // }, 0);
        const today = new Date(selectedDate);
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // Midnight of today
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // Just before midnight of today
        const { data: userRequestsData, error: userRequestsError } = await supabase
            .from('user_request')
            .select('totalliters')
            .eq('createdby', selectedDsr.value)
            .gte('createdtime', startOfDay.toISOString())
            .lte('createdtime', endOfDay.toISOString());

        if (userRequestsError) throw userRequestsError;

        const totalLitres = userRequestsData.reduce((sum, request) => {
          return sum + (request.totalliters || 0);
        }, 0);

        // Update state with fetched data
        setVisitData({ numberOfVisits, numberOfAccounts, totalLitres });


    } catch (error) {
        console.error('Error fetching visit data:', error);
    }
};
    const fetchPaymentData = async () => {
      const today = new Date(selectedDate);
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // Midnight of today
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // Just before midnight of today
  
      try {
          const { data: paymentsData, error } = await supabase
              .from('payment_reference')
              .select('amount, paymode') 
              .eq('createdby', selectedDsr.value)
              .gte('createdtime', startOfDay.toISOString()) // Start of today's date
              .lte('createdtime', endOfDay.toISOString()); // End of today's date
  
          if (error) throw error;
  
  
        // Initialize amounts
        let chequeTotal = 0;
        let upiTotal = 0;
        let cashTotal = 0;
        let adjustTotal = 0;
        let totalAmounts = 0;
  
        // Iterate over payments to calculate totals
        paymentsData.forEach(payment => {
            totalAmounts += payment.amount; // Sum up total amounts for the day
  
            switch (payment.paymode) {
                case 'Cheque':
                    chequeTotal += payment.amount;
                    break;
                case 'UPI/IB':
                    upiTotal += payment.amount;
                    break;
                case 'Cash':
                    cashTotal += payment.amount;
                    break;
                case 'Adjustment':
                    adjustTotal+= payment.amount;
                default:
                    break;
            }
        });
  
        // Update state or handle the totals as needed
        setPaymentData({
            cheque: chequeTotal,
            upi: upiTotal,
            cash: cashTotal,
            adjustment: adjustTotal,
            totalAmounts: totalAmounts,
        });
  
    } catch (error) {
        console.error('Error fetching payment data:', error);
    }
  };

  const handleFilter = async () => {
    if (!selectedDsr || !selectedDate) {
      console.error('Please select both a representative and a date.');
      return;
    }

    try {
      await fetchVisitData();
      await fetchPaymentData();
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
                <li>No. of Visits: {visitData.numberOfVisits}</li>
                <br/>
                <li className="highlight">No. of Orders</li>
                <li>No. of Accounts: {visitData.numberOfAccounts}</li>
                <li>Total Litres: {visitData.totalLitres}</li>
                <br/>
                <li className="highlight">No. of Payments</li>
                {['Cheque', 'UPI/IB', 'Cash', 'Adjustment'].map((method) => {
                        let paymentKey = method.toLowerCase(); // By default, map the method to lowercase key
                        if (method === 'UPI/IB') {
                          paymentKey = 'upi'; // Special case for 'UPI/IB'
                        }
                        return (
                          <div key={method} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{method}:</span>
                            <span>₹ {paymentData[paymentKey] || 0}</span> {/* Show 0 if no value exists */}
                          </div>
                        );
                      })}
                <br/>
                <li className="highlight">Total Amount: ₹ {paymentData.totalAmounts}</li>
              </ul>
            </Col>
          </Row>
        </Container>
     </main>
      );
    }
