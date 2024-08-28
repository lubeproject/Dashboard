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
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

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

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedDsr ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedDsr ? 'red' : provided.borderColor,
      },
    }),
  };
    
      // const handleInputChange = (e) => {
      //   setFormData({ ...formData, [e.target.name]: e.target.value });
      // };
    
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
    
            <Col md={6}>
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
          </Row>
    
          <Row>
            <Col>
              <ul className="report-list">
                <li>No. of Visits: 0</li>
                <br/>
                <li className="highlight">No. of Orders</li>
                <li>No. of Accounts: 0</li>
                <li>Total Litres: 0</li>
                <br/>
                <li className="highlight">No. of Payments</li>
                <li>Cheque: ₹0</li>
                <li>UPI: ₹0</li>
                <li>Cash: ₹0</li>
                <br/>
                <li className="highlight">Total Amount: ₹0</li>
              </ul>
            </Col>
          </Row>
        </Container>
     </main>
       
      );
    }
    // I want to create new component name is "DsrwiseRetailersOutstandingReport" one field

    // first field is select option are "Bharath, GM Khan, Layeeq, Prashanth, Basavaraj" typing filter also i want
    
    // If i choose Bharath after it will be show Tables
    
    // I have given below refference data
    
    // {
    // DSRName: Bharath,
    // Retailer:[
    // {
    // retailer: Star Lubricants  Spares - K R Puram,
    // GCIN No: SVLR - 001
    // invoice.no: 233,
    // Date: 01-08-2024,
    // value: ₹15,000,
    // Balance: ₹15,000,
    
    // }
    // ]
    // }





