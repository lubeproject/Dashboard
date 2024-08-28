import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './ItemMaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ItemMaster() {
  const [itemMasters, setItemMasters] = useState([]);
  const [segments, setSegments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newItemMasterName, setNewItemMasterName] = useState('');
  const [newNoofItemsinBox, setNewNoofItemsinBox] = useState('');
  const [newItemWeight, setNewItemWeight] = useState('');
  const [newItemRRPrice, setNewItemRRPrice] = useState('');
  const [newSegmentId, setNewSegmentId] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [currentItemMaster, setCurrentItemMaster] = useState(null);

  useEffect(() => {
    fetchItemMasters();
    fetchSegments();
    fetchCategories();
  }, []);

  const fetchItemMasters = async () => {
    const { data: itemMasters, error } = await supabase
      .from('item_master')
      .select('*')
      .eq('activestatus', 'Y');

    if (error) console.error('Error fetching items:', error.message);
    else setItemMasters(itemMasters);
  };

  const fetchSegments = async () => {
    const { data, error } = await supabase
      .from('segment_master')
      .select('segmentid, segmentname')
      .eq('activestatus', 'Y');

    if (error) {
      console.error('Error fetching segments:', error.message);
    } else {
      setSegments(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('category_master')
      .select('categoryid, categoryname')
      .eq('activestatus', 'Y');

    if (error) {
      console.error('Error fetching categories:', error.message);
    } else {
      setCategories(data);
    }
  };

  const handleAddItemMaster = async () => {
    if (!newItemMasterName || !newSegmentId || !newCategoryId || !newNoofItemsinBox || !newItemWeight || !newItemRRPrice) {
      alert('Please fill in all the fields.');
      return;
    }

    const segmentIdNumber = Number(newSegmentId);
    const categoryIdNumber = Number(newCategoryId);

    const selectedSegment = segments.find(segment => segment.segmentid === segmentIdNumber);
    const selectedCategory = categories.find(category => category.categoryid === categoryIdNumber);

    if (!selectedSegment || !selectedCategory) {
      alert('Selected segment or category not found. Please select valid options.');
      return;
    }

    const newItemMaster = {
      itemname: newItemMasterName ? newItemMasterName.trim() : '',
      noofitemsinbox: newNoofItemsinBox,
      itemweight: newItemWeight,
      rrprice: newItemRRPrice,
      activestatus: 'Y',
      segmentid: segmentIdNumber,
      segmentname: selectedSegment.segmentname ? selectedSegment.segmentname.trim() : '',
      categoryid: categoryIdNumber,
      categoryname: selectedCategory.categoryname ? selectedCategory.categoryname.trim() : '',
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('item_master')
      .insert([newItemMaster]);

    if (error) {
      console.error('Error adding Item Master:', error.message);
      alert('Failed to add item master. Please try again.');
    } else {
      resetForm();
      setShowAddPopup(false);
      fetchItemMasters();
    }
  };

  const handleEditItemMaster = async () => {
    if (!currentItemMaster) return;

    const segmentIdNumber = Number(newSegmentId);
    const categoryIdNumber = Number(newCategoryId);

    const selectedSegment = segments.find(segment => segment.segmentid === segmentIdNumber);
    const selectedCategory = categories.find(category => category.categoryid === categoryIdNumber);

    if (!selectedSegment || !selectedCategory) {
      alert('Selected segment or category not found. Please select valid options.');
      return;
    }

    const { error } = await supabase
      .from('item_master')
      .update({
        itemname: newItemMasterName ? newItemMasterName.trim() : '',
        noofitemsinbox: newNoofItemsinBox,
        itemweight: newItemWeight,
        rrprice: newItemRRPrice,
        segmentid: segmentIdNumber,
        segmentname: selectedSegment.segmentname ? selectedSegment.segmentname.trim() : '',
        categoryid: categoryIdNumber,
        categoryname: selectedCategory.categoryname ? selectedCategory.categoryname.trim() : '',
        lastupdatetime: new Date().toISOString(),
      })
      .eq('itemid', currentItemMaster.itemid);

    if (error) {
      console.error('Error editing item:', error.message);
      alert('Failed to edit item master. Please try again.');
    } else {
      resetForm();
      setShowEditPopup(false);
      fetchItemMasters();
    }
  };

  const handleDeleteItemMaster = async (itemid) => {
    const { error } = await supabase
      .from('item_master')
      .update({ activestatus: 'N', lastupdatetime: new Date().toISOString() })
      .eq('itemid', itemid);

    if (error) console.error('Error deleting item:', error.message);
    else fetchItemMasters();
  };

  const resetForm = () => {
    setNewItemMasterName('');
    setNewNoofItemsinBox('');
    setNewItemWeight('');
    setNewItemRRPrice('');
    setNewSegmentId('');
    setNewCategoryId('');
    setCurrentItemMaster(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddPopup(false);
    setShowEditPopup(false);
  };

  return (
    <main id='main' className='main'>
      <h2><center>Item Master</center></h2>
      <div className="item-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl No</center></th>
              <th><center>Item Name</center></th>
              <th><center>Segment</center></th>
              <th><center>Category</center></th>
              <th><center>Item Nos.</center></th>
              <th><center>Item Wt.</center></th>
              <th><center>RRP</center></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemMasters.map((itemMaster, index) => (
              <tr key={itemMaster.itemid}>
                <td><center>{index + 1}</center></td>
                <td><center>{itemMaster.itemname ? itemMaster.itemname.trim() : ''}</center></td>
                <td><center style={{ color: 'red' }}>{itemMaster.segmentname ? itemMaster.segmentname.trim() : ''}</center></td>
                <td><center style={{ color: 'red' }}>{itemMaster.categoryname ? itemMaster.categoryname.trim() : ''}</center></td>
                <td><center>{itemMaster.noofitemsinbox}</center></td>
                <td><center>{itemMaster.itemweight}</center></td>
                <td><center>{itemMaster.rrprice}</center></td>
                <td className="actions">
                  <button
                    onClick={() => {
                      setCurrentItemMaster(itemMaster);
                      setNewItemMasterName(itemMaster.itemname ? itemMaster.itemname.trim() : '');
                      setNewNoofItemsinBox(itemMaster.noofitemsinbox);
                      setNewItemWeight(itemMaster.itemweight);
                      setNewItemRRPrice(itemMaster.rrprice);
                      setNewSegmentId(itemMaster.segmentid);
                      setNewCategoryId(itemMaster.categoryid);
                      setShowEditPopup(true);
                    }}
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button
                    onClick={() => handleDeleteItemMaster(itemMaster.itemid)}
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
        <button onClick={() => {
          resetForm();
          setShowAddPopup(true);
        }}>Add New Item Master</button>
      </div>

      {/* Add Item Master Popup */}
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Add New Item Master</h5>
            <select
              value={newSegmentId}
              onChange={(e) => setNewSegmentId(e.target.value)}
            >
              <option value="">Select Segment</option>
              {segments.map(segment => (
                <option key={segment.segmentid} value={segment.segmentid}>
                  {segment.segmentname ? segment.segmentname.trim() : ''}
                </option>
              ))}
            </select>
            <select
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.categoryid} value={category.categoryid}>
                  {category.categoryname ? category.categoryname.trim() : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Item Master Name"
              value={newItemMasterName}
              onChange={(e) => setNewItemMasterName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Number of Items in Box"
              value={newNoofItemsinBox}
              onChange={(e) => setNewNoofItemsinBox(e.target.value)}
            />
            <input
              type="text"
              placeholder="Item Weight"
              value={newItemWeight}
              onChange={(e) => setNewItemWeight(e.target.value)}
            />
            <input
              type="text"
              placeholder="RRP"
              value={newItemRRPrice}
              onChange={(e) => setNewItemRRPrice(e.target.value)}
            />
            <div className='popup-buttons'>
            <button onClick={handleAddItemMaster}>Add Item Master</button>
            <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Master Popup */}
      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Edit Item Master</h5>
            <select
              value={newSegmentId}
              onChange={(e) => setNewSegmentId(e.target.value)}
            >
              <option value="">Select Segment</option>
              {segments.map(segment => (
                <option key={segment.segmentid} value={segment.segmentid}>
                  {segment.segmentname ? segment.segmentname.trim() : ''}
                </option>
              ))}
            </select>
            <select
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.categoryid} value={category.categoryid}>
                  {category.categoryname ? category.categoryname.trim() : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Item Master Name"
              value={newItemMasterName}
              onChange={(e) => setNewItemMasterName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Number of Items in Box"
              value={newNoofItemsinBox}
              onChange={(e) => setNewNoofItemsinBox(e.target.value)}
            />
            <input
              type="text"
              placeholder="Item Weight"
              value={newItemWeight}
              onChange={(e) => setNewItemWeight(e.target.value)}
            />
            <input
              type="text"
              placeholder="RRP"
              value={newItemRRPrice}
              onChange={(e) => setNewItemRRPrice(e.target.value)}
            />
            <div className='popup-buttons'>
            <button onClick={handleEditItemMaster}>Save Changes</button>
            <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ItemMaster;

