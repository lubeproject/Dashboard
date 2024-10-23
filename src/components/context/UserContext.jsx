// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { supabase } from "../../supabaseClient";

const SECRET_KEY = "sailubesoftwaredevelopersmn"; // Use a strong secret key

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [qrMatch, setQrMatch] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const qrCode = localStorage.getItem("view");

    if (storedUser) {
      const bytes = CryptoJS.AES.decrypt(storedUser, SECRET_KEY);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setUser(decryptedUser);
    }

    if(qrCode){
      const { value, expiresAt } = JSON.parse(qrCode);

        // Check if the current time is past the expiration time
  const now = new Date().getTime();
  if (now > expiresAt) {
    // The item has expired, so remove it from localStorage
    localStorage.removeItem("view");
    setQrMatch(null);
  }else {
    const bytes = CryptoJS.AES.decrypt(value, SECRET_KEY);
    const qrCodeMatchUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setQrMatch(qrCodeMatchUser);
  }

    }

   
  }, []);

  const saveUser = (userData) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
    localStorage.setItem("user", encryptedUser);
    setUser(userData);
  };

  const qrCodeUser = (userData) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();

    // Get the current time and calculate the time until the end of the day
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); // End of the day
    const expiresAt = endOfDay.getTime(); // Expiration timestamp (milliseconds)
  
    // Store both the encrypted data and expiration timestamp in localStorage
    localStorage.setItem("view", JSON.stringify({ value: encryptedUser, expiresAt }));
  
    setQrMatch(userData);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, saveUser, clearUser, qrMatch, setQrMatch, qrCodeUser}}>
      {children}
    </UserContext.Provider>
  );
};
