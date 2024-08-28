import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./SalesReportMechanicwiseItemwise.css";

const dummyData = [
  {
    sl: '01',
    invoiceNo: '1234',
    date: '04-07-2024',
    retailerName: 'Star Lubricants Spares- K R Puram',
    gcin: 'SVLR-001',
    dsr: 'Bharath',
    product: 'Quartz 7000FUT.GF6 5W30 3X3.5L',
    segment: 'PCMO',
    category: 'Min',
    size: '3.5',
    sales: '31.5'
  },
  {
    sl: '02',
    invoiceNo: '1214',
    date: '05-07-2024',
    retailerName: 'Impex Automotives-Hoskote',
    gcin: 'SVLR-074',
    dsr: 'Bharath',
    product: 'Quartz 8000NFC 5W30 3X3.5L',
    segment: 'PCMO',
    category: 'FS',
    size: '3.5',
    sales: '105'
  },
  {
    sl: '03',
    invoiceNo: 'SVL-00409',
    date: '04-08-2024',
    retailerName: 'Diamond Automobiles-Anekal',
    gcin: 'SVLR-071',
    dsr: 'Prashanth',
    product: 'Hi-Perf 4T 500 15W50 5X2.5L',
    segment: 'MCO',
    category: 'FS',
    size: '2.5',
    sales: '105'
  }
];

export default function SalesReportMechanicwiseItemwise() {
  const [mechanicsOptions, setMechanicsOptions] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchMechanics = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'mechanic');

      if (error) console.error('Error fetching mechanics:', error);
      else setMechanicsOptions(data.map(mechanic => ({ value: mechanic.userid, label: mechanic.shopname, name: mechanic.name })));
    };
    
    fetchMechanics();
  }, []);

  const handleFilter = () => {
    let filtered = dummyData;

    if (startDate && endDate) {
      if (startDate > endDate) {
        alert("Pick From Date cannot be later than Pick To Date.");
        return;
      }

      filtered = filtered.filter(data => {
        const dataDate = new Date(data.date.split('-').reverse().join('-'));
        return dataDate >= startDate && dataDate <= endDate;
      });
    }

    setFilteredData(filtered);
    setFilterApplied(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

  const handleReset = () => {
    setSelectedMechanic(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedMechanic ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedMechanic ? 'red' : provided.borderColor,
      },
    }),
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const { data: filteredData, error } = await supabase
      .from('segment_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active segments

    if (error) console.error('Error fetching segments:', error.message);
    else setFilteredData(filteredData);
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Sales Report Mechanicwise with Itemwise</h4>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group controlId="formRetailer">
            <Select
              value={selectedMechanic}
              onChange={setSelectedMechanic}
              options={mechanicsOptions}
              placeholder="Select Mechanic"
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
                    <th>Item Name</th>
                    <th>Qty</th>
                    <th>Litres</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.segmentname.trim()}</td>
                      <td>{1}</td>
                      <td>{2}</td>
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
