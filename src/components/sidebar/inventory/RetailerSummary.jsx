import React from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import './retailerSummary.css';

const dummyPurchaseAnalysis = [
  { id: 1, Mineral: '500', Synth: '200', Psy: '300', Total: '1000', NA: '0' },
];

const dummyPerformanceData = [
  { id: 1, Year: '2023', TurnOver: '500000', ToBeCleared: '50000', CreditDaysAvailed: '30' },
];

const dummyWeeklyData = [
  { id: 1, Week: '1', Order: '500', Collection: '450' },
];

const dummyRecoveryData = [
  { id: 1, InvNo: '12345', Date: '01/01/2024', Value: '10000', Balance: '5000', ODDays: '10' },
];

const dummyLoyalMechanics = [
  { id: 1, Mechanic: 'John Doe', Litres: '100', Points: '50' },
];

export default function RetailerSummary() {
  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Account</th>
                  <th>Visiting Day</th>
                  <th>Action</th>
                </tr>
              </thead>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Purchase Analysis (Litres):</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mineral</th>
                  <th>Synth</th>
                  <th>Psy</th>
                  <th>Total</th>
                  <th>NA</th>
                </tr>
              </thead>
              <tbody>
                {dummyPurchaseAnalysis.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.Mineral}</td>
                    <td>{data.Synth}</td>
                    <td>{data.Psy}</td>
                    <td>{data.Total}</td>
                    <td>{data.NA}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Performance Data:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>TurnOver</th>
                  <th>To be Cleared</th>
                  <th>Credit Days Availed</th>
                </tr>
              </thead>
              <tbody>
                {dummyPerformanceData.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.Year}</td>
                    <td>{data.TurnOver}</td>
                    <td>{data.ToBeCleared}</td>
                    <td>{data.CreditDaysAvailed}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Order (Litres)</th>
                  <th>Collection</th>
                </tr>
              </thead>
              <tbody>
                {dummyWeeklyData.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.Week}</td>
                    <td>{data.Order}</td>
                    <td>{data.Collection}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Recovery Data:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Inv.No.</th>
                  <th>Date</th>
                  <th>Value</th>
                  <th>Balance</th>
                  <th>OD Days</th>
                </tr>
              </thead>
              <tbody>
                {dummyRecoveryData.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.InvNo}</td>
                    <td>{data.Date}</td>
                    <td>{data.Value}</td>
                    <td>{data.Balance}</td>
                    <td>{data.ODDays}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h5>Loyal Mechanics:</h5>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mechanic</th>
                  <th>Litres</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {dummyLoyalMechanics.map((data, index) => (
                  <tr key={data.id}>
                    <td>{data.Mechanic}</td>
                    <td>{data.Litres}</td>
                    <td>{data.Points}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
}