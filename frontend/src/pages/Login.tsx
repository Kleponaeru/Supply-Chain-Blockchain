import React from "react";

interface LoginProps {
  setUserRole: (role: number) => void;
}

const Login: React.FC<LoginProps> = ({ setUserRole }) => {
  const handleLogin = (role: number) => {
    setUserRole(role);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Supply Chain Login</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleLogin(1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Manufacturer
        </button>
        <button
          onClick={() => handleLogin(2)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Distributor
        </button>
        <button
          onClick={() => handleLogin(3)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Retailer
        </button>
      </div>
    </div>
  );
};

export default Login;
