// import React from 'react';
// import { QRCodeSVG } from 'qrcode.react';
// import "./viewQrCode.css";

// export default function ViewQrCode() {
//   // Dummy text that will be converted to a QR code
//   const qrText = "Lube_Project";

//   return (

//     <main id='main' className='main'>

//     <h1>Scan this QR Code:</h1>

//     <div style={styles.container}>
      
//       {/* Display QR Code */}
//       <QRCodeSVG value={qrText} size={256} level="H" includeMargin={true} />
//       {/* Display the text that is encoded in the QR code */}
//       <p>Encoded Text: {qrText}</p>
//     </div>
//  </main>
   
//   );
// };

// // Inline styling for the component
// const styles = {
//   container: {
//     textAlign: 'center',
//     marginTop: '50px',
//   },
// };

import React, { useContext } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UserContext } from '../../context/UserContext';
import "./viewQrCode.css";

export default function ViewQrCode() {
  const {user} = useContext(UserContext);


  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <main id='main' className='main'>
      <h1>Scan this QR Code:</h1>

      <div style={styles.container}>
        {/* Display QR Code */}
        {user.qrcode && typeof user.qrcode === 'string' ? (
          <QRCodeSVG value={user.qrcode} size={256} level="H" includeMargin={true} />
        ) : (
          <p>No QR code available.</p>
        )}
        {/* Display the text that is encoded in the QR code */}
        {user.qrcode && <p>Encoded Text: {user.qrcode}</p>}
        {user && (
          <div>
            <p>Role: {user.role ? user.role : 'Not available'}</p>
            <p>Name: {user.name ? user.name : 'Not available'}</p>
            <p>Shop Name: {user.shopname ? user.shopname : 'Not available'}</p>
          </div>
        )}
      </div>
    </main>
  );
};

// Inline styling for the component
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
};