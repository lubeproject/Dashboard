// import React, { useState, useEffect } from 'react';
// import { supabase } from '../../../supabaseClient';
// import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import norecordfound from "../../../images/norecordfound.gif";
// import "./SalesReportMechanicwiseItemwise.css";

// export default function SalesReportMechanicwiseItemwise() {
//   const [itemsOptions, setItemsOptions] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     const fetchItems = async () => {
//       const { data, error } = await supabase
//         .from('item_master')
//         .select('itemid, itemname');

//       if (error) console.error('Error fetching Items:', error);
//       else setItemsOptions(data.map(item => ({ value: item.itemid, label: item.itemname })));
//     };
    
//     fetchItems();;
//   }, []);

//     const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate().toString().padStart(2, '0');
//     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`; // Change format as needed
//   };

//   // const handleFilter = async () => {
//   //   if (!selectedMechanic) {
//   //     alert("Please select a mechanic.");
//   //     return;
//   //   }

//   //   let query = supabase
//   //     .from('user_request_items')
//   //     .select('*')
//   //     .eq('userid', selectedMechanic.value);
//   //   if (startDate && endDate) {
//   //     if (startDate > endDate) {
//   //       alert("Pick From Date cannot be later than Pick To Date.");
//   //       return;
//   //     }
//   //     query = query.gte('date', startDate).lte('date', endDate);
//   //   }

//   //   const { data, error } = await query;

//   //   if (error) {
//   //     console.error('Error fetching filtered data:', error);
//   //   } else {
//   //     setFilteredData(data);
//   //   }
//   // };
//   const handleFilter = async () => {
//     try {
//       // Fetch all records for the selected item
//       const { data: allRequests, error: requestError } = await supabase
//         .from('user_request_items')
//         .select('*')
//         .eq('itemid', selectedItem.value);

//       if (requestError) {
//         console.error('Error fetching requests:', requestError);
//         return;
//       }

//       console.log("All Requests for Item:", allRequests);

//       // Extract reqid values
//       const reqIdArray = allRequests.map(request => request.reqid);

//       if (reqIdArray.length === 0) {
//         console.warn('No requests found for the selected item.');
//         setFilteredData([]);
//         return;
//       }

//       // Fetch corresponding user_request data to get user details
//       const { data: allUserRequests, error: userError } = await supabase
//         .from('user_request')
//         .select('userid, username,usershopname, reqid,role')
//         .eq('role','mechanic')
//         .in('reqid', reqIdArray);

//       if (userError) {
//         console.error('Error fetching user data:', userError);
//         return;
//       }

//       // Merge user data with items data
//       const mergedData = allRequests.map(item => {
//         const user = allUserRequests.find(user => user.reqid === item.reqid);
//         return { ...item, username: user ? user.username : 'Unknown', usershopname: user ? user.usershopname : 'Unknown' };
//       });

//       console.log("Merged Data with User Info:", mergedData);

//       // Apply Order Status Filter
//       let filteredItems = mergedData;

//       // Apply Date Range Filter
//       let dateFilteredItems = filteredItems;

//       if (startDate && endDate) {
//         if (new Date(startDate) > new Date(endDate)) {
//           alert("Pick From Date cannot be later than Pick To Date.");
//           return;
//         }
//         dateFilteredItems = filteredItems.filter(item => {
//           const itemDate = new Date(item.updatedtime); // Convert the date string to a Date object
//           return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
//         });
//         console.log("Date Range Filter Applied:", startDate, "to", endDate);
//       } else if (startDate) {
//         dateFilteredItems = filteredItems.filter(item => {
//           const itemDate = new Date(item.updatedtime);
//           return itemDate >= new Date(startDate);
//         });
//         console.log("Start Date Filter Applied:", startDate);
//       } else if (endDate) {
//         dateFilteredItems = filteredItems.filter(item => {
//           const itemDate = new Date(item.updatedtime);
//           return itemDate <= new Date(endDate);
//         });
//         console.log("End Date Filter Applied:", endDate);
//       }

