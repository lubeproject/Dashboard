import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRDaywiseSalesReport.css";

export default function DSRDaywiseSalesReport() {
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
      // Step 1: Query for the visitors assigned to the representative
      let represent_visitingQuery = supabase
        .from('representassigned_master')
        .select('visitorid, visitor, shopname, role')
        .eq('representativeid', selectedDsr.value);
  
      // Fetch the result of represent_visitingQuery
      const { data: representVisitingData, error: representVisitingError } = await represent_visitingQuery;
  
      if (representVisitingError) {
        console.error('Error fetching represent visiting data:', representVisitingError.message);
        return;
      }
  
      if (!representVisitingData || representVisitingData.length === 0) {
        console.warn('No represent visiting data found.');
        setFilteredData([]);
        return;
      }
  
      const retailerIdArray = representVisitingData.map(invoice => invoice.visitorid);
  
      // Step 2: Filter invoices by date range
      let invoiceQuery = supabase.from('invoices').select('*').in('retailerid', retailerIdArray);
  
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
  
      // Step 3: Calculate total liters by date
      const totalsByDate = {};
  
      filteredInvoices.forEach((record) => {
        const date = new Date(record.updatedtime).toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
        const { totalliters } = record;
  
        // Initialize date entry if not present
        if (!totalsByDate[date]) {
          totalsByDate[date] = 0;  // Initialize totalliters to 0 for this date
        }
  
        // Add totalliters to the total for the date
        totalsByDate[date] += totalliters;
      });
  
      // Update state with calculated totals
      setFilteredData(totalsByDate);
      setFilterApplied(true);
  
      console.log("Final Filtered Totals by Date:", totalsByDate);
  
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
    selectedDsr(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
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
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">DSR Daywise Sales Report</h4>
          </Col>
        </Row>
        <Row className="mb-4">
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
                    <th>Date</th>
                    <th>Orders (In Litres)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.segmentname.trim()}</td>
                    </tr>
                  ))} */}
                  {Object.keys(filteredData).map((date, index) => (
                    <tr key={index}>
                      <td>{formatDate(date)}</td>
                      <td>{filteredData[date]}</td>
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
