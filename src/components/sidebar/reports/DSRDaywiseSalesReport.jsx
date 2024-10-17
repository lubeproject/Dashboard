import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRDaywiseSalesReport.css";
import { UserContext } from '../../context/UserContext';

export default function DSRDaywiseSalesReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Repreentatives:', error);
      else setDsrOptions(data.map(user => ({ value: user.userid, label: user.shopname, name: user.name, role:user.role })));
    };

    if (user?.role === 'representative') {
      setDsrOptions([
        {
          value: user.userid,
          label: user.shopname,
          name: user.name,
          role: user.role,
        },
      ]);
    } else {
      fetchDsr();
    }
  }, [user]);

  const handleFilter = async () => {
    if (!selectedDsr || !startDate || !endDate) {
      alert("Please select a representative and date range.");
      return;
    }

    if(startDate>endDate){
      alert("Pick From Date cannot be later than Pick To Date.");
      return;
    }

    try {
      // Format startDate and endDate to 'YYYY-MM-DD' format strings
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
      
      // Format the date to 'YYYY-MM-DD' to use in the query
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
      
      // Apply start and end of the day adjustments
      const formattedStartDate = formatDateForSQL(setStartOfDay(startDate));
      const formattedEndDate = formatDateForSQL(setEndOfDay(endDate));

      // Query for the visits assigned to the representative, filtering by visitingdate (which is a date field)
      let visitsQuery = supabase
        .from('user_request')
        .select('*')
        .eq('createdby', selectedDsr.value)
        .gte('createdtime', formattedStartDate) // Use formatted date
        .lte('createdtime', formattedEndDate) // Use formatted end date
        .order('reqid');

      const { data: visitsData, error: visitsError } = await visitsQuery;

      // console.log(visitsData);
      if (visitsError) {
        console.error('Error fetching visits:', visitsError.message);
        return;
      }

      // Step 2: Calculate total liters by date
      const totalsByDate = {};
      

      if (visitsData?.length > 0) {
        visitsData.forEach((record) => {
          const date = formatDate(record.createdtime);
          const { totalliters } = record;

          // Initialize date entry if not present
          if (!totalsByDate[date]) {
            totalsByDate[date] = 0; // Initialize total orders to 0 for this date
          }

          // Add orders (in liters) to the total for the date
          totalsByDate[date] += totalliters;
        });
      }

      // Update state with calculated totals
      setFilteredData(totalsByDate);
      setFilterApplied(true);

      // console.log("Final Filtered Totals by Date:", totalsByDate);
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
    setSelectedDsr(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
    setFilterApplied(false);
  };
  const totalOrders = Object.keys(filteredData).reduce((sum, date) => sum + filteredData[date], 0);
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
            <h4 className="text-center">DSR Daywise Sales Report</h4>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group controlId="formUser">
            <Select
                value={selectedDsr}
                onChange={setSelectedDsr}
                options={dsrOptions}
                placeholder="Select Representative"
                styles={customSelectStyles}
            />
            {!selectedDsr && (
        <p className="text-danger">Please select a Representative.</p>
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
                    <th>Date</th>
                    <th>Orders (In Litres)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.segmentname.trim()}</td>
                    </tr>
                  ))} */}
                  {Object.keys(filteredData).map((date, index) => (
                    <tr key={index}>
                      <td>{date}</td>
                      <td>{filteredData[date]}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th>{totalOrders}</th> {/* Display the total sum of all orders */}
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
