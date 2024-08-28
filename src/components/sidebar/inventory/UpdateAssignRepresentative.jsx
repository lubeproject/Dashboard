// import React from 'react';
// import "./assignRepresentative.css";

// export default function AssignRepresentative() {
//   return (
//     <main id='main' className='main'>
//     <div>AssignRepresentative</div>
// </main>
//   )
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Form, Container, Row, Col, Table } from 'react-bootstrap';
import { supabase } from '../../../supabaseClient'; // Import your Supabase client
import Select from 'react-select';
import { FaFilter } from 'react-icons/fa';

export default function AssignRepresentative() {
  const [representatives, setRepresentatives] = useState([]);
  const [shopNames, setShopNames] = useState([]);
  const [visitingDays, setVisitingDays] = useState([]);
  const [selectedRole, setSelectedRole] = useState('Mechanic'); // Default is Mechanic
  const [selectedRepresentative, setSelectedRepresentative] = useState(null);
  const [selectedShopName, setSelectedShopName] = useState(null);
  const [selectedVisitingDay, setSelectedVisitingDay] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

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
        .select('userid, shopname, name') // Fetch shopname and name
        .eq('role', selectedRole.toLowerCase());

      if (error) console.error(`Error fetching ${selectedRole} shop names:`, error);
      else setShopNames(data.map(shop => ({ value: shop.userid, label: shop.shopname, name: shop.name })));
    };

    fetchShopNames();

    // Reset state when role changes
    setSelectedRepresentative(null);
    setSelectedShopName(null);
    setSelectedVisitingDay(null);
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all required fields are selected
    if (!selectedRepresentative || !selectedShopName || !selectedVisitingDay) {
      console.error('Please select all required fields.');
      return;
    }
  
    // Debugging: Log the selected values
    console.log('Selected Representative:', selectedRepresentative);
    console.log('Selected Shop Name:', selectedShopName);
    console.log('Selected Visiting Day:', selectedVisitingDay);
  
    // Ensure that `name` and `value` are accessible
    const visitorName = selectedShopName ? selectedShopName.name : 'Unknown';
    const visitorId = selectedShopName ? selectedShopName.value : null;
  
    const assignmentData = {
      representativename: selectedRepresentative.label,
      representativeid: selectedRepresentative.value,
      role: selectedRole,
      visitor: visitorName, // Ensure visitor has a value
      shopname: selectedShopName.label,
      visitingdayid: selectedVisitingDay.value, // visitingdayid of visitingday
      visitingday: selectedVisitingDay.label,
      visitorid: visitorId, // userid of shopname
      active: 'Y',
      lastupdatetime: new Date().toISOString(),
      created: new Date().toISOString(),
    };
  
    console.log('Assignment Data:', assignmentData); // Log the data being sent to Supabase
  
    const { data, error } = await supabase
      .from('representassigned_master') // Replace with your table name
      .insert([assignmentData]);
  
    if (error) {
      console.error('Error saving assignment:', error);
    } else {
      console.log('Assignment saved:', data);
      setAssignments([...assignments, assignmentData]);
    }
  };
  
  const handleFilterClick = () => {
    // Navigate to the filter page (Implement the actual navigation logic)
    console.log('Filter icon clicked. Navigate to filter page.');
    navigate("/portal/filterAssignRepresentative");
  };

  return (
    <main className='main' style={{ paddingTop: '60px' }}>
      <Container className="mt-4">
        <Row className="align-items-center">
          <Col>
            <h5>Assign Representative</h5>
          </Col>
          
        </Row>

        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group as={Row} controlId="roleSelect">
            <Form.Label column sm="2">
              Choose One
            </Form.Label>
            <Col sm="10">
              <div>
                <Form.Check
                  inline
                  label="Mechanic"
                  type="radio"
                  value="Mechanic"
                  checked={selectedRole === 'Mechanic'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <Form.Check
                  inline
                  label="Retailer"
                  type="radio"
                  value="Retailer"
                  checked={selectedRole === 'Retailer'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
              </div>
            </Col>
          </Form.Group>

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

          <Form.Group as={Row} controlId="shopNameSelect">
            <Form.Label column sm="2">
              {selectedRole} Shop Name
            </Form.Label>
            <Col sm="10">
              <Select
                value={selectedShopName}
                onChange={setSelectedShopName}
                options={shopNames}
                placeholder={`Select a ${selectedRole} Shop Name`}
              />
            </Col>
          </Form.Group>

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
