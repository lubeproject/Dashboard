import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './GiftItemMaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function GiftItemMaster() {
  const [items, setItems] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newRedeemPoints, setNewRedeemPoints] = useState('');
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data: items, error } = await supabase
      .from('giftitem_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active items

    if (error) console.error('Error fetching items:', error.message);
    else setItems(items);
  };

  const handleAddItem = async () => {
    const newItem = {
      itemname: newItemName,
      quantity: newQuantity,
      redeempoints: newRedeemPoints,
      activestatus: 'Y',
      // createdby: 'Admin', // Replace with actual user
      // updatedby: 'Admin',
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('giftitem_master')
      .insert([newItem]);

    if (error) console.error('Error adding item:', error.message);
    else {
      setNewItemName('');
      setNewQuantity('');
      setNewRedeemPoints('');
      setShowAddPopup(false);
      fetchItems();
    }
  };

  const handleEditItem = async () => {
    if (currentItem) {
      const { error } = await supabase
        .from('giftitem_master')
        .update({ itemname: newItemName, quantity: newQuantity, redeempoints: newRedeemPoints, lastupdatetime: new Date().toISOString() })
        .eq('itemid', currentItem.itemid);

      if (error) console.error('Error editing item:', error.message);
      else {
        setNewItemName('');
        setNewQuantity('');
        setNewRedeemPoints('');
        setShowEditPopup(false);
        fetchItems();
      }
    }
  };

  const handleDeleteItem = async (itemid) => {
    const { error } = await supabase
      .from('giftitem_master')
      .update({ activestatus: 'N' })
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
                <td className="actions">
                  <button 
                    onClick={() => {
                      setCurrentItem(item);
                      setNewItemName(item.itemname.trim());
                      setNewQuantity(item.quantity);
                      setNewRedeemPoints(item.redeempoints);
                      setShowEditPopup(true);
                    }} 
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
        <button onClick={() => setShowAddPopup(true)}>Add New Item</button>
      </div>

      {/* Add Item Popup */}
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Add New Gift Item Master</h5>
            <input 
              type="text" 
              placeholder="Item Name" 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Quantity" 
              value={newQuantity} 
              onChange={(e) => setNewQuantity(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Redeem Points" 
              value={newRedeemPoints} 
              onChange={(e) => setNewRedeemPoints(e.target.value)} 
            />
            <div className="popup-buttons">
              <button onClick={handleAddItem}>Submit</button>
              <button onClick={() => setShowAddPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Popup */}
      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Edit Gift Item Master</h5>
            <input 
              type="text" 
              placeholder="Item Name" 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Quantity" 
              value={newQuantity} 
              onChange={(e) => setNewQuantity(e.target.value)} 
            />
            <input 
              type="number" 
              placeholder="Redeem Points" 
              value={newRedeemPoints} 
              onChange={(e) => setNewRedeemPoints(e.target.value)} 
            />
            <div className="popup-buttons">
              <button onClick={handleEditItem}>Submit</button>
              <button onClick={() => setShowEditPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default GiftItemMaster;
