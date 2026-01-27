import React, { useState } from "react";
import { roleToString, Role } from "../utils/blockchain";

interface NavbarProps {
  address: string;
  role: Role;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ address, role, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔗</span>
            <h1 className="text-xl font-bold">Supply Chain</h1>
          </div>

          {/* Role Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
              {roleToString(role)}
            </span>
          </div>

          {/* Wallet Info and Menu */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded-lg transition"
            >
              <span className="text-sm font-medium">{truncateAddress(address)}</span>
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
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b">
                  <p className="text-sm font-semibold">Connected Wallet</p>
                  <p className="text-xs text-gray-600 break-all">{address}</p>
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
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-lg transition text-sm border-t"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
