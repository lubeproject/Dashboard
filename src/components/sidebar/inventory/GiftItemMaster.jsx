// import React, { useContext, useEffect, useState } from 'react';
// import { supabase } from '../../../supabaseClient';
// import './GiftItemMaster.css';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { UserContext } from '../../context/UserContext';

// function GiftItemMaster() {
//   const [items, setItems] = useState([]);
//   const [showAddPopup, setShowAddPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [newItemName, setNewItemName] = useState('');
//   const [newQuantity, setNewQuantity] = useState('');
//   const [newRedeemPoints, setNewRedeemPoints] = useState('');
//   const [currentItem, setCurrentItem] = useState(null);
//   const {user} = useContext(UserContext);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null); // To hold selected image file
//   const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // For image preview

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     const { data: items, error } = await supabase
//       .from('giftitem_master')
//       .select('*')
//       .eq('activestatus', 'Y'); // Filter active items

//     if (error) console.error('Error fetching items:', error.message);
//     else setItems(items);
//   };
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const uploadImageToSupabase = async (file, itemName) => {
//     const fileName = `${itemName}.jpg`;
    
//     const { data, error } = await supabase
//       .storage
//       .from('giftitem')
//       .upload(fileName, file, {
//         upsert: true, // This option allows replacing the existing file
//       });
  
//     if (error) {
//       console.error('Error uploading image:', error.message);
//       return null;
//     }
  
//     // Return the public URL of the image
//     const { publicURL } = supabase
//       .storage
//       .from('giftitem')
//       .getPublicUrl(fileName);
  
//     return publicURL;
//   };
  

//   const handleAddItem = async () => {
//     let imageUrl = '';

//   // Upload the image if a file is selected
//   if (selectedFile) {
//     imageUrl = await uploadImageToSupabase(selectedFile, newItemName);
//     if (!imageUrl) return; // Stop if image upload fails
//   }
//     const newItem = {
//       itemname: newItemName,
//       quantity: newQuantity,
//       redeempoints: newRedeemPoints,
//       itemimg: imageUrl,
//       activestatus: 'Y',
//       createdby: user?.userid,
//       updatedby: user?.userid,
//       created: new Date().toISOString(),
//       lastupdatetime: new Date().toISOString(),
//     };
//     const { error } = await supabase
//       .from('giftitem_master')
//       .insert([newItem]);

//     if (error) console.error('Error adding item:', error.message);
//     else {
//       setNewItemName('');
//       setNewQuantity('');
//       setNewRedeemPoints('');
//       setSelectedFile(null);
//       setShowAddPopup(false);
//       fetchItems();
//     }
//   };

//   const handleEditItem = async () => {
//     if (currentItem) {
//       let imageUrl = currentItem.itemimg;
//       if (selectedFile) {
//         imageUrl = await uploadImageToSupabase(selectedFile, newItemName);
//         if (!imageUrl) return; // Stop if image upload fails
//       }
//       const { error } = await supabase
//         .from('giftitem_master')
//         .update({ itemname: newItemName, quantity: newQuantity, redeempoints: newRedeemPoints, lastupdatetime: new Date().toISOString(),updatedby: user?.userid, itemimg: imageUrl,})
//         .eq('itemid', currentItem.itemid);

//       if (error) console.error('Error editing item:', error.message);
//       else {
//         setNewItemName('');
//         setNewQuantity('');
//         setNewRedeemPoints('');
//         setSelectedFile(null);
//         setShowEditPopup(false);
//         fetchItems();
//       }
//     }
//   };

//   const handleDeleteItem = async (itemid) => {
//     const { error } = await supabase
//       .from('giftitem_master')
//       .delete()
//       .eq('itemid', itemid);

//     if (error) console.error('Error deleting item:', error.message);
//     else fetchItems();
//   };

//   return (
//     <main id='main' className='main'>
//       <h2><center>Gift Item Master</center></h2>
//       <div className="item-table">
//         <table>
//           <thead>
//             <tr>
//               <th><center>Sl No</center></th>
//               <th><center>Item Name</center></th>
//               <th><center>Qty</center></th>
//               <th><center>Redeem Points</center></th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => (
//               <tr key={item.itemid}>
//                 <td><center>{index + 1}</center></td>
//                 <td><center>{item.itemname.trim()}</center></td>
//                 <td><center>{item.quantity}</center></td>
//                 <td><center>{item.redeempoints}</center></td>
//                 <td className="actions">
//                   <button 
//                     onClick={() => {
//                       setCurrentItem(item);
//                       setNewItemName(item.itemname.trim());
//                       setNewQuantity(item.quantity);
//                       setNewRedeemPoints(item.redeempoints);
//                       setShowEditPopup(true);
//                     }} 
//                     className="action-button edit-button"
//                   >
//                     <FaEdit className="icon" />
//                   </button>
//                   <button 
//                     onClick={() => handleDeleteItem(item.itemid)} 
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
//       <div className="add-button-container">
//         <button onClick={() => setShowAddPopup(true)}>Add New Item</button>
//       </div>

//       {/* Add Item Popup */}
//       {showAddPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Add New Gift Item Master</h5>
//             <label>
//               Item Name
//             <input 
//               type="text" 
//               placeholder="Item Name" 
//               value={newItemName} 
//               onChange={(e) => setNewItemName(e.target.value)} 
//             />
//             </label>
//             <label>
//             Quantity
//             <input 
//               type="number" 
//               placeholder="Quantity" 
//               value={newQuantity} 
//               onChange={(e) => setNewQuantity(e.target.value)} 
//             />
//             </label>
//             <label>
//             Redeem Points
//             <input 
//               type="number" 
//               placeholder="Redeem Points" 
//               value={newRedeemPoints} 
//               onChange={(e) => setNewRedeemPoints(e.target.value)} 
//             />
//             </label>
//             <label>
//               Upload Image
//               <input 
//                 type="file" 
//                 onChange={(e) => handleFileChange(e)} 
//               />
//             </label>
//             <div className="popup-buttons">
//               <button onClick={handleAddItem}>Submit</button>
//               <button onClick={() => setShowAddPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Item Popup */}
//       {showEditPopup && (
//         <div className="popup">
//           <div className="popup-inner">
//             <h5>Edit Gift Item Master</h5>
//             <label>
//               Item Name
//             <input 
//               type="text" 
//               placeholder="Item Name" 
//               value={newItemName} 
//               onChange={(e) => setNewItemName(e.target.value)} 
//             />
//             </label>
//             <label>
//             Quantity
//             <input 
//               type="number" 
//               placeholder="Quantity" 
//               value={newQuantity} 
//               onChange={(e) => setNewQuantity(e.target.value)} 
//             />
//             </label>
//             <label>
//             Redeem Points
//             <input 
//               type="number" 
//               placeholder="Redeem Points" 
//               value={newRedeemPoints} 
//               onChange={(e) => setNewRedeemPoints(e.target.value)} 
//             />
//             </label>
//             <label>
//               Upload Image
//               <input 
//                 type="file" 
//                 onChange={(e) => handleFileChange(e)} 
//               />
//             </label>
//             <div className="popup-buttons">
//               <button onClick={handleEditItem}>Submit</button>
//               <button onClick={() => setShowEditPopup(false)}>Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// export default GiftItemMaster;
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../../supabaseClient';
import './GiftItemMaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { UserContext } from '../../context/UserContext';

function GiftItemMaster() {
  const [items, setItems] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newRedeemPoints, setNewRedeemPoints] = useState('');
  const [newRole, setNewRole] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data: items, error } = await supabase
      .from('giftitem_master')
      .select('*')
      .eq('activestatus', 'Y')
      .order('itemid', { ascending: true });

    if (error) console.error('Error fetching items:', error.message);
    else setItems(items);
  };

  const resetForm = () => {
    setNewItemName('');
    setNewQuantity('');
    setNewRedeemPoints('');
    setNewRole('');
    setImagePreviewUrl('');
    setShowAddPopup(false);
    setShowEditPopup(false);
    setCurrentItem(null);
    setErrors({});
    setImageUploading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newItemName) newErrors.itemname = "Please enter Item Name.";
    if (!newQuantity || isNaN(parseInt(newQuantity)) || parseInt(newQuantity) <= 0) newErrors.quantity = "Please enter a valid Quantity greater than 0.";
    if (!newRedeemPoints || isNaN(parseInt(newRedeemPoints)) || parseInt(newRedeemPoints) <= 0) newErrors.redeempoints = "Please enter a valid Redeem Points greater than 0.";
    if (!newRole) newErrors.newRole = "Please Select a Role"
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;
    setShowAddPopup(false);
    const newItem = {
      itemname: newItemName,
      quantity: newQuantity,
      redeempoints: newRedeemPoints,
      role: newRole,
      activestatus: 'Y',
      createdby: user?.userid,
      updatedby: user?.userid,
      itemimg: imagePreviewUrl,
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };
  
    const { data, error } = await supabase
      .from('giftitem_master')
      .insert([newItem])
      .select('*');

      // console.log('Data:', data);
      // console.log('Error:', error);
  
    if (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    } else if (data && data.length > 0) {
      alert('Added Gift Item Successfully!!!');
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 500); // delay page reload by 500ms
    }
  };

  const handleEditItem = async () => {
    if (!currentItem) return;

    if (!validateForm()) return;

    setShowEditPopup(false)

    const updatedItem = {
      itemname: newItemName,
      quantity: newQuantity,
      redeempoints: newRedeemPoints,
      role: newRole,
      itemimg: imagePreviewUrl,
    };

    const { data, error } = await supabase
      .from('giftitem_master')
      .update(updatedItem)
      .eq('itemid', currentItem.itemid)
      .select('*');

    if (error) {
      console.error('Error updating item:', error);
    } else {
      const updatedItems = items.map((item) => (item.itemid === currentItem.itemid ? data[0] : item));
      setItems(updatedItems);
      alert('Edited Gift Item Successfully!!!');
      resetForm();
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    setImageUploading(true);

    const fileName = `${newItemName}_${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage.from('giftitem').upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      setImageUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from('giftitem').getPublicUrl(fileName);
    setImagePreviewUrl(publicUrlData.publicUrl);
    setImageUploading(false);
  };

  const openAddPopup = () => {
    resetForm();
    setShowAddPopup(true);
  };

  const handleEditButtonClick = (item) => {
    setCurrentItem(item);
    setNewItemName(item.itemname.trim());
    setNewQuantity(item.quantity);
    setNewRedeemPoints(item.redeempoints);
    setNewRole(item.role);

    if (item.itemimg) {
      setImagePreviewUrl(item.itemimg);
    } else {
      setImagePreviewUrl('');
    }

    setShowEditPopup(true);
  };

  const handleDeleteItem = async (itemid) => {
    const { error } = await supabase
      .from('giftitem_master')
      .delete()
      .eq('itemid', itemid);

    if (error) console.error('Error deleting item:', error.message);
    else fetchItems();
  };

  return (
    <main id='main' className='main'>
      <h2><center>Gift Item Master</center></h2>
      <div className="item-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl No</center></th>
              <th><center>Item Name</center></th>
              <th><center>Qty</center></th>
              <th><center>Redeem Points</center></th>
              <th><center>Role</center></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.itemid}>
                <td><center>{index + 1}</center></td>
                <td><center>{item.itemname.trim()}</center></td>
                <td><center>{item.quantity}</center></td>
                <td><center>{item.redeempoints}</center></td>
                <td><center>{item.role}</center></td>
                <td className="actions">
                  <button 
                    onClick={() => handleEditButtonClick(item)} 
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(item.itemid)} 
                    className="action-button delete-button"
                  >
                    <FaTrash className="icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="add-button-container">
        <button onClick={openAddPopup}>Add New Item</button>
      </div>

      {/* Add Item Popup */}
      {showAddPopup && (
        <div 
          className="popup" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddPopup(false);
            }
          }}
        >
          <div className="popup-inner">
            <h5>Add New Gift Item Master</h5>
            <label>
              Item Name
              <input 
                type="text" 
                placeholder="Item Name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
              />
              {errors.itemname && <span style={{ color: 'red' }}>{errors.itemname}</span>}
            </label>
            <label>
              Quantity
              <input 
                type="number" 
                placeholder="Quantity" 
                value={newQuantity} 
                onChange={(e) => setNewQuantity(e.target.value)} 
              />
              {errors.quantity && <span style={{ color: 'red' }}>{errors.quantity}</span>}
            </label>
            <label>
              Redeem Points
              <input 
                type="number" 
                placeholder="Redeem Points" 
                value={newRedeemPoints} 
                onChange={(e) => setNewRedeemPoints(e.target.value)} 
              />
              {errors.redeempoints && <span style={{ color: 'red' }}>{errors.redeempoints}</span>}
            </label>
            <label>
              Role <br />
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)} 
              >
                <option value="" disabled hidden>Select a role</option>
                <option value="Retailer">Retailer</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Both">Both</option>
              </select>
              {errors.newRole && <span style={{ color: 'red' }}>{errors.newRole}</span>}
            </label>
            <label>
              Upload Image
              <input 
                type="file" 
                onChange={(e) => handleImageUpload(e.target.files[0])} 
              />
            </label>
            {imageUploading ? (
              <p>Uploading image...</p>
            ) : (
              imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
            <button 
              onClick={handleAddItem}
            >
              Add Item
            </button>
            <button onClick={() => setShowAddPopup(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Item Popup */}
      {showEditPopup && (
        <div 
          className="popup" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditPopup(false);
            }
          }}
        >
          <div className="popup-inner">
            <h5>Edit Gift Item Master</h5>
            <label>
              Item Name
              <input 
                type="text" 
                placeholder="Item Name" 
                value={newItemName} 
                onChange={(e) => setNewItemName(e.target.value)} 
              />
              {errors.itemname && <span style={{ color: 'red' }}>{errors.itemname}</span>}
            </label>
            <label>
              Quantity
              <input 
                type="number" 
                placeholder="Quantity" 
                value={newQuantity} 
                onChange={(e) => setNewQuantity(e.target.value)} 
              />
              {errors.quantity && <span style={{ color: 'red' }}>{errors.quantity}</span>}
            </label>
            <label>
              Redeem Points
              <input 
                type="number" 
                placeholder="Redeem Points" 
                value={newRedeemPoints} 
                onChange={(e) => setNewRedeemPoints(e.target.value)} 
              />
              {errors.redeempoints && <span style={{ color: 'red' }}>{errors.redeempoints}</span>}
            </label>
            <label>
              Role <br />
              <select 
                value={newRole} 
                onChange={(e) => setNewRole(e.target.value)} 
              >
                <option value="" disabled hidden>Select a role</option>
                <option value="Retailer">Retailer</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Both">Both</option>
              </select>
              {errors.newRole && <span style={{ color: 'red' }}>{errors.newRole}</span>}
            </label>
            <label>
              Upload Image
              <input 
                type="file" 
                onChange={(e) => handleImageUpload(e.target.files[0])} 
              />
            </label>
            {imageUploading ? (
              <p>Uploading image...</p>
            ) : (
              imagePreviewUrl && <img src={imagePreviewUrl} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
            <button onClick={handleEditItem}>Update Item</button>
            <button onClick={() => setShowEditPopup(false)}>Cancel</button>
          </div>
        </div>
        )}
      </main>
    );
  }
  
  export default GiftItemMaster;
