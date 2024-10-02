import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./RetailerAccountStatement";
import { UserContext } from '../../context/UserContext';

export default function RetailerAccountStatement() {
  const [usersOptions, setUsersOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [filterApplied1, setFilterApplied1] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchUsers = async () => {
      let userQuery = supabase
      .from('users')
      .select('userid, shopname, name, role')
      .in('role', ['retailer','mechanic'])
      .order('userid',{ascending:true});

      if (user?.role === 'representative'){
        userQuery = userQuery
        .eq('representativeid',user?.userid)
        .eq('representativename',user?.name);
      }else if(user?.role === 'retailer'){
        userQuery = userQuery
        .eq('userid',user?.userid);
      }

      const { data, error } = await userQuery;

      if (error) console.error('Error fetching Users:', error);
      else setUsersOptions(data.map(user => ({ value: user.userid, label: user.shopname, name: user.name, role: user.role })));
    };

    fetchUsers();
  }, [user]);

  const handleFilter = async () => {
    try {
      // Check if dates are valid
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Pick From Date cannot be later than Pick To Date.");
        return;
      }
  
      // Helper function to fetch data with filters
      const fetchData = async (tableName) => {
        let query = supabase.from(tableName).select('*').eq('userid', selectedUser.value);
  
        if (startDate) {
          query = query.gte('createdtime', new Date(startDate).toISOString());
        }
        if (endDate) {
          query = query.lte('createdtime', new Date(endDate).toISOString());
        }
  
        const { data, error } = await query;
        if (error) {
          console.error(`Error fetching data from ${tableName}:`, error);
          return [];
        }
        return data;
      };
  
      // Fetch data for both tables
      const allUserRequests = await fetchData('invoices1');
      const allUserRequests1 = await fetchData('payment_reference');
  
      // Update states
      setFilteredData(allUserRequests || []);
      setFilteredData1(allUserRequests1 || []);
      setFilterApplied(true);
      setFilterApplied1(true);
  
      console.log("Filtered Requests for User (invoices):", allUserRequests);
      console.log("Filtered Requests for User (payment_reference):", allUserRequests1);
  
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
      borderColor: !selectedUser ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedUser ? 'red' : provided.borderColor,
      },
    }),
  };

  // Calculate totals
  const totalDebit = filteredData.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);
  const totalCredit = filteredData1.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);

  // Calculate Collection Amount, Closing Balance, and Total
  const collectionAmount = totalCredit;
  const closingBalance = totalDebit - collectionAmount;
  const finalTotal = collectionAmount + closingBalance;

  return (
    <main id='main' className='main'>
      <Container className="mt-2">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Account Statement</h4>
          </Col>
        </Row>
        <Row className="mb-2">
          <Form.Group controlId="formUser">
            <Select
                value={selectedUser}
                onChange={setSelectedUser}
                options={usersOptions}
                placeholder="Select User"
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
                    <th>Date</th>
                    <th>Particulars</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={`invoice-${index}`}>
                      <td>{formatDate(data.invdate)}</td>
                      <td>invNo. {data.tallyrefinvno}</td>
                      <td>₹ {data.amount}</td>
                      <td>{/* Additional data or leave blank */}</td>
                    </tr>
                  ))}
                  {filteredData1.map((data, index) => (
                    <tr key={`payment-${index}`}>
                      <td>{formatDate(data.updatedtime)}</td>
                      <td>{data.paymode}{data.payref ? ', Refno: ' + data.payref : ''}</td>
                      <td>{/* Additional data or leave blank */}</td>
                      <td>₹ {data.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-end">Collection Amount :</td>
                    <td>{}</td>
                    <td>₹ {collectionAmount}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-end">Closing Balance :</td>
                    <td>{}</td>
                    <td>₹ {closingBalance}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="text-end">Total :</td>
                    <td>₹ {totalDebit}</td>
                    <td>₹ {finalTotal}</td>
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
