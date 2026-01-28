import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { MdFactory } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import {
  connectWallet,
  createProduct,
  Product,
  getProductHistory,
  transferProduct,
} from "../utils/blockchain";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

const Manufacturer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create Product Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [productName, setProductName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Transfer Product Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [distributorAddress, setDistributorAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");
      // In a real app, you'd fetch the products here
      setProducts([]);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!productName.trim() || !batchId.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      await createProduct(productName, batchId, wallet.signer);
      setSuccess(`✓ Product "${productName}" created successfully!`);
      setProductName("");
      setBatchId("");
      setShowCreateModal(false);
      // In a real app, you'd fetch the new product here
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTransferProduct = async () => {
    if (!selectedProduct || !distributorAddress.trim()) {
      setError("Please select a product and enter distributor address");
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      await transferProduct(
        Number(selectedProduct.id),
        distributorAddress,
        wallet.signer,
      );
      setSuccess(`✓ Product transferred successfully!`);
      setDistributorAddress("");
      setSelectedProduct(null);
      setShowTransferModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to transfer product");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4s"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <IconContext.Provider value={{ className: "w-8 h-8 text-white" }}>
                <MdFactory />
              </IconContext.Provider>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Manufacturer Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Create and manage your products on the blockchain
          </p>
        </div>

        {/* Alerts */}
        <div className="space-y-3 mb-8">
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
          {success && (
            <Alert
              type="success"
              message={success}
              onClose={() => setSuccess(null)}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all transform shadow-lg flex items-center justify-center gap-2"
          >
            <IconContext.Provider value={{ className: "w-5 h-5" }}>
              <MdAddBox />
            </IconContext.Provider>
            Create New Product
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            disabled={products.length === 0}
            className={`py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              products.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transform hover:scale-105"
            }`}
          >
            <IconContext.Provider value={{ className: "w-5 h-5" }}>
              <MdLocalShipping />
            </IconContext.Provider>
            Transfer Product
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-blue-200 shadow-lg">
            <div className="flex justify-center mb-3">
              <IconContext.Provider
                value={{ className: "w-16 h-16 text-blue-600" }}
              >
                <MdAddBox />
              </IconContext.Provider>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Created Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first product to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Create Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={Number(product.id)}
                product={product}
                onAction={() => {
                  setSelectedProduct(product);
                  setShowTransferModal(true);
                }}
                actionLabel="Transfer"
                actionColor="green"
              />
            ))}
          </div>
        )}

        {/* Create Product Modal */}
        <Modal
          isOpen={showCreateModal}
          title="Create New Product"
          onClose={() => setShowCreateModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g., iPhone 15 Pro"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Batch ID *
              </label>
              <input
                type="text"
                placeholder="e.g., BATCH-2024-001"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={isCreating}
                className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all ${
                  isCreating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isCreating ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </Modal>

        {/* Transfer Product Modal */}
        <Modal
          isOpen={showTransferModal && !selectedProduct}
          title="Select Product to Transfer"
          onClose={() => setShowTransferModal(false)}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {products.map((product) => (
              <button
                key={Number(product.id)}
                onClick={() => setSelectedProduct(product)}
                className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition"
              >
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">
                  Batch: {product.batchId}
                </p>
              </button>
            ))}
          </div>
        </Modal>

        {/* Transfer Details Modal */}
        {selectedProduct && (
          <Modal
            isOpen={showTransferModal && !!selectedProduct}
            title="Transfer Product"
            onClose={() => {
              setShowTransferModal(false);
              setSelectedProduct(null);
              setDistributorAddress("");
            }}
          >
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-bold text-gray-800">
                  {selectedProduct.name}
                </p>
                <p className="text-sm text-gray-600">
                  Batch: {selectedProduct.batchId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distributor Address *
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={distributorAddress}
                  onChange={(e) => setDistributorAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedProduct(null);
                    setDistributorAddress("");
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferProduct}
                  disabled={isTransferring}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition-all ${
                    isTransferring
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  }`}
                >
                  {isTransferring ? "Transferring..." : "Transfer"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Manufacturer;
