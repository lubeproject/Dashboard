import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './CreditTermItemMaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function CreditTermItemMaster() {
  const [creditTerms, setCreditTerms] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newCreditTermName, setNewCreditTermName] = useState('');
  const [newCreditTermDays, setNewCreditTermDays] = useState('');
  const [currentCreditTerm, setCurrentCreditTerm] = useState(null);

  useEffect(() => {
    fetchCreditTerms();
  }, []);

  const fetchCreditTerms = async () => {
    const { data: creditTerms, error } = await supabase
      .from('credititem_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active credit terms

    if (error) console.error('Error fetching credit terms:', error.message);
    else setCreditTerms(creditTerms);
  };

  const handleAddCreditTerm = async () => {
    const newCreditTerm = {
      credittermname: newCreditTermName,
      limitdays: newCreditTermDays,
      activestatus: 'Y',
      // createdby: 'Admin', // Replace with actual user
      // updatedby: 'Admin',
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };
    const { error } = await supabase
      .from('credititem_master')
      .insert([newCreditTerm]);

    if (error) console.error('Error adding credit term:', error.message);
    else {
      setNewCreditTermName('');
      setNewCreditTermDays('');
      setShowAddPopup(false);
      fetchCreditTerms();
    }
  };

  const handleEditCreditTerm = async () => {
    if (currentCreditTerm) {
      const { error } = await supabase
        .from('credititem_master')
        .update({ credittermname: newCreditTermName, limitdays: newCreditTermDays, lastupdatetime: new Date().toISOString() })
        .eq('credittermid', currentCreditTerm.credittermid);

      if (error) console.error('Error editing credit term:', error.message);
      else {
        setNewCreditTermName('');
        setNewCreditTermDays('');
        setShowEditPopup(false);
        fetchCreditTerms();
      }
    }
  };

  const handleDeleteCreditTerm = async (credittermid) => {
    const { error } = await supabase
      .from('credititem_master')
      .update({ activestatus: 'N' })
      .eq('credittermid', credittermid);

    if (error) console.error('Error deleting credit term:', error.message);
    else fetchCreditTerms();
  };

  return (
    <main id='main' className='main'>
      <h2><center>Credit Term Item Master</center></h2>
      <div className="credit-term-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl No</center></th>
              <th><center>Credit Term Name</center></th>
              <th><center>Days</center></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creditTerms.map((creditTerm, index) => (
              <tr key={creditTerm.credittermid}>
                <td><center>{index + 1}</center></td>
                <td><center>{creditTerm.credittermname.trim()}</center></td>
                <td><center>{creditTerm.limitdays}</center></td>
                <td className="actions">
                  <button 
                    onClick={() => {
                      setCurrentCreditTerm(creditTerm);
                      setNewCreditTermName(creditTerm.credittermname.trim());
                      setNewCreditTermDays(creditTerm.limitdays);
                      setShowEditPopup(true);
                    }} 
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCreditTerm(creditTerm.credittermid)} 
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
        <button onClick={() => setShowAddPopup(true)}>Add New Credit Item Term</button>
      </div>

      {/* Add Credit Term Popup */}
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Add New Credit Item Term</h5>
            <input
              type="text"
              placeholder="Credit Term Name"
              value={newCreditTermName}
              onChange={(e) => setNewCreditTermName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Days"
              value={newCreditTermDays}
              onChange={(e) => setNewCreditTermDays(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddCreditTerm}>Submit</button>
              <button onClick={() => setShowAddPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Credit Term Popup */}
      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Edit Credit Item Term</h5>
            <input
              type="text"
              placeholder="Credit Term Name"
              value={newCreditTermName}
              onChange={(e) => setNewCreditTermName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Days"
              value={newCreditTermDays}
              onChange={(e) => setNewCreditTermDays(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleEditCreditTerm}>Submit</button>
              <button onClick={() => setShowEditPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default CreditTermItemMaster;
