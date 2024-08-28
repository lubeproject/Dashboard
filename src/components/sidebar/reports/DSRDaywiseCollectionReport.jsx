import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRDaywiseCollectionReport.css";

export default function DSRDaywiseCollectionReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [overallTotalsCash, setOverallTotalsCash] = useState(null);
  const [overallTotalsCheque, setOverallTotalsCheque] = useState(null);
  const [overallTotalsUPI, setOverallTotalsUPI] = useState(null);
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
      let represent_visitingQuery = supabase
        .from('payment_reference2')
        .select('*')
        .eq('repid', selectedDsr.value);
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        represent_visitingQuery = represent_visitingQuery
          .gte('updatedtime', new Date(startDate).toISOString())
          .lte('updatedtime', new Date(endDate).toISOString());
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
      console.log(filteredRepresentVisiting);
  
      // Step 2: Calculate totals by payment mode and date
      const totalsByDate = {};
      const overallTotals = { Cash: 0, Cheque: 0, UPI: 0 };
  
      filteredRepresentVisiting.forEach((record) => {
        const date = new Date(record.updatedtime).toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
        const { paymode, amount } = record;
  
        if (!totalsByDate[date]) {
          totalsByDate[date] = { Cash: 0, Cheque: 0, UPI: 0 };
        }
  
        if (paymode === 'Cash') {
          totalsByDate[date].Cash += amount;
          overallTotals.Cash += amount;
        } else if (paymode === 'Cheque') {
          totalsByDate[date].Cheque += amount;
          overallTotals.Cheque += amount;
        } else if (paymode === 'UPI') {
          totalsByDate[date].UPI += amount;
          overallTotals.UPI += amount;
        }
      });
  
      setFilteredData(totalsByDate);
      console.log(filteredData);
      setOverallTotalsCash(overallTotals.Cash);
      setOverallTotalsCheque(overallTotals.Cheque);
      setOverallTotalsUPI(overallTotals.UPI);
      setFilterApplied(true);
      console.log("Final Filtered Totals by Date:", totalsByDate);
      console.log("Overall Totals:", overallTotals);
      console.log(filteredData);
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
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">DSR Daywise Collection Report</h4>
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
                    <th>Cheque</th>
                    <th>Cash</th>
                    <th>UPI</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(filteredData).map((date, index) => (
                    <tr key={index}>
                      <td>{formatDate(date)}</td>
                      <td>{filteredData[date].Cheque}</td>
                      <td>{filteredData[date].Cash}</td>
                      <td>{filteredData[date].UPI}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th>{overallTotalsCheque}</th>
                    <th>{overallTotalsCash}</th>
                    <th>{overallTotalsUPI}</th>
                  </tr>
                </tfoot>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
