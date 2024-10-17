import React, { useEffect, useState, useContext} from "react";
import { supabase } from "../../supabaseClient";
import "./Dashboard.css";
import { UserContext } from "../context/UserContext";
import { startOfWeek, subWeeks, isAfter, format } from 'date-fns';
import { Card } from 'react-bootstrap';

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
    "0-20 Days": 0,
    "21-40 Days": 0,
    "41-60 Days": 0,
    "61-75 Days": 0,
    ">75 Days": 0,
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [percentageData, setPercentageData] = useState([]);
  const { user } = useContext(UserContext);
  const [visitData, setVisitData] = useState({ numberOfVisits: 0, numberOfAccounts: 0, totalLitres: 0 });
  const [paymentData, setPaymentData] = useState({
    cheque: 0,
    upi: 0,
    cash: 0,
    adjustment:0,
    totalAmounts: 0,
});
const [weeklyData, setWeeklyData] = useState([]);
const [isDataFetched, setIsDataFetched] = useState(false);
const [performanceData, setPerformanceData] = useState([]);
const [totalLitresCount, setTotalLitresCount] = useState(0);
const [totalRewards, setTotalRewards] = useState(0);
const [giftItems, setGiftItems] = useState([]);
const [recoveryData, setRecoveryData] = useState([]);

  // Function to get date ranges
  useEffect(() => {
    // const fetchOutData = async () => {
    //   const { data: payments, error } = await supabase
    //     .from('payment_reference')
    //     .select('amount, createdtime');

    //   if (error) {
    //     console.error('Error fetching data:', error);
    //     return;
    //   }

    //   const currentDate = new Date();
    //   const updatedData = {
    //     "0-20 Days": 0,
    //     "21-40 Days": 0,
    //     "41-60 Days": 0,
    //     "61-75 Days": 0,
    //     ">75 Days": 0,
    //   };

    //   payments.forEach(payment => {
    //     const createdDate = new Date(payment.createdtime);
    //     const daysDifference = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24)); // Convert to days

    //     if (daysDifference <= 20) {
    //       updatedData["0-20 Days"] += payment.amount;
    //     } else if (daysDifference <= 40) {
    //       updatedData["21-40 Days"] += payment.amount;
    //     } else if (daysDifference <= 60) {
    //       updatedData["41-60 Days"] += payment.amount;
    //     } else if (daysDifference <= 75) {
    //       updatedData["61-75 Days"] += payment.amount;
    //     } else {
    //       updatedData[">75 Days"] += payment.amount;
    //     }
    //   });

    //   setData(updatedData);
    // };

    const fetchOutData = async () => {
      const currentUserId = user?.userid; // Replace with the actual method of getting current user ID
      const isAdmin = user?.role === 'admin'; // Adjust this condition based on your role management
    
      // Prepare the query to fetch payment data
      let query = supabase.from('payment_reference').select('amount, createdtime').eq('paymentstatus','Approved');
    
      // If the user is a representative, filter by repid
      if (!isAdmin) {
        query = query.eq('repid', currentUserId);
      }
    
      const { data: payments, error } = await query;
    
      if (error) {
        console.error('Error fetching data:', error);
        return;
      }
    
      const currentDate = new Date();
      const updatedData = {
        "0-20 Days": 0,
        "21-40 Days": 0,
        "41-60 Days": 0,
        "61-75 Days": 0,
        ">75 Days": 0,
      };
    
      payments.forEach(payment => {
        const createdDate = new Date(payment.createdtime);
        const daysDifference = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24)); // Convert to days
    
        if (daysDifference <= 20) {
          updatedData["0-20 Days"] += payment.amount;
        } else if (daysDifference <= 40) {
          updatedData["21-40 Days"] += payment.amount;
        } else if (daysDifference <= 60) {
          updatedData["41-60 Days"] += payment.amount;
        } else if (daysDifference <= 75) {
          updatedData["61-75 Days"] += payment.amount;
        } else {
          updatedData[">75 Days"] += payment.amount;
        }
      });
    
      setData(updatedData);
      setIsDataFetched(true);
    };

  //   const OutstandingAnalysis = async () => {
  //     // console.log("Current data:", data); // Check what data looks like
  //     const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  //     // console.log("Total amount:", total); // Check the total calculated
      
  //     setTotalAmount(total);
  
  //     const percentages = Object.keys(data).map((key) => {
  //         // return total > 0 ? Math.round((data[key] / total) * 100) : 0;
  //         if (parseInt(total) === 0) {
  //           return "0"; // Ensure two decimal places
  //       }
  //       if (parseInt((data[key] / total)) === 1) {
  //         return "100"; // Ensure two decimal places
  //     }
  //         return ((data[key] / total) * 100).toFixed(2);
  //     });
  
  //     setPercentageData(percentages);
  // };

    fetchOutData();
  }, []);

  useEffect(() => {
    if (isDataFetched) {
      const OutstandingAnalysis = async () => {
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        setTotalAmount(total);

        const percentages = Object.keys(data).map((key) => {
          if (parseInt(total) === 0 || data[key]===0) {
            return "0"; // Ensure two decimal places
          }

          if(parseInt(total)===data[key]){
            return "100";
          }
          return ((data[key] / total) * 100).toFixed(2);
        });

        setPercentageData(percentages);
      };

      OutstandingAnalysis();
    }
  }, [isDataFetched, data]);

  const fetchVisitData = async () => {
    const today = new Date();
    const visitingDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
        // Fetch total visits for the current representative on the current date
        const { data: visitsData, error: visitsError } = await supabase
            .from('represent_visiting1')
            .select('*') // Get all data to filter unique shop names later
            .eq('createdby', user.userid) // Filter by current representative ID
            .eq('visitingdate', visitingDate); // Filter by today's date using visitingdate

        if (visitsError) throw visitsError;

        const numberOfVisits = visitsData.length; // Total number of visits

        // Use a Set to collect unique shop names
        const uniqueShopNames = new Set(visitsData.map(visit => visit.shopname));

        const numberOfAccounts = uniqueShopNames.size; // Count of unique shop names

      //   const totalLitres = visitsData.reduce((sum, visit) => {
      //     return sum + (visit.orders || 0); // Ensure to handle cases where orders might be undefined
      // }, 0);
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // Midnight of today
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        const { data: userRequestsData, error: userRequestsError } = await supabase
            .from('user_request')
            .select('totalliters')
            .eq('createdby', user?.userid)
            .gte('createdtime', startOfDay.toISOString())
            .lte('createdtime', endOfDay.toISOString());

        if (userRequestsError) throw userRequestsError;

        const totalLitres = userRequestsData.reduce((sum, request) => {
          return sum + (request.totalliters || 0);
        }, 0);

      // Update state with fetched data
      setVisitData({ numberOfVisits, numberOfAccounts, totalLitres });


    } catch (error) {
        console.error('Error fetching visit data:', error);
    }
};
  
