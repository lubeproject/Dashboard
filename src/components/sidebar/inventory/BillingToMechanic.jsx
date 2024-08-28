// import React, { useState }from 'react';
// import "./billingToMechanic.css";
// import Select from 'react-select';
// import { Button, Modal, Form, Container, Row, Col} from 'react-bootstrap';

// const mechanicsArray = [
//   "A S K MOTORS", "ARS Auto Centre- Tumkur", "AAPE AUTO WORKS", "AM MOTORS- Chelur",
//   "ARHA INDUSTRIES", "ASHWINI MOTORS", "CANARA CAR CARE", "FDN MOTORS", "HI TECH AUTO WORKS",
//   "HK MOTO MECH", "HKGN MOTORS", "KDS BIKE POINT", "KHT Chevrolet ( A Div of Morzaria Realtech Pvt Ltd )",
//   "KSS MOTORS- Tumkur", "MANI MOTORS", "MK MOTORS", "NEW MOTOR BIKE BULLET GARAGE", 
//   "RAJKUMAR BIKE POINT", "RIDERS GARAGE", "SAHARA MOTORS", "SRI LOKESH BIKE SERVICE", 
//   "SRI MARUTHI AUTO GARAGE", "SRI THIRUMALA BIKE CENTRE", "SRI VARSHA BIKE SERVICE- Bsk", 
//   "SRI VENKATESHWARA GARAGE", "SRI VINAYAKA AUTOMOBILE WORKS", "SRI VINAYAKA GARAGE", 
//   "SRI VINAYAKA MOTORS - Mallur", "Vinayaka Bike Service Centre- Mico", "Amrutha Motors- Masthi", 
//   "Anjaneya Automobiles- Huliyar", "DHK Motors- Tumkur", "Ekatra Car Care-Jp Nagar", 
//   "G H Motors- Tumkur", "Ismail Car Service- Tumkur", "Krishna Bike Service", "Motomechs- Bsk", 
//   "Mudaseer Bike Service- EC", "Pratham Motors- Kudur", "S B Auto Garage- Begur Road", 
//   "Setu Service Centre- Gubbi", "ZOOM MOTO PIT", "BASAVESHWARA NAGAR"
// ];


// const mechanicsOptions = mechanicsArray.map(mechanic => ({ label: mechanic, value: mechanic }));

// const options = [
//     "Cooltech ECO 12X1L", "Cooltech ECO 20X0.5L", "Agritech Plus 15W40 7.5L Elf",
//     "Agritec Plus 15w40 10L", "Dynatrans SF3I 18+2L(20L)", "Dynatrans SF3I 3X5L",
//     "Fluidmatic DIII MV 12X1L", "Rubia Fleet HD 300 15W40 12X1L",
//     "Rubia Fleet HD 300 15W40 7.5L", "Rubia Fleet HD 500 15W40 10L",
//     "Rubia Fleet HD 500 15W40 12X1L", "Rubia Fleet HD 500 15W40 7.5L",
//     "Rubia Fleet HD 500 15W40 10L"
//   ].map(option => ({ label: option, value: option }));
  

// export default function BillingToMechanic() {
//     const [selectedMechanic, setSelectedMechanic] = useState(null);
//     const [isValid, setIsValid] = useState(true);
  

//     const handleChange = (selectedOption) => {
//       setSelectedMechanic(selectedOption);
//       setIsValid(true);  // Reset validation state when user selects an option
//     };
  
//     const [show, setShow] = useState(false);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [quantity, setQuantity] = useState('');
//     const [isValidModel, setIsValidModel] = useState(true);

//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
  
