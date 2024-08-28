import React, { useState, useEffect } from 'react';
import "./ItemRequest.css";
import Select from 'react-select';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';  
import { supabase } from '../../../supabaseClient'; // Import your Supabase client

export default function ItemRequest() {
  const [retailersOptions, setRetailersOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [show, setShow] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isValidModel, setIsValidModel] = useState(true);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchRetailers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'retailer');

      if (error) console.error('Error fetching Retailers:', error);
      else setRetailersOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
    };

    // Fetch items from the item_master table
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('item_master')
        .select('itemid, itemname, noofitemsinbox, itemweight, rrprice,categoryid,categoryname,segmentname,segmentid')
        .eq('activestatus', 'Y');

      if (error) console.error('Error fetching items:', error);
      else setItems(data.map(item => ({ value: item.itemid, label: item.itemname, noofitemsinbox: item.noofitemsinbox,
         itemweight: item.itemweight, rrprice: item.rrprice,segmentid:item.segmentid,
        categoryid:item.categoryid,categoryname: item.categoryname,segmentname:item.segmentname })));
    };

    fetchRetailers();
    fetchItems();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (selectedOption) => {
    setSelectedRetailer(selectedOption);
    setIsValid(true);
  };

  const handleModelSubmit = (e) => {
    e.preventDefault();

    if (!selectedItem || !quantity) {
        setIsValidModel(false);
        return;
    }

    // Add the item to the list of selected items
    const newItem = {
        id: selectedItem.value,
        name: selectedItem.label,
        quantity: quantity,
        noofitemsinbox: selectedItem.noofitemsinbox,
        itemweight: selectedItem.itemweight,
        rrprice: selectedItem.rrprice, // Include rrprice for calculating total amount
        categoryid : selectedItem.categoryid,
        categoryname: selectedItem.categoryname,
        segmentid: selectedItem.segmentid,
        segmentname: selectedItem.segmentname
    };
    setSelectedItems([...selectedItems, newItem]);
    setSelectedItem('');
    setQuantity('');
    handleClose();
};

const handleEditItem = (index) => {
  const item = selectedItems[index];
  setSelectedItem({ value: item.itemid, label: item.itemname, noofitemsinbox: item.noofitemsinbox,
    itemweight: item.itemweight, rrprice: item.rrprice,segmentid:item.segmentid,
   categoryid:item.categoryid,categoryname: item.categoryname,segmentname:item.segmentname });
  setQuantity(item.quantity);
  handleShow();
  // Remove the item from the list temporarily until updated
  const updatedItems = selectedItems.filter((_, i) => i !== index);
  setSelectedItems(updatedItems);
};

