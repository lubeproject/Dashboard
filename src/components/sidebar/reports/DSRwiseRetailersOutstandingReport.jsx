// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Form, Table } from 'react-bootstrap';
// import Select from 'react-select';
// import { supabase } from '../../../supabaseClient';
// import norecordfound from "../../../images/norecordfound.gif";
// import "./DSRwiseRetailersOutstandingReport.css";

// export default function DSRwiseRetailersOutstandingReport() {
//   const [dsrOptions, setDsrOptions] = useState([]);
//   const [selectedDsr, setSelectedDsr] = useState(null);
//   const [filteredData, setFilteredData] = useState([]);
//   const [filterApplied, setFilterApplied] = useState(false);

//   useEffect(() => {
//     // Fetch mechanics from the users table
//     const fetchDsr = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('userid, shopname, name, role')
//         .eq('role', 'representative');

//       if (error) console.error('Error fetching Retailers:', error);
//       else setDsrOptions(data.map(retailer => ({ value: retailer.userid, label: retailer.shopname, name: retailer.name })));
//     };

//     fetchDsr();
//   }, []);


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

//   const customSelectStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: !selectedDsr ? 'red' : provided.borderColor,
//       '&:hover': {
//         borderColor: !selectedDsr ? 'red' : provided.borderColor,
//       },
//     }),
//   };

//   return (
//     <main id='main' className='main'>
//       <Container>
//       <Row className="mb-4">
//           <Col>
//             <h4 className="text-center">DSRwise Retailers Outstanding Report</h4>
//           </Col>
//         </Row>
//         <Row className="justify-content-center">
//           <Col md={6}>
//             <Form.Group controlId="selectDsr">
//               <Form.Label>Select DSR</Form.Label>
//               <Select
//                 value={selectedDsr}
//                 onChange={setSelectedDsr}
//                 options={dsrOptions}
//                 placeholder="Select Representative"
//                 styles={customSelectStyles}
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Row>
//           <Col>
//             {/* {filteredData ? filteredData.Retailer.map(retailer => renderTable(retailer)) : */}
//               <div className="text-center">
//                 <img src={norecordfound} alt="No Record Found" className="no-record-img"/>
//               </div>
//               {/* } */}
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// }
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import Select from 'react-select';
import { supabase } from '../../../supabaseClient';
import norecordfound from "../../../images/norecordfound.gif";
import "./DSRwiseRetailersOutstandingReport.css";
import { UserContext } from '../../context/UserContext';