//     const handleModelSubmit = (e) => {
//       e.preventDefault();
//       if (!selectedOption || !quantity) {
//         setIsValidModel(false);
//       } else {
//         // Handle form submission logic
//         console.log(`Selected Option: ${selectedOption.value}, Quantity: ${quantity}`);
//         handleClose();
//       }
//     };

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       if (!selectedMechanic) {
//         setIsValid(false);
//       } else {
//         // Handle form submission logic
//         console.log(`Selected Mechanic: ${selectedMechanic.value}`);
//       }
//     };

//     return (

//         <main id='main' className='main'>
//         <Container className="mt-4">
//         <Row>
//             <Col>
//             <h5 style={{textAlign:"center"}}>Billing To Mechanic</h5>
//             </Col>
//         </Row>
//         <br />
//         <Row >
//         <Col className="d-flex justify-content-end mb-2">
//           <Button 
//             variant="success" 
//             onClick={handleShow} 
//             style={{ width: '100px' }} 
//             className="add-button"
//           >
//            <i class="bi bi-plus-lg" ></i> ADD
//           </Button>
//         </Col>
//       </Row>

//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Add Item</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleModelSubmit}>
//             <Form.Group controlId="formSelectOption">
//               <Form.Label>Select Option</Form.Label>
//               <Select
//                 value={selectedOption}
//                 onChange={setSelectedOption}
//                 options={options}
//                 placeholder="Select an option"
//                 className={!isValidModel && !selectedOption ? 'is-invalid' : ''}
//                 styles={{
//                   control: (base, state) => ({
//                     ...base,
//                     borderColor: !isValidModel && !selectedOption ? 'red' : base.borderColor,
//                     '&:hover': {
//                       borderColor: !isValidModel && !selectedOption ? 'red' : base.borderColor
//                     }
//                   })
//                 }}
//               />
//               {!isValidModel && !selectedOption && <div className="invalid-feedback d-block">Please select an option.</div>}
//             </Form.Group>

//             <Form.Group controlId="formQuantity">
//               <Form.Label>Quantity</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={quantity}
//                 onChange={e => setQuantity(e.target.value)}
//                 placeholder="Enter quantity"
//                 className={!isValidModel && !quantity ? 'is-invalid' : ''}
//               />
//               {!isValidModel && !quantity && <div className="invalid-feedback">Please enter a quantity.</div>}
//             </Form.Group>
//             <br/>
//             <Button variant="primary" type="submit">
//               Submit
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       <Form onSubmit={handleSubmit}>
//         <Form.Group controlId="mechanicSelect">
//           <Form.Label>Select Mechanic</Form.Label>
//           <Select
//             value={selectedMechanic}
//             onChange={handleChange}
//             options={mechanicsOptions}
//             placeholder="Select Mechanic"
//             className={!isValid ? 'is-invalid' : ''}
//             styles={{
//               control: (base, state) => ({
//                 ...base,
//                 borderColor: !isValid ? 'red' : base.borderColor,
//                 '&:hover': {
//                   borderColor: !isValid ? 'red' : base.borderColor
//                 }
//               })
//             }}
//           />
//           {!isValid && <div className="invalid-feedback d-block">Please select a mechanic.</div>}
//         </Form.Group>
//         <br/>
//         <div style={{ display: "flex", justifyContent:"center",margin:"0px auto"}}>
//         <Button type="submit" variant="primary" className="mt-3" style={{width:"500px"}} >Submit</Button>

//         </div>
//       </Form>
//     </Container>
//     </main>
     
//     );
//   };

import React, { useState, useEffect } from 'react';
import "./billingToMechanic.css";
import Select from 'react-select';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Modal, Form, Container, Row, Col, Table } from 'react-bootstrap';  
import { supabase } from '../../../supabaseClient'; // Import your Supabase client

export default function BillingToMechanic() {
  const [mechanicsOptions, setMechanicsOptions] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [show, setShow] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isValidModel, setIsValidModel] = useState(true);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchMechanics = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'mechanic');

      if (error) console.error('Error fetching mechanics:', error);
      else setMechanicsOptions(data.map(mechanic => ({ value: mechanic.userid, label: mechanic.shopname, name: mechanic.name })));
    };

    // Fetch items from the item_master table
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('item_master')
        .select('itemid, itemname, noofitemsinbox, rrprice, itemweight')
        .eq('activestatus', 'Y');
    
      if (error) console.error('Error fetching items:', error);
      else setItems(data.map(item => ({ value: item.itemid, label: item.itemname, rrprice: item.rrprice, itemweight: item.itemweight, noofitemsinbox: item.noofitemsinbox })));
    };
    

    fetchMechanics();
    fetchItems();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (selectedOption) => {
    setSelectedMechanic(selectedOption);
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
        rrprice: selectedItem.rrprice, // Include rrprice for calculating total amount
        itemweight: selectedItem.itemweight,
        noofitemsinbox: selectedItem.noofitemsinbox
    };
    setSelectedItems([...selectedItems, newItem]);
    setSelectedItem('');
    setQuantity('');
    handleClose();
    console.log(selectedItems)
};

