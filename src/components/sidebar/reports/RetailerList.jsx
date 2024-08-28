import React, { useState, useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient"; // Ensure this path is correct

export default function RetailerList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRetailers();
  }, []);

  const fetchRetailers = async () => {
    setLoading(true);
    try {
      const { data: retailers, error } = await supabase
        .from('users')
        .select('*')
        .eq('active', 'Y')
        .eq('role', 'retailer');

      if (error) {
        throw error;
      }

      // Sort retailers by userid
      const sortedRetailers = retailers.sort((a, b) => a.userid - b.userid);
      setData(sortedRetailers);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (retailer) => {
    navigate("/portal/updateRetailerDetails", { state: { retailer } });
  };

  const handleDeactivate = async (userid) => {
    try {
      console.log("Attempting to deactivate retailer with userid:", userid); // Debugging

      const { error } = await supabase
        .from('users')
        .update({
          active: 'N',
          lastupdatedtime: new Date().toISOString(),
          updatedtime: new Date().toISOString()
        })
        .eq('userid', userid);

      if (error) {
        throw error;
      }

      console.log("Successfully updated retailer with userid:", userid); // Debugging

      // Reload data to reflect changes
      fetchRetailers();
    } catch (error) {
      console.error("Error deactivating retailer:", error.message); // Error handling
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main id="main" className="main">
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Retailer List</h4>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ backgroundColor: "darkorange", color: "white" }}>
              <th>Sl.No</th>
              <th>Retailer Name</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.userid}>
                  <td>{index + 1}</td>
                  <td>{item.shopname}</td>
                  <td>{item.address}</td>
                  <td className="d-flex flex-row">
                    <Button
                      variant={item.active === "Y" ? "danger" : "success"}
                      onClick={() => handleDeactivate(item.userid)}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {item.active === "Y" ? <FaTimes /> : <FaCheck />}
                      <span style={{ marginLeft: "10px" }}>
                        {item.active === "Y" ? "Deactivate" : "Activate"}
                      </span>
                    </Button>
                    <Button
                      className="d-flex flex-row align-items-center justify-content-center"
                      style={{ marginLeft: "20px" }}
                      onClick={() => handleEditClick(item)}
                    >
                      <FaEdit />
                      {/* <span style={{ marginLeft: "10px" }}> Edit </span> */}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No Retailers Found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}
