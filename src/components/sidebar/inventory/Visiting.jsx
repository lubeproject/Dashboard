import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { FaCamera, FaUpload } from 'react-icons/fa';
import { IoIosFlash, IoIosFlashOff } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import jsQR from "jsqr";
import "./visiting.css";

export default function Visiting() {

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startScanning = async () => {
    setIsScanning(true);
    setShowOptions(true);
    setScanResult(null);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
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
        localStorage.setItem('qrScanResult', code.data);
        stopScanning();
      } else {
        requestAnimationFrame(tick);
      }
    } else {
      requestAnimationFrame(tick);
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
          localStorage.setItem('qrScanResult', code.data);
          stopScanning();  // Automatically close the modal after successful scan
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

            <br/>
            <br/>
            <br/>
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
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </main>
  );
}
