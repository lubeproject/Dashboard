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
      const bytes = CryptoJS.AES.decrypt(qrCode, SECRET_KEY);
      const qrCodeMatchUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setQrMatch(qrCodeMatchUser);
    }

   
  }, []);

  const saveUser = (userData) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
    localStorage.setItem("user", encryptedUser);
    setUser(userData);
  };

  const qrCodeUser = (userData) => {
    const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
    localStorage.setItem("view", encryptedUser);
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
