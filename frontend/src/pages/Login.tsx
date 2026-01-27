import React from "react";

const Login: React.FC = () => {
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
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-8">
              Use the wallet button in the top-right corner to connect and
              access the supply chain network
            </p>
            <div className="space-y-4 text-left">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900 mb-2">
                  📍 Getting Started:
                </p>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click "Connect Wallet" button in the navbar</li>
                  <li>Select your wallet from MetaMask</li>
                  <li>Your role will be automatically detected</li>
                  <li>Access your dashboard</li>
                </ol>
              </div>
            </div>
          </div>
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
