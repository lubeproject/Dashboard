import React, { useState, useEffect } from 'react';
import supabase from "../../authUser/supabaseClient";
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./LinesperDealerReport.css";

export default function LinesperDealerReport() {
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
        .from('invoices')
        .select('*')
        .eq('retailerid', selectedRetailer.value);
  
      if (retailerError) {
        console.error('Error fetching retailer requests:', retailerError);
        return;
      }
  
      console.log("All Requests for Retailer:", allRetailerRequests);
  
      // Extract reqid values
      const invIdArray = allRetailerRequests.map(invoice => invoice.invid);
  
      if (invIdArray.length === 0) {
        console.warn('No requests found for the selected retailer.');
        setFilteredData([]);
        return;
      }
  
      // Fetch all items from invoice_items
      const { data: allItemsData, error: itemsError } = await supabase
        .from('invoice_items')
        .select('*')
        .in('invid', invIdArray);
  
      if (itemsError) {
        console.error('Error fetching items data:', itemsError);
        return;
      }
  
      console.log("All Items Data:", allItemsData);

      let filteredItems = allItemsData;
      // Apply Date Range Filter
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
    setSelectedRetailer(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
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

  return (
    <main id='main' className='main'>
      <Container className="mt-3">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Lines per Dealer Report</h4>
          </Col>
        </Row>
        <Row className="mb-2 select-row">
          <Col md={12} xs={12} className="mb-2">
            <Form.Group controlId="formRetailer">
              <Select
                value={selectedRetailer}
                onChange={setSelectedRetailer}
                options={retailersOptions}
                placeholder="Select Retailer"
                styles={customSelectStyles}
              />
            </Form.Group>
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
                      <th>Sl</th>
                      <th>Product</th>
                      <th>Segment</th>
                      <th>YTD Ltrs</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{data.itemname.trim()}</td>
                      <td>{data.segmentname.trim()}</td>
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
