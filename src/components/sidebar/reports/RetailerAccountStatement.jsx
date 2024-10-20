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
  const [unfilteredData, setUnfilteredData] = useState([]);
  const [unfilteredData1, setUnfilteredData1] = useState([]);
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

  // useEffect(() => {
  //   if (selectedUser) {
  //     const fetchUnfilteredData = async () => {
  //       const unfilteredInvoices = await fetchUnfilteredDataFromSupabase('invoices1', selectedUser.value);
  //       const unfilteredPayments = await fetchUnfilteredDataFromSupabase('payment_reference', selectedUser.value);

  //       setUnfilteredData(unfilteredInvoices);
  //       setUnfilteredData1(unfilteredPayments);
  //     };

  //     fetchUnfilteredData();
  //   }
  // }, [selectedUser]);

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
      // Check if dates are valid
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        alert("Pick From Date cannot be later than Pick To Date.");
        return;
      }
      
      
      // Helper function to fetch data with filters
      const fetchData = async (tableName, startDate=null,endDate=null) => {
        let query = supabase.from(tableName).select('*').eq('userid', selectedUser.value).order('createdtime',{ascending:true});
  
        if (startDate) {
          const startOfDay = formatDateForSQL(setStartOfDay(startDate));
          query = query.gte('createdtime', startOfDay);
        }
        if (endDate) {
          const endOfDay = formatDateForSQL(setEndOfDay(endDate));
          query = query.lte('createdtime', endOfDay);
        }
  
        const { data, error } = await query;
        if (error) {
          console.error(`Error fetching data from ${tableName}:`, error);
          return [];
        }
        return data;
      };
  
      // Fetch data for both tables
      const allUserRequests = await fetchData('invoices1',startDate,endDate);
      const allUserRequests1 = await fetchData('payment_reference',startDate,endDate);

      const combinedData = [
        ...allUserRequests.map(data => ({
          date: data.invdate,
          particulars: `Inv: ${data.tallyrefinvno}`,
          debit: data.amount,
          credit: null,
        })),
        ...allUserRequests1.map(data => ({
          date: data.createdtime,
          particulars: `${data.paymode}${data.payref ? `, Refno: ${data.payref}` : ''}`,
          debit: null,
          credit: data.amount,
        })),
      ];
      combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Update the state with the sorted combined data
      setFilteredData(combinedData);
      setFilteredData1(allUserRequests1);
      const allUserRequests2 = await fetchData('invoices1');
      const allUserRequests3 = await fetchData('payment_reference');

      // Update states
      setUnfilteredData(allUserRequests2 || []);
      setUnfilteredData1(allUserRequests3 || []);

      console.log("UnFiltered Requests for User (invoices):", allUserRequests2);
      console.log("UnFiltered Requests for User (payment_reference):", allUserRequests3);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };
  

  const handleReset = () => {
    setSelectedUser(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
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
  // const totalDebit = filteredData.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);
  // const totalCredit = filteredData1.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);

  // // Calculate Collection Amount, Closing Balance, and Total
  // const collectionAmount = totalCredit;
  // const closingBalance = totalDebit - collectionAmount;
  // const finalTotal = collectionAmount + closingBalance;

  const totalDebit = unfilteredData.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);
  const totalCredit = unfilteredData1.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);
  const collectionAmount = filteredData1.reduce((sum, data) => sum + parseFloat(data.amount || 0), 0);
  const closingBalance = totalDebit - totalCredit;
  const finalTotal = totalCredit + closingBalance;

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
            {!selectedUser && (
        <p className="text-danger">Please select a User.</p>
      )}
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
                    <tr key={`combined-${index}`}>
                      <td>{formatDate(data.date)}</td>
                      <td>{data.particulars}</td>
                      <td>{data.debit ? `₹ ${data.debit}` : ''}</td>
                      <td>{data.credit ? `₹ ${data.credit}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2" className="text-end">Collection Amount for Dates :</td>
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
