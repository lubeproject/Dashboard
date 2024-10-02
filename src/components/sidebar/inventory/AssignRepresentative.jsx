// // import React from 'react';
// // import "./assignRepresentative.css";

// // export default function AssignRepresentative() {
// //   return (
// //     <main id='main' className='main'>
// //     <div>AssignRepresentative</div>
// // </main>
// //   )
// // }

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
// import { supabase } from '../../../supabaseClient'; // Import your Supabase client
// import Select from 'react-select';
// import { FaFilter } from 'react-icons/fa';
// import './assignRepresentative.css';

// export default function AssignRepresentative() {
//   const [representatives, setRepresentatives] = useState([]);
//   const [shopNames, setShopNames] = useState([]);
//   const [visitingDays, setVisitingDays] = useState([]);
//   const [selectedRole, setSelectedRole] = useState('Mechanic'); // Default is Mechanic
//   const [selectedRepresentative, setSelectedRepresentative] = useState(null);
//   const [selectedShopName, setSelectedShopName] = useState(null);
//   const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch representatives from the database
//     const fetchRepresentatives = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, name')
//         .eq('role', 'representative');

//       if (error) console.error('Error fetching representatives:', error);
//       else setRepresentatives(data.map(rep => ({ value: rep.userid, label: rep.name })));
//     };

//     // Fetch visiting days from the database
//     const fetchVisitingDays = async () => {
//       const { data, error } = await supabase
//         .from('visiting_days')
//         .select('visitingdayid, visitingday');

//       if (error) console.error('Error fetching visiting days:', error);
//       else setVisitingDays(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
//     };

//     fetchRepresentatives();
//     fetchVisitingDays();
//   }, []);

//   useEffect(() => {
//     // Fetch shop names based on selected role
//     const fetchShopNames = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, shopname, name') // Fetch shopname and name
//         .eq('role', selectedRole.toLowerCase());

//       if (error) console.error(`Error fetching ${selectedRole} shop names:`, error);
//       else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, name: shop.name })));
//     };

//     fetchShopNames();

//     // Reset state when role changes
//     setSelectedRepresentative(null);
//     setSelectedShopName(null);
//     setSelectedVisitingDay(null);
//   }, [selectedRole]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     // Check if all required fields are selected
//     if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
//       console.error('Please select all required fields.');
//       return;
//     }
  
//     // Debugging: Log the selected values
//     console.log('Selected Representative:', selectedRepresentative);
//     console.log('Selected Shop Name:', selectedShopName);
//     console.log('Selected Visiting Day:', selectedVisitingDay);
  
//     // Ensure that `name` and `value` are accessible
//     const visitorName = selectedShopName ? selectedShopName.name : 'Unknown';
//     const visitorId = selectedShopName ? selectedShopName.value : null;
  
//     const assignmentData = {
//       representativename: selectedRepresentative.label,
//       representativeid: selectedRepresentative.value,
//       role: selectedRole,
//       visitor: visitorName, // Ensure visitor has a value
//       shopname: selectedShopName.label,
//       visitingdayid: selectedVisitingDay.value, // visitingdayid of visitingday
//       visitingday: selectedVisitingDay.label,
//       visitorid: visitorId, // userid of shopname
//       active: 'Y',
//       lastupdatetime: new Date().toISOString(),
//       created: new Date().toISOString(),
//     };
  
//     console.log('Assignment Data:', assignmentData); // Log the data being sent to Supabase
  
//     const { data, error } = await supabase
//       .from('representassigned_master') // Replace with your table name
//       .insert([assignmentData]);
  
//     if (error) {
//       console.error('Error saving assignment:', error);
//     } else {
//       console.log('Assignment saved:', data);
//       setAssignments([...assignments, assignmentData]);
//     }
//   };
  
//   const handleFilterClick = () => {
//     // Navigate to the filter page (Implement the actual navigation logic)
//     console.log('Filter icon clicked. Navigate to filter page.');
//     navigate("/portal/filterAssignRepresentative");
//   };

//   return (
//   //   <main className='main' style={{ paddingTop: '60px' }}>
//   //     <Container className="mt-4">
//   //       <Row className="align-items-center">
//   //         <Col>
//   //           <h5>Assign Representative</h5>
//   //         </Col>
          
//   //       </Row>

