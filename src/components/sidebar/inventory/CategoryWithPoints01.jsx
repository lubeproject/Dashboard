import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './CategoryWithPoints.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function CategoryWithPoints() {
  const [categories, setCategories] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryPoints, setNewCategoryPoints] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data: categories, error } = await supabase
      .from('category_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active categories

    if (error) console.error('Error fetching categories:', error.message);
    else setCategories(categories);
  };

  const handleAddCategory = async () => {
    const newCategory = {
      categoryname: newCategoryName,
      pointsperltr: newCategoryPoints,
      activestatus: 'Y',
      // createdby: 'Admin', // Replace with actual user
      // updatedby: 'Admin',
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('category_master')
      .insert([newCategory]);

    if (error) console.error('Error adding category:', error.message);
    else {
      setNewCategoryName('');
      setNewCategoryPoints('');
      setShowAddPopup(false);
      fetchCategories();
    }
  };

  const handleEditCategory = async () => {
    if (currentCategory) {
      const { error } = await supabase
        .from('category_master')
        .update({ categoryname: newCategoryName, pointsperltr: newCategoryPoints, lastupdatetime: new Date().toISOString() })
        .eq('categoryid', currentCategory.categoryid);

      if (error) console.error('Error editing category:', error.message);
      else {
        setNewCategoryName('');
        setNewCategoryPoints('');
        setShowEditPopup(false);
        fetchCategories();
      }
    }
  };

  const handleDeleteCategory = async (categoryid) => {
    const { error } = await supabase
      .from('category_master')
      .update({ activestatus: 'N' })
      .eq('categoryid', categoryid);

    if (error) console.error('Error deleting category:', error.message);
    else fetchCategories();
  };

  return (
    <main id='main' className='main'>
      <h2><center>Category Master</center></h2>
      <div className="category-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl No</center></th>
              <th><center>Category Name</center></th>
              <th><center>Points Per Liter</center></th>
              <th><center>Actions</center></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.categoryid}>
                <td><center>{index + 1}</center></td>
                <td><center>{category.categoryname.trim()}</center></td>
                <td><center>{category.pointsperltr}</center></td>
                <td className="actions">
                  <button 
                    onClick={() => {
                      setCurrentCategory(category);
                      setNewCategoryName(category.categoryname.trim());
                      setNewCategoryPoints(category.pointsperltr);
                      setShowEditPopup(true);
                    }} 
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.categoryid)} 
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
        <button onClick={() => setShowAddPopup(true)}>Add New Category</button>
      </div>

      {/* Add Category Popup */}
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Add New Category</h5>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Points Per Liter"
              value={newCategoryPoints}
              onChange={(e) => setNewCategoryPoints(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddCategory}>Submit</button>
              <button onClick={() => setShowAddPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Popup */}
      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Edit Category</h5>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Points Per Liter"
              value={newCategoryPoints}
              onChange={(e) => setNewCategoryPoints(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleEditCategory}>Submit</button>
              <button onClick={() => setShowEditPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CategoryWithPoints;
