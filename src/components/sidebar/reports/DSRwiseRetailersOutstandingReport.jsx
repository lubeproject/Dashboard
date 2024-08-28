import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRwiseRetailersOutstandingReport.css";

export default function DSRwiseRetailersOutstandingReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    // Fetch mechanics from the users table
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) console.error('Error fetching Retailers:', error);
      else setDsrOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
    };

    fetchDsr();
  }, []);


  // const handleDsrChange = (selectedOption) => {
  //   setSelectedDsr(selectedOption.value);
  // };

  // const renderTable = (retailer) => {
  //   let totalValue = 0;
  //   let totalBalance = 0;

  //   return (
  //     <div key={retailer.name} className="retailer-section">
  //       <br/>
  //       <h5><span style={{color:"darkorange"}}>Retailer : </span>{retailer.name}   <span style={{color:"darkorange", marginLeft:"50px"}}>GCIN No: </span>({retailer.invoices[0]?.GCINNo || 'N/A'})</h5>
  //       <Table striped bordered hover responsive>
  //         <thead>
  //           <tr>
  //             <th style={{backgroundColor:"darkorange", color:"white"}}>Invoice No</th>
  //             <th style={{backgroundColor:"darkorange", color:"white"}}>Date</th>
  //             <th style={{backgroundColor:"darkorange", color:"white"}}>Value</th>
  //             <th style={{backgroundColor:"darkorange", color:"white"}}>Balance</th>
  //             <th style={{backgroundColor:"darkorange", color:"white"}}>Due Days</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {retailer.invoices.length > 0 ? retailer.invoices.map((invoice, index) => {
  //             totalValue += invoice.value || 0;
  //             totalBalance += invoice.balance || 0;

  //             return (
  //               <tr key={index}>
  //                 <td>{invoice.invoiceNo || 'N/A'}</td>
  //                 <td>{invoice.date || 'N/A'}</td>
  //                 <td>₹{invoice.value.toLocaleString()}</td>
  //                 <td>₹{invoice.balance.toLocaleString()}</td>
  //                 <td>{invoice.dueDays || 'N/A'}</td>
  //               </tr>
  //             );
  //           }) : <tr><td colSpan="5">No Data Available</td></tr>}
  //         </tbody>
  //         {retailer.invoices.length > 0 && (
  //           <tfoot>
  //             <tr>
  //               <td colSpan="2"><strong>Total</strong></td>
  //               <td><strong>₹{totalValue.toLocaleString()}</strong></td>
  //               <td><strong>₹{totalBalance.toLocaleString()}</strong></td>
  //               <td></td>
  //             </tr>
  //           </tfoot>
  //         )}
  //       </Table>
  //     </div>
  //   );
  // };

  // const selectedData = data.find(dsr => dsr.DSRName === selectedDsr);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: !selectedDsr ? 'red' : provided.borderColor,
      '&:hover': {
        borderColor: !selectedDsr ? 'red' : provided.borderColor,
      },
    }),
  };

  return (
    <main id='main' className='main'>
      <Container>
      <Row className="mb-4">
          <Col>
            <h4 className="text-center">DSRwise Retailers Outstanding Report</h4>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form.Group controlId="selectDsr">
              <Form.Label>Select DSR</Form.Label>
              <Select
                value={selectedDsr}
                onChange={setSelectedDsr}
                options={dsrOptions}
                placeholder="Select Representative"
                styles={customSelectStyles}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* {filteredData ? filteredData.Retailer.map(retailer => renderTable(retailer)) : */}
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" className="no-record-img"/>
              </div>
              {/* } */}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
