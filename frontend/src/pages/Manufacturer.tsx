import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { MdFactory } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import {
  connectWallet,
  createProduct,
  transferToDistributor,
  Product,
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
  const [createFormData, setCreateFormData] = useState({
    productName: "",
    batchId: "",
    quantity: "",
    origin: "",
    manufacturingDate: "",
    qualityStandard: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Transfer Product Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transferFormData, setTransferFormData] = useState({
    distributorAddress: "",
    temperature: "",
    humidity: "",
    location: "",
    transportationMode: "",
    expectedDeliveryDate: "",
  });
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
    const {
      productName,
      batchId,
      quantity,
      origin,
      manufacturingDate,
      qualityStandard,
    } = createFormData;

    if (
      !productName.trim() ||
      !batchId.trim() ||
      !quantity.trim() ||
      !origin.trim() ||
      !manufacturingDate ||
      !qualityStandard.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      const mfgDate = Math.floor(new Date(manufacturingDate).getTime() / 1000);

      await createProduct(
        productName,
        batchId,
        BigInt(quantity),
        origin,
        BigInt(mfgDate),
        qualityStandard,
        wallet.signer,
      );

      setSuccess(
        `✓ Product "${productName}" created successfully on blockchain!`,
      );
      setCreateFormData({
        productName: "",
        batchId: "",
        quantity: "",
        origin: "",
        manufacturingDate: "",
        qualityStandard: "",
      });
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsCreating(false);
    }
  };

  const handleTransferProduct = async () => {
    const {
      distributorAddress,
      temperature,
      humidity,
      location,
      transportationMode,
      expectedDeliveryDate,
    } = transferFormData;

    if (
      !selectedProduct ||
      !distributorAddress.trim() ||
      !temperature ||
      !humidity ||
      !location.trim() ||
      !transportationMode.trim() ||
      !expectedDeliveryDate
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      const delDate = Math.floor(
        new Date(expectedDeliveryDate).getTime() / 1000,
      );

      await transferToDistributor(
        Number(selectedProduct.id),
        distributorAddress,
        parseInt(temperature),
        parseInt(humidity),
        location,
        transportationMode,
        delDate,
        wallet.signer,
      );

      setSuccess(`✓ Product transferred to distributor successfully!`);
      setTransferFormData({
        distributorAddress: "",
        temperature: "",
        humidity: "",
        location: "",
        transportationMode: "",
        expectedDeliveryDate: "",
      });
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
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
            Create and manage your products on the blockchain supply chain
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold transition-all transform shadow-lg flex items-center justify-center gap-2 hover:scale-105"
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
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transform hover:scale-105"
            }`}
          >
            <IconContext.Provider value={{ className: "w-5 h-5" }}>
              <MdLocalShipping />
            </IconContext.Provider>
            Transfer to Distributor
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
          onClose={() => {
            setShowCreateModal(false);
            setCreateFormData({
              productName: "",
              batchId: "",
              quantity: "",
              origin: "",
              manufacturingDate: "",
              qualityStandard: "",
            });
          }}
        >
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g., iPhone 15 Pro"
                value={createFormData.productName}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    productName: e.target.value,
                  })
                }
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
                value={createFormData.batchId}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    batchId: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity (units) *
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={createFormData.quantity}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    quantity: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Origin / Manufacturing Location *
              </label>
              <input
                type="text"
                placeholder="e.g., Shanghai, China"
                value={createFormData.origin}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    origin: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturing Date *
              </label>
              <input
                type="date"
                value={createFormData.manufacturingDate}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    manufacturingDate: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quality Standard / Certification *
              </label>
              <select
                value={createFormData.qualityStandard}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    qualityStandard: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Quality Standard</option>
                <option value="ISO 9001">ISO 9001</option>
                <option value="ISO 14001">ISO 14001</option>
                <option value="FDA Approved">FDA Approved</option>
                <option value="CE Certified">CE Certified</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateFormData({
                    productName: "",
                    batchId: "",
                    quantity: "",
                    origin: "",
                    manufacturingDate: "",
                    qualityStandard: "",
                  });
                }}
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
            {products.length === 0 ? (
              <p className="text-center text-gray-600 py-4">
                No products available
              </p>
            ) : (
              products.map((product) => (
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
              ))
            )}
          </div>
        </Modal>

        {/* Transfer Details Modal */}
        {selectedProduct && (
          <Modal
            isOpen={showTransferModal && !!selectedProduct}
            title="Transfer to Distributor"
            onClose={() => {
              setShowTransferModal(false);
              setSelectedProduct(null);
              setTransferFormData({
                distributorAddress: "",
                temperature: "",
                humidity: "",
                location: "",
                transportationMode: "",
                expectedDeliveryDate: "",
              });
            }}
          >
            <div className="space-y-4 max-h-96 overflow-y-auto">
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
                  value={transferFormData.distributorAddress}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      distributorAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperature (°C) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 25"
                    value={transferFormData.temperature}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        temperature: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Humidity (%) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 50"
                    value={transferFormData.humidity}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        humidity: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Shanghai Distribution Center"
                  value={transferFormData.location}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transportation Mode *
                </label>
                <select
                  value={transferFormData.transportationMode}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      transportationMode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select Transportation Mode</option>
                  <option value="Air">Air</option>
                  <option value="Sea">Sea</option>
                  <option value="Road">Road</option>
                  <option value="Rail">Rail</option>
                  <option value="Multi-Modal">Multi-Modal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Delivery Date *
                </label>
                <input
                  type="date"
                  value={transferFormData.expectedDeliveryDate}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      expectedDeliveryDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedProduct(null);
                    setTransferFormData({
                      distributorAddress: "",
                      temperature: "",
                      humidity: "",
                      location: "",
                      transportationMode: "",
                      expectedDeliveryDate: "",
                    });
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
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  }`}
                >
                  {isTransferring
                    ? "Transferring..."
                    : "Transfer to Distributor"}
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
