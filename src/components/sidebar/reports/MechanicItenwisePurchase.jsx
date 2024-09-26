
import React, { useState } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './mechanicItenwisePurchase.css';

export default function MechanicItenwisePurchase() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleFilter = async () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert("Pick From Date cannot be later than Pick To Date.");
        return;
      }
      // Simulate fetching data based on the date range
      const data = await fetchDataByDateRange(startDate, endDate);
      setFilteredData(data);
      setFilterApplied(true);
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  const fetchDataByDateRange = (start, end) => {
    // Placeholder for fetching data logic
    return [
      // Simulated data
      { id: 1, date: '01/01/2024', mechanic: 'John Doe', purchase: 'Oil Filter', amount: '1000' },
      { id: 2, date: '05/01/2024', mechanic: 'Jane Smith', purchase: 'Brake Pads', amount: '1500' }
    ];
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-3">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Mechanic Itenwise Purchase Reports</h4>
          </Col>
        </Row>
        <Row className="mb-2">
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
                <br/>
                <h4>No records found</h4>
                <br/>
              </div>
            ) : (
              <Table striped bordered hover responsive className="mechanic-purchase-report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mechanic</th>
                    <th>Purchase Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data) => (
                    <tr key={data.id}>
                      <td>{data.date}</td>
                      <td>{data.mechanic}</td>
                      <td>{data.purchase}</td>
                      <td>{data.amount}</td>
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
