import React, { useState } from "react";
import { connectWallet } from "../utils/blockchain";
import { roleToString } from "../utils/blockchain";
import { ROLE_EMOJIS } from "../config/walletConfig";

interface NavbarProps {
  address: string | null;
  role: number;
  onAddressChange: (address: string) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  address,
  role,
  onAddressChange,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      if (result) {
        onAddressChange(result.address);
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      alert(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <h1 className="text-xl font-bold">Supply Chain</h1>
          </div>

          {/* Role Badge (if connected) */}
          {address && role > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
                {ROLE_EMOJIS[role] || "❓"} {roleToString(role)}
              </span>
            </div>
          )}

          {/* Wallet Controls */}
          {!address ? (
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isConnecting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 transform hover:scale-105"
              }`}
            >
              <span>🦊</span>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition"
              >
                <span className="text-sm font-medium">
                  {truncateAddress(address)}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                  <div className="p-4 border-b">
                    <p className="text-sm font-semibold mb-1">
                      Connected Wallet
                    </p>
                    <p className="text-xs text-gray-600 break-all font-mono">
                      {address}
                    </p>
                    {role > 0 && (
                      <p className="text-xs text-blue-600 mt-2 font-semibold">
                        {ROLE_EMOJIS[role]} {roleToString(role)}
                      </p>
                    )}
                    {role === 0 && (
                      <p className="text-xs text-yellow-600 mt-2">
                        ⚠️ No role assigned to this wallet
                      </p>
                    )}
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition text-sm"
                    >
                      📋 Copy Address
                    </button>
                    <button
                      onClick={handleConnectWallet}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded transition text-sm"
                    >
                      💱 Switch Wallet
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg transition text-sm border-t"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
