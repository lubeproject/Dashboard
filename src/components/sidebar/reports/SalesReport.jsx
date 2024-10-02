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

  const handleFilter = async () => {
    try {
      // Step 1: Filter invoices by date range
      let invoiceQuery = supabase.from('invoices1').select('*').order('createdtime',{ascending:false});
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        invoiceQuery = invoiceQuery
          .gte('createdtime', new Date(startDate).toISOString())
          .lt('createdtime', adjustedEndDate.toISOString());
        console.log("Date Range Filter Applied:", startDate, "to", adjustedEndDate);
      } else if (startDate) {
        invoiceQuery = invoiceQuery.gte('createdtime', new Date(startDate).toISOString());
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        invoiceQuery = invoiceQuery.lt('createdtime', adjustedEndDate.toISOString());
        console.log("End Date Filter Applied:", adjustedEndDate);
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
        .in('invid', invIdArray);
  
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError.message);
        return;
      }
  
      // Step 3: Fetch user details from users table
      const userIdArray = [...new Set(filteredInvoices.map(invoice => invoice.userid))]; // Get unique user IDs
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('userid, name, representativename, cginno')
        .in('userid', userIdArray)
        .in('role', ['retailer','mechanic']);
  
      if (userError) {
        console.error('Error fetching user details:', userError.message);
        return;
      }
  
      // Step 4: Combine data and set to state
      const finalData = invoiceItems.map(item => {
        const invoice = filteredInvoices.find(inv => inv.invid === item.invid);
        const user = users.find(ret => ret.userid === invoice.userid);
  
        return {
          ...item,
          tallyrefinvno: invoice.tallyrefinvno,
          username: user ? user.name : 'N/A',
          representativename: user ? user.representativename : 'N/A',
          cginno: user ? user.cginno : 'N/A',
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
                      <th>Sales (Litres)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                    .sort((a, b) => new Date(b.updatedtime) - new Date(a.updatedtime)) // Sort in descending order
                    .map((data, index) => (
                      <tr key={index}>
                        <td>Inv.no.{data.tallyrefinvno} <br /> {formatDate(data.updatedtime)}</td>
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
