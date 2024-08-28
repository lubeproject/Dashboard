import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import "./Dashboard.css"

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [segmentData, setSegmentData] = useState({});
  const [segmentPriceData, setSegmentPriceData] = useState({});
  const [totalColumns, setTotalColumns] = useState([]);
  const [totalValues, setTotalValues] = useState([]);

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
        setTotalValues(Object.values(segmentTotals));

        // Calculate category-wise quantities
        const { quantities: categoryQuantities, totals: categoryTotals } = getCategoryQuantities(data);
        setCategoryData(categoryQuantities);
        setTotalColumns(Object.keys(categoryTotals));
        setTotalValues(Object.values(categoryTotals));

        // Calculate segment-wise prices
        const { turnovers: segmentPrices, totals: segmentsTotals } = getSegmentTurnover(data);
        setSegmentPriceData(segmentPrices);
        setTotalColumns(Object.keys(segmentsTotals));
        setTotalValues(Object.values(segmentsTotals));

      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <main id='main' className='main'>
      <h2><center>Purchase Analysis (Litres)</center> </h2>
      <h4>Segmentwise :</h4>
      <table className="segment-table">
        <thead>
          <tr>
            <th><center>Segment</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {Object.keys(segmentData).map((segment, index) => (
            <tr key={index}>
              <td><center>{segment}</center></td>
              {totalColumns.map((col, i) => (
                <td key={i}><center>{segmentData[segment][col]}</center></td>
              ))}
            </tr>
          ))}
          <tr>
            <td><center>Total</center></td>
            {totalValues.map((val, i) => <td key={i}><center>{val}</center></td>)}
          </tr>
        </tbody>
      </table>

      <h4>Categorywise :</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th><center>Category</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {Object.keys(categoryData).map((category, index) => (
            <tr key={index}>
              <td><center>{category}</center></td>
              {totalColumns.map((col, i) => (
                <td key={i}><center>{categoryData[category][col]}</center></td>
              ))}
            </tr>
          ))}
          <tr>
            <td><center>Total</center></td>
            {totalValues.map((val, i) => <td key={i}><center>{val}</center></td>)}
          </tr>
        </tbody>
      </table>
      <h4>Segmentwise Turnover:</h4>
      <table className="segment-table">
        <thead>
          <tr>
            <th><center>Segment</center></th>
            {totalColumns.map((col, index) => <th key={index}><center>{col}</center></th>)}
          </tr>
        </thead>
        <tbody>
          {Object.keys(segmentPriceData).map((segment, index) => (
            <tr key={index}>
              <td><center>{segment}</center></td>
              {totalColumns.map((col, i) => (
                <td key={i}><center>{segmentPriceData[segment][col]}</center></td>
              ))}
            </tr>
          ))}
          <tr>
            <td><center>Total</center></td>
            {totalValues.map((val, i) => <td key={i}><center>{val}</center></td>)}
          </tr>
          <tr>
            <td><center>Avg</center></td>
            {totalValues.map((val, i) => <td key={i}><center>{val}</center></td>)}
          </tr>
        </tbody>
      </table>
      <h4>DSR Summary of the Day :</h4>
    </main>
  )
}
