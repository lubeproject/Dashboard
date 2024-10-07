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
      // Apply Date Range Filter
      let dateFilteredItems = filteredItems;
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime); // Convert the date string to a Date object
          return itemDate >= new Date(startDate) && itemDate <= adjustedEndDate;
        });
        console.log("Date Range Filter Applied:", startDate, "to", adjustedEndDate);
      } else if (startDate) {
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= new Date(startDate);
        });
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate <= adjustedEndDate;
        });
        console.log("End Date Filter Applied:", adjustedEndDate);
      }
  
      // Set the filtered items data to state
      setFilteredData(dateFilteredItems || []);
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
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{formatDate(data.createdtime)}</td>
                      <td>
                        <span>{data.usershopname.trim()}</span><br/>
                        <span>{data.username.trim()}</span>
                        </td>
                      <td>{data.paymode.trim()}</td>
                      <td>{data.amount}</td>
                      <td>{data.repname.trim()}</td>
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
