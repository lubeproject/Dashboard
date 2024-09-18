import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import "./Dashboard.css";

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [categories, setCategories] = useState([]);
  const [segmentData, setSegmentData] = useState({});
  const [segments, setSegments] = useState([]);
  const [segmentPriceData, setSegmentPriceData] = useState({});
  const [paymentApprovals, setPaymentApprovals] = useState([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState({});
  const [totalColumns, setTotalColumns] = useState([]);
  const [totalCategoryValues, setTotalCategoryValues] = useState([]);
  const [totalSegmentValues, setTotalSegmentValues] = useState([]);
  const [totalSegmentPriceValues, setTotalSegmentPriceValues] = useState([]);
  const [totalSegmentPriceAvg, setTotalSegmentPriceAvg] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [mappedData, setMappedData] = useState({}); 
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});
  const [data, setData] = useState({
    '0-20 Days': 100,
    '21-40 Days': 0,
    '41-60 Days': 0,
    '61-75 Days': 0,
    '>75 Days': 5000,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [percentageData, setPercentageData] = useState([]);


  // Function to get date ranges
  const getDateRanges = () => {
    const today = new Date();
    const thisMonthName = today.toLocaleString('default', { month: 'short' });
    const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const previousMonthName = previousMonthDate.toLocaleString('default', { month: 'short' });
    const thisYear = today.getFullYear();
    const previousYear = thisYear - 1;

    return {
      thisMonthName,
      previousMonthName,
      thisYear,
      previousYear,
      startOfThisMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      startOfPreviousMonth: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      endOfPreviousMonth: new Date(today.getFullYear(), today.getMonth(), 0),
      startOfThisYear: new Date(today.getFullYear(), 0, 1),
      startOfPreviousYear: new Date(previousYear, 0, 1),
      endOfPreviousYear: new Date(previousYear, 11, 31),
    };
  };

  const fetchSegments = async () => {
    const { data: segments, error } = await supabase
      .from('segment_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active segments

      if (error) console.error('Error fetching segments:', error.message);
      else setSegments(segments);
  };

  const fetchCategories = async () => {
    const { data: categories, error } = await supabase
      .from('category_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active categories

    if (error) console.error('Error fetching categories:', error.message);
    else setCategories(categories);
  };

  // Function to calculate segment-wise quantities
  const getSegmentQuantities = (data) => {
    const {
      thisMonthName,
      previousMonthName,
      thisYear,
      previousYear,
      startOfThisMonth,
      startOfPreviousMonth,
      endOfPreviousMonth,
      startOfThisYear,
      startOfPreviousYear,
      endOfPreviousYear,
    } = getDateRanges();

    const quantities = {};

    data.forEach((item) => {
      const segment = item.segmentname;
      const qty = item.qty;
      const itemDate = new Date(item.updatedtime);

      if (!quantities[segment]) {
        quantities[segment] = {
          [previousMonthName]: 0,
          [thisMonthName]: 0,
          [previousYear]: 0,
          [thisYear]: 0,
          // Total: 0
        };
      }

      if (itemDate >= startOfThisMonth) {
        quantities[segment][thisMonthName] += qty;
      }
      if (itemDate >= startOfPreviousMonth && itemDate <= endOfPreviousMonth) {
        quantities[segment][previousMonthName] += qty;
      }
      if (itemDate >= startOfThisYear) {
        quantities[segment][thisYear] += qty;
      }
      if (itemDate >= startOfPreviousYear && itemDate <= endOfPreviousYear) {
        quantities[segment][previousYear] += qty;
      }
      // quantities[segment].Total += qty;
    });

    // Calculate totals
    const totals = {
      [previousMonthName]: 0,
      [thisMonthName]: 0,
      [thisYear]: 0,
      [previousYear]: 0,
      // Total: 0
    };
    Object.values(quantities).forEach((segment) => {
      totals[previousMonthName] += segment[previousMonthName];
      totals[thisMonthName] += segment[thisMonthName];
      totals[thisYear] += segment[thisYear];
      totals[previousYear] += segment[previousYear];
      // totals.Total += segment.Total;
    });

    return { quantities, totals };
  };


  // Function to calculate segment-wise turnover
  const getSegmentTurnover = (data) => {
    const {
      thisMonthName,
      previousMonthName,
      thisYear,
      previousYear,
      startOfThisMonth,
      startOfPreviousMonth,
      endOfPreviousMonth,
      startOfThisYear,
      startOfPreviousYear,
      endOfPreviousYear,
    } = getDateRanges();

    const turnovers = {};

    data.forEach((item) => {
      const segment = item.segmentname;
      const totalPrice = item.totalprice; // Using totalprice instead of qty
      const itemDate = new Date(item.updatedtime);

      if (!turnovers[segment]) {
        turnovers[segment] = {
          [previousMonthName]: 0,
          [thisMonthName]: 0,
          [thisYear]: 0,
          [previousYear]: 0,
          // Total: 0,
        };
      }

      if (itemDate >= startOfThisMonth) {
        turnovers[segment][thisMonthName] += totalPrice;
      }
      if (itemDate >= startOfPreviousMonth && itemDate <= endOfPreviousMonth) {
        turnovers[segment][previousMonthName] += totalPrice;
      }
      if (itemDate >= startOfThisYear) {
        turnovers[segment][thisYear] += totalPrice;
      }
      if (itemDate >= startOfPreviousYear && itemDate <= endOfPreviousYear) {
        turnovers[segment][previousYear] += totalPrice;
      }
      // turnovers[segment].Total += totalPrice;
    });

    // Calculate totals
    const totals = {
      [previousMonthName]: 0,
      [thisMonthName]: 0,
      [thisYear]: 0,
      [previousYear]: 0,
      // Total: 0,
    };
    Object.values(turnovers).forEach((segment) => {
      totals[previousMonthName] += segment[previousMonthName];
      totals[thisMonthName] += segment[thisMonthName];
      totals[thisYear] += segment[thisYear];
      totals[previousYear] += segment[previousYear];
      // totals.Total += segment.Total;
    });

    return { turnovers, totals };
  };

  // Function to calculate category-wise quantities
  const getCategoryQuantities = (data) => {
    const {
      thisMonthName,
      previousMonthName,
      thisYear,
      previousYear,
      startOfThisMonth,
      startOfPreviousMonth,
      endOfPreviousMonth,
      startOfThisYear,
      startOfPreviousYear,
      endOfPreviousYear,
    } = getDateRanges();

    const quantities = {};

    data.forEach((item) => {
      const category = item.categoryname;
      const qty = item.qty;
      const itemDate = new Date(item.updatedtime);

      if (!quantities[category]) {
        quantities[category] = {
          [previousMonthName]: 0,
          [thisMonthName]: 0,
          [thisYear]: 0,
          [previousYear]: 0,
          // Total: 0
        };
      }

      if (itemDate >= startOfThisMonth) {
        quantities[category][thisMonthName] += qty;
      }
      if (itemDate >= startOfPreviousMonth && itemDate <= endOfPreviousMonth) {
        quantities[category][previousMonthName] += qty;
      }
      if (itemDate >= startOfThisYear) {
        quantities[category][thisYear] += qty;
      }
      if (itemDate >= startOfPreviousYear && itemDate <= endOfPreviousYear) {
        quantities[category][previousYear] += qty;
      }
      // quantities[category].Total += qty;
    });

    // Calculate totals
    const totals = {
      [previousMonthName]: 0,
      [thisMonthName]: 0,
      [thisYear]: 0,
      [previousYear]: 0,
      // Total: 0
    };
    Object.values(quantities).forEach((category) => {
      totals[thisMonthName] += category[thisMonthName];
      totals[previousMonthName] += category[previousMonthName];
      totals[thisYear] += category[thisYear];
      totals[previousYear] += category[previousYear];
      // totals.Total += category.Total;
    });

    return { quantities, totals };
  };

  const fetchWeeklyPerformance = async () => {
    // Fetch data from the invoices table
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('updatedtime, totalliters, paidamount');

    if (error) {
        console.error('Error fetching invoices:', error.message);
        return;
    }

    // Get the current date
    const now = new Date();
    console.log('Current Date:', now);

    // Calculate the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Adjust to Sunday
    startOfCurrentWeek.setHours(0, 0, 0, 0); // Set time to midnight

    console.log('Start of Current Week (Sunday):', startOfCurrentWeek);

    // Create an array to hold totals for each week (Week 1 to Week 5)
    const weeklyData = Array(5).fill().map(() => ({ totalliters: 0, paidamount: 0 }));

    // Calculate the start and end date for each week
    const weekStartDates = Array(5).fill().map((_, i) => {
        const weekStart = new Date(startOfCurrentWeek);
        weekStart.setDate(weekStart.getDate() - i * 7); // Go back i weeks
        return weekStart;
    });

    // Process each invoice
    invoices.forEach(invoice => {
        const updatedDate = new Date(invoice.updatedtime);
        updatedDate.setHours(0, 0, 0, 0); // Normalize time to midnight

        // Check in which week the invoice falls
        for (let i = 0; i < 5; i++) {
            const weekStart = weekStartDates[i];
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // Saturday of the same week

            if (updatedDate >= weekStart && updatedDate <= weekEnd) {
                weeklyData[i].totalliters += invoice.totalliters;
                weeklyData[i].paidamount += invoice.paidamount;
            }
        }
    });
    console.log(weeklyData);
    // console.log(weeklyData.reverse());

    // Reverse the data to treat current week as Week 1, previous week as Week 2, etc.
    setWeeklyPerformance(weeklyData);
    console.log(weeklyPerformance);
};


  const summaryDetails = async () => {
    try {
      // Fetch representatives from the users table
      const { data: reps, error: repsError } = await supabase
        .from('users')
        .select('userid, name, role')
        .eq('role', 'representative');
  
      if (repsError) throw repsError;
  
      setRepresentatives(reps);
  
      // Fetch payments for today's date from the payment_reference2 table
      const today = new Date().toISOString().slice(0, 10); // Format date as YYYY-MM-DD
  
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payment_reference2")
        .select("repid, paymode, amount")
        .eq("updatedtime", today); // Assuming 'updatedtime' is the date field in your table
  
      if (paymentsError) throw paymentsError;
  
      setPayments(paymentsData);
  
      // Initialize an object to store totals by payment mode for each representative
      const paymentModes = ['Cheque', 'UPI', 'Cash', 'Adjustment'];
      const dataByPaymode = {};
      const totalByRep = {}; // Object to store total amount for each representative
  
      // Initialize data structure for each payment mode and representative
      paymentModes.forEach((mode) => {
        dataByPaymode[mode] = {};
        reps.forEach((rep) => {
          dataByPaymode[mode][rep.userid] = 0; // Start with zero for each rep
          if (!totalByRep[rep.userid]) {
            totalByRep[rep.userid] = 0; // Initialize total for each rep
          }
        });
      });
  
      // Sum amounts by payment mode for each representative
      paymentsData.forEach((payment) => {
        const { repid, paymode, amount } = payment;
        if (dataByPaymode[paymode] && dataByPaymode[paymode][repid] !== undefined) {
          dataByPaymode[paymode][repid] += amount;
          totalByRep[repid] += amount; // Increment the total for this representative
        }
      });
  
      // Update the state with the computed data
      setMappedData(dataByPaymode);
      setTotals(totalByRep); // Update the state with total amounts for each representative
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentApprovals = async () => {
    // Fetch data from the payment_approval table with specific columns
    const { data: payments, error } = await supabase
      .from('payment_approval')
      .select('chequedate, retailershopname, amount'); // Select specific columns

    if (error) {
        console.error('Error fetching payment approvals:', error.message);
    } else {
        // Assuming you have a state or a way to use the fetched data
        setPaymentApprovals(payments);
    }
};

const OutstandingAnalysis = async () => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    setTotalAmount(total);
    // Calculate the percentage for each column and round it to the nearest integer
    const percentages = Object.keys(data).map((key) => {
      return total > 0 ? Math.round((data[key] / total) * 100) : '0'; // Round to the nearest integer
    });

    setPercentageData(percentages);
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('invoice_items')
          .select('*');

        if (error) {
          throw error;
        }

        // Calculate segment-wise quantities
        const { quantities: segmentQuantities, totals: segmentTotals } = getSegmentQuantities(data);
        setSegmentData(segmentQuantities);
        setTotalColumns(Object.keys(segmentTotals));
        setTotalSegmentValues(Object.values(segmentTotals));

        // Calculate category-wise quantities
        const { quantities: categoryQuantities, totals: categoryTotals } = getCategoryQuantities(data);
        setCategoryData(categoryQuantities);
        setTotalColumns(Object.keys(categoryTotals));
        setTotalCategoryValues(Object.values(categoryTotals));

        // Calculate segment-wise prices
        const { turnovers: segmentPrices, totals: segmentsTotals } = getSegmentTurnover(data);
        setSegmentPriceData(segmentPrices);
        setTotalColumns(Object.keys(segmentsTotals));
        setTotalSegmentPriceValues(Object.values(segmentsTotals));

        if (totalSegmentValues.length > 0) {
          const averages = totalSegmentPriceValues.map((value, i) => 
            totalSegmentValues[i] === 0 ? 0 : value / totalSegmentValues[i]
          );
          const roundedAverages = averages.map(avg => Math.round(avg));
          setTotalSegmentPriceAvg(roundedAverages);
        }

      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchSegments();
    fetchCategories();
    fetchData();
    fetchWeeklyPerformance();
    fetchPaymentApprovals();
    OutstandingAnalysis();
    summaryDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

  return (
    <main id='main' className='main'>
      <h2><center>Purchase Analysis (Litres)</center> </h2>
      <h4>Categorywise :</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>Category</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td><center>{category.categoryname}</center></td>
              {totalColumns.map((col, i) => (
                <td key={i}>
                  <center>
                    {categoryData[category.categoryname] && categoryData[category.categoryname][col] !== undefined
                      ? categoryData[category.categoryname][col]
                      : 0}
                  </center>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td><center>Total</center></td>
            {totalCategoryValues.map((val, i) => (
              <td key={i}><center>{val}</center></td>
            ))}
          </tr>
        </tbody>
      </table>
      <h4>Segmentwise :</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>Segment</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {segments.map((segment, index) => (
            <tr key={index}>
              <td>
                <center>{segment.segmentname}</center>
              </td>
              {totalColumns.map((col, i) => (
                <td key={i}>
                  <center>
                    {segmentData[segment.segmentname] && segmentData[segment.segmentname][col] !== undefined
                      ? segmentData[segment.segmentname][col]
                      : 0}
                  </center>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td>
              <center>Total</center>
            </td>
            {totalSegmentValues.map((val, i) => (
              <td key={i}>
                <center>{val}</center>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <h4>Weekly Performance:</h4>
        <table className="category-table">
          <thead>
            <tr>
              <th><center>Week</center></th>
              <th><center>Orders (Liters)</center></th>
              <th><center>Collections</center></th>
            </tr>
          </thead>
          <tbody>
            {weeklyPerformance.map((weekData, index) => (
              <tr key={index}>
                <td><center>Week {index+1}</center></td>
                <td><center>{weekData.totalliters}</center></td>
                <td><center>₹{weekData.paidamount}</center></td>
              </tr>
            ))}
          </tbody>
        </table>

      <h4>Segmentwise Turnover:</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>Segment</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {segments.map((segment, index) => (
            <tr key={index}>
              <td><center>{segment.segmentname}</center></td>
              {totalColumns.map((col, i) => (
                <td key={i}><center>{segmentPriceData[segment.segmentname] && segmentPriceData[segment.segmentname][col] !== undefined
                  ? segmentPriceData[segment.segmentname][col]
                  : 0}</center></td>
              ))}
            </tr>
          ))}
          <tr>
            <td><center>Total</center></td>
            {totalSegmentPriceValues.map((val, i) => (
              <td key={i}><center>{val}</center></td>
            ))}
          </tr>
          <tr>
            <td><center>Avg</center></td>
            {totalSegmentPriceAvg.map((val, i) => (
              <td key={i}><center>{val}</center></td>
            ))}
          </tr>
        </tbody>
      </table>

      <h4>Outstanding Analysis:</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center></center></th>
            <th><center>0-20 Days</center></th>
            <th><center>21-40 Days</center></th>
            <th><center>41-60 Days</center></th>
            <th><center>61-75 Days</center></th>
            <th><center>&gt;75 Days</center></th>
            <th><center>Total</center></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><center>₹</center></td>
            {Object.values(data).map((value, index) => (
              <td key={index}><center>₹{value}</center></td>
            ))}
            <td><center>₹{totalAmount}</center></td>
          </tr>
          <tr>
            <td><center>%</center></td>
            {percentageData.map((percent, index) => (
              <td key={index}><center>{percent}%</center></td>
            ))}
            <td><center>100%</center></td>
          </tr>
        </tbody>
      </table>

      <h4>Upcoming Cheque Details:</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>Cheque Date</center></th>
            <th><center>Retailer Name</center></th>
            <th><center>Value</center></th>
          </tr>
        </thead>
          <tbody>
            {paymentApprovals.map((paymentapproval, index) => (
              <tr key={index}>
                <td><center>{formatDate(paymentapproval.chequedate)}</center></td>
                <td><center>{paymentapproval.retailershopname.trim()}</center></td>
                <td><center>₹{paymentapproval.amount}</center></td>
              </tr>
            ))}
          </tbody>
        </table>

      <h4>DSR Summary of the Day:</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>DSR</center></th>
            {representatives.map((rep) => (
              <th key={rep.userid}><center>{rep.name}</center></th>
            ))}
            <th><center>Total</center></th> {/* Add a column for totals */}
          </tr>
        </thead>
        <tbody>
          {Object.keys(mappedData).map((paymode) => (
            <tr key={paymode}>
              <td><center>{paymode}</center></td>
              {representatives.map((rep) => (
                <td key={rep.userid}><center>₹{mappedData[paymode][rep.userid] || 0}</center></td>
              ))}
              <td><center>
                {/* Display the total for this row across all representatives */}
                ₹{representatives.reduce((sum, rep) => sum + (mappedData[paymode][rep.userid] || 0), 0)}
              </center></td>
            </tr>
          ))}
          <tr>
            <td><center><strong>Total</strong></center></td>
            {representatives.map((rep) => (
              <td key={rep.userid}><center><strong>₹{totals[rep.userid] || 0}</strong></center></td>
            ))}
            <td><center>
              {/* Display the overall total sum of all representatives and all payment modes */}
              <strong>
              ₹{Object.values(totals).reduce((sum, amount) => sum + amount, 0)}
              </strong>
            </center></td>
          </tr>
        </tbody>
      </table>
    </main>
  )
}
