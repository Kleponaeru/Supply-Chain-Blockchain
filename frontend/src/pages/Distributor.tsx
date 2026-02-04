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
            <div className="space-y-6 max-h-[32rem] overflow-y-auto px-1 py-1">
              {/* Product Info Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5 rounded-xl border border-emerald-200 shadow-sm">
                <div className="grid grid-cols-2 gap-5 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Product Name
                    </p>
                    <p className="font-bold text-base text-gray-800">
                      {selectedProductDetails.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Batch ID
                    </p>
                    <p className="font-bold text-base text-gray-800">
                      {selectedProductDetails.batchId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={selectedProductDetails.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Owner
                    </p>
                    <p className="font-mono text-xs text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 inline-block">
                      {selectedProductDetails.owner.slice(0, 6)}...
                      {selectedProductDetails.owner.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* History Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800">
                    Transaction History
                  </h3>
                </div>

                {loadingHistory ? (
                  <div className="py-8">
                    <LoadingSpinner text="Loading history..." />
                  </div>
                ) : productHistory.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <svg
                      className="w-12 h-12 text-gray-300 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">
                      No history records
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Transaction history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0 relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-200"></div>

                    {productHistory.map((record, index) => (
                      <div key={index} className="flex gap-4 pb-4 relative">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 relative z-10">
                          <div
                            className={`w-5 h-5 rounded-full mt-1 border-2 border-white shadow-md ${
                              index === 0
                                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                                : "bg-gradient-to-br from-blue-500 to-blue-600"
                            }`}
                          >
                            {index === 0 && (
                              <svg
                                className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                              </svg>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-semibold text-gray-800">
                              {index === 0
                                ? "🎉 Product Created"
                                : "📦 Status Updated"}
                            </p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                index === 0
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              #{productHistory.length - index}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <p className="text-sm text-gray-600 font-mono">
                              {record.actor.slice(0, 6)}...
                              {record.actor.slice(-4)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                Number(record.timestamp) * 1000,
                              ).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedProductDetails(null);
                    setProductHistory([]);
                  }}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg hover:from-gray-200 hover:to-gray-300 active:scale-[0.98] font-semibold transition-all duration-200 shadow-sm"
                >
                  Close
                </button>
              </div>
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
            <div className="space-y-5 max-h-[32rem] overflow-y-auto px-1 py-1">
              {/* Product Info Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 rounded-xl border border-emerald-200 shadow-sm">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Product
                </p>
                <p className="font-bold text-lg text-gray-800">
                  {selectedProduct.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Batch:{" "}
                  <span className="font-medium">{selectedProduct.batchId}</span>
                </p>
              </div>

              {/* Retailer Address */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Retailer Address <span className="text-red-500">*</span>
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
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono text-sm bg-white transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              {/* Storage Condition & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Storage Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={transferFormData.storageCondition}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        storageCondition: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Condition
                    </option>
                    <option value="Room Temperature">
                      🌡️ Room Temperature
                    </option>
                    <option value="Refrigerated">❄️ Refrigerated</option>
                    <option value="Frozen">🧊 Frozen</option>
                    <option value="Climate Controlled">
                      🌡️ Climate Controlled
                    </option>
                    <option value="Dry">☀️ Dry</option>
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Expiry Date <span className="text-red-500">*</span>
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
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Wholesale Price */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Wholesale Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="500.00"
                    value={transferFormData.price}
                    onChange={(e) =>
                      setTransferFormData({
                        ...transferFormData,
                        price: e.target.value,
                      })
                    }
                    className="w-full pl-8 pr-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white transition-all duration-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Verification Notes */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Verification Notes{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  placeholder="e.g., All items inspected and verified. Quality standards met."
                  value={transferFormData.verificationNotes}
                  onChange={(e) =>
                    setTransferFormData({
                      ...transferFormData,
                      verificationNotes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white resize-none transition-all duration-200 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {transferFormData.verificationNotes.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
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
                  className="flex-1 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTransferProduct}
                  disabled={isTransferring}
                  className={`flex-1 px-6 py-2.5 text-sm rounded-lg font-semibold text-white transition-all duration-200 ${
                    isTransferring
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] shadow-md hover:shadow-lg"
                  }`}
                >
                  {isTransferring ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Transferring...
                    </span>
                  ) : (
                    "Transfer to Retailer"
                  )}
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
