import React, { useState, useEffect } from "react";
import { connectWallet, getContract } from "../utils/blockchain";

const Retailer: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const getHistory = async () => {
    const wallet = await connectWallet();
    if (!wallet) return;

    const contract = getContract(wallet.signer);
    const productHistory = await contract.getProductHistory(productId);
    setHistory(productHistory);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Retailer Dashboard</h1>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={getHistory}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Get Product History
        </button>
      </div>

      <div className="mt-4">
        {history.length > 0 && (
          <ul className="space-y-2">
            {history.map((h, index) => (
              <li key={index}>
                Actor: {h.actor} | Status: {h.status} | Time:{" "}
                {new Date(h.timestamp * 1000).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Retailer;