//   //       <Form onSubmit={handleSubmit} className="mt-4">
//   //         <Form.Group as={Row} controlId="roleSelect">
//   //           <Form.Label column sm="2">
//   //             Choose One
//   //           </Form.Label>
//   //           <Col sm="10">
//   //             <div>
//   //               <Form.Check
//   //                 inline
//   //                 label="Mechanic"
//   //                 type="radio"
//   //                 value="Mechanic"
//   //                 checked={selectedRole === 'Mechanic'}
//   //                 onChange={(e) => setSelectedRole(e.target.value)}
//   //               />
//   //               <Form.Check
//   //                 inline
//   //                 label="Retailer"
//   //                 type="radio"
//   //                 value="Retailer"
//   //                 checked={selectedRole === 'Retailer'}
//   //                 onChange={(e) => setSelectedRole(e.target.value)}
//   //               />
//   //             </div>
//   //           </Col>
//   //         </Form.Group>

//   //         <Form.Group as={Row} controlId="representativeSelect">
//   //           <Form.Label column sm="2">
//   //             Representative
//   //           </Form.Label>
//   //           <Col sm="10">
//   //             <Select
//   //               value={selectedRepresentative}
//   //               onChange={setSelectedRepresentative}
//   //               options={representatives}
//   //               placeholder="Select a Representative"
//   //             />
//   //           </Col>
//   //         </Form.Group>

//   //         <Form.Group as={Row} controlId="shopNameSelect">
//   //           <Form.Label column sm="2">
//   //             {selectedRole} Shop Name
//   //           </Form.Label>
//   //           <Col sm="10">
//   //             <Select
//   //               value={selectedShopName}
//   //               onChange={setSelectedShopName}
//   //               options={shopNames}
//   //               placeholder={`Select a ${selectedRole} Shop Name`}
//   //             />
//   //           </Col>
//   //         </Form.Group>

//   //         <Form.Group as={Row} controlId="visitingDaySelect">
//   //           <Form.Label column sm="2">
//   //             Visiting Day
//   //           </Form.Label>
//   //           <Col sm="10">
//   //             <Select
//   //               value={selectedVisitingDay}
//   //               onChange={setSelectedVisitingDay}
//   //               options={visitingDays}
//   //               placeholder="Select a Visiting Day"
//   //             />
//   //           </Col>
//   //         </Form.Group>
//   //         <Row className="justify-content-end">
//   //           <center>
//   //           <Col sm="2">
//   //             <Button type="submit" variant="primary" block>
//   //               Assign
//   //             </Button>
//   //           </Col>
//   //           </center>
//   //           <Col className="text-right">
//   //           <FaFilter className="filter-icon" onClick={handleFilterClick} style={{ cursor: 'pointer', fontSize: '18px' }} />
//   //         </Col>
          
//   //         </Row>
//   //       </Form>

//   //       <Table striped bordered hover className="mt-4">
//   //         <thead>
//   //           <tr>
//   //             <th>Sl No.</th>
//   //             <th>Representative</th>
//   //             <th> Shop Name</th>
//   //             <th> Role</th>
//   //             <th>Visiting Day</th>
//   //           </tr>
//   //         </thead>
//   //         <tbody>
//   //           {assignments.map((assignment, index) => (
//   //             <tr key={index}>
//   //               <td>{index + 1}</td>
//   //               <td>{assignment.representativename}</td>
//   //               <td>{assignment.shopname}</td>
//   //               <td>{assignment.role}</td>
//   //               <td>{assignment.visitingday}</td>
//   //             </tr>
//   //           ))}
//   //         </tbody>
//   //       </Table>
//   //     </Container>
//   //   </main>
//   // );
//   <main className='main' style={{ paddingTop: '60px' }}>
//       <Container className="mt-4">
//         <Row className="align-items-center">
//           <Col>
//             <h5>Assign Representative</h5>
//           </Col>
//         </Row>

