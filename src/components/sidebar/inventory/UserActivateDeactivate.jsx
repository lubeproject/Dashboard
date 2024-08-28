// import React, { useEffect, useState } from 'react';
// import {supabase} from '../../../supabaseClient';
// import './UserActivateDeactivate.css';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// function UserActivateDeactivate() {
//   const [segments, setSegments] = useState([]);
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [newSegmentName, setNewSegmentName] = useState('');
//   const [currentSegment, setCurrentSegment] = useState(null);

//   useEffect(() => {
//     fetchSegments();
//   }, []);

//   const fetchSegments = async () => {
//     const { data: segments, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('activestatus', 'Y'); // Filter active segments

//     if (error) console.error('Error fetching segments:', error.message);
//     else setSegments(segments);
//   };

//   const handleAddSegment = async () => {
//     const newSegment = {
//       segmentname: newSegmentName,
//       activestatus: 'Y',
//       createdby: 'Admin', // Replace with actual user
//       updatedby: 'Admin',
//       created: new Date().toISOString(),
//       lastupdatetime: new Date().toISOString(),
//     };
//     const { error } = await supabase
//       .from('users')
//       .insert([newSegment]);

//     if (error) console.error('Error adding segment:', error.message);
//     else {
//       setNewSegmentName('');
//       setShowAddPopup(false);
//       fetchSegments();
//     }
//   };

//   const handleEditSegment = async () => {
//     if (currentSegment) {
//       const { error } = await supabase
//         .from('users')
//         .update({ segmentname: newSegmentName, lastupdatetime: new Date().toISOString() })
//         .eq('userid', currentSegment.userid);

//       if (error) console.error('Error editing segment:', error.message);
//       else {
//         setNewSegmentName('');
//         setShowEditPopup(false);
//         fetchSegments();
//       }
//     }
//   };

//   const handleDeleteSegment = async (userid) => {
//     const { error } = await supabase
//       .from('users')
//       .update({ activestatus: 'N' })
//       .eq('userid', userid);

//     if (error) console.error('Error deleting segment:', error.message);
//     else fetchSegments();
//   };

//   return (
//     <main id='main' className='main'>
//       <h2><center>User Activate / Deactivate</center></h2>
//       <div className="segment-table">
//         <table>
//           <thead>
//             <tr>
//               <th><center>Sl No</center></th>
//               <th><center>User Name</center></th>
//               <th><center>Role</center></th>
//               <th><center>Actions</center></th>
//             </tr>
//           </thead>
//           <tbody>
//             {segments.map((segment, index) => (
//               <tr key={segment.userid}>
//                 <td><center>{index + 1}</center></td>
//                 <td><center>{segment.username.trim()}</center></td>
//                 <td><center>{segment.role.trim()}</center></td>
//                 <td className="actions">
//                   <button 
//                     onClick={() => {
//                       setCurrentSegment(segment);
//                       setNewSegmentName(segment.segmentname.trim());
//                       setShowEditPopup(true);
//                     }} 
//                     className="action-button edit-button"
//                   >
//                     <FaEdit className="icon" />
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteSegment(segment.userid)} 
//                     className="action-button delete-button"
//                   >
//                     <FaTrash className="icon" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* <div className="add-button-container">
//         <button onClick={() => setShowAddPopup(true)}>Add New Segment Item</button>
//       </div> */}

//       {/* Add Segment Popup
//       {showAddPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Add New Segment Item</h5>
//             <input
//               type="text"
//               placeholder="Segment Name"
//               value={newSegmentName}
//               onChange={(e) => setNewSegmentName(e.target.value)}
//             />
//             <div className="popup-buttons">
//               <button onClick={handleAddSegment}>Submit</button>
//               <button onClick={() => setShowAddPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* Edit Segment Popup */}
//       {showEditPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Edit Segment Item </h5>
//             <input
//               type="text"
//               placeholder="Segment Name"
//               value={newSegmentName}
//               onChange={(e) => setNewSegmentName(e.target.value)}
//             />
//             <div className="popup-buttons">
//               <button onClick={handleEditSegment}>Submit</button>
//               <button onClick={() => setShowEditPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// export default UserActivateDeactivate;
import React, { useState, useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient"; // Ensure this path is correct

export default function UserActivateDeactivate() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role, active')
        .order('userid', { ascending: true });

      if (error) {
        throw error;
      }

      setData(users);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userid, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
      const { error } = await supabase
        .from('users')
        .update({
          active: newStatus,
          lastupdatedtime: new Date().toISOString(),
          updatedtime: new Date().toISOString()
        })
        .eq('userid', userid);

      if (error) {
        throw error;
      }

      fetchUsers(); // Reload data to reflect changes
    } catch (error) {
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
            <h4 className="text-center">User Activate / Deactivate</h4>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ backgroundColor: "darkorange", color: "white" }}>
              <th>Sl.No</th>
              <th>Shop Name</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.userid}>
                  <td>{index + 1}</td>
                  <td>{item.shopname || '-'}</td>
                  <td>{item.name || '-'}</td>
                  <td>{item.role || '-'}</td>
                  <td className="d-flex flex-row">
                  <Button
                      variant={item.active === "Y" ? "danger" : "success"}
                      onClick={() => handleToggleStatus(item.userid, item.active)}
                      className="d-flex align-items-center justify-content-center"
                    >
                      {item.active === "Y" ? <FaTimes /> : <FaCheck />}
                      <span style={{ marginLeft: "10px" }}>
                        {item.active === "Y" ? "Deactivate" : "Activate"}
                      </span>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No Users Found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}
