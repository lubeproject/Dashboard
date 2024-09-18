import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./SalesReportMechanicwise.css";

export default function SalesReportMechanicwise() {
  const [mechanicsOptions, setMechanicsOptions] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchMechanics = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'mechanic');

      if (error) console.error('Error fetching mechanics:', error);
      else setMechanicsOptions(data.map(mechanic => ({ value: mechanic.userid, label: mechanic.shopname, name: mechanic.name })));
    };
    
    fetchMechanics();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };


  const handleFilter = async () => {
    if (!selectedMechanic || !startDate || !endDate) {
      alert('Please select a mechanic and date range.');
      return;
    }

    if (startDate > endDate) {
      alert("Pick From Date cannot be later than Pick To Date.");
      return;
    }

    // Fetch billing data from billing_mechanic table
    const { data, error } = await supabase
      .from('billing_mechanic')
      .select('*')
      .eq('mechid', selectedMechanic.value)
      .gte('createddate', startDate.toISOString())
      .lte('createddate', endDate.toISOString());

    if (error) {
      console.error('Error fetching billing data:', error);
      return;
    }

    setFilteredData(data);
    setFilterApplied(true);
  };

  const handleReset = () => {
    setSelectedMechanic(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedMechanic ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedMechanic ? 'red' : provided.borderColor,
      },
    }),
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Sales Report Mechanicwise</h4>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group controlId="formRetailer">
            <Select
              value={selectedMechanic}
              onChange={setSelectedMechanic}
              options={mechanicsOptions}
              placeholder="Select Mechanic"
              styles={customSelectStyles}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3 filter-row">
          <Col md={3} xs={6} className="mb-3">
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Pick From Date"
            />
          </Col>
          <Col md={3} xs={6}>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
              placeholderText="Pick To Date"
            />
          </Col>
          <Col md={3} xs={6} className="mb-3">
            <Button variant="primary" onClick={handleFilter} block>
              Apply Filter
            </Button>
          </Col>
          <Col md={3} xs={6}>
            <Button variant="secondary" onClick={handleReset} block>
              Reset
            </Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            {filteredData.length === 0 ? (
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" className="no-record-img" />
              </div>
            ) : (
              <Table striped bordered hover responsive className="sales-report-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Shopname</th>
                    <th>Qty</th>
                    <th>Liters</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(data.createddate)}</td>
                      <td>{data.mechname}</td>
                      <td>{data.mechshopname}</td>
                      <td>{data.totalqty}</td>
                      <td>{data.totalliters}</td>
                      <td>{data.totalamount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
