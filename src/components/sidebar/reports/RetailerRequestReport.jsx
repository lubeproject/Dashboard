import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import { supabase } from '../../../supabaseClient';
import "./RetailerRequestReport.css";
import { UserContext } from '../../context/UserContext';

export default function RetailerRequestReport() {
  const [usersOptions, setUsersOptions] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  // const [selectedItems, setSelectedItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchUsers = async () => {
      let userQuery = supabase
      .from('users')
      .select('userid, shopname, name, role')
      .eq('role', 'retailer')
      .order('userid',{ascending:true});

      if(user?.role === 'representative'){
        userQuery = userQuery
        .eq('representativeid',user?.userid)
        .eq('representativename',user?.name);
      } else if(user?.role === 'retailer'){
        userQuery = userQuery
        .eq('userid',user?.userid);
      }

      const { data, error } = await userQuery;

      if (error) console.error('Error fetching Users:', error);
      else setUsersOptions(data.map(user => ({ value: user.userid, label: user.shopname, name: user.name })));
    };

    // Fetch items from the item_master table
    const fetchOrderStatus = async () => {
      const { data, error } = await supabase
        .from('order_status')
        .select('orderstatusid, orderstatus')

      if (error) console.error('Error fetching items:', error);
      else setOrderStatus(data.map(order => ({ value: order.orderstatusid, label: order.orderstatus})));
    };

    fetchUsers();
    fetchOrderStatus();
  }, [user]);

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

  const handleFilter = async () => {
    try {
      // Fetch all records for the selected user
      const { data: allUserRequests, error: userError } = await supabase
        .from('user_request')
        .select('*')
        .eq('userid', selectedUser.value);
  
      if (userError) {
        console.error('Error fetching retailer requests:', userError);
        return;
      }
  
      console.log("All Requests for Retailer:", allUserRequests);
  
      // Extract reqid values
      const reqIdArray = allUserRequests.map(request => request.reqid);
  
      if (reqIdArray.length === 0) {
        console.warn('No requests found for the selected retailer.');
        setFilteredData([]);
        return;
      }
  
      // Fetch all items from user_request_items
      const { data: allItemsData, error: itemsError } = await supabase
        .from('user_request_items')
        .select('*')
        .in('reqid', reqIdArray);
  
      if (itemsError) {
        console.error('Error fetching items data:', itemsError);
        return;
      }
  
      console.log("All Items Data:", allItemsData);
  
      // Debugging output
      console.log("Selected Order:", selectedOrder);
      console.log("Selected Order Label:", selectedOrder?.label);
  
      // Apply Order Status Filter
      let filteredItems = allItemsData;
  
      if (selectedOrder && selectedOrder.label.trim() !== "All") {
        filteredItems = filteredItems.filter(item => {
          const status = item.orderstatus || ""; // Default to empty string if undefined
          const selectedStatus = selectedOrder.label || ""; // Default to empty string if undefined
          console.log("Comparing item status:", status, "with", selectedStatus);
          return status.trim().toLowerCase() === selectedStatus.trim().toLowerCase();
        });
        console.log("Filtered Items by Order Status:", filteredItems);
      } else {
        console.log("All Item Statuses Included.");
      }
  
      // Apply Date Range Filter
      let dateFilteredItems = filteredItems;
  
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const startOfDay = setStartOfDay(startDate);
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime); // Convert the date string to a Date object
          return itemDate >= startOfDay && itemDate <= endOfDay;
        });
        // console.log("Date Range Filter Applied:", startOfDay, "to", endOfDay);
      } else if (startDate) {
        const startOfDay = setStartOfDay(startDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate >= startOfDay;
        });
        // console.log("Start Date Filter Applied:", startDate);
      } else if (endDate) {
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate <= endOfDay;
        });
        // console.log("End Date Filter Applied:", endOfDay);
      }
  
      // Set the filtered items data to state
      setFilteredData(dateFilteredItems || []);
      setFilterApplied(true);
      console.log("Final Filtered Items Data:", dateFilteredItems);
  
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
    setSelectedUser(null);
    setSelectedOrder(null);
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
            <h4 className="text-center">Retailerwise Request Report</h4>
          </Col>
        </Row>
        <Row className="mb-2 select-row">
          <Col md={6} xs={12} className="mb-2">
            <Form.Group controlId="formUser">
              <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={usersOptions}
                placeholder="Select Retailer"
                styles={customSelectStyles}
              />
              {!selectedUser && (
        <p className="text-danger">Please select a User.</p>
      )}
            </Form.Group>
          </Col>
          <Col md={6} xs={12} className="mb-2">
            <Form.Group controlId="formPaymentStatus">
              <Select
                value={selectedOrder}
                onChange={setSelectedOrder}
                options={orderStatus}
                placeholder="Select Order Status"
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
                    <th>Order No</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Box</th>
                    <th>Litres</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.sort((a, b) => a.reqid - b.reqid).map((data, index) => (
                    <tr key={index}>
                      <td>{data.reqid}</td>
                      {/* <td>{data.updatedtime}</td> */}
                      <td>{formatDate(data.updatedtime)}</td>
                      <td>{data.itemname.trim()}</td>
                      <td>{data.noofboxes}</td>
                      <td>{data.totalliters}</td>
                      <td>{data.orderstatus.trim()}</td>
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