//         <Form onSubmit={handleSubmit} className="mt-4">
//           <Row>
//             <Col sm="6">
//               <Form.Group as={Row} controlId="roleSelect">
//                 <Form.Label column sm="4">
//                   Choose One
//                 </Form.Label>
//                 <Col sm="8">
//                   <div>
//                     <Form.Check
//                       inline
//                       label="Mechanic"
//                       type="radio"
//                       value="Mechanic"
//                       checked={selectedRole === 'Mechanic'}
//                       onChange={(e) => setSelectedRole(e.target.value)}
//                     />
//                     <Form.Check
//                       inline
//                       label="Retailer"
//                       type="radio"
//                       value="Retailer"
//                       checked={selectedRole === 'Retailer'}
//                       onChange={(e) => setSelectedRole(e.target.value)}
//                     />
//                   </div>
//                 </Col>
//               </Form.Group>
//             </Col>
//             <Col sm="6">
//               <Form.Group as={Row} controlId="representativeSelect">
//                 <Form.Label column sm="4">
//                   Representative
//                 </Form.Label>
//                 <Col sm="8">
//                   <Select
//                     value={selectedRepresentative}
//                     onChange={setSelectedRepresentative}
//                     options={representatives}
//                     placeholder="Select a Representative"
//                   />
//                 </Col>
//               </Form.Group>
//             </Col>
//           </Row>

//           <Row>
//             <Col sm="6">
//               <Form.Group as={Row} controlId="shopNameSelect">
//                 <Form.Label column sm="4">
//                   {selectedRole} Shop Name
//                 </Form.Label>
//                 <Col sm="8">
//                   <Select
//                     value={selectedShopName}
//                     onChange={setSelectedShopName}
//                     options={shopNames}
//                     placeholder={`Select a ${selectedRole} Shop Name`}
//                   />
//                 </Col>
//               </Form.Group>
//             </Col>
//             <Col sm="6">
//               <Form.Group as={Row} controlId="visitingDaySelect">
//                 <Form.Label column sm="4">
//                   Visiting Day
//                 </Form.Label>
//                 <Col sm="8">
//                   <Select
//                     value={selectedVisitingDay}
//                     onChange={setSelectedVisitingDay}
//                     options={visitingDays}
//                     placeholder="Select a Visiting Day"
//                   />
//                 </Col>
//               </Form.Group>
//             </Col>
//           </Row>
          
//           <Row className="justify-content-center mt-4">
//             <Col sm="2">
//               <Button type="submit" variant="primary" block>
//                 Assign
//               </Button>
//             </Col>
//             <Col sm="auto">
//               <FaFilter className="filter-icon" onClick={handleFilterClick} style={{ cursor: 'pointer', fontSize: '18px' }} />
//             </Col>
//           </Row>
//         </Form>

//         <Table striped bordered hover className="mt-4">
//           <thead>
//             <tr>
//               <th>Sl No.</th>
//               <th>Representative</th>
//               <th>Shop Name</th>
//               <th>Role</th>
//               <th>Visiting Day</th>
//             </tr>
//           </thead>
//           <tbody>
//             {assignments.map((assignment, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{assignment.representativename}</td>
//                 <td>{assignment.shopname}</td>
//                 <td>{assignment.role}</td>
//                 <td>{assignment.visitingday}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Container>
//     </main>
//   );
// }

///////=========================================================================================================================================================

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import { FaFilter } from 'react-icons/fa';
// import { supabase } from '../../../supabaseClient'; // Import your Supabase client
// import './assignRepresentative.css'; // Import your CSS file

// export default function AssignRepresentative() {
//   const [representatives, setRepresentatives] = useState([]);
//   const [shopNames, setShopNames] = useState([]);
//   const [visitingDays, setVisitingDays] = useState([]);
//   const [selectedRole, setSelectedRole] = useState('Mechanic'); // Default is Mechanic
//   const [selectedRepresentative, setSelectedRepresentative] = useState(null);
//   const [selectedShopName, setSelectedShopName] = useState(null);
//   const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch representatives from the database
//     const fetchRepresentatives = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, name')
//         .eq('role', 'representative');

//       if (error) console.error('Error fetching representatives:', error);
//       else setRepresentatives(data.map(rep => ({ value: rep.userid, label: rep.name })));
//     };

//     // Fetch visiting days from the database
//     const fetchVisitingDays = async () => {
//       const { data, error } = await supabase
//         .from('visiting_days')
//         .select('visitingdayid, visitingday');

//       if (error) console.error('Error fetching visiting days:', error);
//       else setVisitingDays(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
//     };

//     fetchRepresentatives();
//     fetchVisitingDays();
//   }, []);

//   useEffect(() => {
//     // Fetch shop names based on selected role
//     const fetchShopNames = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, shopname, name')
//         .eq('role', selectedRole.toLowerCase());

//       if (error) console.error(`Error fetching ${selectedRole} shop names:`, error);
//       else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, name: shop.name })));
//     };

//     fetchShopNames();

