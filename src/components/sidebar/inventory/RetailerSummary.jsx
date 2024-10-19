import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import './retailerSummary.css';
import { FaTools } from "react-icons/fa";
import { MdOutlineWaterDrop } from "react-icons/md";
import { IoDiamondOutline } from "react-icons/io5";
import { PiCurrencyInrBold } from "react-icons/pi";
import { useLocation } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { startOfWeek, subWeeks, isAfter, format } from 'date-fns';

const dummyLoyalMechanics = [
  { id: 1, Mechanic: 'John Doe', Litres: '100', Points: '50' },
];

export default function RetailerSummary() {
  // const { userId } = useParams();
  const location = useLocation();
  const { userId } = location.state || {};
  const [user, setUser] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recoveryData, setRecoveryData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    years: {},
    months: {}
  });

    

  useEffect(() => {
    // Fetch user details and recovery data when the component mounts
    const fetchData = async () => {
      try {
        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('shopname,name,role')
          .eq('userid', userId)
          .single();

        if (userError) throw userError;

        setUser(userData); // Set user data in state

        // Fetch recovery data (invoices)
        const { data: invoiceData, error: invoiceError } = await supabase
          .from('invoices1')
          .select('*') // Fetch paidamount as well
          .eq('userid', userId)
          .order('invid',{ascending:true}); // Filter invoices by retailer ID

        if (invoiceError) throw invoiceError;

        // Calculate balance for each invoice and OD Days
        const recoveryDataWithCalculations = invoiceData.map((invoice) => {
          const balance = invoice.amount - invoice.paidamount;
          const invoiceDate = new Date(invoice.invdate).setHours(0, 0, 0, 0);
          const ODDays = Math.floor(
            (new Date().setHours(0, 0, 0, 0) - invoiceDate) / (1000 * 60 * 60 * 24)
          );

          return {
            ...invoice,
            balance,
            ODDays,
          };
        });

        // Set recovery data in state
        setRecoveryData(recoveryDataWithCalculations);

        // Calculate total balance
        const total = recoveryDataWithCalculations.reduce((sum, invoice) => sum + invoice.balance, 0);
        setTotalBalance(total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchPurchaseAnalysis = async () => {
      try {
        const today = new Date();
        const currentYear = today.getFullYear(); // e.g., 2024
        const previousYear = currentYear - 1;   // e.g., 2023
        const currentMonth = today.getMonth();  // e.g., 8 for September (0-indexed)
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        // Get the previous and current months' names
        const previousMonthName = monthNames[(currentMonth - 1 + 12) % 12];  // For example, August if current is September
        const currentMonthName = monthNames[currentMonth];                   // For example, September

        // Generate start and end dates for fetching year and month data
        const startOfPreviousYear = new Date(previousYear, 0, 1);
        const endOfPreviousYear = new Date(previousYear, 11, 31);
        const startOfCurrentYear = new Date(currentYear, 0, 1);
        const startOfPreviousMonth = new Date(today.getFullYear(), (currentMonth - 1 + 12) % 12, 1);
        const startOfCurrentMonth = new Date(today.getFullYear(), currentMonth, 1);

        // Fetch data for the previous year
        const { data: previousYearData, error: previousYearError } = await supabase
          .from('user_request_items')
          .select('totalliters, categoryname, createdtime')
          .eq('userid', userId)
          .gte('createdtime', startOfPreviousYear.toISOString())
          .lte('createdtime', endOfPreviousYear.toISOString());

        if (previousYearError) throw previousYearError;

        // Fetch data for the current year
        const { data: currentYearData, error: currentYearError } = await supabase
          .from('user_request_items')
          .select('totalliters, categoryname, createdtime')
          .eq('userid', userId)
          .gte('createdtime', startOfCurrentYear.toISOString());

        if (currentYearError) throw currentYearError;

        // Fetch data for the previous month
        const { data: previousMonthData, error: previousMonthError } = await supabase
          .from('user_request_items')
          .select('totalliters, categoryname, createdtime')
          .eq('userid', userId)
          .gte('createdtime', startOfPreviousMonth.toISOString())
          .lt('createdtime', startOfCurrentMonth.toISOString());

        if (previousMonthError) throw previousMonthError;

        // Fetch data for the current month
        const { data: currentMonthData, error: currentMonthError } = await supabase
          .from('user_request_items')
          .select('totalliters, categoryname, createdtime')
          .eq('userid', userId)
          .gte('createdtime', startOfCurrentMonth.toISOString());

        if (currentMonthError) throw currentMonthError;

        // Helper function to accumulate litres by category
        const accumulateLitresByCategory = (data) => {
          const categories = { Mineral: 0, Synth: 0, Psy: 0, Total: 0, NA: 0 };
          data.forEach((item) => {
            if (item.categoryname === 'Min') categories.Mineral += item.totalliters;
            else if (item.categoryname === 'FS') categories.Synth += item.totalliters;
            else if (item.categoryname === 'PS') categories.Psy += item.totalliters;
            else categories.NA += item.totalliters;
            categories.Total += item.totalliters;
          });
          return categories;
        };

        // Accumulate litres by category for each time period
        const previousYearAnalysis = accumulateLitresByCategory(previousYearData);
        const currentYearAnalysis = accumulateLitresByCategory(currentYearData);
        const previousMonthAnalysis = accumulateLitresByCategory(previousMonthData);
        const currentMonthAnalysis = accumulateLitresByCategory(currentMonthData);

        // Update state with the accumulated data
        setPurchaseData({
          years: {
            [previousYear]: previousYearAnalysis,
            [currentYear]: currentYearAnalysis
          },
          months: {
            [previousMonthName]: previousMonthAnalysis,
            [currentMonthName]: currentMonthAnalysis
          }
        });
      } catch (error) {
        console.error("Error fetching purchase analysis data:", error);
      }
    };

    const fetchYearWisePerformanceData = async () => {
      try {
        // Fetch turnover data from payment_reference
        const { data: turnoverData, error: turnoverError } = await supabase
          .from('payment_reference')
          .select('amount, createdtime')
          .eq('userid', userId);
  
        if (turnoverError) throw turnoverError;
  
        // Extract year from createdtime and group turnover by year
        const turnoverByYear = turnoverData.reduce((acc, record) => {
          const year = new Date(record.createdtime).getFullYear();
          acc[year] = (acc[year] || 0) + record.amount;
          return acc;
        }, {});
  
        // Fetch "To be Cleared" data from payment_approval
        const { data: approvalData, error: approvalError } = await supabase
          .from('payment_approval')
          .select('amount, createdtime, paymentstatus')
          .eq('userid', userId)
          .eq('paymentstatus', 'Pending'); // Assuming 'Pending' means "To be Cleared"
  
        if (approvalError) throw approvalError;
  
        // Extract year from createdtime and group "To be Cleared" by year
        const toBeClearedByYear = approvalData.reduce((acc, record) => {
          const year = new Date(record.createdtime).getFullYear();
          acc[year] = (acc[year] || 0) + record.amount;
          return acc;
        }, {});

        const { data: userCreditData, error: userCreditError } = await supabase
          .from('users')
          .select('creditterm')
          .eq('userid', userId)
          .single();

        if (userCreditError) throw userCreditError;
        const creditterm = userCreditData.creditterm;
        // Fetch limitdays from credititem_master based on creditterm
        const { data: creditMasterData, error: creditMasterError } = await supabase
          .from('credititem_master')
          .select('limitdays')
          .eq('credittermname', creditterm)
          .single();
        if (creditMasterError) throw creditMasterError;
        const creditDaysAvailed = creditMasterData.limitdays || 0;
        // Generate the final data array for display
        const allYears = new Set([...Object.keys(turnoverByYear), ...Object.keys(toBeClearedByYear)]);
        const finalData = Array.from(allYears).map(year => ({
          year,
          turnover: turnoverByYear[year] || 0,
          toBeCleared: toBeClearedByYear[year] || 0,
          creditDaysAvailed: creditDaysAvailed,
        }));
  
        // Update the state with the final data
        setPerformanceData(finalData);
      } catch (error) {
        console.error('Error fetching year-wise performance data:', error);
      }
    };
  

    // const fetchWeeklyData = async () => {
    //   try {
    //     const { data: visitData, error } = await supabase
    //       .from('represent_visiting1')
    //       .select('*') // Fetch relevant fields
    //       .eq('visitorid', userId)
    //       .order('created', { ascending: false })
    //       .limit(5);

    //     if (error) throw error;

    //     // Process data for display
    //     const formattedData = visitData.map((visit, index) => {
    //       const week = `Week ${index + 1}`; // Calculate week based on visit order
    //       const order = visit.orders; // Assuming 'liters' represents order quantity
    //       const collection = visit.amount; // Assuming there's a collection field

    //       return {
    //         week,
    //         order,
    //         collection,
    //       };
    //     });

    //     setWeeklyData(formattedData); // Set weekly data in state
    //   } catch (error) {
    //     console.error('Error fetching weekly data:', error);
    //   }
    // };
    const fetchWeeklyData = async () => {
      try {
        const currentDate = new Date();
        const fiveWeeksAgo = subWeeks(currentDate, 5); // Calculate date for 5 weeks ago
    
        // Fetch user requests (orders) from user_request
        const { data: requestData, error: requestError } = await supabase
          .from('user_request')
          .select('createdtime, totalqty') // Fetch total quantity and created time
          .eq('userid', userId)
          .order('createdtime', { ascending: false });
    
        if (requestError) throw requestError;
    
        // Fetch collection data (amount) from represent_visiting1
        const { data: visitingData, error: visitingError } = await supabase
          .from('represent_visiting1')
          .select('checkintime, amount,visitingdate') // Fetch check-in time and amount
          .eq('visitorid', userId)
          .order('created', { ascending: false });
    
        if (visitingError) throw visitingError;
    
        // Combine data from both tables by the week starting from Sunday
        const weekMap = new Map(); // To store data grouped by week
    
        // Process request data (orders)
        requestData.forEach((request) => {
          const requestDate = new Date(request.createdtime);
          const weekStart = startOfWeek(requestDate, { weekStartsOn: 0 }); // Week starts on Sunday
    
          if (isAfter(weekStart, fiveWeeksAgo)) {
            const weekKey = format(weekStart, 'yyyy-MM-dd'); // Use week start date as the key
    
            if (!weekMap.has(weekKey)) {
              weekMap.set(weekKey, {
                weekStart: weekStart,
                totalOrders: 0,
                totalCollection: 0,
              });
            }
    
            // Update total orders for the week
            const weekData = weekMap.get(weekKey);
            weekData.totalOrders += request.totalqty;
          }
        });
    
        // Process visiting data (collection)
        visitingData.forEach((visit) => {
          const visitDate = new Date(visit.visitingdate);
          const weekStart = startOfWeek(visitDate, { weekStartsOn: 0 });
    
          if (isAfter(weekStart, fiveWeeksAgo)) {
            const weekKey = format(weekStart, 'yyyy-MM-dd');
    
            if (!weekMap.has(weekKey)) {
              weekMap.set(weekKey, {
                weekStart: weekStart,
                totalOrders: 0,
                totalCollection: 0,
              });
            }
    
            // Update total collection for the week
            const weekData = weekMap.get(weekKey);
            weekData.totalCollection += visit.amount;
          }
        });
    
        // Convert map to an array, sort by the week, and limit to 5 weeks
        const formattedData = Array.from(weekMap.values())
          .sort((a, b) => b.weekStart - a.weekStart) // Sort by the most recent week
          .slice(0, 5) // Limit to 5 weeks
          .map((weekData, index) => ({
            week: `Week ${index + 1}`,
            order: weekData.totalOrders,
            collection: weekData.totalCollection,
            weekStart: format(weekData.weekStart, 'MMMM do, yyyy'), // Optional: Format the date
          }));
    
        setWeeklyData(formattedData); // Set weekly data in state
      } catch (error) {
        console.error('Error fetching weekly data:', error);
      }
    };

    fetchData();
    fetchPurchaseAnalysis();
    fetchYearWisePerformanceData ();
    fetchWeeklyData();
  }, [userId]);

  return (
    <main id='main' className='main'>
      <h2><center>User Summary</center></h2>

      {user && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <h3>{user.shopname}</h3>
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>{user.role}</span>
        </div>
      )}

      <div className='icons'>
          <div>
            <h4 style={{color:"darkorange"}}>0</h4>
             < FaTools fontSize={"25"}/>
          </div>

          <div>
            <h4 style={{color:"darkorange"}}>0</h4>
             <  MdOutlineWaterDrop fontSize={"25"}/>
          </div>

          <div>
            <h4 style={{color:"darkorange"}}>0</h4>
             < IoDiamondOutline fontSize={"25"} />
          </div>

          <div>
            <h4 style={{color:"darkorange"}}>₹{totalBalance}</h4>
             < PiCurrencyInrBold fontSize={"25"}/>
          </div>
      </div>
      <Container className="mt-4">
        {/* <Row className="mb-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Account</th>
                  <th>Visiting Day</th>
                  <th>Action</th>
                </tr>
              </thead>
            </Table>
          </Col>
        </Row> */}
        <Row className="mb-4">
          <Col>
            <h5>Purchase Analysis (Litres):</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                <th>Period</th>
                  <th>Mineral</th>
                  <th>Synth</th>
                  <th>Psy</th>
                  <th>Total</th>
                  <th>NA</th>
                </tr>
              </thead>
              <tbody>
                {/* {purchaseData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.Mineral}</td>
                    <td>{data.Synth}</td>
                    <td>{data.Psy}</td>
                    <td>{data.Total}</td>
                    <td>{data.NA}</td>
                  </tr>
                ))} */}
                {Object.entries(purchaseData.years).map(([year, data]) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{data.Mineral}</td>
                      <td>{data.Synth}</td>
                      <td>{data.Psy}</td>
                      <td>{data.Total}</td>
                      <td>{data.NA}</td>
                    </tr>
                  ))}
                  {Object.entries(purchaseData.months).map(([month, data]) => (
                    <tr key={month}>
                      <td>{month}</td>
                      <td>{data.Mineral}</td>
                      <td>{data.Synth}</td>
                      <td>{data.Psy}</td>
                      <td>{data.Total}</td>
                      <td>{data.NA}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Performance Data:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>TurnOver</th>
                  <th>To be Cleared</th>
                  <th>Credit Days Availed</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((data, index) => (
                  <tr key={index+1}>
                    <td>{data.year}</td>
                    <td>₹{data.turnover}</td>
                    <td>₹{data.toBeCleared}</td>
                    <td>{data.creditDaysAvailed}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Order (Litres)</th>
                  <th>Collection</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((data, index) => (
                  <tr key={data.weekStart || index}>
                    <td>{data.week}</td>
                    <td>{data.order}</td>
                    <td>₹{data.collection}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Recovery Data:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Inv.No.</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>Balance</th>
                  <th>OD Days</th>
                </tr>
              </thead>
              <tbody>
                {recoveryData.map((data, index) => (
                    <tr key={data.invid}>
                      <td>{data.tallyrefinvno}</td>
                      <td>{new Date(data.invdate).toLocaleDateString()}</td>
                      <td>₹{data.amount}</td>
                      <td>₹{data.balance}</td>
                      <td>{data.ODDays}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Loyal Mechanics:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mechanic</th>
                  <th>Litres</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {dummyLoyalMechanics.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.Mechanic}</td>
                    <td>{data.Litres}</td>
                    <td>{data.Points}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
