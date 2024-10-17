import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./RepresentativeVisitingHistory.css";

export default function RepresentativeVisitingHistory() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [userError, setUserError] = useState(false);

  useEffect(() => {
    // Fetch representatives from the users table
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Representatives:', error);
      else setDsrOptions(data.map(representative => ({ value: representative.userid, label: representative.shopname, name: representative.name })));
    };

    fetchDsr();
  }, []);

  const setStartOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);  // Set hours, minutes, seconds, and milliseconds to 0
    return newDate;
  };
  
  // Set end date to 23:59:59 (end of the day) if needed
  const setEndOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);  // Set hours, minutes, seconds, and milliseconds to the end of the day
    return newDate;
  };

  const formatDateForSQL = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted date in 'YYYY-MM-DD HH:MM:SS' format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleFilter = async () => {
    if (!selectedDsr) {
      setUserError(true);
      return;  // Stop form submission
    }
    setUserError(false);
    try {
      // Step 1: Filter from represent_visiting1 by date range and representative
      let visitingQuery = supabase
        .from('represent_visiting1')
        .select('*')
        .eq('repid', selectedDsr.value)
        .order('punchingid',{ascending:true});

        if (startDate && endDate) {
          if (new Date(startDate) > new Date(endDate)) {
            alert("Pick From Date cannot be later than Pick To Date.");
            return;
          }
          const startOfDay = formatDateForSQL(setStartOfDay(startDate));
          const endOfDay = formatDateForSQL(setEndOfDay(endDate));
        visitingQuery = visitingQuery
          .gte('created', startOfDay)  // Ensure only date is used
          .lte('created', endOfDay);
      } else if (startDate) {
        const startOfDay = formatDateForSQL(setStartOfDay(startDate));
        visitingQuery = visitingQuery.gte('created', startOfDay);
      } else if (endDate) {
        const endOfDay = formatDateForSQL(setEndOfDay(endDate));
        visitingQuery = visitingQuery.lte('created', endOfDay);
      }

      const { data: filteredVisitingData, error: visitingError } = await visitingQuery;

      if (visitingError) {
        console.error('Error fetching filtered visiting history:', visitingError.message);
        return;
      }

      if (!filteredVisitingData || filteredVisitingData.length === 0) {
        console.warn('No visiting history found for the selected date range.');
        setFilteredData([]);
        return;
      }

      setFilteredData(filteredVisitingData);
      console.log("Filtered visiting data:", filteredVisitingData);
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };

  const handleReset = () => {
    setSelectedDsr(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format time as HH:MM (ignoring the date portion)
  // const formatTime = (timeString) => {
  //   if (!timeString || timeString.trim() === ''){
  //     return "In Session";
  //   }
  //   const time = new Date(timeString);
  //   const hours = time.getHours().toString().padStart(2, '0');
  //   const minutes = time.getMinutes().toString().padStart(2, '0');
  //   const seconds = time.getSeconds().toString().padStart(2, '0');
  //   return `${hours}:${minutes}:${seconds}`;
  // };

  function formatTime(timeString) {
    if (!timeString || timeString.trim() === '') {
      console.log('Time string is empty or invalid');
      return '00:00:00'; // Default or placeholder value
    }
    
    const parts = timeString.split(':');
    if (parts.length !== 3) {
      console.log('Invalid time format');
      return '00:00:00'; // Default or placeholder value
    }
  
    const [hours, minutes, seconds] = parts.map(part => {
      // Ensure each part is a valid number
      const num = parseInt(part, 10);
      return isNaN(num) ? '00' : num.toString().padStart(2, '0');
    });
  
    return `${hours}:${minutes}:${seconds}`;
  }
  

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
          <Form.Group controlId="formRepresentative">
            <Select
              value={selectedDsr}
              onChange={setSelectedDsr}
              options={dsrOptions}
              placeholder="Select Representative"
              styles={customSelectStyles}
            />
            {userError && (
                <div className="text-danger" style={{ marginTop: '5px' }}>
                  Please select a Representative.
                </div>
              )}
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
                    <th>Punch In (Check-in)</th>
                    <th>Punch Out (Check-out)</th>
                    <th>Orders</th>
                    <th>Amount</th>
                    <th>Visited Day</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{formatDate(data.visitingdate)}</td>
                      <td>{data.shopname}<br/>
                      {data.visitor}
                      </td>
                      <td>{formatTime(data.checkintime)}</td>
                      <td>{formatTime(data.checkouttime)=='00:00:00'? 'In Session':formatTime(data.checkouttime)}</td>
                      <td>{data.orders}</td>
                      <td>{data.amount}</td>
                      <td>{data.visitingday}</td>
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
