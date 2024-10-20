import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./SalesReport.css";

export default function SalesReport() {
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
      // Step 1: Filter invoices by date range
      let invoiceQuery = supabase.from('invoices1').select('*').order('createdtime',{ascending:false});
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const formattedStartDate = formatDateForSQL(setStartOfDay(startDate));
        const formattedEndDate = formatDateForSQL(setEndOfDay(endDate));
        invoiceQuery = invoiceQuery
        .gte('createdtime', formattedStartDate)
        .lte('createdtime', formattedEndDate);
      console.log("Date Range Filter Applied:", formattedStartDate, "to", formattedEndDate);
      } else if (startDate) {
        const formattedStartDate = formatDateForSQL(setStartOfDay(startDate));
        invoiceQuery = invoiceQuery.gte('createdtime', formattedStartDate);
        console.log("Start Date Filter Applied:", formattedStartDate);
      } else if (endDate) {
        const formattedEndDate = formatDateForSQL(setEndOfDay(endDate));
        invoiceQuery = invoiceQuery.lte('createdtime', formattedEndDate);
        console.log("End Date Filter Applied:", formattedEndDate);
      }
  
      const { data: filteredInvoices, error: invoiceError } = await invoiceQuery;
  
      if (invoiceError) {
        console.error('Error fetching filtered invoices:', invoiceError.message);
        return;
      }
  
      if (!filteredInvoices || filteredInvoices.length === 0) {
        console.warn('No invoices found for the selected date range.');
        setFilteredData([]);
        return;
      }
  
      // Step 2: Fetch corresponding items from invoice_items using invid
      const invIdArray = filteredInvoices.map(invoice => invoice.invid);
      const { data: invoiceItems, error: itemsError } = await supabase
        .from('invoice_items1')
        .select('*')
        .in('invid', invIdArray)
        .gt('qty',0);
  
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError.message);
        return;
      }
  
      // Step 3: Fetch user details from users table
      const userIdArray = [...new Set(filteredInvoices.flatMap(invoice => [invoice.userid, invoice.createdby]))]; // Get unique user IDs
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('userid, name, representativename, cginno')
        .in('userid', userIdArray);
  
      if (userError) {
        console.error('Error fetching user details:', userError.message);
        return;
      }
  
      // Step 4: Combine data and set to state
      const finalData = invoiceItems.map(item => {
        const invoice = filteredInvoices.find(inv => inv.invid === item.invid);
        const user = users.find(ret => ret.userid === invoice.userid);
        const creator = users.find(user => user.userid === invoice.createdby);
  
        return {
          ...item,
          tallyrefinvno: invoice.tallyrefinvno,
          username: user ? user.name : 'N/A',
          representativename: user ? user.representativename : 'N/A',
          cginno: user ? user.cginno : 'N/A',
          orderedby: creator ? creator.name : 'N/A',
        };
      });
  
      setFilteredData(finalData);
      setFilterApplied(true);
      console.log("Final Filtered Items Data:", finalData);
  
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
            <h4 className="text-center">Sales Report</h4>
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
                      <th>Inv.No / Date</th>
                      <th>Account / GCIN / DSR </th>
                      <th>Product / Segment / Category</th>
                      {/* <th>Size</th> */}
                      <th>Ordered By</th>
                      <th>Sales (Litres)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .sort((a, b) => new Date(b.createdtime) - new Date(a.createdtime)) // Sort in descending order
                    .map((data, index) => (
                      <tr key={index}>
                        <td> {data.tallyrefinvno} <br /> {formatDate(data.createdtime)}</td>
                        <td>
                          {data.username.trim()} <br /> {/* Retailer Name */}
                          {data.cginno} <br/>  
                          <span style={{ color: 'red' }}> {data.representativename.trim()}</span> {/* GCIN/DSR on a new line */}
                        </td>
                        <td>
                          {data.itemname.trim()} <br /> {/* Product Name */}
                          <span style={{ color: 'red' }}> {data.segmentname.trim()} </span> {/* Segment Name on a new line */}<br/>
                          <span style={{ color: 'blue' }}> {data.categoryname.trim()} </span> {/* Category Name on a new line */}
                        </td>
                        {/* <td>{data.itemweight}</td> */}
                        <td style={{ color: data.orderedby.trim() === data.representativename.trim() ? 'green' : 'red' }}>{data.orderedby.trim()}</td>
                        <td>{data.liters}</td>
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