export default function DSRwiseRetailersOutstandingReport() {
  const [dsrOptions, setDsrOptions] = useState([]);
  const [selectedDsr, setSelectedDsr] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const {user} = useContext(UserContext);

  useEffect(() => {
    const fetchDsr = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('userid, shopname, name, role')
        .eq('role', 'representative');

      if (error) {
        console.error('Error fetching DSRs:', error);
      } else {
        setDsrOptions(data.map(dsr => ({
          value: dsr.userid,
          label: dsr.shopname,
          name: dsr.name,
          role: dsr.role
        })));
      }
    };

    if (user?.role === 'representative') {
      setDsrOptions([
        {
          value: user.userid,
          label: user.shopname,
          name: user.name,
          role: user.role,
        },
      ]);
    } else {
      fetchDsr();
    }
  }, [user]);

  useEffect(() => {
    const fetchInvoicesAndUsers = async () => {
      if (!selectedDsr) {
        console.log('No DSR selected');
        return;
      }

      try {
        // Fetch all users assigned to the selected representative
        const { data: assignedUsers, error: assignedUsersError } = await supabase
          .from('users')
          .select('userid, shopname, name, cginno')
          .eq('representativeid', selectedDsr.value)
          .eq('role', 'retailer');

        if (assignedUsersError) {
          console.error('Error fetching assigned users:', assignedUsersError);
          return;
        }

        // Fetch all invoices for the selected representative
        const { data: invoices, error: invoiceError } = await supabase
          .from('invoices1')
          .select('*')
          .eq('createdby', selectedDsr.value);

        if (invoiceError) {
          console.error('Error fetching invoices:', invoiceError);
          return;
        }

        // Extract unique user IDs from invoices
        const userIdsFromInvoices = [...new Set(invoices.map(invoice => invoice.userid))];

        // Fetch users based on those IDs
        const { data: usersFromInvoices, error: usersFromInvoicesError } = await supabase
          .from('users')
          .select('userid, shopname, name, cginno')
          .in('userid', userIdsFromInvoices);

        if (usersFromInvoicesError) {
          console.error('Error fetching users from invoices:', usersFromInvoicesError);
          return;
        }

        // Combine users who are assigned and those who have previously transacted
        const userMap = new Map();
        assignedUsers.forEach(user => userMap.set(user.userid, {
          ...user,
          GCINNo : user.cginno,
          invoices: []
        }));
        usersFromInvoices.forEach(user => {
          if (!userMap.has(user.userid)) {
            userMap.set(user.userid, {
              ...user,
              GCINNo : user.cginno,
              invoices: []
            });
          }
        });

        // Map invoices to corresponding users
        invoices.forEach(invoice => {
          const user = userMap.get(invoice.userid);
          if (user) {
            user.invoices.push({
              tallyrefinvno: invoice.tallyrefinvno || 'N/A',
              invdate: invoice.invdate || '',
              amount: invoice.amount || 0,
              paidamount: invoice.paidamount || 0,
              paymentdate: invoice.paymentdate || ''
            });
          }
        });

        // Convert map to array
        const combinedData = Array.from(userMap.values());
        setFilteredData(combinedData);

      } catch (error) {
        console.error('Error fetching invoices and users:', error);
      }
    };

    fetchInvoicesAndUsers();
  }, [selectedDsr]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderTable = (user) => {
    let totalValue = 0;
    let totalBalance = 0;

    return (
      <div key={user.userid} className="user-section">
        <h5>
          <span style={{color: "darkorange"}}>User: </span>{user.shopname}   
          <span style={{color: "darkorange", marginLeft: "50px"}}>GCIN No: </span>{user.GCINNo || 'N/A'}
        </h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th style={{backgroundColor: "darkorange", color: "white"}}>Invoice No</th>
              <th style={{backgroundColor: "darkorange", color: "white"}}>Date</th>
              <th style={{backgroundColor: "darkorange", color: "white"}}>Value</th>
              <th style={{backgroundColor: "darkorange", color: "white"}}>Balance</th>
              <th style={{backgroundColor: "darkorange", color: "white"}}>Due Days</th>
            </tr>
          </thead>
          <tbody>
            {user.invoices.map((invoice, index) => {
              const balance = invoice.amount - invoice.paidamount;
              const payDate = invoice.paymentdate || new Date();
              const duedays = invoice.invdate ? Math.floor(
                (new Date(payDate).setHours(0, 0, 0, 0) - new Date(invoice.invdate).setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
              ) : 'N/A';

              totalValue += invoice.amount || 0;
              totalBalance += balance || 0;

              return (
                <tr key={index}>
                  <td>{invoice.tallyrefinvno || 'N/A'}</td>
                  <td>{formatDate(invoice.invdate) || 'N/A'}</td>
                  <td>₹{invoice.amount.toLocaleString()}</td>
                  <td>₹{balance.toLocaleString()}</td>
                  <td>{duedays}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Total</strong></td>
              <td><strong>₹{totalValue.toLocaleString()}</strong></td>
              <td><strong>₹{totalBalance.toLocaleString()}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
    );
  };

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
            {filteredData.length > 0 ? filteredData.map(user => renderTable(user)) :
              <div className="text-center">
                <img src={norecordfound} alt="No Record Found" className="no-record-img"/>
              </div>
            }
          </Col>
        </Row>
      </Container>
    </main>
  );
}
