import React, { useState, useEffect } from 'react';
import {supabase} from "../../../supabaseClient";
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./LinesperDealerReport.css";

export default function LinesperDealerReport() {
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'retailer')
        .order('userid',{ascending:true});

      if (error) console.error('Error fetching Users:', error);
      else setUsersOptions(data.map(user => ({ value: user.userid, label: user.shopname, name: user.name })));
    };

    fetchUsers();
  }, []);

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
      // Fetch all records for the selected user
      const { data: allUserRequests, error: userError } = await supabase
        .from('user_request')
        .select('*')
        .eq('userid', selectedUser.value);
  
      if (userError) {
        console.error('Error fetching user requests:', userError);
        return;
      }
  
      // console.log("All Requests for User:", allUserRequests);
  
      // Extract invid values
      const invIdArray = allUserRequests.map(req => req.reqid);
  
      if (invIdArray.length === 0) {
        console.warn('No requests found for the selected user.');
        setFilteredData([]);
        return;
      }
  
      // Fetch all items from invoice_items1
      const { data: allItemsData, error: itemsError } = await supabase
        .from('user_request_items')
        .select('*')
        .in('reqid', invIdArray)
        .gt('pendingqty', 0);
  
      if (itemsError) {
        console.error('Error fetching items data:', itemsError);
        return;
      }
  
      // console.log("All Items Data:", allItemsData);
  
      let filteredItems = allItemsData;
  
      // Apply Date Range Filter
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const startOfDay = setStartOfDay(startDate);
        const endOfDay = setEndOfDay(endDate);
  
        filteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay && itemDate <= endOfDay;
        });
  
        console.log("Date Range Filter Applied:", startDate, "to", endDate);
      } else if (startDate) {
        const startOfDay = setStartOfDay(startDate);
        filteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay;
        });
        console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        const endOfDay = setEndOfDay(endDate);
        filteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate <= endOfDay;
        });
        console.log("End Date Filter Applied:", endDate);
      }

      const combinedItems = filteredItems.reduce((accumulator, currentItem) => {
        const { itemname, pendingqty } = currentItem; // Adjust as needed
  
        // Check if the itemname already exists in the accumulator
        if (accumulator[itemname]) {
          // Combine quantities or any other properties you need
          accumulator[itemname].pendingqty += pendingqty; // Example of combining quantities
          // If you need to combine more properties, adjust here
        } else {
          // If it doesn't exist, add it to the accumulator
          accumulator[itemname] = { ...currentItem }; // Spread current item
        }
  
        return accumulator;
      }, {});
  
      // Convert the accumulator object back to an array
      const finalFilteredItems = Object.values(combinedItems);
  
      // Set the filtered items data to state
      // console.log("Final Filtered Items Data:", finalFilteredItems);
      setFilteredData(finalFilteredItems || []);
  
      // // Set the filtered items data to state
      // console.log("Final Filtered Items Data:", filteredItems);
      // setFilteredData(filteredItems || []);
      setFilterApplied(true);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };  

  const handleReset = () => {
    setSelectedUser(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedUser ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedUser ? 'red' : provided.borderColor,
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
            <Form.Group controlId="formUser">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={usersOptions}
                placeholder="Select User"
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
                      <td>{data.pendingqty*data.itemweight}</td>
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
