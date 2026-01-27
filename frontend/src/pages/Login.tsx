import React, { useState, useEffect } from "react";
import { connectWallet, getUserRole, Role } from "../utils/blockchain";
import RoleSelector from "../components/RoleSelector";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

interface LoginProps {
  setUserRole: (role: number) => void;
}

const Login: React.FC<LoginProps> = ({ setUserRole }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Try to reconnect on mount
  useEffect(() => {
    const reconnectWallet = async () => {
      try {
        if (window.ethereum?.selectedAddress) {
          const result = await connectWallet();
          if (result) {
            setAddress(result.address);
          }
        }
      } catch (err) {
        console.log("Auto-connect failed, user needs to connect manually");
      }
    };
    reconnectWallet();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const result = await connectWallet();
      if (result) {
        setAddress(result.address);
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to connect wallet. Please ensure MetaMask is installed.",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRole = async (role: Role) => {
    setSelectedRole(role);
    setIsLoading(true);
    setError(null);
    try {
      const result = await connectWallet();
      if (result) {
        const userRole = await getUserRole(result.address, result.signer);
        if (userRole !== Role.None && userRole === role) {
          setUserRole(role);
        } else {
          setError(
            `Your wallet is not assigned the ${role === 1 ? "Manufacturer" : role === 2 ? "Distributor" : "Retailer"} role. Contact the admin.`,
          );
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please try again.");
    } finally {
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Supply Chain Blockchain
          </h1>
          <p className="text-gray-600">
            Track products with transparency and immutability
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Wallet Connection */}
          {!address ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🦊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Sign in with MetaMask to access the supply chain network
              </p>
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className={`px-8 py-4 rounded-lg font-bold text-white text-lg transition-all ${
                  isConnecting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transform hover:scale-105"
                }`}
              >
                {isConnecting ? "Connecting..." : "🦊 Connect MetaMask"}
              </button>
            </div>
          ) : (
            <div>
              {/* Connected Wallet Info */}
              <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Connected Wallet</p>
                <p className="font-mono text-lg font-bold text-gray-800">
                  {address}
                </p>
              </div>

              {/* Role Selection */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Select Your Role
                </h2>
                {isLoading ? (
                  <LoadingSpinner text="Verifying your role..." />
                ) : (
                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelectRole={handleSelectRole}
                  />
                )}
              </div>

              {/* Switch Wallet Button */}
              <button
                onClick={handleConnectWallet}
                className="w-full mt-6 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
              >
                💱 Switch Wallet
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mt-6">
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl mb-2">🏭</div>
            <p className="font-semibold text-gray-700 mb-1">Manufacturer</p>
            <p className="text-sm text-gray-600">Create & manage products</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-semibold text-gray-700 mb-1">Distributor</p>
            <p className="text-sm text-gray-600">Distribute products</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-3xl mb-2">🏪</div>
            <p className="font-semibold text-gray-700 mb-1">Retailer</p>
            <p className="text-sm text-gray-600">Track products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
