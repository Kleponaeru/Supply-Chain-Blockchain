import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { MdLocalShipping } from "react-icons/md";
import { MdInfo } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import {
  connectWallet,
  Product,
  getProductHistory,
  transferToRetailer,
  HistoryRecord,
} from "../utils/blockchain";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

const Distributor: React.FC = () => {
  const [receivedProducts, setReceivedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Transfer Modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transferFormData, setTransferFormData] = useState({
    retailerAddress: "",
    storageCondition: "",
    expiryDate: "",
    price: "",
    verificationNotes: "",
  });
  const [isTransferring, setIsTransferring] = useState(false);

  // Product Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] =
    useState<Product | null>(null);
  const [productHistory, setProductHistory] = useState<HistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadReceivedProducts();
  }, []);

  const loadReceivedProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");
      // In a real app, you'd fetch products received by this distributor
      // For now, we'll show an empty state
      setReceivedProducts([]);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (product: Product) => {
    setSelectedProductDetails(product);
    setLoadingHistory(true);
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      const history = await getProductHistory(
        Number(product.id),
        wallet.signer,
      );
      setProductHistory(history);
    } catch (err: any) {
      setError(err.message || "Failed to load product history");
    } finally {
      setLoadingHistory(false);
    }
    setShowDetailsModal(true);
  };

  const handleTransferProduct = async () => {
    const {
      retailerAddress,
      storageCondition,
      expiryDate,
      price,
      verificationNotes,
    } = transferFormData;

    if (
      !selectedProduct ||
      !retailerAddress.trim() ||
      !storageCondition.trim() ||
      !expiryDate ||
      !price.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsTransferring(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      const exDate = Math.floor(new Date(expiryDate).getTime() / 1000);

      await transferToRetailer(
        Number(selectedProduct.id),
        retailerAddress,
        storageCondition,
        exDate,
        BigInt(price),
        verificationNotes,
        wallet.signer,
      );

      setSuccess(`✓ Product transferred to retailer successfully!`);
      setTransferFormData({
        retailerAddress: "",
        storageCondition: "",
        expiryDate: "",
        price: "",
        verificationNotes: "",
      });
      setSelectedProduct(null);
      setShowTransferModal(false);
      await loadReceivedProducts();
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
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
              <IconContext.Provider value={{ className: "w-8 h-8 text-white" }}>
                <MdLocalShipping />
              </IconContext.Provider>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Distributor Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Track inventory and distribute products to retailers
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

        {/* Received Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Received Products
          </h2>

          {loading ? (
            <LoadingSpinner text="Loading products..." />
          ) : receivedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-emerald-200 shadow-lg">
              <div className="flex justify-center mb-3">
                <IconContext.Provider
                  value={{ className: "w-16 h-16 text-emerald-600" }}
                >
                  <MdAddBox />
                </IconContext.Provider>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Products Received Yet
              </h3>
              <p className="text-gray-600">
                Wait for manufacturers to send products to your address
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {receivedProducts.map((product) => (
                <div key={Number(product.id)} className="relative">
                  <ProductCard
                    product={product}
                    onAction={() => {
                      setSelectedProduct(product);
                      setShowTransferModal(true);
                    }}
                    actionLabel="Transfer to Retailer"
                    actionColor="green"
                  />
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="absolute top-3 right-3 w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-600 rounded-full flex items-center justify-center text-lg transition"
                    title="View details"
                  >
                    <IconContext.Provider value={{ className: "w-4 h-4" }}>
                      <MdInfo />
                    </IconContext.Provider>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Modal */}
        <Modal
          isOpen={showDetailsModal && !!selectedProductDetails}
          title="Product Details & History"
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProductDetails(null);
            setProductHistory([]);
          }}
        >
          {selectedProductDetails && (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Product Info */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Product Name</p>
                    <p className="font-bold text-gray-800">
                      {selectedProductDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Batch ID</p>
                    <p className="font-bold text-gray-800">
                      {selectedProductDetails.batchId}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedProductDetails.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600">Owner</p>
                    <p className="font-mono text-xs text-gray-800">
                      {selectedProductDetails.owner.slice(0, 6)}...
                      {selectedProductDetails.owner.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4">
                  Transaction History
                </h3>
                {loadingHistory ? (
                  <LoadingSpinner text="Loading history..." />
                ) : productHistory.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No history records
                  </p>
                ) : (
                  <div className="space-y-3">
                    {productHistory.map((record, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-4 border-b last:border-b-0"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full mt-1"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {index === 0 ? "Product Created" : "Status Updated"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.actor.slice(0, 6)}...
                            {record.actor.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              Number(record.timestamp) * 1000,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedProductDetails(null);
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </Modal>

        {/* Transfer Modal */}
        {selectedProduct && (
          <Modal
            isOpen={showTransferModal && !!selectedProduct}
            title="Transfer to Retailer"
            onClose={() => {
              setShowTransferModal(false);
              setSelectedProduct(null);
              setTransferFormData({
                retailerAddress: "",
                storageCondition: "",
                expiryDate: "",
                price: "",
                verificationNotes: "",
              });
            }}
          >
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
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
                  Retailer Address *
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={transferFormData.retailerAddress}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      retailerAddress: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Storage Condition *
                </label>
                <select
                  value={transferFormData.storageCondition}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      storageCondition: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">Select Storage Condition</option>
                  <option value="Room Temperature">Room Temperature</option>
                  <option value="Refrigerated">Refrigerated</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Climate Controlled">Climate Controlled</option>
                  <option value="Dry">Dry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={transferFormData.expiryDate}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      expiryDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wholesale Price (USD) *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 500"
                  value={transferFormData.price}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Notes (optional)
                </label>
                <textarea
                  placeholder="e.g., All items inspected and verified..."
                  value={transferFormData.verificationNotes}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      verificationNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedProduct(null);
                    setTransferFormData({
                      retailerAddress: "",
                      storageCondition: "",
                      expiryDate: "",
                      price: "",
                      verificationNotes: "",
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
                  {isTransferring ? "Transferring..." : "Transfer to Retailer"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Distributor;
