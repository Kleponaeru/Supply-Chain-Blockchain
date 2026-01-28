import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  connectWallet,
  disconnectWallet,
  wasWalletConnected,
  silentReconnect,
} from "./utils/blockchain";
import { getRoleFromAddress } from "./config/walletConfig";
import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Distributor from "./pages/Distributor";
import Retailer from "./pages/Retailer";
import Navbar from "./components/Navbar";
import { SiBlockchaindotcom } from "react-icons/si";
import { FaQuestion } from "react-icons/fa";
import { IconContext } from "react-icons";

function App() {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize and check for existing wallet connection
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Only auto-connect if user previously connected
        if (wasWalletConnected()) {
          console.log("🔄 Attempting silent reconnection...");
          const connection = await silentReconnect();

          if (connection) {
            console.log("📍 Silently reconnected:", connection.address);
            const detectedRole = getRoleFromAddress(connection.address);
            console.log("👤 Detected role:", detectedRole);
            setAddress(connection.address);
            setRole(detectedRole);
          } else {
            console.log("📭 No wallet currently connected");
            // Clear the flag if wallet is no longer connected
            disconnectWallet();
          }
        } else {
          console.log("ℹ️ User has not previously connected wallet");
        }
      } catch (error) {
        console.log("ℹ️ Wallet initialization skipped:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      console.log("🔄 MetaMask accounts changed:", accounts);

      if (accounts.length === 0) {
        // User disconnected from MetaMask
        handleLogout();
      } else if (wasWalletConnected()) {
        // User switched accounts
        handleAddressChange(accounts[0]);
      }
    };

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener?.(
          "accountsChanged",
          handleAccountsChanged,
        );
      }
    };
  }, []);

  const handleAddressChange = (newAddress: string) => {
    console.log("🔄 Address changed:", newAddress);
    setAddress(newAddress);
    const detectedRole = getRoleFromAddress(newAddress);
    console.log("👤 New role detected:", detectedRole);
    setRole(detectedRole);
  };

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    disconnectWallet();
    setAddress(null);
    setRole(0);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg animate-bounce">
            <span className="text-5xl">
              <SiBlockchaindotcom />
            </span>
          </div>
          <p className="text-gray-600 font-semibold">
            Initializing Supply Chain...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
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
                  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-12 border border-amber-200">
                      <div className="inline-block p-4 bg-amber-100 rounded-full mb-6">
                        <div className="text-6xl">
                          <IconContext.Provider
                            value={{
                              className:
                                "text-yellow-600 w-6 h-6 mt-0.5 flex-shrink-0",
                            }}
                          >
                            <FaQuestion />
                          </IconContext.Provider>
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Role Not Assigned
                      </h2>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto text-lg">
                        Your wallet doesn't have a role assigned. Please contact
                        your administrator to add your wallet to the system.
                      </p>
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 text-left inline-block">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-mono font-semibold text-gray-900">
                            {address}
                          </span>
                        </p>
                        <p className="text-xs text-amber-700">
                          To test locally, add your address to{" "}
                          <code className="bg-white px-2 py-1 rounded font-mono">
                            src/config/walletConfig.ts
                          </code>
                        </p>
                      </div>
                    </div>
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