const handleEditItem = (index) => {
  const item = selectedItems[index];
  setSelectedItem({ value: item.id, label: item.name, rrprice: item.rrprice });
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
  
    if (!selectedMechanic || selectedItems.length === 0) {
      setIsValid(false);
      return;
    }
  
    // Calculate total quantity and amount
    const totalQty = selectedItems.reduce((acc, item) => acc + parseInt(item.quantity, 10), 0);
    const totalAmount = selectedItems.reduce((acc, item) => acc + (parseInt(item.quantity, 10) * item.rrprice), 0);
    const totalLiters = selectedItems.reduce((acc, item) => acc + (parseInt(item.quantity, 10) * item.itemweight * item.noofitemsinbox), 0);
    console.log(totalLiters)
  
    // Prepare billing data to insert into billing_mechanic table
    const billingData = {
      mechid: selectedMechanic.value,
      mechname: selectedMechanic.name,
      mechshopname: selectedMechanic.label || '', // Use an empty string if shopname is not available
      role: 'mechanic',
      totalliters: totalLiters,
      totalqty: totalQty,
      totalamount: totalAmount,
      createddate: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD
      createdtime: new Date().toISOString(), // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
      updatedtime: new Date().toISOString() // Format datetime to YYYY-MM-DDTHH:mm:ss.sssZ
    };
  
    try {
      // Insert into billing_mechanic and retrieve the row with ID
      const { data: billingDataResponse, error: billingError } = await supabase
        .from('billing_mechanic')
        .insert([billingData])
        .select('billingid') // Retrieve all columns or specify the columns you need
        .single(); // Ensure to get a single row response
  
      if (billingError) {
        console.error('Error inserting billing data:', billingError);
        throw billingError;
      }
  
      if (!billingDataResponse || !billingDataResponse.billingid) {
        throw new Error('No ID returned from billing_mechanic insert operation');
      }
  
      const billingId = billingDataResponse.billingid;
  
      console.log('Billing details saved:', billingDataResponse);
  
      // Insert related items with the retrieved billingId
      for (let i = 0; i < selectedItems.length; i++) {
        const selectedItem = selectedItems[i];
        const billingItemData = {
          billingid: billingId,
          itemid: selectedItem.id,
          mechid: selectedMechanic.value,
          mechname: selectedMechanic.name,
          itemname: selectedItem.name,
          price: selectedItem.rrprice,
          itemweight:selectedItem.itemweight,
          qty: selectedItem.quantity,
          totalliters: selectedItem.itemweight * selectedItem.quantity * selectedItem.noofitemsinbox,
          totalprice: selectedItem.quantity * selectedItem.rrprice,
          createddate: new Date().toISOString().split('T')[0],
          createdtime: new Date().toISOString(),
          updatedtime: new Date().toISOString()
        };
  
        const { data: billingItemResponse, error: billingItemError } = await supabase
          .from('billing_items')
          .insert([billingItemData]);
  
        if (billingItemError) {
          console.error('Error inserting billing item data:', billingItemError);
          throw billingItemError;
        }
  
        console.log('Billing item details saved:', billingItemResponse);
      }
  
      alert('Billing details saved successfully!');
      setSelectedMechanic(null);
      setSelectedItems([]);
      setIsValid(true);
  
    } catch (error) {
      console.error('Error saving billing:', error);
      alert('Failed to save billing details. Please try again.');
    }
  };

  return (
    <main id='main' className='main'>
      <Container className="mt-4">
        <Row>
          <Col>
            <h5 style={{ textAlign: "center" }}>Billing To Mechanic</h5>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="mechanicSelect">
            <Form.Label>Select Mechanic</Form.Label>
            <Select
              value={selectedMechanic}
              onChange={handleChange}
              options={mechanicsOptions}
              placeholder="Select Mechanic"
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
            {!isValid && <div className="invalid-feedback d-block">Please select a mechanic.</div>}
          </Form.Group>
          <br />
          <div className="billing-mechanic-table">
        <table>
          <thead>
            <tr>
              <th><center>Sl.</center></th>
              <th><center>Itemid</center></th>
              <th><center>Item Name</center></th>
              <th><center>Quantity</center></th>
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
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter quantity"
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
