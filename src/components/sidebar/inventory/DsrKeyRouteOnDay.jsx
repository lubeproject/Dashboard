// import React, { useState } from 'react';
// import { Table, Form, Button, Container } from 'react-bootstrap';
// import { FaChevronRight } from "react-icons/fa";
// import "./dsrKeyRouteOnDay.css";
// import { useNavigate } from 'react-router-dom';

// export default function DsrKeyRouteOnDay() {
//   const data = {
//     Monday: [
//       { sl: 1, account: 'Mahalakshmi', category: 'retailer', visitingday: 'Monday' },
//       { sl: 2, account: 'Ranga', category: 'mechanic', visitingday: 'Monday' },
//     ],
//     Tuesday: [
//       { sl: 1, account: 'Mahalakshmi dhevi', category: 'mechanic', visitingday: 'Tuesday' },
//       { sl: 2, account: 'Ranga naadhan', category: 'retailer', visitingday: 'Tuesday' },
//     ],
//   };

//   const [selectedDay, setSelectedDay] = useState('');
//   const [tableData, setTableData] = useState([]);

//   const navigate = useNavigate();

//   const handleDayChange = (event) => {
//     const day = event.target.value;
//     setSelectedDay(day);
//     setTableData(data[day] || []);
//   };

//   return (
//     <main id='main' className='main'>
//       <h3 className='text-center mt-2' >DSR Key Route On Day</h3>
//       <Container fluid>
//         <Form.Group controlId="daySelect">
//           <Form.Label>Select Day</Form.Label>
//           <Form.Control as="select" value={selectedDay} onChange={handleDayChange} style={{border: "1px solid darkblue"}}>
//             <option value="">Select a Day</option>
//             <option value="Monday">Monday</option>
//             <option value="Tuesday">Tuesday</option>
//             <option value="Wednesday">Wednesday</option>
//             <option value="Thursday">Thursday</option>
//             <option value="Friday">Friday</option>
//             <option value="Saturday">Saturday</option>
//             <option value="Sunday">Sunday</option>
//           </Form.Control>
//         </Form.Group>
// <br />
// <br />
//         {selectedDay && tableData.length > 0 && (
//           <div className="table-responsive">
//             <Table striped bordered hover className="full-width-table">
//               <thead>
//                 <tr >
//                   <th style={{backgroundColor:"darkorange", color:"white"}}>SL</th>
//                   <th style={{backgroundColor:"darkorange", color:"white"}}>Account</th>
                  
//                   <th style={{backgroundColor:"darkorange", color:"white"}}>Visiting Day</th>
//                   <th style={{backgroundColor:"darkorange", color:"white"}}>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.map((item, index) => (
//                   <tr key={index} >
//                     <td >{item.sl}</td>
//                     <td>{item.account} <br/> <span style={{color:"darkblue"}}>{item.category}</span></td>
                   
//                     <td>{item.visitingday}</td>
//                     <td>
//                       <Button variant="secondary" size="sm" className="details-button"style={{color:"white"}} onClick={()=> navigate("/portal/retailer-summary")}>
//                       <b>  Details </b> <FaChevronRight />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         )}
//       </Container>
//     </main>
//   );
// }
import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Button, Container } from 'react-bootstrap';
import { FaChevronRight } from "react-icons/fa";
import { supabase } from '../../../supabaseClient';
import "./dsrKeyRouteOnDay.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Select from 'react-select';

export default function DsrKeyRouteOnDay() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [daysOptions, setDaysOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { user } = useContext(UserContext); // Get user context
  const navigate = useNavigate();
  const location = useLocation();
  

  const selectedDsr = user?.name;

  useEffect(() => {
    // Check if there's relevant state to apply filters automatically
    if (location.state && location.state.selectedDay) {
      const {selectedDsr,selectedDay} = location.state;
      // Update local state with these values
      setSelectedDay(selectedDay);
      // Convert dates to appropriate format or use as is if already in Date format
    }
  }, [location.state]);

  useEffect(() => {
    const fetchDays = async () => {
      try {
        const { data, error } = await supabase
          .from('visiting_days')
          .select('visitingdayid, visitingday');
  
        if (error) {
          console.error('Error fetching Visiting Days:', error);
          return;
        }
  
        if (data && data.length > 0) {
          setDaysOptions(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
        } else {
          console.warn('No visiting days found');
        }
      } catch (err) {
        console.error('Error fetching Visiting Days:', err);
      }
    };
  
    fetchDays();
  }, []);

  const handleDayChange = async (selectedOption) => {
    const dayId = selectedOption.value;
    setSelectedDay(selectedOption);

    // Fetch data for the current representative based on the selected day
    let query = supabase
      .from('representassigned_master')
      .select('*')
      .eq('representativeid', user?.userid)
      .eq('visitingdayid', dayId);

      const { data, error } = await query;
    if (error) {
      console.error('Error fetching data for the representative:', error);
      setTableData([]); // Clear table data on error
    } else {
      // Map the fetched data to match the required format
      const formattedData = data.map((item, index) => ({
        sl: index + 1,
        account: item.shopname || 'N/A',
        category: item.role || 'N/A',
        visitingday: selectedOption.label,
        visitorid: item.visitorid // Include visitor ID for navigation
      }));
      setTableData(formattedData);
    }
  };

  const handleDetailsClick = (userId) => {
    navigate(`/portal/retailer-summary`,{state:{userId,selectedDsr,selectedDay}});
  };

  return (
    <main id='main' className='main'>
      <h3 className='text-center mt-2'>DSR Key Route On Day</h3>
      <Container fluid>
        <Form.Group controlId="formDay">
          <Form.Label>Select Visiting Day</Form.Label>
          <Select
            value={selectedDay}
            onChange={handleDayChange}
            options={daysOptions}
            placeholder="Select Visiting Day"
            required
          />
          {!selectedDay && (
            <p className="text-danger">Please select a Visiting Day.</p>
          )}
        </Form.Group>
        <br />
        {selectedDay && tableData.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover className="full-width-table">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "darkorange", color: "white" }}>SL</th>
                  <th style={{ backgroundColor: "darkorange", color: "white" }}>Account</th>
                  <th style={{ backgroundColor: "darkorange", color: "white" }}>Visiting Day</th>
                  <th style={{ backgroundColor: "darkorange", color: "white" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.sl}</td>
                    <td>{item.account} <br /> <span style={{ color: "darkblue" }}>{item.category}</span></td>
                    <td>{item.visitingday}</td>
                    <td>
                      {item.category === 'retailer' ? (
                        <Button variant="warning" size="sm" className="details-button" onClick={() => handleDetailsClick(item.visitorid)}>
                          <b>Details</b> <FaChevronRight />
                        </Button>
                        ) : null
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        {selectedDay && tableData.length === 0 && (
          <p className="text-center">No data found for the selected day.</p>
        )}
      </Container>
    </main>
  );
}
