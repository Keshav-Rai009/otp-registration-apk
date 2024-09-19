import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a provider component to wrap around your app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    email: "", // User email
    phone: "", // User phone
    emailVerified: false, // Email verification status
    phoneVerified: false, // Phone verification status
    phoneOtp: "", // OTP for phone verification
    emailOtp: "", // OTP for email verification
    phoneOtpExpiration: null, // Expiration time for phone OTP
    emailOtpExpiration: null, // Expiration time for email OTP
  });

  const updateUser = (newData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newData,
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
