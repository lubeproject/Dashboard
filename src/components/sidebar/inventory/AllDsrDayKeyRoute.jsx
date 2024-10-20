import React,{useState, useRef, useEffect, useContext} from 'react';
import { supabase } from '../../../supabaseClient';
import "./allDsrDayKeyRoute.css";
import { FaChevronRight } from "react-icons/fa";
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";

export default function AllDsrDayKeyRoute() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [daysOptions, setDaysOptions] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();
  const { user} = useContext(UserContext);
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's relevant state to apply filters automatically
    if (location.state && location.state.selectedDsr) {
      const {selectedDsr,selectedDay} = location.state;
      // Update local state with these values
      setSelectedDsr(selectedDsr);
      setSelectedDay(selectedDay);
      // Convert dates to appropriate format or use as is if already in Date format
    }
  }, [location.state]);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Representatives:', error);
      else setDsrOptions(data.map(representative => ({ value: representative.userid, label: representative.shopname, name: representative.name, role: representative.role })));
    };

    // Fetch mechanics from the users table
    const fetchDays = async () => {
      const { data, error } = await supabase
        .from('visiting_days')
        .select('visitingdayid, visitingday');

      if (error) console.error('Error fetching Visiting Days:', error);
      else setDaysOptions(data.map(representative => ({ value: representative.visitingdayid, label: representative.visitingday})));
    };


    if (user?.role === 'representative') {
      setDsrOptions([
        {
          value: user?.userid,
          label: user?.shopname,
          name: user?.name,
          role: user?.role
        }
      ]);
    } else {
      fetchDsr();
    }

    // fetchDsr();
    fetchDays();
  }, []);

  const handleDetailsClick = (userId,selectedDsr,selectedDay) => {
    // Navigate to another page with the invoice details
    navigate(`/portal/retailer-summary`,{state:{userId,selectedDsr,selectedDay}});
  };

  const handleFilter = async () => {
    if(!selectedDsr){
      alert("Please Select a DSR.");
      return;
    }
    if(!selectedDay){
      alert("Please Select a Visiting Day.");
      return;
    }

    try {
      // Fetch all records for the selected retailer
      // const { data: allDsrDetails, error: dsrError } = await supabase
      //   .from('representassigned_master')
      //   .select('*')
      //   .eq('representativeid', selectedDsr.value)
      //   .eq('visitingdayid', selectedDay.value);
      let query = supabase
      .from('representassigned_master')
      .select('*')
      .eq('representativeid', selectedDsr.value);

      if (selectedDay) {
        query = query.eq('visitingdayid', selectedDay.value);
      }

      const { data: allDsrDetails, error: dsrError } = await query;

  
      if (dsrError) {
        console.error('Error fetching representative details:', dsrError);
        return;
      }
  
      console.log("All Requests for Representative:", allDsrDetails);
  
      // Set the filtered items data to state
      setFilteredData(allDsrDetails || []);
      // setFilterApplied(true);
      console.log("Final Filtered Items Data:", allDsrDetails);
  
    } catch (error) {
      console.error('Unexpected error during filtering:', error);
    }
  };

  const handleReset = () => {
    setSelectedDsr(null);
    setSelectedDay(null);
    setFilteredData([]);
    // setFilterApplied(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedDsr ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedDsr ? 'red' : provided.borderColor,
      },
    }),
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
      <Row className="mb-4">
          <Col>
            <h4 className="text-center">All DSR Day Key Route </h4>
          </Col>
        </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="formRepresentative">
            <Form.Label>Select Representative</Form.Label>
            <Select
                value={selectedDsr}
                onChange={setSelectedDsr}
                options={dsrOptions}
                placeholder="Select Representative"
                styles={customSelectStyles}
            />
            {!selectedDsr && (
        <p className="text-danger">Please select a representative.</p>
      )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="formDay">
            <Form.Label>Select Visiting Day</Form.Label>
            <Select
              value={selectedDay}
              onChange={setSelectedDay}
              options={daysOptions}
              placeholder="Select Visiting Day"
              styles={customSelectStyles}
              required
            />
            {!selectedDay && (
        <p className="text-danger">Please select a Visiting Day.</p>
      )}
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6}>
          <Button variant="primary" onClick={handleFilter} block>Filter</Button>
        </Col>
        <br/>
        <Col md={6}>
          <Button variant="secondary" onClick={handleReset} block>Reset</Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>SL</th>
                <th>Account</th>
                <th>Role</th>
                <th>Visiting Day</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.shopname || 'N/A'}</td>
                    <td>{data.role || 'N/A'}</td>
                    <td>{data.visitingday || 'N/A'}</td>
                    {/* <td>
                      <Button variant="warning" onClick={() => handleDetailsClick(data.visitorid)}>Details</Button>
                    </td> */}
                    <td>{data.role === 'retailer' ? (
                        <Button variant="warning" size="sm" className="details-button" onClick={() => handleDetailsClick(data.visitorid,selectedDsr,selectedDay)}>
                          <b>Details</b> <FaChevronRight />
                        </Button>
                        ) : null
                      }</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No data found for the selected DSR and Day</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
    </main>
  )
}
