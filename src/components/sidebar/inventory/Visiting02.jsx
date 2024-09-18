// import React, { useState, useRef } from 'react';
// import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
// import { FaCamera, FaUpload } from 'react-icons/fa';
// import { IoIosFlash, IoIosFlashOff } from "react-icons/io";
// import { FiUpload } from "react-icons/fi";
// import jsQR from "jsqr";
// import "./visiting.css";

// export default function Visiting() {

//   const [isScanning, setIsScanning] = useState(false);
//   const [scanResult, setScanResult] = useState(null);
//   const [showOptions, setShowOptions] = useState(false);
//   const [flashOn, setFlashOn] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const startScanning = async () => {
//     setIsScanning(true);
//     setShowOptions(true);
//     setScanResult(null);

//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
//         videoRef.current.srcObject = stream;
//         videoRef.current.setAttribute("playsinline", true);
//         videoRef.current.play();
//         requestAnimationFrame(tick);
//       } catch (error) {
//         console.error('Error accessing media devices.', error);
//         stopScanning();
//       }
//     }
//   };

//   const tick = () => {
//     if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");
//       canvas.height = videoRef.current.videoHeight;
//       canvas.width = videoRef.current.videoWidth;
//       context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//       const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//       const code = jsQR(imageData.data, imageData.width, imageData.height, {
//         inversionAttempts: "dontInvert",
//       });

//       if (code) {
//         setScanResult(code.data);
//         localStorage.setItem('qrScanResult', code.data);
//         stopScanning();
//       } else {
//         requestAnimationFrame(tick);
//       }
//     } else {
//       requestAnimationFrame(tick);
//     }
//   };

//   const stopScanning = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       const tracks = stream.getTracks();
//       tracks.forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsScanning(false);
//     setShowOptions(false);
//   };

//   const handleFlashToggle = async () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject;
//       const videoTrack = stream.getVideoTracks()[0];
//       const imageCapture = new ImageCapture(videoTrack);

//       try {
//         const capabilities = await imageCapture.getPhotoCapabilities();
//         if (capabilities.fillLightMode.includes('flash')) {
//           const newFlashOn = !flashOn;
//           await videoTrack.applyConstraints({
//             advanced: [{ torch: newFlashOn }]
//           });
//           setFlashOn(newFlashOn);
//         } else {
//           console.log('Torch mode is not supported by this device.');
//         }
//       } catch (error) {
//         console.error('Error toggling flash:', error);
//       }
//     }
//   };

//   const handleUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       try {
//         const img = await createImageBitmap(file);
//         const canvas = document.createElement('canvas');
//         const context = canvas.getContext('2d');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         context.drawImage(img, 0, 0, img.width, img.height);

//         const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//         const code = jsQR(imageData.data, imageData.width, imageData.height);

//         if (code) {
//           setScanResult(code.data);
//           localStorage.setItem('qrScanResult', code.data);
//           stopScanning();
//         } else {
//           setScanResult('Not a valid QR code');
//         }
//       } catch (error) {
//         console.error('Error processing uploaded image:', error);
//         setScanResult('Error processing image');
//       }
//     }
//   };

//   return (
//     <main id='main' className='main'>
//       <Container>
//         <Row className="justify-content-center">
//           <Col md={8} className="text-center">
//             <h2>QR Code Scanner</h2>
//             <br />
//             <br />
//             <Button onClick={startScanning} variant="primary" className="m-2" style={{ maxWidth: "200px" }}>
//               <FaCamera size={50} /> <p> Start Scanning </p>
//             </Button>
//             {showOptions && (
//               <Modal show={isScanning} onHide={stopScanning} centered>
//                 <Modal.Header closeButton>
//                   <Modal.Title>Scan QR Code</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                   <video ref={videoRef} style={{ width: '100%' }} />
//                   <canvas ref={canvasRef} style={{ display: 'none' }} />
//                   <div className="d-flex justify-content-between mt-3 align-items-center w-100">
//                     <div>
//                       <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
//                       <label htmlFor="upload-input" className="btn btn-info" style={{ maxWidth: "200px" }}>
//                         <FiUpload size={25} /> Upload Image
//                       </label>
//                     </div>
//                     <Button onClick={handleFlashToggle} variant={flashOn ? "warning" : "secondary"} style={{ maxWidth: "200px" }}>
//                       {flashOn ? <IoIosFlashOff size={25} /> : <IoIosFlash size={25} />} {flashOn ? "Turn Flash Off" : "Turn Flash On"}
//                     </Button>
//                   </div>
//                 </Modal.Body>
//               </Modal>
//             )}

//             <br/>
//             <br/>
//             <br/>
//             <br/>
//             {scanResult && (
//               <div>
//                 <h4>Scan Result:</h4>
//                 <br/>
               
//                 {scanResult === 'Not a valid QR code' ? (
//                   <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>{scanResult}</p>
//                 ) : (
//                   <h2>{scanResult}</h2>
//                 )}
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Container>
//     </main>
//   );
// }
import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { FaCamera, FaUpload } from 'react-icons/fa';
import { IoIosFlash, IoIosFlashOff } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import jsQR from "jsqr";
import { supabase } from "../../../supabaseClient"; 
import "./visiting.css";

