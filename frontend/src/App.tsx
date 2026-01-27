import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { connectWallet } from "./utils/blockchain";
import { getRoleFromAddress } from "./config/walletConfig";
import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Distributor from "./pages/Distributor";
import Retailer from "./pages/Retailer";
import Navbar from "./components/Navbar";

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and check for existing wallet connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (window.ethereum?.selectedAddress) {
          const result = await connectWallet();
          if (result) {
            const detectedRole = getRoleFromAddress(result.address);
            setAddress(result.address);
            setRole(detectedRole);
          }
        }
      } catch (error) {
        console.log("No wallet connected");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const handleAddressChange = (newAddress: string) => {
    setAddress(newAddress);
    const detectedRole = getRoleFromAddress(newAddress);
    setRole(detectedRole);
  };

  const handleLogout = () => {
    setAddress(null);
    setRole(0);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        address={address}
        role={role}
        onAddressChange={handleAddressChange}
        onLogout={handleLogout}
      />

      {!address ? (
        <Login />
      ) : (
        <Router>
          <Routes>
            {role === 1 && <Route path="/" element={<Manufacturer />} />}
            {role === 2 && <Route path="/" element={<Distributor />} />}
            {role === 3 && <Route path="/" element={<Retailer />} />}
            {role === 0 && (
              <Route
                path="/"
                element={
                  <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                    <div className="text-6xl mb-4">❓</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      No Role Assigned
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Your wallet address is not assigned any role. Please
                      contact the administrator to assign a role to your wallet.
                    </p>
                    <p className="text-sm text-gray-500 font-mono">{address}</p>
                  </div>
                }
              />
            )}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