const fetchPaymentData = async () => {
  const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0); // Midnight of today
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59); // Just before midnight of today

    try {
        const { data: paymentsData, error } = await supabase
            .from('payment_reference')
            .select('amount, paymode') // Select the amount and payment mode
            .eq('createdby', user?.userid) // Filter by current representative ID
            .gte('createdtime', startOfDay.toISOString()) // Start of today's date
            .lte('createdtime', endOfDay.toISOString()); // End of today's date

        if (error) throw error;


      // Initialize amounts
      let chequeTotal = 0;
      let upiTotal = 0;
      let cashTotal = 0;
      let adjustTotal = 0;
      let totalAmounts = 0;

      // Iterate over payments to calculate totals
      paymentsData.forEach(payment => {
          totalAmounts += payment.amount; // Sum up total amounts for the day

          switch (payment.paymode) {
              case 'Cheque':
                  chequeTotal += payment.amount;
                  break;
              case 'UPI/IB':
                  upiTotal += payment.amount;
                  break;
              case 'Cash':
                  cashTotal += payment.amount;
                  break;
              case 'Adjustment':
                  adjustTotal+= payment.amount;
              default:
                  break;
          }
      });

      // Update state or handle the totals as needed
      setPaymentData({
          cheque: chequeTotal,
          upi: upiTotal,
          cash: cashTotal,
          adjustment: adjustTotal,
          totalAmounts: totalAmounts,
      });

  } catch (error) {
      console.error('Error fetching payment data:', error);
  }
};
const fetchYearWisePerformanceData = async () => {
  try {
    // Fetch turnover data from payment_reference
    const userId = user?.userid;
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

    // Generate the final data array for display
    const allYears = new Set([...Object.keys(turnoverByYear), ...Object.keys(toBeClearedByYear)]);
    const finalData = Array.from(allYears).map(year => ({
      year,
      turnover: turnoverByYear[year] || 0,
      toBeCleared: toBeClearedByYear[year] || 0,
      creditDaysAvailed: 30, // Placeholder, replace with actual logic if needed
    }));

    // Update the state with the final data
    setPerformanceData(finalData);
  } catch (error) {
    console.error('Error fetching year-wise performance data:', error);
  }
};

const fetchTotalLitres = async () => {
  setLoading(true);
  const { data, error } = await supabase
    .from('user_request')
    .select('totalliters', { count: 'exact' })
    .eq('userid', user.userid) // filter by current user's ID
    .eq('role', 'mechanic');

  if (error) {
    console.error('Error fetching total litres:', error.message);
  } else if (data) {
    // Summing all 'totalliters'
    const sumLitres = data.reduce((sum, item) => sum + item.totalliters, 0);
    setTotalLitresCount(sumLitres);
  }
  const { data: rewardData, error: rewardError } = await supabase
    .from('users')
    .select('rewardpoints')
    .eq('userid', user.userid); // filter by current user's ID

  if (rewardError) {
    console.error('Error fetching reward points:', rewardError.message);
  } else if (rewardData?.length > 0) {
    setTotalRewards(rewardData[0].rewardpoints);
  }

  setLoading(false);
};

