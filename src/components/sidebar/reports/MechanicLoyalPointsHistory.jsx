import React, { useState, useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import norecordfound from "../../../images/norecordfound.gif";
import "./MechanicLoyalPointsHistory.css";

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function MechanicLoyalPointsHistory() {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const { data: filteredData, error } = await supabase
      .from('segment_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active segments

    if (error) console.error('Error fetching segments:', error.message);
    else setFilteredData(filteredData);
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 style={{ textAlign: "center" }}>Mechanic Loyal Points History</h4>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            {filteredData.length === 0 ? (
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" style={{ width: '50%' }} />
              </div>
            ) : (
              <Table striped bordered hover responsive className="mechanic-loyal-points-table">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Mechanic Name</th>
                    <th>Points Achieve</th>
                    <th>Redeemed</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.segmentname.trim()}</td>
                      <td>{1}</td>
                      <td>{2}</td>
                      <td>{3}</td>
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
