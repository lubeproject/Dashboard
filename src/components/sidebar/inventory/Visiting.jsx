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

import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import { IoIosFlash, IoIosFlashOff } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import jsQR from "jsqr";
import Cookies from "js-cookie";
import { supabase } from "../../../supabaseClient"; // Ensure this path is correct
import "./visiting.css"; // Ensure you have the necessary styles
import { UserContext } from "../../context/UserContext";

const Visiting = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [location, setLocation] = useState(null); // Current device geolocation
  const [userLocation, setUserLocation] = useState(null); // Fetched user geolocation
  const [distance, setDistance] = useState(null); // Distance between locations
  const [checkedOut, setCheckedOut] = useState(false);
  const [visitId, setVisitId] = useState(null); // Store the ID of the visit
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(null); // Error messages
  const { user, qrMatch, setQrMatch, qrCodeUser} = useContext(UserContext);


  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  // Get current time in "HH:mm:ss" format
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  useEffect(() => {
    const storedPunchingId = Cookies.get("punchingid");
    if (storedPunchingId) {
      setVisitId(storedPunchingId);
      console.log(`Restored punchingid from cookie: ${storedPunchingId}`);
    }
    const checkoutAtMidnight = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours === 23 && minutes === 36) {
        handleCheckout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkoutAtMidnight);
  }, [visitId]);


  const fetchUserDetails = async (qrcode) => {
    try {
      const { data: userData, error: userTableError } = await supabase
        .from("users")
        .select("userid, name, shopname, role, latitude, longitude,representativeid,representativename")
        .eq("qrcode", qrcode)
        .single();

      if (userTableError) {
        throw userTableError;
      }

      if (userData) {
        qrCodeUser(qrcode)
     
        return userData;
      } else {
        console.error("User details not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setErrorMessage("Error fetching user details. Please try again.");
      return null;
    }
  };

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1); // Delta latitude in radians
    const dLon = toRadians(lon2 - lon1); // Delta longitude in radians

    const lat1Rad = toRadians(lat1); // Latitude 1 in radians
    const lat2Rad = toRadians(lat2); // Latitude 2 in radians

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
  }

  const startScanning = async () => {
    setIsScanning(true);
    setShowOptions(true);
    setScanResult(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        videoRef.current.play();
        requestAnimationFrame(tick);
      } catch (error) {
        console.error("Error accessing media devices.", error);
        stopScanning();
      }
    }
  };

  const tick = () => {
    if (
      videoRef.current &&
      videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
    ) {
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
        console.log(code.data)
        fetchAndCalculateLocation(code.data);
        stopScanning();
      } else {
        requestAnimationFrame(tick);
      }
    } else {
      requestAnimationFrame(tick);
    }
  };

  function getDayFromDate(dateString) {
    const date = new Date(dateString);

    // Array to map day index to day names
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Get the day (0-6 corresponds to Sunday-Saturday)
    const dayName = days[date.getDay()];

    return dayName;
  }

  const fetchAndCalculateLocation = async (qrcode) => {
    setIsLoading(true);
    try {
      // Validate QR code format
      // if (!isValidQRCode(qrcode)) {
      //   setErrorMessage('Invalid QR code format.');
      //   setScanResult('Not a valid QR code');
      //   setIsLoading(false);
      //   return;
      // }

      const userDetails = await fetchUserDetails(qrcode);
     
      if (!userDetails) {
        setErrorMessage("User details not found for the scanned QR code.");
        setScanResult("User not found");
        setIsLoading(false);
        return;
      }

      const {
        latitude: userLat,
        longitude: userLon,
        userid,
        name,
        shopname,
        role,
        representativeid,
        representativename
      } = userDetails;
      setUserLocation({ latitude: userLat, longitude: userLon });

      if (location) {
        // Ensure device location is available
        const dist = haversineDistance(
          location.latitude,
          location.longitude,
          userLat,
          userLon
        );
        setDistance(dist);

        // Insert visit record
        const currentTime = getCurrentTime();
        const visitingDate = new Date().toISOString().split("T")[0];
        const visitingday = getDayFromDate(visitingDate);
        const now = new Date();

        // const repId = user.userid;
        // const repName = user.name;

        const { data: insertData, error: insertError } = await supabase
          .from("represent_visiting1")
          .insert([
            {
              repid: representativeid||1,
              repname: representativename||'SV Agency',
              visitorid: userid,
              visitor: name,
              shopname: shopname,
              replatitude: location.latitude,
              replongitude: location.longitude,
              role: role,
              checkintime: currentTime,
              checkouttime: null,
              distance: dist,
              orderref: "",
              visitingdate: visitingDate,
              created: now,
              lastupdatetime: now,
              visitingday: visitingday,
              createdby: user?.userid,
              updatedby: user?.userid,
            },
          ])
          .select("punchingid"); // Selecting the primary key

        if (insertError) {
          console.error("Error inserting visiting details:", insertError);
          setErrorMessage("Error recording visit. Please try again.");
          setIsLoading(false);
          return;
        }

        if (insertData && insertData.length > 0) {
          const insertedId = insertData[0].punchingid;
          if (insertedId) {
            setVisitId(insertedId);
            // Cookies.set("punchingid", insertedId, { expires: 1 });
            Cookies.set("punchingid", insertedId);
            alert("Check-in successful!");
          } else {
            console.error("Inserted ID not found.");
            setErrorMessage("Error recording visit. Please try again.");
          }
        } else {
          console.error("Inserted data not returned.");
          setErrorMessage("Error recording visit. Please try again.");
        }
      } else {
        setErrorMessage("Device location not available.");
      }
    } catch (error) {
      console.error("Error in fetchAndCalculateLocation:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
    setIsLoading(false);
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
        if (capabilities.fillLightMode.includes("flash")) {
          const newFlashOn = !flashOn;
          await videoTrack.applyConstraints({
            advanced: [{ torch: newFlashOn }],
          });
          setFlashOn(newFlashOn);
        } else {
          console.log("Torch mode is not supported by this device.");
        }
      } catch (error) {
        console.error("Error toggling flash:", error);
      }
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const img = await createImageBitmap(file);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setScanResult(code.data);
          fetchAndCalculateLocation(code.data);
          stopScanning();
        } else {
          setScanResult("Not a valid QR code");
          stopScanning();
        }
        setCheckedOut(false);
      } catch (error) {
        console.error("Error processing uploaded image:", error);
        setScanResult("Error processing image");
      }
    }
  };

  // const handleCheckout =async() => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('represent_visiting1')
  //       .update([
  //         {
  //           checkouttime: currentTime,
  //           lastupdatetime: new Date(),
  //        }
  //       ]);
  //       if (error) {
  //         console.error('Error updating visiting details:', error);
  //       } else {
  //         console.log('Visiting details updated successfully:', data);
  //       }
  //     } catch (error) {
  //       console.error('Error updating data:', error);
  //     }
  //   setCheckedOut(true);  // Mark the user as checked out
  //   setScanResult(null);   // Clear the scan result
  // };

  const handleCheckout = async () => {
    if (visitId && !checkedOut) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("represent_visiting1")
          .update({
            checkouttime: getCurrentTime(),
            lastupdatetime: new Date(),
            updatedby: user?.userid,
          })
          .eq("punchingid", visitId);
     
        if (error) {
          console.error("Error updating checkout time:", error);
          setErrorMessage("Error during checkout. Please try again.");
        } else {
          Cookies.remove("punchingid");
          console.log("Checkout time updated successfully");
          setCheckedOut(true);
          alert("Checkout successful!");
          setQrMatch(null);
          localStorage.removeItem("view");
        }
      } catch (error) {
        console.error("Error updating checkout time:", error);
        setErrorMessage(
          "An unexpected error occurred during checkout. Please try again."
        );
      }
      setIsLoading(false);
    } else {
      console.log("No visit ID found or already checked out.");
      setErrorMessage("No active visit found to checkout.");
      setCheckedOut(true);
      setQrMatch(null);
    }
  };

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

  //             {/* <br/>
  //             <br/>
  //             <br/> */}
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

  //                 {location && (
  //                   <div>
  //                     <h5>Geolocation:</h5>
  //                     <p>Latitude: {location.latitude}</p>
  //                     <p>Longitude: {location.longitude}</p>
  //                   </div>
  //                 )}
  //                 {userLocation && (
  //                   <div>
  //                     <h5>User location:</h5>
  //                     <p>Latitude: {userLocation.latitude}</p>
  //                     <p>Longitude: {userLocation.longitude}</p>
  //                   </div>
  //                 )}

  //                 {distance && (
  //                   <div>
  //                     <h5>Distance:</h5>
  //                     <p>{distance.toFixed(3)} Km</p>
  //                   </div>
  //                 )}
  //                 <br/>
  //                <Button className='text-center' variant="danger" onClick={handleCheckout} style={{ maxWidth: "200px", color:"white", fontWeight:"bolder" }}>Check Out</Button>
  //               </div>
  //             )}
  //           </Col>

  //         </Row>

  //         <Row className="justify-content-center">
  //         <Col md={8} className="text-center">

  //           </Col>
  //         </Row>

  //       </Container>

  //     </main>
  //   );
  // }
  return (
    <main id="main" className="main">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h2>QR Code Scanner</h2>
            <br />

           {qrMatch ?  null :<> {!scanResult && !checkedOut &&(
                <Button
                  onClick={startScanning}
                  variant="primary"
                  className="m-2"
                  style={{ maxWidth: "200px" }}
                >
                  <FaCamera size={50} /> <p> Start Scanning </p>
                </Button>
              )}</>}

            {scanResult === "Not a valid QR code" ? (
              <>
              <Button
                onClick={startScanning}
                variant="primary"
                className="m-2"
                style={{ maxWidth: "200px" }}
              >
                <FaCamera size={50} /> <p> Start Scanning </p>
              </Button>
                    <br />
                    </>
            ) : scanResult === "User not found" ? (
              <>
              <Button
                onClick={startScanning}
                variant="primary"
                className="m-2"
                style={{ maxWidth: "200px" }}
              >
                <FaCamera size={50} /> <p> Start Scanning </p>
              </Button>
                    <br />
                    </>
            ) : null}

            {showOptions && (
              <Modal show={isScanning} onHide={stopScanning} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Scan QR Code</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <video ref={videoRef} style={{ width: "100%" }} />
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                  <div className="d-flex justify-content-between mt-3 align-items-center w-100">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        style={{ display: "none" }}
                        id="upload-input"
                      />
                      <label
                        htmlFor="upload-input"
                        className="btn btn-info"
                        style={{ maxWidth: "200px" }}
                      >
                        <FiUpload size={25} /> Upload Image
                      </label>
                    </div>
                    <Button
                      onClick={handleFlashToggle}
                      variant={flashOn ? "warning" : "secondary"}
                      style={{ maxWidth: "200px" }}
                    >
                      {flashOn ? (
                        <IoIosFlashOff size={25} />
                      ) : (
                        <IoIosFlash size={25} />
                      )}{" "}
                      {flashOn ? "Turn Flash Off" : "Turn Flash On"}
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            )}

            {qrMatch ?  <>
            <div>
                {/* <h4>Scan Result:</h4> */}
                <br />
                {scanResult === "Not a valid QR code" ? (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "48px",
                    }}
                  >
                    {scanResult }
                  </p>
                ) : (
                  <>
                
                {/* { qrMatch ? <h2>{qrMatch}</h2> :<h2>{scanResult}</h2> } */}
                    <br />
                    <Button
                      className="text-center"
                      variant="danger"
                      onClick={handleCheckout}
                      style={{
                        maxWidth: "200px",
                        color: "white",
                        fontWeight: "bolder",
                      }}
                    >
                      Check Out
                    </Button>
                  </>
                )}

                {/* {location && (
                <div>
                  <h5>Geolocation:</h5>
                  <p>{location.latitude},{location.longitude}</p>
                </div>
              )} */}

                {/* {userLocation && (
                <div>
                  <h5>User location:</h5>
                  <p>{userLocation.latitude}, {userLocation.longitude}</p>
                </div>
              )}

              {distance && (
                <div>
                  <h5>Distance:</h5>
                  <p>{distance.toFixed(3)} Km</p>
                </div>
              )} */}
              </div>
            </> : scanResult && !checkedOut && (
              <div>
                <h4>Scan Result:</h4>
                <br />
                {scanResult === "Not a valid QR code" ? (
                  <p
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      fontSize: "48px",
                    }}
                  >
                    {scanResult }
                  </p>
                ) : (
                  <>
                
                { qrMatch ? <h2>{qrMatch}</h2> :<h2>{scanResult}</h2> }
                    <br />
                    <Button
                      className="text-center"
                      variant="danger"
                      onClick={handleCheckout}
                      style={{
                        maxWidth: "200px",
                        color: "white",
                        fontWeight: "bolder",
                      }}
                    >
                      Check Out
                    </Button>
                  </>
                )}

                {/* {location && (
                <div>
                  <h5>Geolocation:</h5>
                  <p>{location.latitude},{location.longitude}</p>
                </div>
              )} */}

                {/* {userLocation && (
                <div>
                  <h5>User location:</h5>
                  <p>{userLocation.latitude}, {userLocation.longitude}</p>
                </div>
              )}

              {distance && (
                <div>
                  <h5>Distance:</h5>
                  <p>{distance.toFixed(3)} Km</p>
                </div>
              )} */}
              </div>
            )}

            {checkedOut && (
              <Button
                onClick={startScanning}
                variant="primary"
                className="m-2"
                style={{ maxWidth: "200px" }}
              >
                <FaCamera size={50} /> <p> Start Scanning </p>
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Visiting;
