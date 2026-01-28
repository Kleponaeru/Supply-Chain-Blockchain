import React, { useState, useRef, useEffect } from "react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const result = await connectWallet();
      if (result) {
        console.log("✅ Connected wallet:", result.address);
        onAddressChange(result.address);
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error("❌ Failed to connect wallet:", error);
      alert(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("walletConnected");
    onLogout();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Address copied to clipboard!");
      setIsOpen(false);
    } catch {
      alert("Failed to copy address");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-blue-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all">
              <span className="text-xl">🔗</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Supply Chain
              </h1>
              <p className="text-xs text-blue-300/70">Blockchain</p>
            </div>
          </div>

          {/* Center - Role Badge */}
          {address && role > 0 && (
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 backdrop-blur-sm">
              <span className="text-lg">{ROLE_EMOJIS[role] || "❓"}</span>
              <span className="text-sm font-semibold">
                {roleToString(role)}
              </span>
            </div>
          )}

          {/* Right Section - Wallet Controls */}
          <div className="flex items-center gap-3">
            {!address ? (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                  isConnecting
                    ? "bg-gray-600 cursor-not-allowed opacity-75"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-indigo-500/50"
                }`}
              >
                <span className="text-lg">🦊</span>
                <span className="hidden sm:inline">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600/20 transition-all border border-blue-400/30 backdrop-blur-sm group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold leading-none">
                      {truncateAddress(address)}
                    </span>
                    {role > 0 && (
                      <span className="text-xs text-blue-300/70">
                        {roleToString(role)}
                      </span>
                    )}
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform group-hover:text-blue-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
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
                  <div className="absolute right-0 mt-3 w-72 bg-slate-800 text-white rounded-xl shadow-2xl z-50 border border-blue-400/20 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with address */}
                    <div className="p-4 border-b border-blue-400/20 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
                      <p className="text-xs font-semibold text-blue-300 mb-2">
                        Connected Wallet
                      </p>
                      <p className="text-sm break-all font-mono bg-slate-900/50 p-2 rounded border border-blue-400/20">
                        {address}
                      </p>
                      {role > 0 && (
                        <div className="mt-3 p-2 rounded bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30">
                          <p className="text-sm font-semibold text-blue-200">
                            {ROLE_EMOJIS[role]} {roleToString(role)}
                          </p>
                        </div>
                      )}
                      {role === 0 && (
                        <div className="mt-3 p-2 rounded bg-yellow-500/20 border border-yellow-400/30">
                          <p className="text-xs text-yellow-200">
                            ⚠️ No role assigned to this wallet
                          </p>
                          <p className="text-xs text-yellow-200/70 mt-1">
                            Add your address to walletConfig.ts
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => copyToClipboard(address)}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-500/20 rounded-lg transition text-sm font-medium flex items-center gap-2 text-blue-300 hover:text-blue-200"
                      >
                        <span>📋</span> Copy Address
                      </button>
                      <button
                        onClick={handleConnectWallet}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-500/20 rounded-lg transition text-sm font-medium flex items-center gap-2 text-blue-300 hover:text-blue-200"
                      >
                        <span>🔄</span> Switch Wallet
                      </button>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 border-t border-blue-400/20 hover:bg-red-500/20 transition text-sm font-medium flex items-center gap-2 text-red-300 hover:text-red-200 rounded-b-lg"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
