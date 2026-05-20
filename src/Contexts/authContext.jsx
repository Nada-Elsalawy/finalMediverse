import React, { createContext, useState, useEffect, useContext } from 'react';

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const patient = localStorage.getItem("patient");
    if (patient) setIsLoggedIn(true);
  }, []);

  const login = (patientData) => {
    localStorage.setItem("patient", JSON.stringify(patientData));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("patient");
    localStorage.removeItem("capturedFaceImage");
    setIsLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </authContext.Provider>
  );
}

// ✅ useAuth hook
export function useAuth() {
  const { isLoggedIn, login, logout } = useContext(authContext);
  const user = isLoggedIn
    ? JSON.parse(localStorage.getItem('patient') || '{}')
    : null;
  return { user, isLoggedIn, login, logout };
}
