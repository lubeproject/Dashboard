import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./SalesReportMechanicwise.css";
import { UserContext } from '../../context/UserContext';

export default function SalesReportMechanicwise() {
  const [mechanicsOptions, setMechanicsOptions] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchMechanics = async () => {
      let userQuery = supabase
      .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'mechanic')
        .order('userid', { ascending: true });

        if(user?.role === 'representative'){
          userQuery = userQuery
          .eq('representativeid',user?.userid)
          .eq('representativename',user?.name);
        }
      const { data, error } = await userQuery;
        

      if (error) console.error('Error fetching mechanics:', error);
      else setMechanicsOptions(data.map(mechanic => ({ value: mechanic.userid, label: mechanic.shopname, name: mechanic.name, role: mechanic.role })));
    };
    if (user?.role === 'mechanic') {
      setMechanicsOptions([
        {
          value: user.userid,
          label: user.shopname,
          name: user.name,
          role: user.role,
        },
      ]);
    } else {
    fetchMechanics();
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

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
    if (!selectedMechanic) {
      alert('Please select a Mechanic.');
      return;
    }

    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        alert("Pick From Date cannot be later than Pick To Date.");
        return;
      }
    }

    // Fetch billing data from billing_mechanic table
    let query = supabase
      .from('user_request')
      .select('*')
      .eq('userid', selectedMechanic.value);

    const { data: userRequests, error: userRequestError } = await query;

    if (userRequestError) {
      console.error('Error fetching user requests:', userRequestError);
      return;
    }

    // Get the reqids from the fetched userRequests
    const reqIds = userRequests.map(request => request.reqid);

    // If no requests found, handle gracefully
    if (reqIds.length === 0) {
      console.warn('No requests found for the selected mechanic.');
      setFilteredData([]);
      return;
    }

    // Fetch request items from the `user_request_items` table using the fetched reqids
    const { data: requestItems, error: requestItemsError } = await supabase
      .from('user_request_items')
      .select('*')
      .eq('userid', selectedMechanic.value) // Match with mechanic's user ID
      .in('reqid', reqIds); // Match with reqids

    if (requestItemsError) {
      console.error('Error fetching request items:', requestItemsError);
      return;
    }

    // Merge the fetched request items with their corresponding user requests
    const mergedData = requestItems.map(item => {
      const userRequest = userRequests.find(request => request.reqid === item.reqid);
      return {
        ...item, 
        itemname: item.itemname || 'Unknown', // Assuming itemname is in `user_request_items`
        usershopname: userRequest ? userRequest.usershopname : 'Unknown',
        createdtime: userRequest ? userRequest.createdtime : null
      };
    });

    // Date filtering based on start and end dates (if provided)
    let filteredItems = mergedData;
    if (startDate || endDate) {
      let dateFilteredItems = filteredItems;
      
      if (startDate && endDate) {
        const startOfDay = setStartOfDay(startDate);
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay && itemDate <= endOfDay;
        });
      } else if (startDate) {
        const startOfDay = setStartOfDay(startDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate >= startOfDay;
        });
      } else if (endDate) {
        const endOfDay = setEndOfDay(endDate);
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.createdtime);
          return itemDate <= endOfDay;
        });
      }

      filteredItems = dateFilteredItems;
    }

    // Update the state with the filtered data
    setFilteredData(filteredItems || []);
    setFilterApplied(true);
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

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Sales Report Mechanicwise</h4>
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
            {!selectedMechanic && (
                <p className="text-danger">Please select a Mechanic</p>
              )}
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
                    <th>Sl</th>
                    <th>Date</th>
                    <th>Item name</th>
                    <th>Qty</th>
                    <th>Liters</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData
                  .sort((a, b) => new Date(b.createdtime) - new Date(a.createdtime))
                  .map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatDate(data.createdtime)}</td>
                      <td>{data.itemname}</td>
                      <td>{data.qty}</td>
                      <td>{data.totalliters.toFixed(2)}</td>
                      <td>₹{data.totalprice.toFixed(2)}</td>
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
