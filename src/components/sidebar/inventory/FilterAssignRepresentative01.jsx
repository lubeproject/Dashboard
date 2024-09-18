// import React, { useState, useEffect } from 'react';
// import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
// import { supabase } from '../../../supabaseClient'; // Import your Supabase client
// import Select from 'react-select';

// export default function FilterAssignRepresentative() {
//   const [representatives, setRepresentatives] = useState([]);
//   const [shopNames, setShopNames] = useState([]);
//   const [visitingDays, setVisitingDays] = useState([]);
//   const [selectedRepresentative, setSelectedRepresentative] = useState(null);
//   const [selectedRetailer, setSelectedRetailer] = useState(null);
//   const [selectedMechanic, setSelectedMechanic] = useState(null);
//   const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
//   const [filteredAssignments, setFilteredAssignments] = useState([]);

//   useEffect(() => {
//     const fetchRepresentatives = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, name')
//         .eq('role', 'representative');

//       if (error) console.error('Error fetching representatives:', error);
//       else setRepresentatives(data.map(rep => ({ value: rep.userid, label: rep.name })));
//     };

//     const fetchShopNames = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, shopname, role') // Fetch shopname and role
//         .in('role', ['retailer', 'mechanic']); // Adjust roles based on your needs

//       if (error) console.error('Error fetching shop names:', error);
//       else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, role: shop.role })));
//     };

//     const fetchVisitingDays = async () => {
//       const { data, error } = await supabase
//         .from('visiting_days')
//         .select('visitingdayid, visitingday');

//       if (error) console.error('Error fetching visiting days:', error);
//       else setVisitingDays(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
//     };

//     fetchRepresentatives();
//     fetchShopNames();
//     fetchVisitingDays();
//   }, []);

//   const handleFilter = async () => {
//     if (!selectedRepresentative) {
//       console.error('Representative is required.');
//       return;
//     }
  
//     let query = supabase.from('representassigned_master').select('*');
//     query = query.eq('representativeid', selectedRepresentative.value);
  
//     if (selectedRetailer || selectedMechanic) {
//       // Construct OR condition for `selectedRetailer` and `selectedMechanic`
//       let orCondition = '';
      
//       if (selectedRetailer) {
//         orCondition += `visitorid.eq.${selectedRetailer.value}`;
//       }
      
//       if (selectedMechanic) {
//         if (orCondition) {
//           orCondition += ',';
//         }
//         orCondition += `visitorid.eq.${selectedMechanic.value}`;
//       }
  
//       query = query.or(orCondition);
//     }
  
//     if (selectedVisitingDay) {
//       query = query.eq('visitingdayid', selectedVisitingDay.value);
//     }
  
//     const { data, error } = await query;
  
//     if (error) console.error('Error fetching filtered assignments:', error);
//     else setFilteredAssignments(data);
//   };  

//   const handleReset = () => {
//     setSelectedRepresentative(null);
//     setSelectedRetailer(null);
//     setSelectedMechanic(null);
//     setSelectedVisitingDay(null);
//     setFilteredAssignments([]);
//   };

//   const retailers = shopNames.filter(shop => shop.role === 'retailer');
//   const mechanics = shopNames.filter(shop => shop.role === 'mechanic');

//   return (
//     <main className='main' style={{ paddingTop: '60px' }}>
//       <Container className="mt-4">
//         <h5>Filter Assign Representative</h5>
//         <Form className="mt-4">
//           <Form.Group as={Row} controlId="representativeSelect">
//             <Form.Label column sm="2">
//               Representative
//             </Form.Label>
//             <Col sm="10">
//               <Select
//                 value={selectedRepresentative}
//                 onChange={setSelectedRepresentative}
//                 options={representatives}
//                 placeholder="Select a Representative"
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} controlId="retailerSelect">
//             <Form.Label column sm="2">
//               Retailer
//             </Form.Label>
//             <Col sm="10">
//               <Select
//                 value={selectedRetailer}
//                 onChange={setSelectedRetailer}
//                 options={retailers}
//                 placeholder="Select a Retailer"
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} controlId="mechanicSelect">
//             <Form.Label column sm="2">
//               Mechanic
//             </Form.Label>
//             <Col sm="10">
//               <Select
//                 value={selectedMechanic}
//                 onChange={setSelectedMechanic}
//                 options={mechanics}
//                 placeholder="Select a Mechanic"
//               />
//             </Col>
//           </Form.Group>

