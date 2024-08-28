import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./RetailerAccountStatement";

export default function RetailerAccountStatement() {
  const [retailersOptions, setRetailersOptions] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchRetailers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'retailer');

      if (error) console.error('Error fetching Retailers:', error);
      else setRetailersOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
    };

    fetchRetailers();
  }, []);

  const handleFilter = async () => {
    try {
      // Fetch all records for the selected retailer
      const { data: allRetailerRequests, error: retailerError } = await supabase
        .from('retailer_request')
        .select('*')
        .eq('retailerid', selectedRetailer.value);
  
      if (retailerError) {
        console.error('Error fetching retailer requests:', retailerError);
        return;
      }
  
      console.log("All Requests for Retailer:", allRetailerRequests);
  
      // Extract reqid values
      const reqIdArray = allRetailerRequests.map(request => request.reqid);
  
      if (reqIdArray.length === 0) {
        console.warn('No requests found for the selected retailer.');
        setFilteredData([]);
        return;
      }
  
      // Fetch all items from retailer_request_items
      const { data: allItemsData, error: itemsError } = await supabase
        .from('retailer_request_items')
        .select('*')
        .in('reqid', reqIdArray);
  
      if (itemsError) {
        console.error('Error fetching items data:', itemsError);
        return;
      }
  
      console.log("All Items Data:", allItemsData);
  
      // Apply Date Range Filter
      let filteredItems = allItemsData;
      let dateFilteredItems = filteredItems;
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime); // Convert the date string to a Date object
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
        console.log("Date Range Filter Applied:", startDate, "to", endDate);
      } else if (startDate) {
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate >= new Date(startDate);
        });
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate <= new Date(endDate);
        });
        console.log("End Date Filter Applied:", endDate);
      }
  
      // Set the filtered items data to state
      setFilteredData(dateFilteredItems || []);
      setFilterApplied(true);
      console.log("Final Filtered Items Data:", dateFilteredItems);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };

  const handleReset = () => {
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
      borderColor: !selectedRetailer ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedRetailer ? 'red' : provided.borderColor,
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
      <Container className="mt-2">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Account Statement</h4>
          </Col>
        </Row>
        <Row className="mb-2">
          <Form.Group controlId="formRetailer">
            <Select
                value={selectedRetailer}
                onChange={setSelectedRetailer}
                options={retailersOptions}
                placeholder="Select Retailer"
                styles={customSelectStyles}
            />
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
                    <th>Sl</th>
                    <th>Account</th>
                    <th>Punch In</th>
                    <th>Punch Out</th>
                    <th>Orders</th>
                    <th>Amt</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.segmentname.trim()}</td>
                      <td>{1}</td>
                      <td>{2}</td>
                      <td>{3}</td>
                      <td>{2}</td>
                      <td>{3}</td>
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
