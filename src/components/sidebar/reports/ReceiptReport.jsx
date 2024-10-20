import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./ReceiptReport.css";

export default function ReceiptReport() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

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
    try {
        const { data: filteredItems, error: receiptError } = await supabase
        .from('payment_reference')
        .select('*')
        .order('createdtime',{ascending:false});
  
      if (receiptError) {
        console.error('Error fetching receipt report:', receiptError.message);
        return;
      }
  
      console.log("All Receipts:", filteredItems);
      // Step 2: Extract unique user IDs from the createdby field
    const userIds = [...new Set(filteredItems.map(item => item.createdby))];

    // Step 3: Fetch user details from users table
    const { data: usersData, error: userError } = await supabase
      .from('users')
      .select('userid, name')
      .in('userid', userIds);

    if (userError) {
      console.error('Error fetching user details:', userError.message);
      return;
    }

    // Step 4: Map users by userid for easier lookup
    const userMap = {};
    usersData.forEach(user => {
      userMap[user.userid] = user.name;
    });

      // Step 5: Apply Date Range Filter
      let dateFilteredItems = filteredItems;
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const startOfDay = setStartOfDay(startDate);
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay && itemDate <= endOfDay;
        });
      } else if (startDate) {
        const startOfDay = setStartOfDay(startDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay;
        });
      } else if (endDate) {
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate <= endOfDay;
        });
      }

      // Step 6: Set the filtered items data to state with mapped user names
      const finalData = dateFilteredItems.map(item => ({
        ...item,
        createdbyName: userMap[item.createdby] || 'Unknown' // Map createdby to user name
      }));

      setFilteredData(finalData || []);
      setFilterApplied(true);
      console.log("Final Filtered Items Data:", dateFilteredItems);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-3">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Receipt Report</h4>
          </Col>
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
                      <th>User</th>
                      <th>Pay Type</th>
                      <th>Amount</th>
                      <th>DSR</th>
                      <th>Entry By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                  .sort((a, b) => new Date(b.createdtime) - new Date(a.createdtime))
                  .map((data, index) => (
                    <tr key={index}>
                      <td>{formatDate(data.createdtime)}</td>
                      <td>
                        <span>{data.usershopname.trim()}</span><br/>
                        <span>{data.username.trim()}</span>
                        </td>
                      <td>{data.paymode.trim()}</td>
                      <td>{data.amount}</td>
                      <td>{data.repname.trim()}</td>
                      <td style={{ color: data.createdbyName.trim() === data.repname.trim() ? 'green' : 'red' }}>{data.createdbyName.trim()}</td>
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
