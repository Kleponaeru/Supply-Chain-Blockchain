import React, { useState } from "react";
import { connectWallet, getContract } from "../utils/blockchain";

const Manufacturer: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState("");

  const createProduct = async () => {
    const wallet = await connectWallet();
    if (!wallet) return;

    const contract = getContract(wallet.signer);
    const tx = await contract.createProduct(productName, batchId);
    await tx.wait();
    setStatus(`Product "${productName}" created!`);
    setProductName("");
    setBatchId("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manufacturer Dashboard</h1>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={createProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Product
        </button>
      </div>
      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
};

export default Manufacturer;
