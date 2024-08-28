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
      let invoiceQuery = supabase.from('invoices').select('*');
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        invoiceQuery = invoiceQuery
          .gte('updatedtime', new Date(startDate).toISOString())
          .lte('updatedtime', new Date(endDate).toISOString());
        console.log("Date Range Filter Applied:", startDate, "to", endDate);
      } else if (startDate) {
        invoiceQuery = invoiceQuery.gte('updatedtime', new Date(startDate).toISOString());
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        invoiceQuery = invoiceQuery.lte('updatedtime', new Date(endDate).toISOString());
        console.log("End Date Filter Applied:", endDate);
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
        .from('invoice_items')
        .select('*')
        .in('invid', invIdArray);
  
      if (itemsError) {
        console.error('Error fetching invoice items:', itemsError.message);
        return;
      }
  
      // Step 3: Fetch retailer details from users table
      const retailerIdArray = [...new Set(filteredInvoices.map(invoice => invoice.retailerid))]; // Get unique retailer IDs
      const { data: retailers, error: retailerError } = await supabase
        .from('users')
        .select('userid, name, representativename, cginno')
        .in('userid', retailerIdArray)
        .eq('role', 'retailer');
  
      if (retailerError) {
        console.error('Error fetching retailer details:', retailerError.message);
        return;
      }
  
      // Step 4: Combine data and set to state
      const finalData = invoiceItems.map(item => {
        const invoice = filteredInvoices.find(inv => inv.invid === item.invid);
        const retailer = retailers.find(ret => ret.userid === invoice.retailerid);
  
        return {
          ...item,
          tallyrefinvno: invoice.tallyrefinvno,
          retailername: retailer ? retailer.name : 'N/A',
          representativename: retailer ? retailer.representativename : 'N/A',
          cginno: retailer ? retailer.cginno : 'N/A',
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
                      <th>Inv. No/ Date</th>
                      <th>Retailer </th>
                      <th>GCIN/ DSR</th>
                      <th>Product/ Segment/ Category</th>
                      <th>Size</th>
                      <th>Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.tallyrefinvno}/ {formatDate(data.updatedtime)}</td>
                      <td>{data.retailername.trim()}</td>
                      <td>
                        {data.cginno} / 
                        <span style={{ color: 'red' }}> {data.representativename.trim()}</span></td>
                      <td>
                        {data.itemname.trim()} 
                        <span style={{ color: 'red' }}> {data.segmentname.trim()} </span>
                        <span style={{ color: 'blue' }}> {data.categoryname.trim()}</span>
                      </td>
                      <td>{data.itemweight}</td>
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