const handleDeleteItem = (index) => {
  const updatedItems = selectedItems.filter((_, i) => i !== index);
  setSelectedItems(updatedItems);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedRetailer || selectedItems.length === 0) {
    setIsValid(false);
    return;
  }

  // Calculate total quantity, total amount, and total liters
  const totalQty = selectedItems.reduce((acc, item) => acc + (parseInt(item.quantity, 10) * item.noofitemsinbox), 0);
  const totalAmount = selectedItems.reduce((acc, item) => acc + (parseInt(item.quantity, 10) * item.rrprice), 0);
  const totalLiters = selectedItems.reduce((acc, item) => acc + (parseInt(item.quantity, 10) * item.itemweight * item.noofitemsinbox), 0);

  // Prepare request data to insert into retailer_request table
  const requestData = {
    retailerid: selectedRetailer.value,
    retailername: selectedRetailer.name,
    retailershopname: selectedRetailer.label || '', // Use an empty string if shop name is not available
    role: 'retailer',
    totalliters: totalLiters,
    totalqty: totalQty,
    deliveredqty: 0,
    totalamount: totalAmount,
    orderstatus: 'pending',
    orderref: '', // Add a reference if available
    // createdby: 1, // Replace with the actual user ID or username if available
    // updatedby: 1, // Replace with the actual user ID or username if available
    createdtime: new Date().toISOString(), // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
    updatedtime: new Date().toISOString() // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
  };

  try {
    // Insert request data into retailer_request table
    const { data: requestDataResponse, error: requestError } = await supabase
      .from('retailer_request')
      .insert([requestData])
      .select('reqid') // Retrieve all columns or specify the columns you need
      .single();

    if (requestError) {
      console.error('Error inserting data:', requestError);
      throw requestError;
    }

    if (!requestDataResponse || !requestDataResponse.reqid) {
      throw new Error('No ID returned from retailer_request insert operation');
    }
    const reqId = requestDataResponse.reqid;
    console.log('Item Request details saved:', requestDataResponse);


    // Store each selected item in retailer_request_items table
    for (let i = 0; i < selectedItems.length; i++) {
      const selectedItem = selectedItems[i];
      const quantity = parseInt(selectedItem.quantity, 10); // Ensure quantity is an integer
      const totalQty = quantity * selectedItem.noofitemsinbox;
      const totalPrice = quantity * selectedItem.rrprice;
      const totalLiters = quantity * selectedItem.itemweight * selectedItem.noofitemsinbox;

      console.log('Selected Item:', selectedItem);
      

      if (!selectedItem.categoryid) {
        alert('Category ID is missing for the selected item. Please select another item.');
        return;
    }
    
      const requestItemData = {
        reqid: reqId, // Use the same request ID from requestData
        itemid: selectedItem.id,
        categoryid: selectedItem.categoryid,
        itemname: selectedItem.name,
        categoryname: selectedItem.categoryname,
        segmentid: selectedItem.segmentid,
        segmentname: selectedItem.segmentname,
        itemweight: selectedItem.itemweight,
        noofboxes: quantity,
        noofitemsinbox: selectedItem.noofitemsinbox,
        price: selectedItem.rrprice,
        qty: totalQty, // Total quantity
        pendingqty: totalQty, // Initially, pending quantity is the same as ordered quantity
        deliveredqty: 0, // Initially, no items are delivered
        orderstatus: 'pending', // Set the initial order status to 'pending'
        totalliters: totalLiters, // Total liters
        totalprice: totalPrice, // Total price
        createdtime: new Date().toISOString(), // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
        updatedtime: new Date().toISOString() // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
      };

      console.log('Request Item Data:', requestItemData);

      const { data: requestItemResponse, error: requestItemError } = await supabase
        .from('retailer_request_items')
        .insert([requestItemData]);

      if (requestItemError) {
        throw requestItemError;
      }

      console.log('Request item details saved:', requestItemResponse);
    }

    alert('Item Request details saved successfully!');
    setSelectedRetailer(null);
    setSelectedItems([]);
    setIsValid(true);

  } catch (error) {
    console.error('Error saving item request:', error);
    alert('Failed to save item request details. Please try again.');
  } finally {
    // setLoading(false);
  }
};

    

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row>
          <Col>
            <h5 style={{ textAlign: "center" }}>Item Request</h5>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="retailerSelect">
            <Form.Label>Select Retailer</Form.Label>
            <Select
              value={selectedRetailer}
              onChange={handleChange}
              options={retailersOptions}
              placeholder="Select Retailer"
              className={!isValid ? 'is-invalid' : ''}
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: !isValid ? 'red' : base.borderColor,
                  '&:hover': {
                    borderColor: !isValid ? 'red' : base.borderColor
                  }
                })
              }}
            />
            {!isValid && <div className="invalid-feedback d-block">Please select a Retailer.</div>}
          </Form.Group>
          <br />
          <div className="item-request-table">
        <table>
          <thead>
            <tr>
            <th><center>Slno</center></th>
              <th><center>Itemid</center></th>
              <th><center>Item Name</center></th>
              <th><center>Box(es)</center></th>
              <th><center>Quantity</center></th>
              <th><center>Litres</center></th>
              <th><center>Actions</center></th>
            </tr>
          </thead>
          <tbody>
          {selectedItems.map((item, index) => (
                <tr key={index}>
                <td><center>{index + 1}</center></td>
                <td><center>{item.id}</center></td>
                <td><center>{item.name}</center></td>
                <td><center>{item.quantity}</center></td>
                <td><center>{item.quantity*item.noofitemsinbox}</center></td>
                <td><center>{item.quantity*item.noofitemsinbox*item.itemweight}</center></td>
                <td className="actions">
                  <button 
                    onClick={() => handleEditItem(index)} 
                    className="action-button edit-button"
                  >
                    <FaEdit className="icon" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem(index)} 
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
          <br />
          <Row >
            <Col className="d-flex justify-content-end mb-2">
              <Button 
                variant="success" 
                onClick={handleShow} 
                style={{ width: '100px' }} 
                className="add-button"
              >
                <i className="bi bi-plus-lg"></i> ADD
              </Button>
            </Col>
          </Row>
          <div style={{ display: "flex", justifyContent: "center", margin: "0px auto" }}>
            <Button type="submit" variant="primary" className="mt-3" style={{ width: "500px" }}>Submit</Button>
          </div>
        </Form>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleModelSubmit}>
              <Form.Group controlId="formSelectOption">
                <Form.Label>Select Option</Form.Label>
                <Select
                  value={selectedItem}
                  onChange={setSelectedItem}
                  options={items}
                  placeholder="Select an Item"
                  className={!isValidModel && !selectedItem ? 'is-invalid' : ''}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: !isValidModel && !selectedItem ? 'red' : base.borderColor,
                      '&:hover': {
                        borderColor: !isValidModel && !selectedItem ? 'red' : base.borderColor
                      }
                    })
                  }}
                />
                {!isValidModel && !selectedItem && <div className="invalid-feedback d-block">Please select an Item.</div>}
              </Form.Group>

              <Form.Group controlId="formQuantity">
                <Form.Label>No of Box(es)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter No of Box(es)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={!isValidModel && !quantity ? 'is-invalid' : ''}
                />
                {!isValidModel && !quantity && <div className="invalid-feedback d-block">Please enter a quantity.</div>}
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Add Item
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </main>
  );
}

