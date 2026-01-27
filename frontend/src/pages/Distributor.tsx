import React, { useState } from "react";
import { connectWallet, getContract } from "../utils/blockchain";

const Distributor: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [receiver, setReceiver] = useState("");
  const [status, setStatus] = useState("");

  const receiveProduct = async () => {
    const wallet = await connectWallet();
    if (!wallet) return;

    const contract = getContract(wallet.signer);
    const tx = await contract.transferToRetailer(productId, receiver);
    await tx.wait();
    setStatus(`Product #${productId} transferred to retailer!`);
    setProductId("");
    setReceiver("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Distributor Dashboard</h1>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Retailer Address"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={receiveProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Transfer to Retailer
        </button>
      </div>
      {status && <p className="mt-4 text-green-600">{status}</p>}
    </div>
  );
};

export default Distributor;
