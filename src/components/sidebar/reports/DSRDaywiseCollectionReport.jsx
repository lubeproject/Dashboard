import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRDaywiseCollectionReport.css";
import { UserContext } from '../../context/UserContext';

export default function DSRDaywiseCollectionReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [overallTotalsCash, setOverallTotalsCash] = useState(null);
  const [overallTotalsCheque, setOverallTotalsCheque] = useState(null);
  const [overallTotalsUPI, setOverallTotalsUPI] = useState(null);
  const [overallTotalsAdjust, setOverallTotalsAdjust] = useState(null);
  const [filteredData, setFilteredData] = useState([]); 
  const [filterApplied, setFilterApplied] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Representatives:', error);
      else setDsrOptions(data.map(rep => ({ value: rep.userid, label: rep.shopname, name: rep.name })));
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
      // Step 1: Filter invoices by date range
      let represent_visitingQuery = supabase
        .from('payment_reference')
        .select('*')
        .eq('createdby', selectedDsr.value)
        .order('createdtime',{ascending:true});
      
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        const formattedStartDate = formatDateForSQL(setStartOfDay(startDate));
        const formattedEndDate = formatDateForSQL(setEndOfDay(endDate));
        represent_visitingQuery = represent_visitingQuery
          .gte('createdtime', formattedStartDate)
          .lte('createdtime', formattedEndDate);
        console.log("Date Range Filter Applied:", formattedStartDate, "to", formattedEndDate);
      } else if (startDate) {
        const formattedStartDate = formatDateForSQL(setStartOfDay(startDate));
        represent_visitingQuery = represent_visitingQuery.gte('createdtime', formattedStartDate);
        console.log("Start Date Filter Applied:", formattedStartDate);
      } else if (endDate) {
        const formattedEndDate = formatDateForSQL(setEndOfDay(endDate));
        represent_visitingQuery = represent_visitingQuery.lte('createdtime', formattedEndDate);
        console.log("End Date Filter Applied:", formattedEndDate);
      }
  
      const { data: filteredRepresentVisiting, error: represent_visitingError } = await represent_visitingQuery;

      // console.log(filteredRepresentVisiting);
      if (represent_visitingError) {
        console.error('Error fetching filtered represent visiting:', represent_visitingError.message);
        return;
      }
  
      if (!filteredRepresentVisiting || filteredRepresentVisiting.length === 0) {
        console.warn('No Sales Order found for the selected date range.');
        setFilteredData([]);
        return;
      }
      // console.log(filteredRepresentVisiting);
  
      // Step 2: Calculate totals by payment mode and date
      const totalsByDate = {};
      const overallTotals = { Cash: 0, Cheque: 0, UPI: 0 ,Adjust:0 };
  
      filteredRepresentVisiting.forEach((record) => {
        const date = formatDate(record.createdtime); // Get date in 'YYYY-MM-DD' format
        const { paymode, amount } = record;
  
        if (!totalsByDate[date]) {
          totalsByDate[date] = { Cash: 0, Cheque: 0, UPI: 0,Adjust:0};
        }
  
        if (paymode === 'Cash') {
          totalsByDate[date].Cash += amount;
          overallTotals.Cash += amount;
        } else if (paymode === 'Cheque') {
          totalsByDate[date].Cheque += amount;
          overallTotals.Cheque += amount;
        } else if (paymode === 'UPI/IB') {
          totalsByDate[date].UPI += amount;
          overallTotals.UPI += amount;
        } else if (paymode === 'Adjustment') {
          totalsByDate[date].Adjust += amount;
          overallTotals.Adjust += amount;
        }
      });
  
      setFilteredData(totalsByDate);
      // console.log(filteredData);
      setOverallTotalsCash(overallTotals.Cash);
      setOverallTotalsCheque(overallTotals.Cheque);
      setOverallTotalsUPI(overallTotals.UPI);
      setOverallTotalsAdjust(overallTotals.Adjust);
      setFilterApplied(true);
      console.log("Final Filtered Totals by Date:", totalsByDate);
      console.log("Overall Totals:", overallTotals);
      // console.log(filteredData);
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };
  

  const handleReset = () => {
    setSelectedDsr(null);
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
            <h4 className="text-center">DSR Daywise Collection Report</h4>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group controlId="formRepresentative">
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
                    <th>Cheque</th>
                    <th>Cash</th>
                    <th>UPI/IB</th>
                    <th>Adjustment</th>
                    <th>Day Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(filteredData).map((date, index) => {
                    const chequeAmount = filteredData[date].Cheque || 0;
                    const cashAmount = filteredData[date].Cash || 0;
                    const upiAmount = filteredData[date].UPI || 0;
                    const adjustAmount = filteredData[date].Adjust || 0;

                    // Calculate the total for the day
                    const dayTotal = chequeAmount + cashAmount + upiAmount + adjustAmount;

                    return (
                      <tr key={index}>
                        <td>{date}</td>
                        <td>{chequeAmount}</td>
                        <td>{cashAmount}</td>
                        <td>{upiAmount}</td>
                        <td>{adjustAmount}</td>
                        <td>{dayTotal}</td> {/* Display the total for the day */}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th>{overallTotalsCheque}</th>
                    <th>{overallTotalsCash}</th>
                    <th>{overallTotalsUPI}</th>
                    <th>{overallTotalsAdjust}</th>
                    <th>{overallTotalsAdjust+overallTotalsUPI+overallTotalsCash+overallTotalsCheque}</th>
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
