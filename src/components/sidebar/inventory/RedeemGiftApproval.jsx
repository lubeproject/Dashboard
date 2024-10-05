// import React from 'react';
// import "./redeemGiftApproval.css";

// export default function RedeemGiftApproval() {
//   return (
//     <main id='main' className='main'>
//     <div>RedeemGiftApproval</div>
// </main>
//   )
// }
// import React, { useState, useEffect, useContext } from "react";
// import { Container, Table, Button, Row, Col } from "react-bootstrap";
// import { FaCheck } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../../../supabaseClient"; // Ensure this path is correct
// import { UserContext } from "../../context/UserContext";

// export default function RedeemGiftApproval() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   // const [styles, setStyles] = useState({});
//   const { user } = useContext(UserContext);

//   useEffect(() => {
//     fetchRedeemRequests();
//   }, []);

//   const fetchRedeemRequests = async () => {
//     setLoading(true);
//     try {
//       const { data: redeemRequests, error } = await supabase
//         .from('giftitem_redeem')
//         .select('*')
//         .eq('active','Y')
//         .order('redeemid', { ascending: true });

//       if (error) {
//         throw error;
//       }

//       setData(redeemRequests);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproveRequest = async (redeemId) => {
//     try {
//       const { error } = await supabase
//         .from('giftitem_redeem')
//         .update({
//           redeemapproval: 'Y',
//           approvedby: user?.userid,
//           lastupdatetime: new Date().toISOString(),
//           updatedby: user?.userid,
//           active: 'N'
//         })
//         .eq('redeemid', redeemId);

//       if (error) {
//         throw error;
//       }

//       fetchRedeemRequests(); // Reload data to reflect changes
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   // ... (handleRejectRequest placeholder)
//   const styles = {
//     tableContainer: {
//       overflowX: 'auto',  // This ensures horizontal scrolling only when necessary
//       maxWidth: '100%',   // Make sure the container does not exceed the available width
//     },
//     table: {
//       width: '100%',
//       minWidth: '600px',  // Optional: Ensure table has a minimum width for small screens
//     },
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   // const styles = {
//   //   tableContainer: {
//   //     overflowY: 'hidden',
//   //     overflowX: 'auto'
//   //   },
//   // };

//   return (
//     <main id="main" className="main" >
//       <Container className="mt-4" style={styles.tableContainer}> {/* Apply custom styles */}
//         <Row className="mb-4">
//           <Col>
//             <h4 className="text-center">Gift Item Redemption Requests</h4>
//           </Col>
//         </Row>

//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Sl no.</th>
//               <th>User</th>
//               <th>Item Name</th>
//               <th>Quantity</th>
//               <th>Redeem Points</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 ? (
//               data.map((item, index) => (
//                 <tr key={item.redeemid}>
//                   <td>{index + 1}</td>
//                   <td><span>{item.shopname}</span> <br /><span>{item.name}</span></td>
//                   <td>{item.itemname}</td>
//                   <td>{item.quantity}</td>
//                   <td>{item.redeempoints}</td>
//                   <td>{item.redeemapproval === 'Y' ? 'Approved' : 'Pending'}</td>
//                   <td>
//                     {item.redeemapproval === 'N' && (
//                       <Button variant="success" onClick={() => handleApproveRequest(item.redeemid)}>
//                         <FaCheck /> Approve
//                       </Button>
                      
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center">
//                   No Active Redemption Requests
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </Container>
//     </main>
//   );
// }
import React, { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import FaTimes for the Reject button
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient"; // Ensure this path is correct
import { UserContext } from "../../context/UserContext";

export default function RedeemGiftApproval() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchRedeemRequests();
  }, []);

  const fetchRedeemRequests = async () => {
    setLoading(true);
    try {
      const { data: redeemRequests, error } = await supabase
        .from('giftitem_redeem')
        .select('*')
        .eq('active', 'Y')
        .order('redeemid', { ascending: true });

      if (error) {
        throw error;
      }

      setData(redeemRequests);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (redeemId) => {
    try {
      const { error } = await supabase
        .from('giftitem_redeem')
        .update({
          redeemapproval: 'Y',
          approvedby: user?.userid,
          lastupdatetime: new Date().toISOString(),
          updatedby: user?.userid,
          active: 'N'
        })
        .eq('redeemid', redeemId);

      if (error) {
        throw error;
      }

      fetchRedeemRequests(); // Reload data to reflect changes
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRejectRequest = async (redeemId, userId, redeemPoints) => {
    try {
      console.log('Rejecting request:', redeemId, userId, redeemPoints);
  
      // Fetch the current redeempoints of the user
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('rewardpoints')
        .eq('userid', userId)
        .single();
  
      if (userFetchError) {
        console.error('Error fetching user data:', userFetchError.message);
        throw userFetchError;
      }
  
      const currentRedeemPoints = userData.rewardpoints || 0;
      const updatedRedeemPoints = currentRedeemPoints + redeemPoints;
  
      console.log('Current Points:', currentRedeemPoints, 'Updated Points:', updatedRedeemPoints);
  
      // Update the user's redeempoints
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ rewardpoints: updatedRedeemPoints })
        .eq('userid', userId);
  
      if (userUpdateError) {
        console.error('Error updating user points:', userUpdateError.message);
        throw userUpdateError;
      }
  
      // Update the giftitem_redeem table
      const { error: redeemUpdateError } = await supabase
        .from('giftitem_redeem')
        .update({
          active: 'N',
          redeemapproval: 'N',
          approvedby: user?.userid,
          lastupdatetime: new Date().toISOString(),
          updatedby: user?.userid,
        })
        .eq('redeemid', redeemId);
  
      if (redeemUpdateError) {
        console.error('Error updating redeem item:', redeemUpdateError.message);
        throw redeemUpdateError;
      }
  
      // Reload data
      fetchRedeemRequests();
  
    } catch (error) {
      console.error('Error in handleRejectRequest:', error.message);
      setError(error.message);
    }
  };
  

  const styles = {
    tableContainer: {
      overflowX: 'auto',
      maxWidth: '100%',
    },
    table: {
      width: '100%',
      minWidth: '600px',
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main id="main" className="main">
      <Container className="mt-4" style={styles.tableContainer}>
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Gift Item Redemption Requests</h4>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Sl no.</th>
              <th>User</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Redeem Points</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.redeemid}>
                  <td>{index + 1}</td>
                  <td>
                    <span>{item.shopname}</span> <br />
                    <span>{item.name}</span>
                  </td>
                  <td>{item.itemname}</td>
                  <td>{item.quantity}</td>
                  <td>{item.redeempoints}</td>
                  <td>{item.redeemapproval === 'Y' ? 'Approved' : 'Pending'}</td>
                  <td>
                    {item.redeemapproval === 'N' && (
                      <>
                        <Button
                          variant="success"
                          onClick={() => handleApproveRequest(item.redeemid)}
                          className="me-2"
                          style={{ minWidth: '100px', padding: '2px 12px', textAlign: 'center' }}
                        >
                          <FaCheck /> Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleRejectRequest(
                              item.redeemid,
                              item.userid,
                              item.redeempoints
                            )
                          }
                          style={{ minWidth: '100px', padding: '6px 12px', textAlign: 'center' }}
                        >
                          <FaTimes /> Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No Active Redemption Requests
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}