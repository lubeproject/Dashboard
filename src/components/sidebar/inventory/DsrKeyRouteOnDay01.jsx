import React, { useState } from 'react';
import { Table, Form, Button, Container } from 'react-bootstrap';
import { FaChevronRight } from "react-icons/fa";
import "./dsrKeyRouteOnDay.css";
import { useNavigate } from 'react-router-dom';

export default function DsrKeyRouteOnDay() {
  const data = {
    Monday: [
      { sl: 1, account: 'Mahalakshmi', category: 'retailer', visitingday: 'Monday' },
      { sl: 2, account: 'Ranga', category: 'mechanic', visitingday: 'Monday' },
    ],
    Tuesday: [
      { sl: 1, account: 'Mahalakshmi dhevi', category: 'mechanic', visitingday: 'Tuesday' },
      { sl: 2, account: 'Ranga naadhan', category: 'retailer', visitingday: 'Tuesday' },
    ],
  };

  const [selectedDay, setSelectedDay] = useState('');
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const handleDayChange = (event) => {
    const day = event.target.value;
    setSelectedDay(day);
    setTableData(data[day] || []);
  };

  return (
    <main id='main' className='main'>
      <h3 className='text-center mt-2' >DSR Key Route On Day</h3>
      <Container fluid>
        <Form.Group controlId="daySelect">
          <Form.Label>Select Day</Form.Label>
          <Form.Control as="select" value={selectedDay} onChange={handleDayChange} style={{border: "1px solid darkblue"}}>
            <option value="">Select a Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </Form.Control>
        </Form.Group>
<br />
<br />
        {selectedDay && tableData.length > 0 && (
          <div className="table-responsive">
            <Table striped bordered hover className="full-width-table">
              <thead>
                <tr >
                  <th style={{backgroundColor:"darkorange", color:"white"}}>SL</th>
                  <th style={{backgroundColor:"darkorange", color:"white"}}>Account</th>
                  
                  <th style={{backgroundColor:"darkorange", color:"white"}}>Visiting Day</th>
                  <th style={{backgroundColor:"darkorange", color:"white"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index} >
                    <td >{item.sl}</td>
                    <td>{item.account} <br/> <span style={{color:"darkblue"}}>{item.category}</span></td>
                   
                    <td>{item.visitingday}</td>
                    <td>
                      <Button variant="secondary" size="sm" className="details-button"style={{color:"white"}} onClick={()=> navigate("/portal/retailer-summary")}>
                      <b>  Details </b> <FaChevronRight />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </main>
  );
}
