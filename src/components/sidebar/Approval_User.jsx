import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaEye } from "react-icons/fa6";
import { FcApproval } from "react-icons/fc";
import { ImCancelCircle } from "react-icons/im";
import { Button, Modal, Table, Container } from "react-bootstrap";
import "./approval_User.css"; // Ensure this CSS file is created

export default function Approval_User() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchPendingUsers();
    }, []);
  
    const fetchPendingUsers = async () => {
      try {
        const { data, error } = await supabase.from("pending_users").select("*");
        if (error) throw error;
        setPendingUsers(data);
      } catch (error) {
        console.error("Error fetching pending users:", error.message);
        alert("Failed to fetch pending users.");
      }
    };
  
    const handleView = (user) => {
      setSelectedUser(user);
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setSelectedUser(null);
      setIsModalOpen(false);
    };
  
    const handleAccept = async (user) => {
      try {
        setIsRegistering(true);
        const { data, error } = await supabase.from("users").insert([{
          role: user.role,
          mobile: user.mobile,
          name: user.name,
          address: user.address,
          email: user.email,
          password: user.password,
          shopname: user.shopname,
          enablecheck: user.enablecheck,
          qrcode: user.qrcode,
          active: user.active,
          updatedby: user.updatedby,
          visitingday: user.visitingday,
          shopimgurl: user.shopimgurl,
          shippingaddress: user.shippingaddress,
          segment: user.segment,
          rewardpoints: user.rewardpoints,
          representativename: user.representativename,
          representativeid: user.representativeid,
          monthlypotential: user.monthlypotential,
          longitude: user.longitude,
          latitude: user.latitude,
          creditterm: user.creditterm,
          creditdays: user.creditdays,
          cginno: user.cginno,
          dob: user.dob,
          lastupdatedtime: user.lastupdatedtime,
          locateddate: user.locateddate,
          noofemployees: user.noofemployees,
          shopimgurl2: user.shopimgurl2,
          spacetype: user.spacetype,
          totalarea: user.totalarea,
          workshoparea: user.workshoparea,
          createdtime: user.createdtime,
          updatedtime: user.updatedtime,
          devicetoken: user.devicetoken,
        

        }]);
  
        if (error) throw error;
  
        const { error: deleteError } = await supabase.from("pending_users").delete().eq("pendinguserid", user.pendinguserid);
        if (deleteError) throw deleteError;
  
        alert("User accepted successfully.");
        fetchPendingUsers();
      } catch (error) {
        console.error("Error accepting user:", error.message);
        alert("Failed to accept user.");
      } finally {
        setIsRegistering(false);
      }
    };
  
    const handleCancel = async (user) => {
   
      try {
        setIsRegistering(true);
        const { error } = await supabase.from("pending_users").delete().eq("pendinguserid", user.pendinguserid);
        if (error) throw error;
        alert("User cancelled successfully.");
        fetchPendingUsers();
      } catch (error) {
        console.error("Error cancelling user:", error.message);
        alert("Failed to cancel user.");
      } finally {
        setIsRegistering(false);
      }
    };
  

  return (

    <main id='main' className='main'>

   
<Container className="mt-4 approval-user-container">
      <h3 className="text-center approval-user-title">Approval-User</h3>
      <Table responsive className="approval-user-table">
        <thead>
          <tr>
            <th>Sl.no</th>
            <th>Name</th>
            <th>Role</th>
            <th>Mobile</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No pending users.</td>
            </tr>
          ) : (
            pendingUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.mobile}</td>
                
                <td style={{display:"flex", justifyContent:"space-around", gap:"20px"}}>
                  
                    <FaEye color="darkblue" className="me-2" onClick={() => handleView(user)} fontSize={"25px"} style={{cursor:"pointer"}}/>
                  
               
                
                  
                 
                    <FcApproval color="darkgreen"   className="me-2"
                    onClick={() => handleAccept(user)}
                    disabled={isRegistering} fontSize={"25px"} style={{cursor:"pointer"}}/>
                
                    <ImCancelCircle color="red" onClick={() => handleCancel(user)}
                    disabled={isRegistering} fontSize={"25px"} style={{cursor:"pointer"}}/>
                
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal for Viewing User Details */}
      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="user-details">
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Mobile Number:</strong> {selectedUser.mobile}</p>
              <p><strong>Email ID:</strong> {selectedUser.email}</p>
              <p><strong>Shop Name:</strong> {selectedUser.shopname}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
</main>


   
  );
}
