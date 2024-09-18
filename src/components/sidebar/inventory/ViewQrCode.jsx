import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "./viewQrCode.css";

export default function ViewQrCode() {
  // Dummy text that will be converted to a QR code
  const qrText = "Lube_Project";

  return (

    <main id='main' className='main'>

    <h1>Scan this QR Code:</h1>

    <div style={styles.container}>
      
      {/* Display QR Code */}
      <QRCodeSVG value={qrText} size={256} level="H" includeMargin={true} />
      {/* Display the text that is encoded in the QR code */}
      <p>Encoded Text: {qrText}</p>
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