//     // Reset state when role changes
//     setSelectedRepresentative(null);
//     setSelectedShopName(null);
//     setSelectedVisitingDay(null);
//   }, [selectedRole]);

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
  
//   //   if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
//   //     console.error('Please select all required fields.');
//   //     return;
//   //   }
  
//   //   const { error } = await supabase
//   //     .from('representassigned_master')
//   //     .insert([
//   //       {
//   //         representative_id: selectedRepresentative.value,
//   //         shop_id: selectedShopName.value,
//   //         visiting_day_id: selectedVisitingDay.value,
//   //       },
//   //     ]);

//   //   if (error) {
//   //     console.error('Error assigning representative:', error);
//   //   } else {
//   //     alert('Representative assigned successfully!');
//   //     navigate('/portal/filterAssignRepresentative'); // Redirect after successful assignment
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//         e.preventDefault();
      
//         // Check if all required fields are selected
//         if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
//           console.error('Please select all required fields.');
//           return;
//         }
      
//         // Debugging: Log the selected values
//         console.log('Selected Representative:', selectedRepresentative);
//         console.log('Selected Shop Name:', selectedShopName);
//         console.log('Selected Visiting Day:', selectedVisitingDay);
      
//         // Ensure that `name` and `value` are accessible
//         const visitorName = selectedShopName ? selectedShopName.name : 'Unknown';
//         const visitorId = selectedShopName ? selectedShopName.value : null;
      
//         const assignmentData = {
//           representativename: selectedRepresentative.label,
//           representativeid: selectedRepresentative.value,
//           role: selectedRole,
//           visitor: visitorName, // Ensure visitor has a value
//           shopname: selectedShopName.label,
//           visitingdayid: selectedVisitingDay.value, // visitingdayid of visitingday
//           visitingday: selectedVisitingDay.label,
//           visitorid: visitorId, // userid of shopname
//           active: 'Y',
//           lastupdatetime: new Date().toISOString(),
//           created: new Date().toISOString(),
//         };
      
//         console.log('Assignment Data:', assignmentData); // Log the data being sent to Supabase
      
//         const { data, error } = await supabase
//           .from('representassigned_master') // Replace with your table name
//           .insert([assignmentData]);
      
//         if (error) {
//           console.error('Error saving assignment:', error);
//         } else {
//           console.log('Assignment saved:', data);
//           setAssignments([...assignments, assignmentData]);
//         }
//       };

//   return (
//     <main id='main' className='main'>
//       <Container>
//         <h4 className="text-center mb-4">Assign Representative</h4>
//         <Form onSubmit={handleSubmit}>
//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group controlId="formRole">
//                 <Form.Label>Role</Form.Label>
//                 <Select
//                   value={{ label: selectedRole, value: selectedRole }}
//                   onChange={(e) => setSelectedRole(e.value)}
//                   options={[
//                     { label: 'Mechanic', value: 'Mechanic' },
//                     { label: 'Retailer', value: 'Retailer' },
//                   ]}
//                   placeholder="Select Role"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group controlId="formRepresentative">
//                 <Form.Label>Representative</Form.Label>
//                 <Select
//                   value={selectedRepresentative}
//                   onChange={setSelectedRepresentative}
//                   options={representatives}
//                   placeholder="Select Representative"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Row className="mb-3">
//             <Col md={6}>
//               <Form.Group controlId="formVisitingDay">
//                 <Form.Label>Visiting Day</Form.Label>
//                 <Select
//                   value={selectedVisitingDay}
//                   onChange={setSelectedVisitingDay}
//                   options={visitingDays}
//                   placeholder="Select Visiting Day"
//                 />
//               </Form.Group>
//             </Col>
//             <Col md={6}>
//               <Form.Group controlId="formShopName">
//                 <Form.Label>Shop Name</Form.Label>
//                 <Select
//                   value={selectedShopName}
//                   onChange={setSelectedShopName}
//                   options={shopNames}
//                   placeholder="Select Shop Name"
//                 />
//               </Form.Group>
//             </Col>
//           </Row>
//           <Row className="mt-4">
//             <Col>
//               <Button type="submit" variant="primary" block>
//                 Assign Representative
//               </Button>
//             </Col>
//           </Row>
//         </Form>
//         <div className="credit-term-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Sl No.</th>
//               <th>Representative</th>
//               <th>Shop Name</th>
//               <th>Role</th>
//               <th>Visiting Day</th>
//             </tr>
//           </thead>
//           <tbody>
//           {assignments.map((assignment, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{assignment.representativename}</td>
//                 <td>{assignment.shopname}</td>
//                 <td>{assignment.role}</td>
//                 <td>{assignment.visitingday}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       </Container>
//     </main>
//   );
// }


