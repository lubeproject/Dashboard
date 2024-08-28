import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import work_in_progress from "../../images/work_in_progress.gif"; // Replace with your image path
import './workProgress.css';

export default function WorkProgress() {
  return (
    <main id='main' className='main'>
      <Container className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Row>
          <Col className="text-center">
            <Image src={work_in_progress} fluid style={{ maxHeight: "500px" }} />
          </Col>
        </Row>
      </Container>
    </main>
  );
}
