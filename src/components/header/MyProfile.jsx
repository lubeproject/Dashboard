import React, { useContext } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { FaBuilding, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import company_logo from "../../images/logo.gif";
import './myProfile.css';
import { UserContext } from "../context/UserContext";

export default function MyProfile() {
  const { user } = useContext(UserContext);
  
  return (
    <main id='main' className='main'>
      <Container className="my-4">
        <Row className="justify-content-center text-start">
          <Col xs={12} md={8} className="profile-card">
            <Row className="justify-content-center mb-4">
              <Col xs={6} md={4}>
                <Image src={company_logo} className="profile-image" fluid />
              </Col>
            </Row>
         <Row>
         <h4><i class="bi bi-buildings"></i> SVL Agency</h4>
            <h5><i class="bi bi-person"></i> {user.name}</h5>
            <h5><i class="bi bi-telephone"></i> {user.mobile}</h5>
            <h5><i class="bi bi-envelope-check"></i> {user.email}</h5>
         </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
