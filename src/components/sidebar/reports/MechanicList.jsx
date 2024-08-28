// import React, { useEffect, useState } from 'react';
// import {supabase} from '../../../supabaseClient';
// import './MechanicList.css';
// import { FaEdit, FaTrash } from 'react-icons/fa';

// function MechanicList() {
//   const [mechanics, setMechanics] = useState([]);
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [newMechanicName, setNewMechanicName] = useState('');
//   const [currentMechanic, setCurrentMechanic] = useState(null);

//   useEffect(() => {
//     fetchMechanics();
//   }, []);

//   const fetchMechanics = async () => {
//     const { data: mechanics, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('active', 'Y')
//       .eq('role', 'mechanic');

//     if (error) console.error('Error fetching mechanics:', error.message);
//     else setMechanics(mechanics);
//   };

//   const handleAddMechanic = async () => {
//     const newMechanic = {
//       name: newMechanicName,
//       active: 'Y',
//       role: 'mechanic',
//       createdby: 'Admin', // Replace with actual user
//       updatedby: 'Admin',
//       created: new Date().toISOString(),
//       lastupdatetime: new Date().toISOString(),
//     };
//     const { error } = await supabase
//       .from('users')
//       .insert([newMechanic]);

//     if (error) console.error('Error adding mechanic:', error.message);
//     else {
//       setNewMechanicName('');
//       setShowAddPopup(false);
//       fetchMechanics();
//     }
//   };

//   const handleEditMechanic = async () => {
//     if (currentMechanic) {
//       const { error } = await supabase
//         .from('users')
//         .update({ name: newMechanicName, lastupdatetime: new Date().toISOString() })
//         .eq('id', currentMechanic.id);

//       if (error) console.error('Error editing mechanic:', error.message);
//       else {
//         setNewMechanicName('');
//         setShowEditPopup(false);
//         fetchMechanics();
//       }
//     }
//   };

//   const handleDeactivateMechanic = async (id) => {
//     const { error } = await supabase
//       .from('users')
//       .update({ active: 'N' })
//       .eq('id', id);

//     if (error) console.error('Error deactivating mechanic:', error.message);
//     else fetchMechanics();
//   };

//   return (
//     <main id='main' className='main'>
//       <h2><center>Mechanic List</center></h2>
//       <div className="mechanic-table">
//         <table>
//           <thead>
//             <tr>
//               <th><center>Sl No</center></th>
//               <th><center>Mechanic Name</center></th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {mechanics.length > 0 ? (
//               mechanics.map((mechanic, index) => (
//                 <tr key={mechanic.id}>
//                   <td><center>{index + 1}</center></td>
//                   <td><center>{mechanic.name.trim()}</center></td>
//                   <td className="actions">
//                     <button 
//                       onClick={() => {
//                         setCurrentMechanic(mechanic);
//                         setNewMechanicName(mechanic.name.trim());
//                         setShowEditPopup(true);
//                       }} 
//                       className="action-button edit-button"
//                     >
//                       <FaEdit className="icon" />
//                     </button>
//                     <button 
//                       onClick={() => handleDeactivateMechanic(mechanic.id)} 
//                       className="action-button deactivate-button"
//                     >
//                       <FaTrash className="icon" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4"><center>No Mechanics found.</center></td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* <div className="add-button-container">
//         <button onClick={() => setShowAddPopup(true)}>Add New Mechanic</button>
//       </div> */}

//       {/* Add Mechanic Popup
//       {showAddPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Add New Mechanic</h5>
//             <input
//               type="text"
//               placeholder="Mechanic Name"
//               value={newMechanicName}
//               onChange={(e) => setNewMechanicName(e.target.value)}
//             />
//             <div className="popup-buttons">
//               <button onClick={handleAddMechanic}>Submit</button>
//               <button onClick={() => setShowAddPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* Edit Mechanic Popup */}
//       {showEditPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Edit Mechanic</h5>
//             <input
//               type="text"
//               placeholder="Mechanic Name"
//               value={newMechanicName}
//               onChange={(e) => setNewMechanicName(e.target.value)}
//             />
//             <div className="popup-buttons">
//               <button onClick={handleEditMechanic}>Submit</button>
//               <button onClick={() => setShowEditPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// export default MechanicList;
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './MechanicList.css';

export default function MechanicList(){
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    setLoading(true);
    try {
      const { data: mechanics, error } = await supabase
      .from('users')
      .select('*')
      .eq('active', 'Y')
      .eq('role', 'mechanic')
      .order('userid', { ascending: true });

      if (error) {
        throw error;
      }
      setData(mechanics);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (mechanic) => {
    navigate("/portal/updateMechanicDetails", { state: {mechanic} });
  };


  const handleDeactivate = async (id) => {
    const { error } = await supabase
      .from('users')
      .update({
        active: 'N',
        lastupdatedtime: new Date().toISOString(),
        updatedtime: new Date().toISOString()
      })
      .eq('userid', id);

    if (error) console.error('Error deactivating mechanic:', error.message);
    else fetchMechanics();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <main id="main" className="main">
      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h4 className="text-center">Mechanics List</h4>
          </Col>
        </Row>
        <Table striped bordered hover responsive>
          <thead>
            <tr style={{ backgroundColor: "darkorange", color: "white" }}>
              <th>Sl.No</th>
              <th>Mechanic Name</th>
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
                <td colSpan="4" className="text-center">No Mechanics Found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </main>
  );
}