//       // Set the filtered items data to state
//       setFilteredData(dateFilteredItems || []);
//       console.log("Final Filtered Items Data:", dateFilteredItems);

//     } catch (error) {
//       console.error('Unexpected error during filtering:', error);
//     }
//   };


//   const handleReset = () => {
//     setSelectedItem(null);
//     setStartDate(null);
//     setEndDate(null);
//     setFilteredData([]);
//   };

//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: !selectedItem ? 'red' : provided.borderColor,
//       '&:hover': {
//         borderColor: !selectedItem ? 'red' : provided.borderColor,
//       },
//     }),
//   };

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./SalesReportMechanicwiseItemwise.css";

export default function SalesReportMechanicwiseItemwise() {
  const [itemsOptions, setItemsOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Track logged-in user details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch logged-in user details
    const fetchUser = async () => {
      const { data: user, error } = await supabase.auth.getUser(); // Fetch user details from Supabase Auth
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setCurrentUser(user);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('item_master')
        .select('itemid, itemname');

      if (error) console.error('Error fetching Items:', error);
      else setItemsOptions(data.map(item => ({ value: item.itemid, label: item.itemname })));
    };

    fetchItems();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleFilter = async () => {
    try {
      // Step 1: Fetch from user_request table where role is mechanic
      const { data: userRequests, error: userRequestError } = await supabase
        .from('user_request')
        .select('userid, username, usershopname, reqid, role')
        .eq('role', 'mechanic');

      if (userRequestError) {
        console.error('Error fetching user requests:', userRequestError);
        return;
      }

      // Get reqids from the fetched user requests
      const reqIds = userRequests.map(request => request.reqid);

      if (reqIds.length === 0) {
        console.warn('No requests found for mechanics.');
        setFilteredData([]);
        return;
      }

      // Step 2: Fetch from user_request_items table based on the selected item and reqids
      const { data: requestItems, error: requestItemsError } = await supabase
        .from('user_request_items')
        .select('*')
        .eq('itemid', selectedItem.value)
        .in('reqid', reqIds);

      if (requestItemsError) {
        console.error('Error fetching request items:', requestItemsError);
        return;
      }

      // Merge requestItems with userRequests
      const mergedData = requestItems.map(item => {
        const user = userRequests.find(request => request.reqid === item.reqid);
        return { ...item, username: user ? user.username : 'Unknown', usershopname: user ? user.usershopname : 'Unknown' };
      });

      let filteredItems = mergedData;
      let dateFilteredItems = filteredItems;

      // Filter by start and end date
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          alert("Pick From Date cannot be later than Pick To Date.");
          return;
        }
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
      } else if (startDate) {
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate >= new Date(startDate);
        });
      } else if (endDate) {
        dateFilteredItems = filteredItems.filter(item => {
          const itemDate = new Date(item.updatedtime);
          return itemDate <= new Date(endDate);
        });
      }

      setFilteredData(dateFilteredItems || []);
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };

  const handleReset = () => {
    setSelectedItem(null);
    setStartDate(null);
    setEndDate(null);
    setFilteredData([]);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedItem ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedItem ? 'red' : provided.borderColor,
      },
    }),
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Itemwise Mechanic Sales Report</h4>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group controlId="formRetailer">
            <Select
              value={selectedItem}
              onChange={setSelectedItem}
              options={itemsOptions}
              placeholder="Select Item"
              styles={customSelectStyles}
            />
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
                      <th>Order</th>
                      <th>Account</th>
                      <th>Total Liters</th>
                      <th>Total Price</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item) => (
                      <tr key={item.reqid}>
                        <td>{item.reqid} / {formatDate(item.createdtime)}</td>
                        <td>
                        <span>{item.usershopname}</span><br/>
                          <span>{item.username}</span>
                        </td>
                        <td>{item.totalliters}</td>
                        <td>₹{item.totalprice}</td>
                        <td>{item.orderstatus}</td>
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
