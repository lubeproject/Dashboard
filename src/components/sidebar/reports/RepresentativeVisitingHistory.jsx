import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./RepresentativeVisitingHistory";

export default function RepresentativeVisitingHistory() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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

  const handleFilter = async () => {
    try {
      // Step 1: Filter invoices by date range
      let represent_visitingQuery = supabase.from('payment_reference').select('*').eq('repid', selectedDsr.value);
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        represent_visitingQuery = represent_visitingQuery.gte('updatedtime', new Date(startDate).toISOString()).lte('updatedtime', new Date(endDate).toISOString());
        console.log("Date Range Filter Applied:", startDate, "to", endDate);
      } else if (startDate) {
        represent_visitingQuery = represent_visitingQuery.gte('updatedtime', new Date(startDate).toISOString());
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        represent_visitingQuery = represent_visitingQuery.lte('updatedtime', new Date(endDate).toISOString());
        console.log("End Date Filter Applied:", endDate);
      }
  
      const { data: filteredRepresentVisiting, error: represent_visitingError } = await represent_visitingQuery;
  
      if (represent_visitingError) {
        console.error('Error fetching filtered represent visiting:', represent_visitingError.message);
        return;
      }
  
      if (!filteredRepresentVisiting || filteredRepresentVisiting.length === 0) {
        console.warn('No Represent Visiting found for the selected date range.');
        setFilteredData([]);
        return;
      }
  
      setFilteredData(filteredRepresentVisiting);
      setFilterApplied(true);
      console.log("Final Filtered Items Data:", filteredRepresentVisiting);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };

  const handleReset = () => {
    setSelectedDsr(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
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
      <Container className="mt-2">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Representative Visiting History</h4>
          </Col>
        </Row>
        <Row className="mb-2">
          <Form.Group controlId="formRetailer">
            <Select
                value={selectedDsr}
                onChange={setSelectedDsr}
                options={dsrOptions}
                placeholder="Select Representative"
                styles={customSelectStyles}
            />
          </Form.Group>
        </Row>
        <Row className="mb-2 filter-row">
          <Col md={3} xs={6} className="mb-2">
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
          <Col md={3} xs={6} className="mb-2">
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
        <Row className="mt-2">
          <Col>
            {filteredData.length === 0 ? (
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" className="no-record-img" />
              </div>
            ) : (
              <Table striped bordered hover responsive className="sales-report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Account</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Orders</th>
                    <th>Amt</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{formatDate(data.updatedtime)}</td>
                      <td>{data.retailershopname.trim()}</td>
                      <td>{data.payid}</td>
                      <td>{data.payid}</td>
                      <td>{data.payref}</td>
                      <td>{data.amount}</td>
                      <td>{3}</td>
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