export default function Visiting() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [location, setLocation] = useState(null);  // Current device geolocation
  const [userLocation, setUserLocation] = useState(null); // Fetched user geolocation
  const [distance, setDistance] = useState(null);  // Distance between locations
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchUserLocation = async (qrcode) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('latitude, longitude')
        .eq('qrcode', qrcode);

      if (error) {
        throw new Error('Error fetching user location from Supabase');
      }

      if (data && data.length > 0) {
        return { latitude: data[0].latitude, longitude: data[0].longitude };
      } else {
        console.error('User location not found.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user location:', error);
      return null;
    }
  };

  // Haversine formula to calculate the distance between two lat/lon points
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);
  
    const R = 6371; // Radius of the Earth in kilometers
  
    const dLat = toRadians(lat2 - lat1);  // Delta latitude in radians
    const dLon = toRadians(lon2 - lon1);  // Delta longitude in radians
  
    const lat1Rad = toRadians(lat1); // Latitude 1 in radians
    const lat2Rad = toRadians(lat2); // Latitude 2 in radians
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Distance in kilometers
  
    return distance;
  }

  const startScanning = async () => {
    setIsScanning(true);
    setShowOptions(true);
    setScanResult(null);

    // Get Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });  // Set current location
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Access camera for QR code scanning
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true); // Needed for iOS
        videoRef.current.play();
        requestAnimationFrame(tick);
      } catch (error) {
        console.error('Error accessing media devices.', error);
        stopScanning();
      }
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = videoRef.current.videoHeight;
      canvas.width = videoRef.current.videoWidth;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        setScanResult(code.data);
        fetchAndCalculateLocation(code.data); // Fetch location based on QR code
        stopScanning();
      } else {
        requestAnimationFrame(tick);
      }
    } else {
      requestAnimationFrame(tick);
    }
  };

  const fetchAndCalculateLocation = async (qrcode) => {
    const userLoc = await fetchUserLocation(qrcode);
    setUserLocation(userLoc);

    if (userLoc && location) {
      const dist = haversineDistance(location.latitude, location.longitude, userLoc.latitude, userLoc.longitude);
      setDistance(dist);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setShowOptions(false);
  };

  const handleFlashToggle = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      try {
        const capabilities = await imageCapture.getPhotoCapabilities();
        if (capabilities.fillLightMode.includes('flash')) {
          const newFlashOn = !flashOn;
          await videoTrack.applyConstraints({
            advanced: [{ torch: newFlashOn }]
          });
          setFlashOn(newFlashOn);
        } else {
          console.log('Torch mode is not supported by this device.');
        }
      } catch (error) {
        console.error('Error toggling flash:', error);
      }
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const img = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanResult(code.data);
          fetchAndCalculateLocation(code.data);
          stopScanning();
        } else {
          setScanResult('Not a valid QR code');
        }
      } catch (error) {
        console.error('Error processing uploaded image:', error);
        setScanResult('Error processing image');
      }
    }
  };


  return (
    <main id='main' className='main'>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2>QR Code Scanner</h2>
            <br />
            <br />
            <Button onClick={startScanning} variant="primary" className="m-2" style={{ maxWidth: "200px" }}>
              <FaCamera size={50} /> <p> Start Scanning </p>
            </Button>
            {showOptions && (
              <Modal show={isScanning} onHide={stopScanning} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Scan QR Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <video ref={videoRef} style={{ width: '100%' }} />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="d-flex justify-content-between mt-3 align-items-center w-100">
                    <div>
                      <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
                      <label htmlFor="upload-input" className="btn btn-info" style={{ maxWidth: "200px" }}>
                        <FiUpload size={25} /> Upload Image
                      </label>
                    </div>
                    <Button onClick={handleFlashToggle} variant={flashOn ? "warning" : "secondary"} style={{ maxWidth: "200px" }}>
                      {flashOn ? <IoIosFlashOff size={25} /> : <IoIosFlash size={25} />} {flashOn ? "Turn Flash Off" : "Turn Flash On"}
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            )}

            {/* <br/>
            <br/>
            <br/> */}
            <br/>
            {scanResult && (
              <div>
                <h4>Scan Result:</h4>
                <br/>
               
                {scanResult === 'Not a valid QR code' ? (
                  <p style={{ color: 'red', fontWeight: 'bold', fontSize: '18px' }}>{scanResult}</p>
                ) : (
                  <h2>{scanResult}</h2>
                )}

                {location && (
                  <div>
                    <h5>Geolocation:</h5>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                  </div>
                )}
                {userLocation && (
                  <div>
                    <h5>User location:</h5>
                    <p>Latitude: {userLocation.latitude}</p>
                    <p>Longitude: {userLocation.longitude}</p>
                  </div>
                )}

                {distance && (
                  <div>
                    <h5>Distance:</h5>
                    <p>{distance.toFixed(3)} Km</p>
                  </div>
                )}
                <br/>    

               <Button className='text-center' variant="danger" style={{ maxWidth: "200px", color:"white", fontWeight:"bolder" }}>Check Out</Button>

              </div>
            )}
          </Col>

          
        </Row>

        <Row className="justify-content-center">
        <Col md={8} className="text-center">
          
          </Col>
        </Row>

      </Container>

    </main>
  );
}
