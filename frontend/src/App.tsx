// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { connectWallet, Role } from "./utils/blockchain";
import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Distributor from "./pages/Distributor";
import Retailer from "./pages/Retailer";
import Navbar from "./components/Navbar";

function App() {
  const [role, setRole] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize wallet connection on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (window.ethereum?.selectedAddress) {
          const result = await connectWallet();
          if (result) {
            setAddress(result.address);
          }
        }
      } catch (error) {
        console.log("Not connected to wallet");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const handleSetRole = (selectedRole: number) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(0);
    setAddress("");
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🔗</div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!role) return <Login setUserRole={handleSetRole} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar address={address} role={role as Role} onLogout={handleLogout} />
      <Router>
        <Routes>
          {role === Role.Manufacturer && <Route path="/" element={<Manufacturer />} />}
          {role === Role.Distributor && <Route path="/" element={<Distributor />} />}
          {role === Role.Retailer && <Route path="/" element={<Retailer />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
