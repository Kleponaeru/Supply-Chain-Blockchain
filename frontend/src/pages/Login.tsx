import React from "react";
import { SiBlockchaindotcom } from "react-icons/si";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4s"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <span className="text-5xl text-white">
                <SiBlockchaindotcom />
              </span>
            </div>
            <h1
              className="text-5xl md:text-6xl leading-tight py-3 font-bold
               bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Supply Chain Blockchain
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Transparent. Immutable. Traceable.
            </p>
            <p className="text-gray-500">
              Enterprise-grade supply chain management powered by blockchain
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Get Started Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 backdrop-blur-lg bg-opacity-95 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Get Started
                  </h2>
                </div>

                <p className="text-gray-600 mb-8 text-lg">
                  Connect your wallet to access your supply chain dashboard.
                </p>

                {/* Steps */}
                <div className="space-y-4">
                  {[
                    {
                      num: "1",
                      title: "Click Connect Wallet",
                      desc: "Look for the button in the top-right corner of the navbar",
                    },
                    {
                      num: "2",
                      title: "Select Your Account",
                      desc: "Choose your wallet from the MetaMask popup",
                    },
                    {
                      num: "3",
                      title: "Auto-detect Role",
                      desc: "Your role will be automatically assigned",
                    },
                    {
                      num: "4",
                      title: "Access Dashboard",
                      desc: "Start managing your supply chain",
                    },
                  ].map((step) => (
                    <div
                      key={step.num}
                      className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Box */}
                <div className="mt-8 p-5 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                  <div className="text-2xl flex-shrink-0">💡</div>
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">
                      MetaMask Required
                    </p>
                    <p className="text-sm text-amber-800">
                      You need MetaMask extension installed. Need help?{" "}
                      <a
                        href="https://metamask.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:text-amber-600"
                      >
                        Download MetaMask
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles Sidebar */}
            {/* <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Available Roles
              </h3>

              {[
                {
                  emoji: "🏭",
                  name: "Manufacturer",
                  desc: "Create and manage products",
                  color: "from-orange-400 to-red-500",
                },
                {
                  emoji: "🚚",
                  name: "Distributor",
                  desc: "Distribute and track",
                  color: "from-green-400 to-emerald-500",
                },
                {
                  emoji: "🏪",
                  name: "Retailer",
                  desc: "Verify and sell products",
                  color: "from-blue-400 to-indigo-500",
                },
              ].map((role) => (
                <div
                  key={role.name}
                  className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all hover:border-gray-200 group"
                >
                  <div
                    className={`inline-block p-3 rounded-lg bg-gradient-to-br ${role.color} mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <span className="text-2xl">{role.emoji}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{role.name}</h4>
                  <p className="text-sm text-gray-600">{role.desc}</p>
                </div>
              ))}
            </div> */}
          </div>

          {/* Features Section */}
          {/* <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Why Choose Our Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🔐",
                  title: "Secure",
                  desc: "Blockchain-secured transactions",
                },
                {
                  icon: "⚡",
                  title: "Fast",
                  desc: "Instant product transfers",
                },
                {
                  icon: "👁️",
                  title: "Transparent",
                  desc: "Complete audit trail",
                },
                {
                  icon: "🌍",
                  title: "Global",
                  desc: "Decentralized network",
                },
              ].map((feature) => (
                <div key={feature.title} className="text-center group">
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2s {
          animation-delay: 2s;
        }
        .animation-delay-4s {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
