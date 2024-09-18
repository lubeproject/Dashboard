import React, { useEffect, useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './SegmentMaster.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

function SegmentMaster() {
  const [segments, setSegments] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [currentSegment, setCurrentSegment] = useState(null);

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    const { data: segments, error } = await supabase
      .from('segment_master')
      .select('*')
      .eq('activestatus', 'Y'); // Filter active segments

      if (error) console.error('Error fetching segments:', error.message);
      else setSegments(segments);
  };

  const handleAddSegment = async () => {
    const newSegment = {
      segmentname: newSegmentName,
      activestatus: 'Y',
      // createdby: 'Admin', // Replace with actual user
      // updatedby: 'Admin',
      created: new Date().toISOString(),
      lastupdatetime: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('segment_master')
      .insert([newSegment]);

    if (error) {
      console.error('Error adding segment:', error.message);
    } else {
      setNewSegmentName('');
      setShowAddPopup(false);
      fetchSegments();
    }
  };

  const handleEditSegment = async () => {
    if (currentSegment) {
      const { error } = await supabase
        .from('segment_master')
        .update({ segmentname: newSegmentName, lastupdatetime: new Date().toISOString() })
        .eq('segmentid', currentSegment.segmentid);

      if (error) console.error('Error editing segment:', error.message);
      else {
        setNewSegmentName('');
        setShowEditPopup(false);
        fetchSegments();
      }
    }
  };

  const handleDeleteSegment = async (segmentid) => {
    const { error } = await supabase
      .from('segment_master')
      .update({ activestatus: 'N' })
      .eq('segmentid', segmentid);

    if (error) console.error('Error deleting segment:', error.message);
    else fetchSegments();
  };


  return (
    <main id='main' className='main'>
      <h2><center>Segment Master</center></h2>
      <div className="credit-term-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl No</center></th>
              <th><center>Segment Name</center></th>
              <th><center>Actions</center></th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment, index) => (
              <tr key={segment.segmentid}>
                <td><center>{index + 1}</center></td>
                <td><center>{segment.segmentname.trim()}</center></td>
                <td className="actions">
                  <button 
                    onClick={() => {
                      setCurrentSegment(segment);
                      setNewSegmentName(segment.segmentname.trim());
                      setShowEditPopup(true);
                    }} 
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSegment(segment.segmentid)} 
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
        <button onClick={() => setShowAddPopup(true)}>Add New Segment</button>
      </div>

      {/* Add Category Popup */}
      {showAddPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Add New Segment</h5>
            <input
              type="text"
              placeholder="Segment Name"
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleAddSegment}>Submit</button>
              <button onClick={() => setShowAddPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Popup */}
      {showEditPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h5>Edit Segment</h5>
            <input
              type="text"
              placeholder="Segment Name"
              value={newSegmentName}
              onChange={(e) => setNewSegmentName(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleEditSegment}>Submit</button>
              <button onClick={() => setShowEditPopup(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default SegmentMaster;