const fetchGiftItems = async () => {
  const { data, error } = await supabase
    .from('giftitem_master')
    .select('*')
    .eq('activestatus', 'Y');

  if (error) {
    console.error('Error fetching gift items:', error.message);
  } else {
    setGiftItems(data);
  }
};

  useEffect(() => {
    if (user && user?.role === 'representative') { // Check if the user is a representative
        fetchVisitData();
        fetchPaymentData();
    }
    if(user && user?.role === 'admin'){
      fetchWeeklyPerformance();
    }
    else{
      fetchWeeklyData();
    }

    if(user && user?.role === 'retailer'){
      fetchYearWisePerformanceData();
      fetchGiftItems();
    }
    if(user && user?.role === 'mechanic'){
      fetchTotalLitres();
      fetchGiftItems();
    }
}, [user]);

  const getDateRanges = () => {
    const today = new Date();
    const thisMonthName = today.toLocaleString("default", { month: "short" });
    const previousMonthDate = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const previousMonthName = previousMonthDate.toLocaleString("default", {
      month: "short",
    });
    const thisYear = today.getFullYear();
    const previousYear = thisYear - 1;

    return {
      thisMonthName,
      previousMonthName,
      thisYear,
      previousYear,
      startOfThisMonth: new Date(today.getFullYear(), today.getMonth(), 1),
      startOfPreviousMonth: new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      ),
      endOfPreviousMonth: new Date(today.getFullYear(), today.getMonth(), 0),
      startOfThisYear: new Date(today.getFullYear(), 0, 1),
      startOfPreviousYear: new Date(previousYear, 0, 1),
      endOfPreviousYear: new Date(previousYear, 11, 31),
    };
  };

  const fetchSegments = async () => {
    const { data: segments, error } = await supabase
      .from("segment_master")
      .select("*")
      .eq("activestatus", "Y"); // Filter active segments

    if (error) console.error("Error fetching segments:", error.message);
    else setSegments(segments);
  };

  const fetchCategories = async () => {
    const { data: categories, error } = await supabase
      .from("category_master")
      .select("*")
      .eq("activestatus", "Y"); // Filter active categories

    if (error) console.error("Error fetching categories:", error.message);
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
      const qty = item.totalliters;
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
      .from("invoices1")
      .select("updatedtime, totalliters, paidamount");

    if (error) {
      console.error("Error fetching invoices:", error.message);
      return;
    }

    // Get the current date
    const now = new Date();
    console.log("Current Date:", now);

    // Calculate the start of the current week (Sunday)
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Adjust to Sunday
    startOfCurrentWeek.setHours(0, 0, 0, 0); // Set time to midnight

    console.log("Start of Current Week (Sunday):", startOfCurrentWeek);

    // Create an array to hold totals for each week (Week 1 to Week 5)
    const weeklyData = Array(5)
      .fill()
      .map(() => ({ totalliters: 0, paidamount: 0 }));

    // Calculate the start and end date for each week
    const weekStartDates = Array(5)
      .fill()
      .map((_, i) => {
        const weekStart = new Date(startOfCurrentWeek);
        weekStart.setDate(weekStart.getDate() - i * 7); // Go back i weeks
        return weekStart;
      });

    // Process each invoice
    invoices.forEach((invoice) => {
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
    // console.log(weeklyData);
    // console.log(weeklyData.reverse());

    // Reverse the data to treat current week as Week 1, previous week as Week 2, etc.
    setWeeklyPerformance(weeklyData);
    // console.log(weeklyPerformance);
  };

  const fetchWeeklyData = async () => {
    try {
      const userId = user?.userid;
      if (!userId) throw new Error('User ID is missing');
  
      const currentDate = new Date();
      const fiveWeeksAgo = subWeeks(currentDate, 5);
  
      const isRepresentative = user?.role === 'representative';
  
      let orderData = [];
      let collectionData = [];
  
      if (isRepresentative) {
        // Fetch orders for representatives
        const { data: repData, error } = await supabase
          .from('represent_visiting1')
          .select('visitingdate, orders, amount')
          .eq('repid', userId)
          .order('visitingdate', { ascending: false });
  
        if (error) throw error;
        orderData = repData;
        collectionData = repData; // For representatives, orders and amount are fetched in one go
      } else {
        // Fetch orders for non-representatives
        const { data: userData, error: userError } = await supabase
          .from('user_request')
          .select('createdtime, totalliters')
          .eq('userid', userId)
          .order('createdtime', { ascending: false });
  
        if (userError) throw userError;
        orderData = userData;
  
        // Fetch collection for non-representatives
        const { data: visitingData, error: visitingError } = await supabase
          .from('represent_visiting1')
          .select('visitingdate, amount')
          .eq('visitorid', userId)
          .order('visitingdate', { ascending: false });
  
        if (visitingError) throw visitingError;
        collectionData = visitingData;
      }
  
      const weekOrderMap = new Map();
      const weekCollectionMap = new Map();
  
      // Process order data
      orderData.forEach((entry) => {
        const entryDate = new Date(isRepresentative ? entry.visitingdate : entry.createdtime);
        const weekStart = startOfWeek(entryDate, { weekStartsOn: 0 });
  
        if (isAfter(weekStart, fiveWeeksAgo)) {
          const weekKey = format(weekStart, 'yyyy-MM-dd');
  
          if (!weekOrderMap.has(weekKey)) {
            weekOrderMap.set(weekKey, {
              weekStart: weekStart,
              totalOrders: 0,
            });
          }
  
          const weekData = weekOrderMap.get(weekKey);
          if ('orders' in entry) weekData.totalOrders += entry.orders;
          if ('totalliters' in entry) weekData.totalOrders += entry.totalliters;
        }
      });
  
      // Process collection data
      collectionData.forEach((entry) => {
        const entryDate = new Date(entry.visitingdate);
        const weekStart = startOfWeek(entryDate, { weekStartsOn: 0 });
  
        if (isAfter(weekStart, fiveWeeksAgo)) {
          const weekKey = format(weekStart, 'yyyy-MM-dd');
  
          if (!weekCollectionMap.has(weekKey)) {
            weekCollectionMap.set(weekKey, {
              weekStart: weekStart,
              totalCollection: 0,
            });
          }
  
          const weekData = weekCollectionMap.get(weekKey);
          if ('amount' in entry) weekData.totalCollection += entry.amount;
        }
      });
  
      // Combine order and collection data
      const combinedData = new Map();
      [weekOrderMap, weekCollectionMap].forEach(map => {
        map.forEach((value, key) => {
          if (!combinedData.has(key)) {
            combinedData.set(key, { ...value, totalOrders: value.totalOrders || 0, totalCollection: value.totalCollection || 0 });
          } else {
            const combinedValue = combinedData.get(key);
            combinedValue.totalOrders += value.totalOrders || 0;
            combinedValue.totalCollection += value.totalCollection || 0;
          }
        });
      });
  
      // Convert map to an array, format, and sort
      const formattedData = Array.from(combinedData.values())
        .sort((a, b) => b.weekStart - a.weekStart)
        .slice(0, 5)
        .map((weekData, index) => ({
          week: `Week ${index + 1}`,
          order: weekData.totalOrders,
          collection: weekData.totalCollection,
          weekStart: format(weekData.weekStart, 'MMMM do, yyyy'),
        }));
  
      setWeeklyData(formattedData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const summaryDetails = async () => {
    try {
      // Fetch representatives from the users table
      const { data: reps, error: repsError } = await supabase
        .from("users")
        .select("userid, name, role")
        .eq("role", "representative");

      if (repsError) throw repsError;

      setRepresentatives(reps);

      
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date(todayStart);
      todayEnd.setHours(23, 59, 59, 999); 


      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payment_reference")
        .select("repid, paymode, amount")
        .eq("paymentstatus",'Approved')
        .gte("updatedtime", todayStart.toISOString())
        .lte("updatedtime", todayEnd.toISOString());

      if (paymentsError) throw paymentsError;

      setPayments(paymentsData);

      // Initialize an object to store totals by payment mode for each representative
      const paymentModes = ["Cheque", "UPI/IB", "Cash", "Adjustment"];
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
        if (
          dataByPaymode[paymode] &&
          dataByPaymode[paymode][repid] !== undefined
        ) {
          dataByPaymode[paymode][repid] += amount;
          totalByRep[repid] += amount;
        }
      });

      // Update the state with the computed data
      setMappedData(dataByPaymode);
      // console.log(dataByPaymode);
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
      .from("payment_approval")
      .select("chequedate, usershopname, amount")
      .eq("active", "Y"); // Select specific columns

    if (error) {
      console.error("Error fetching payment approvals:", error.message);
    } else {
      // Assuming you have a state or a way to use the fetched data
      setPaymentApprovals(payments);
    }
  };

  // const OutstandingAnalysis = async () => {
  //   const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  //   setTotalAmount(total);
  //   // Calculate the percentage for each column and round it to the nearest integer
  //   const percentages = Object.keys(data).map((key) => {
  //     return total > 0 ? Math.round((data[key] / total) * 100) : "0"; // Round to the nearest integer
  //   });

  //   setPercentageData(percentages);
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data, error } = await supabase
  //         .from("user_request_items")
  //         .select("*");

  //       if (error) {
  //         throw error;
  //       }

  //       // Calculate segment-wise quantities
  //       const { quantities: segmentQuantities, totals: segmentTotals } =
  //         getSegmentQuantities(data);
  //       setSegmentData(segmentQuantities);
  //       setTotalColumns(Object.keys(segmentTotals));
  //       setTotalSegmentValues(Object.values(segmentTotals));

  //       // Calculate category-wise quantities
  //       const { quantities: categoryQuantities, totals: categoryTotals } =
  //         getCategoryQuantities(data);
  //       setCategoryData(categoryQuantities);
  //       setTotalColumns(Object.keys(categoryTotals));
  //       setTotalCategoryValues(Object.values(categoryTotals));

  //       // Calculate segment-wise prices
  //       const { turnovers: segmentPrices, totals: segmentsTotals } =
  //         getSegmentTurnover(data);
  //       setSegmentPriceData(segmentPrices);
  //       setTotalColumns(Object.keys(segmentsTotals));
  //       setTotalSegmentPriceValues(Object.values(segmentsTotals));

  //       if (totalSegmentValues.length > 0) {
  //         const averages = totalSegmentPriceValues.map((totalPrice, i) => {
  //           const totalCount = totalSegmentValues[i];
  //           return totalCount === 0 ? 0 : totalPrice / totalCount;
  //         });        
  //         const roundedAverages = averages.map((avg) => Math.round(avg));
  //         setTotalSegmentPriceAvg(roundedAverages);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching data:", error.message);
  //     }
  //   };

  //   fetchSegments();
  //   fetchCategories();
  //   fetchData();
  //   fetchWeeklyPerformance();
  //   fetchPaymentApprovals();
  //   OutstandingAnalysis();
  //   summaryDetails();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const { data, error } = await supabase
        //   .from("user_request_items")
        //   .select("*");
        let query = supabase
          .from("user_request_items")
          .select("*");

        if (user?.role === "representative") {
          const { data: requestData, error: requestError } = await supabase
              .from("user_request")
              .select("reqid")
              .eq("createdby", user?.userid); // Assuming repid is the representative ID in user_request

            if (requestError) {
              console.error("Error fetching requests for representative:", requestError);
              return;
            }

          const reqIds = requestData.map((request) => request.reqid);
          query = query
            .in("reqid", reqIds);
          
        } else if (user?.role === "retailer" || user?.role === "mechanic") {
          query = query
            .eq("userid", user?.userid); // Use `eq` on the `userid` column
        }

        const { data, error } = await query;
  
        if (error) {
          throw error;
        }
  
        // console.log("Fetched Data:", data); // Log fetched data
  
        // Calculate segment-wise quantities and totals
        const { quantities: segmentQuantities, totals: segmentTotals } = getSegmentQuantities(data);
        // console.log("Segment Quantities:", segmentQuantities);
        // console.log("Segment Totals:", segmentTotals);
  
        // Calculate category-wise quantities and totals
        const { quantities: categoryQuantities, totals: categoryTotals } = getCategoryQuantities(data);
        // console.log("Category Quantities:", categoryQuantities);
        // console.log("Category Totals:", categoryTotals);
  
        // Calculate segment-wise prices and totals
        const { turnovers: segmentPrices, totals: segmentsTotals } = getSegmentTurnover(data);
        // console.log("Segment Prices:", segmentPrices);
        // console.log("Segment Totals for Prices:", segmentsTotals);
  
        // Update state
        setSegmentData(segmentQuantities);
        setCategoryData(categoryQuantities);
        setTotalColumns(Object.keys(categoryTotals));
        setTotalCategoryValues(Object.values(categoryTotals));
        const columnNames = Object.keys(segmentTotals);
        setTotalColumns(columnNames);
        setTotalSegmentValues(Object.values(segmentTotals));
        setSegmentPriceData(segmentPrices);
        setTotalSegmentPriceValues(Object.values(segmentsTotals));
  
        // Calculate averages
        const totalSegmentValues = Object.values(segmentTotals);
        const totalSegmentPriceValues = Object.values(segmentsTotals);
  
        if (totalSegmentValues.length > 0 && totalSegmentPriceValues.length > 0) {
          const averages = totalSegmentPriceValues.map((totalPrice, i) => {
            const totalCount = totalSegmentValues[i];
            return totalCount === 0 ? 0 : Math.round(totalPrice / totalCount);
          });
          // console.log("Calculated Averages:", averages); // Log calculated averages
          setTotalSegmentPriceAvg(averages);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
  
    // Fetch data and perform calculations
    fetchData();
    fetchSegments();
    fetchCategories();
    fetchPaymentApprovals();
    // OutstandingAnalysis();
    summaryDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Change format as needed
  };

  // Dummy data
  const username = user?.name;

  const averageAgeing = "35 Days";
  // const summaryOfTheDay = "Good progress with significant collections.";
  // const numberOfVisits = 5;
  // const numberOfAccounts = 12;
  // const totalLitres = 1500;
  // const cheque = 5;
  // const upi = 8;
  // const cash = 7;
  // const totalAmounts = 30000;

  const name = user?.name;
  const ironbox = "Special Ironbox Offer";
  const points = "1000 Points Earned";
  // const purchaseAnalysisData = [
  //   { sl: 1, mineral: 50, synth: 100, psy: 70, total: 220 },
  //   { sl: 2, mineral: 40, synth: 80, psy: 60, total: 180 },
  //   // Add more rows as necessary
  // ];

  // performanceData = [
  //   { sl: 1, year: 2021, turnover: 50000, toBeCleared: 10000, creditDays: 30 },
  //   { sl: 2, year: 2022, turnover: 60000, toBeCleared: 12000, creditDays: 40 },
  //   // Add more rows as necessary
  // ];

    // Dummy data
    const companyName = user?.name;
    // const totalLitresCount = 1200;
    // const totalRewards = 350;
    const pointsCount = 250;

  return (
    <main id="main" className="main">
      {user.role === "admin" ? (
        <>
          <h2>
            <center>Sales Quantity Analysis (Litres)</center>{" "}
          </h2>
          <h4>Categorywise :</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>Category</center>
                </th>
                {totalColumns.map((col, index) => (
                  <th key={index}>
                    <center>{col}</center>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td>
                    <center>{category.categoryname}</center>
                  </td>
                  {totalColumns.map((col, i) => (
                    <td key={i}>
                      <center>
                        {categoryData[category.categoryname] &&
                        categoryData[category.categoryname][col] !== undefined
                          ? categoryData[category.categoryname][col].toFixed(2)
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
                {totalCategoryValues.map((val, i) => (
                  <td key={i}>
                    <center>{val}</center>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <h4>Segmentwise :</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>Segment</center>
                </th>
                {totalColumns.map((col, index) => (
                  <th key={index}>
                    <center>{col}</center>
                  </th>
                ))}
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
                        {segmentData[segment.segmentname] &&
                        segmentData[segment.segmentname][col] !== undefined
                          ? segmentData[segment.segmentname][col].toFixed(2)
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
                    <center>{val.toFixed(2)}</center>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <h4>Weekly Performance:</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>Week</center>
                </th>
                <th>
                  <center>Orders (Liters)</center>
                </th>
                <th>
                  <center>Collections</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {weeklyPerformance.map((weekData, index) => (
                <tr key={index}>
                  <td>
                    <center>Week {index + 1}</center>
                  </td>
                  <td>
                    <center>{weekData.totalliters.toFixed(2)}</center>
                  </td>
                  <td>
                    <center>₹{weekData.paidamount.toFixed(2)}</center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Segmentwise Turnover:</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>Segment</center>
                </th>
                {totalColumns.map((col, index) => (
                  <th key={index}>
                    <center>{col}</center>
                  </th>
                ))}
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
                      ₹{segmentPriceData[segment.segmentname] &&
                        segmentPriceData[segment.segmentname][col] !== undefined
                          ? segmentPriceData[segment.segmentname][col].toFixed(2)
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
                {totalSegmentPriceValues.map((val, i) => (
                  <td key={i}>
                    <center>₹{val.toFixed(2)}</center>
                  </td>
                ))}
              </tr>
              <tr>
                <td>
                  <center>Avg</center>
                </td>
                {totalSegmentPriceAvg.map((avg, i) => (
                  <td key={i}>
                    <center>₹{avg.toFixed(2)}</center>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <h4>Outstanding Analysis:</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center></center>
                </th>
                <th>
                  <center>0-20 Days</center>
                </th>
                <th>
                  <center>21-40 Days</center>
                </th>
                <th>
                  <center>41-60 Days</center>
                </th>
                <th>
                  <center>61-75 Days</center>
                </th>
                <th>
                  <center>&gt;75 Days</center>
                </th>
                <th>
                  <center>Total</center>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <center>₹</center>
                </td>
                {Object.values(data).map((value, index) => (
                  <td key={index}>
                    <center>₹{value.toFixed(2)}</center>
                  </td>
                ))}
                <td>
                  <center>₹{totalAmount.toFixed(2)}</center>
                </td>
              </tr>
              <tr>
                <td>
                  <center>%</center>
                </td>
                {percentageData.map((percent, index) => (
                  <td key={index}>
                    <center>{percent}%</center>
                  </td>
                ))}
                <td>
                  <center>{percentageData.reduce((acc, curr) => acc + parseFloat(curr), 0)}%</center>
                </td>
              </tr>
            </tbody>
          </table>

          <h4>Upcoming Cheque Details:</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>Cheque Date</center>
                </th>
                <th>
                  <center>Retailer Name</center>
                </th>
                <th>
                  <center>Value</center>
                </th>
              </tr>
            </thead>
            <tbody>
              {paymentApprovals.map((paymentapproval, index) => (
                <tr key={index}>
                  <td>
                    <center>{formatDate(paymentapproval.chequedate)}</center>
                  </td>
                  <td>
                    <center>{paymentapproval.usershopname.trim()}</center>
                  </td>
                  <td>
                    <center>₹{paymentapproval.amount.toFixed(2)}</center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>DSR Summary of the Day:</h4>
          <table className="category-table">
            <thead>
              <tr>
                <th>
                  <center>DSR</center>
                </th>
                {representatives.map((rep) => (
                  <th key={rep.userid}>
                    <center>{rep.name}</center>
                  </th>
                ))}
                <th>
                  <center>Total</center>
                </th>{" "}
                {/* Add a column for totals */}
              </tr>
            </thead>
            <tbody>
              {Object.keys(mappedData).map((paymode) => (
                <tr key={paymode}>
                  <td>
                    <center>{paymode}</center>
                  </td>
                  {representatives.map((rep) => (
                    <td key={rep.userid}>
                      <center>₹{mappedData[paymode][rep.userid] || 0}</center>
                    </td>
                  ))}
                  <td>
                    <center>
                      {/* Display the total for this row across all representatives */}
                      ₹
                      {representatives.reduce(
                        (sum, rep) =>
                          sum + (mappedData[paymode][rep.userid] || 0),
                        0
                      ).toFixed(2)}
                    </center>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <center>
                    <strong>Total</strong>
                  </center>
                </td>
                {representatives.map((rep) => (
                  <td key={rep.userid}>
                    <center>
                      <strong>₹{totals[rep.userid].toFixed(2) || 0}</strong>
                    </center>
                  </td>
                ))}
                <td>
                  <center>
                    {/* Display the overall total sum of all representatives and all payment modes */}
                    <strong>
                      ₹
                      {Object.values(totals).reduce(
                        (sum, amount) => sum + amount,
                        0
                      ).toFixed(2)}
                    </strong>
                  </center>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : user.role  === "representative" ? (
        <>
          <div className="dashboard">
            <br />
            {/* First Child */}
            <h3 className="center-text" style={{ color: "darkorange" }}>
              Welcome, {username}
            </h3>
            <br />
            {/* Second Child */}
            <div className="analysis-section">
              <h4>Sales Quantity Analysis (Litres):</h4>
              <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>
                        <center>Category</center>
                      </th>
                      {totalColumns.map((col, index) => (
                        <th key={index}>
                          <center>{col}</center>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>
                          <center>{category.categoryname}</center>
                        </td>
                        {totalColumns.map((col, i) => (
                          <td key={i}>
                            <center>
                              {categoryData[category.categoryname] &&
                              categoryData[category.categoryname][col] !== undefined
                                ? categoryData[category.categoryname][col].toFixed(2)
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
                      {totalCategoryValues.map((val, i) => (
                        <td key={i}>
                          <center>{val.toFixed(2)}</center>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
            </div>

            {/* Third Child */}
            <div className="performance-section">
              <h4>Weekly Performance:</h4>
              {/* <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Week</th>
                    <th>Orders (Litres)</th>
                    <th>Collection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Week 1</td>
                    <td>300</td>
                    <td>₹200</td>
                  </tr>
                </tbody>
              </table> */}
              <table className="responsive-table">
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
                    <td>{data.order.toFixed(2)}</td>
                    <td>₹{data.collection.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            {/* Fourth Child */}
            <div className="outstanding-analysis-section">
              {/* <h4>Outstanding Analysis:</h4> */}
              {/* <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>0-20 Days</th>
                    <th>21-40 Days</th>
                    <th>41-60 Days</th>
                    <th>61-75 Days</th>
                    <th>75 Days</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>₹</td>
                    <td>₹100</td>
                    <td>₹80</td>
                    <td>₹60</td>
                    <td>₹40</td>
                    <td>₹20</td>
                    <td>₹300</td>
                  </tr>
                </tbody>
              </table> */}
              <h4>Outstanding Analysis:</h4>
              <table className="category-table">
                <thead>
                  <tr>
                    <th>
                      <center></center>
                    </th>
                    <th>
                      <center>0-20 Days</center>
                    </th>
                    <th>
                      <center>21-40 Days</center>
                    </th>
                    <th>
                      <center>41-60 Days</center>
                    </th>
                    <th>
                      <center>61-75 Days</center>
                    </th>
                    <th>
                      <center>&gt;75 Days</center>
                    </th>
                    <th>
                      <center>Total</center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <center>₹</center>
                    </td>
                    {Object.values(data).map((value, index) => (
                      <td key={index}>
                        <center>₹{value.toFixed(2)}</center>
                      </td>
                    ))}
                    <td>
                      <center>₹{totalAmount.toFixed(2)}</center>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <center>%</center>
                    </td>
                    {percentageData.map((percent, index) => (
                      <td key={index}>
                        <center>{percent}%</center>
                      </td>
                    ))}
                    <td>
                      <center>{percentageData.reduce((acc, curr) => acc + parseFloat(curr), 0)}%</center>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <h5 style={{ color: "darkorange" }}>
                Average Ageing: {averageAgeing}
              </h5>
              {/* <br/>
              <h5>Summary of the Day: {summaryOfTheDay}</h5>
              <br /> */}
            </div>

            {/* Fifth Child */}
            {/* <div className="summary-section center-text p-5">
              <div>
                <h6>Number of visits: {visitData.numberOfVisits}</h6>
                <br />
                <div>
                  <h5 style={{ color: "darkorange" }}>Number Of Orders:</h5>
                  <ul>
                    <li>Number of Accounts: {visitData.numberOfAccounts}</li>
                    <li>Total Litres: {visitData.totalLitres}</li>
                  </ul>
                </div>

                <div>
                  <h5 style={{ color: "darkorange" }}>Number of Payments:</h5>
                  <ul>
                    <li>Cheque: ₹ {paymentData.cheque}</li>
                    <li>UPI: ₹ {paymentData.upi}</li>
                    <li>Cash: ₹ {paymentData.cash}</li>
                    <li>Adjustment: ₹ {paymentData.adjustment}</li>
                  </ul>
                </div>
                <h5 style={{ color: "darkorange" }}>
                  Total Amount: ₹ {paymentData.totalAmounts}
                </h5>
              </div>
            </div> */}
            <Card className="summary-section center-text" style={{ padding: '1rem' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRadius: '15px' }}>
                <Card.Title className="text-center" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Summary of the Day
                </Card.Title>

                {/* Visits Section */}
                <Card.Text style={{ margin: 0 }}>
                  <h6 style={{ margin: '0.25rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>No. of visits:</span>
                    <span>{visitData.numberOfVisits}</span>
                  </h6>
                  
                  {/* Orders Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                    <div>
                      <h5 style={{ color: 'red', fontSize: '1rem', margin: '0.25rem 0', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Number Of Orders:</span>
                        <span></span>
                      </h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>No. of Accounts:</span>
                        <span>{visitData.numberOfAccounts}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Litres:</span>
                        <span>{visitData.totalLitres}</span>
                      </div>
                    </div>

                    {/* Payments Section */}
                    <div>
                      <h5
                        style={{
                          color: 'red',
                          fontSize: '1rem',
                          margin: '0.25rem 0',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>Number of Payments:</span>
                        <span></span>
                      </h5>

                      {['Cheque', 'UPI/IB', 'Cash', 'Adjustment'].map((method) => {
                        let paymentKey = method.toLowerCase(); // By default, map the method to lowercase key
                        if (method === 'UPI/IB') {
                          paymentKey = 'upi'; // Special case for 'UPI/IB'
                        }
                        return (
                          <div key={method} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{method}:</span>
                            <span>₹ {paymentData[paymentKey].toFixed(2) || 0}</span> {/* Show 0 if no value exists */}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total Amount Section */}
                  <h5 style={{ color: 'red', fontSize: '1rem', margin: '0.5rem 0 0.25rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Amount:</span>
                    <span>₹ {paymentData.totalAmounts.toFixed(2)}</span>
                  </h5>
                </Card.Text>
              </Card.Body>
            </Card>

          </div>
        </>
      ) : user.role  === "retailer" ? (
        <>
          <div className="dashboard">
            {/* First child: H4 Tag with username */}
            <h3>{`Welcome, ${name}`}</h3>

            {/* Second child: Offers Section */}
            <h5>Offers:</h5>

            {/* Third child: Ironbox and Points */}
            <div className="mechanic-dashboard-offers">
            {giftItems.map((item) => (
                <div key={item.id} className="reward-box">
                  <div className="reward-info">
                    <h5 className="item-name">{item.itemname}</h5> {/* Display item name */}
                    <h6 className="redeem-points">Redeem Points: {item.redeempoints}</h6> {/* Display required redeem points */}
                  </div>
                </div>
              ))}
            </div>

            {/* Fourth child: Purchase Analysis */}
            <div className="analysis-section">
              <h4>Purchase Analysis (Litres):</h4>
              {/* <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Mineral</th>
                    <th>Synth</th>
                    <th>PSY</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseAnalysisData.map((data, index) => (
                    <tr key={index}>
                      <td>{data.sl}</td>
                      <td>{data.mineral}</td>
                      <td>{data.synth}</td>
                      <td>{data.psy}</td>
                      <td>{data.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>
                        <center>Category</center>
                      </th>
                      {totalColumns.map((col, index) => (
                        <th key={index}>
                          <center>{col}</center>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>
                          <center>{category.categoryname}</center>
                        </td>
                        {totalColumns.map((col, i) => (
                          <td key={i}>
                            <center>
                              {categoryData[category.categoryname] &&
                              categoryData[category.categoryname][col] !== undefined
                                ? categoryData[category.categoryname][col].toFixed(2)
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
                      {totalCategoryValues.map((val, i) => (
                        <td key={i}>
                          <center>{val.toFixed(2)}</center>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
            </div>

            {/* Fifth child: Performance Data */}
            <div className="performance-section">
              <h6>Performance Data:</h6>
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Year</th>
                    <th>Turn Over</th>
                    <th>To be Cleared</th>
                    <th>Credit Days Availed</th>
                  </tr>
                </thead>
                <tbody>
                {performanceData.map((data, index) => (
                  <tr key={index+1}>
                    <td>{index+1}</td>
                    <td>{data.year}</td>
                    <td>₹{data.turnover.toFixed(2)}</td>
                    <td>₹{data.toBeCleared.toFixed(2)}</td>
                    <td>{data.creditDaysAvailed}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {/* <div className="recovery-section">
              {recoveryData.length > 0 && (
                <>
                  <h5>Recovery Data:</h5>
                  <table className="responsive-table">
                    <thead>
                      <tr>
                        <th>Inv.No.</th>
                        <th>Date</th>
                        <th>Value</th>
                        <th>Balance</th>
                        <th>Due Days</th>
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
                  </table>
                </>
              )}
            </div> */}
          </div>
        </>
      ) : user.role  === "mechanic" ? (
        <>
          {" "}
          <div className="mechanic-dashboard">
            {/* First Child - Company Name */}
            <h2 className="mechanic-company-name">{companyName}</h2>

            {/* Second Child - Two boxes with border, shadow, and fixed width */}
            <div className="mechanic-dashboard-metrics">
              {/* First Box */}
              <div className="mechanic-dashboard-box">
                <div className="mechanic-content">
                  <h5>{totalLitresCount.toFixed(2)}</h5>
                  <h5>Total Litres</h5>
                </div>
              </div>
              {/* Second Box */}
              <div className="mechanic-dashboard-box">
                <div className="mechanic-content">
                  <h5>{totalRewards}</h5>
                  <h5>Total Rewards</h5>
                </div>
              </div>
            </div>

            {/* Third Child - Offers */}
            <h4 className="mechanic-offers-title" style={{textAlign:"left", color:"darkorange"}}>Offers:</h4>

            {/* Fourth Child - Iron Box and Points */}
            <div className="mechanic-dashboard-offers">
              {giftItems.map((item) => (
                <div key={item.id} className="reward-box">
                  <div className="reward-info">
                    <h5 className="item-name">{item.itemname}</h5> {/* Display item name */}
                    <h6 className="redeem-points">Redeem Points: {item.redeempoints}</h6> {/* Display required redeem points */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