/////====================================================================================================================================================================


import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { supabase } from '../../../supabaseClient'; // Import your Supabase client
import Select from 'react-select';
import { FaFilter } from 'react-icons/fa';
import { UserContext } from "../../context/UserContext";


export default function AssignRepresentative() {
  const [representatives, setRepresentatives] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [visitingDays, setVisitingDays] = useState([]);
  // const [selectedRole, setSelectedRole] = useState('Mechanic'); // Default is Mechanic
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [selectedShopName, setSelectedShopName] = useState(null);
  const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const { user} = useContext(UserContext);

  useEffect(() => {
    // Fetch representatives from the database
    const fetchRepresentatives = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, name')
        .eq('role', 'representative');

      if (error) console.error('Error fetching representatives:', error);
      else setRepresentatives(data.map(rep => ({ value: rep.userid, label: rep.name })));
    };

    // Fetch visiting days from the database
    const fetchVisitingDays = async () => {
      const { data, error } = await supabase
        .from('visiting_days')
        .select('visitingdayid, visitingday');

      if (error) console.error('Error fetching visiting days:', error);
      else setVisitingDays(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
    };

    fetchRepresentatives();
    fetchVisitingDays();
  }, []);

  useEffect(() => {
    // Fetch shop names based on selected role
    const fetchShopNames = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name,role') // Fetch shopname and name
        .in('role',['retailer','mechanic'])
        .order('userid',{ascending:true});

      if (error) console.error(`Error fetching shop names:`, error);
      else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, name: shop.name, role: shop.role })));
    };

    fetchShopNames();

    // Reset state when role changes
    setSelectedRepresentative(null);
    setSelectedShopName(null);
    setSelectedVisitingDay(null);
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Check if all required fields are selected
  //   if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
  //     console.error('Please select all required fields.');
  //     return;
  //   }
  
  //   // Debugging: Log the selected values
  //   console.log('Selected Representative:', selectedRepresentative);
  //   console.log('Selected Shop Name:', selectedShopName);
  //   console.log('Selected Visiting Day:', selectedVisitingDay);
  
  //   // Ensure that `name` and `value` are accessible
  //   const visitorName = selectedShopName ? selectedShopName.name : 'Unknown';
  //   const visitorId = selectedShopName ? selectedShopName.value : null;
  
  //   const assignmentData = {
  //     representativename: selectedRepresentative.label,
  //     representativeid: selectedRepresentative.value,
  //     role: selectedShopName.role,
  //     visitor: visitorName, // Ensure visitor has a value
  //     shopname: selectedShopName.label,
  //     visitingdayid: selectedVisitingDay.value, // visitingdayid of visitingday
  //     visitingday: selectedVisitingDay.label,
  //     visitorid: visitorId, // userid of shopname
  //     active: 'Y',
  //     lastupdatetime: new Date().toISOString(),
  //     created: new Date().toISOString(),
  //   };
  
  //   console.log('Assignment Data:', assignmentData); // Log the data being sent to Supabase
  
  //   const { data, error } = await supabase
  //     .from('representassigned_master') // Replace with your table name
  //     .insert([assignmentData]);
  
  //   if (error) {
  //     console.error('Error saving assignment:', error);
  //   } else {
  //     console.log('Assignment saved:', data);
  //     setAssignments([...assignments, assignmentData]);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
      console.error('Please select all required fields.');
      return;
    }
  
    // Get details of selected shop/visitor
    const visitorName = selectedShopName ? selectedShopName.name : 'Unknown';
    const visitorId = selectedShopName ? selectedShopName.value : null;
  
    const assignmentData = {
      representativename: selectedRepresentative.label,
      representativeid: selectedRepresentative.value,
      role: selectedShopName.role,
      visitor: visitorName,
      shopname: selectedShopName.label,
      visitingdayid: selectedVisitingDay.value,
      visitingday: selectedVisitingDay.label,
      visitorid: visitorId,
      active: 'Y',
      lastupdatetime: new Date().toISOString(),
      updatedby:user?.userid,
      createdby:user?.userid,
      // 'created' field is excluded here intentionally
    };
  
    try {
      // Check if the shop is already assigned a representative
      const { data: existingAssignment, error: fetchError } = await supabase
        .from('representassigned_master')
        .select('*')
        .eq('visitorid', visitorId)
        .single(); // Single to ensure we only get one result
  
      if (fetchError && fetchError.code !== 'PGRST116') {
        // If there's an error but not the "No Rows Found" error, log the error
        console.error('Error checking existing assignment:', fetchError);
        return;
      }
  
      if (existingAssignment) {
        // If the shop is already assigned, update the existing assignment
        const { data: updatedData, error: updateError } = await supabase
          .from('representassigned_master')
          .update({
            representativename: selectedRepresentative.label,
            representativeid: selectedRepresentative.value,
            role: selectedShopName.role,
            visitor: visitorName,
            shopname: selectedShopName.label,
            visitingdayid: selectedVisitingDay.value,
            visitingday: selectedVisitingDay.label,
            visitorid: visitorId,
            active: 'Y',
            updatedby:user?.userid ,
            lastupdatetime: new Date().toISOString(),
            // 'created' field is omitted here
          })
          .eq('visitorid', visitorId); // Assuming 'visitorid' is the primary key
  
        if (updateError) {
          console.error('Error updating assignment:', updateError);
          return;
        }
  
        console.log('Assignment updated:', updatedData);
      } else {
        // If no existing assignment, insert a new one
        const { data: insertedData, error: insertError } = await supabase
          .from('representassigned_master')
          .insert([assignmentData]);
  
        if (insertError) {
          console.error('Error saving new assignment:', insertError);
          return;
        }
  
        console.log('New assignment saved:', insertedData);
      }
  
      // After updating/inserting into representassigned_master, update the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          representativename: selectedRepresentative.label,
          representativeid: selectedRepresentative.value,
          updatedby:user?.userid ,
          visitingday: selectedVisitingDay.label,
          lastupdatedtime: new Date().toISOString(),
          updatedtime: new Date().toISOString()
        })
        .eq('userid', visitorId);
  
      if (updateError) {
        console.error('Error updating users table:', updateError);
        return;
      }
  
      console.log('User table updated for visitor:', visitorId);
  
      // Update local state to display in the table
      setAssignments([...assignments, assignmentData]);
    } catch (err) {
      console.error('Error assigning representative:', err);
    }
  };
  
    
  const handleFilterClick = () => {
    // Navigate to the filter page (Implement the actual navigation logic)
    console.log('Filter icon clicked. Navigate to filter page.');
    navigate("/portal/filterAssignRepresentative");
  };

  return (
    <main id="main" className='main'>
      <Container className="mt-4">
        <Row className="align-items-center">
          <Col>
            <h4 className='text-center'>Assign Representative</h4>
          </Col>
          
        </Row>

        <Form onSubmit={handleSubmit} className="mt-4">
<br/>
          <Form.Group as={Row} controlId="representativeSelect">
            <Form.Label column sm="2">
              Representative
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedRepresentative}
                onChange={setSelectedRepresentative}
                options={representatives}
                placeholder="Select a Representative"
              />
            </Col>
          </Form.Group>
<br/>
          <Form.Group as={Row} controlId="shopNameSelect">
            <Form.Label column sm="2">
              User Shop Name
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedShopName}
                onChange={setSelectedShopName}
                options={shopNames}
                placeholder={`Select a Shop Name`}
              />
            </Col>
          </Form.Group>
<br/>
          <Form.Group as={Row} controlId="visitingDaySelect">
            <Form.Label column sm="2">
              Visiting Day
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedVisitingDay}
                onChange={setSelectedVisitingDay}
                options={visitingDays}
                placeholder="Select a Visiting Day"
              />
            </Col>
          </Form.Group>
          <br/>
          <Row className="justify-content-end">
            <center>
            <Col sm="2">
              <Button type="submit" variant="primary" block>
                Assign
              </Button>
            </Col>
            </center>
            <Col className="text-right">
            <FaFilter className="filter-icon" onClick={handleFilterClick} style={{ cursor: 'pointer', fontSize: '18px' }} />
          </Col>
          
          </Row>
        </Form>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Representative</th>
              <th> Shop Name</th>
              <th> Role</th>
              <th>Visiting Day</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{assignment.representativename}</td>
                <td>{assignment.shopname}</td>
                <td>{assignment.role}</td>
                <td>{assignment.visitingday}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}