//           <Form.Group as={Row} controlId="visitingDaySelect">
//             <Form.Label column sm="2">
//               Visiting Day
//             </Form.Label>
//             <Col sm="10">
//               <Select
//                 value={selectedVisitingDay}
//                 onChange={setSelectedVisitingDay}
//                 options={visitingDays}
//                 placeholder="Select a Visiting Day"
//               />
//             </Col>
//           </Form.Group>

//           <Row className="justify-content-end">
//             <Col sm="2">
//               <Button onClick={handleFilter} variant="primary" block>
//                 Apply Filter
//               </Button>
//             </Col>
//             <Col sm="2">
//               <Button onClick={handleReset} variant="secondary" block>
//                 Reset
//               </Button>
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
//             {filteredAssignments.map((assignment, index) => (
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


/////=========================================================================================================================================================

import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { supabase } from '../../../supabaseClient'; // Import your Supabase client
import Select from 'react-select';

export default function FilterAssignRepresentative() {
  const [representatives, setRepresentatives] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [visitingDays, setVisitingDays] = useState([]);
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  useEffect(() => {
    const fetchRepresentatives = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, name')
        .eq('role', 'representative');

      if (error) console.error('Error fetching representatives:', error);
      else setRepresentatives(data.map(rep => ({ value: rep.userid, label: rep.name })));
    };

    const fetchShopNames = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, role') // Fetch shopname and role
        .in('role', ['retailer', 'mechanic']); // Adjust roles based on your needs

      if (error) console.error('Error fetching shop names:', error);
      else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, role: shop.role })));
    };

    const fetchVisitingDays = async () => {
      const { data, error } = await supabase
        .from('visiting_days')
        .select('visitingdayid, visitingday');

      if (error) console.error('Error fetching visiting days:', error);
      else setVisitingDays(data.map(day => ({ value: day.visitingdayid, label: day.visitingday })));
    };

    fetchRepresentatives();
    fetchShopNames();
    fetchVisitingDays();
  }, []);

  const handleFilter = async () => {
    if (!selectedRepresentative) {
      console.error('Representative is required.');
      return;
    }
  
    let query = supabase.from('representassigned_master').select('*');
    query = query.eq('representativeid', selectedRepresentative.value);
  
    if (selectedRetailer || selectedMechanic) {
      // Construct OR condition for `selectedRetailer` and `selectedMechanic`
      let orCondition = '';
      
      if (selectedRetailer) {
        orCondition += `visitorid.eq.${selectedRetailer.value}`;
      }
      
      if (selectedMechanic) {
        if (orCondition) {
          orCondition += ',';
        }
        orCondition += `visitorid.eq.${selectedMechanic.value}`;
      }
  
      query = query.or(orCondition);
    }
  
    if (selectedVisitingDay) {
      query = query.eq('visitingdayid', selectedVisitingDay.value);
    }
  
    const { data, error } = await query;
  
    if (error) console.error('Error fetching filtered assignments:', error);
    else setFilteredAssignments(data);
  };  

  const handleReset = () => {
    setSelectedRepresentative(null);
    setSelectedRetailer(null);
    setSelectedMechanic(null);
    setSelectedVisitingDay(null);
    setFilteredAssignments([]);
  };

  const retailers = shopNames.filter(shop => shop.role === 'retailer');
  const mechanics = shopNames.filter(shop => shop.role === 'mechanic');

  return (
    <main id="main" className='main'>
      <Container className="mt-4">
        <h4 className='text-center'>Filter Assign Representative</h4>
        <br/>
        <Form className="mt-4">
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
          <Form.Group as={Row} controlId="retailerSelect">
            <Form.Label column sm="2">
              Retailer
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedRetailer}
                onChange={setSelectedRetailer}
                options={retailers}
                placeholder="Select a Retailer"
              />
            </Col>
          </Form.Group>
<br/>
          <Form.Group as={Row} controlId="mechanicSelect">
            <Form.Label column sm="2">
              Mechanic
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedMechanic}
                onChange={setSelectedMechanic}
                options={mechanics}
                placeholder="Select a Mechanic"
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
            <Col sm="2">
              <Button onClick={handleFilter} variant="primary" block>
                Apply Filter
              </Button>
            </Col>
            <Col sm="2">
              <Button onClick={handleReset} variant="secondary" block>
                Reset
              </Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Representative</th>
              <th>Shop Name</th>
              <th>Role</th>
              <th>Visiting Day</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment, index) => (
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

