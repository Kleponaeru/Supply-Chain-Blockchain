import React, { useState } from "react";
import { IconContext } from "react-icons";
import { MdStore } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import {
  connectWallet,
  getProductHistory,
  getProduct,
  getManufacturerData,
  getDistributorData,
  getRetailerData,
  Product,
  HistoryRecord,
  ManufacturerData,
  DistributorData,
  RetailerData,
} from "../utils/blockchain";
import StatusBadge from "../components/StatusBadge";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Retailer: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [manufacturerData, setManufacturerData] =
    useState<ManufacturerData | null>(null);
  const [distributorData, setDistributorData] =
    useState<DistributorData | null>(null);
  const [retailerData, setRetailerData] = useState<RetailerData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim()) {
      setError("Please enter a product ID");
      return;
    }

    setLoading(true);
    setError(null);
    setProduct(null);
    setHistory([]);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      const productData = await getProduct(parseInt(productId), wallet.signer);
      if (!productData) {
        setError("Product not found. Please check the product ID.");
        return;
      }

      setProduct(productData);

      // Fetch all supply chain data
      const historyData = await getProductHistory(
        parseInt(productId),
        wallet.signer,
      );
      setHistory(historyData);

      const mfgData = await getManufacturerData(
        parseInt(productId),
        wallet.signer,
      );
      setManufacturerData(mfgData);

      const distData = await getDistributorData(
        parseInt(productId),
        wallet.signer,
      );
      setDistributorData(distData);

      const retData = await getRetailerData(parseInt(productId), wallet.signer);
      setRetailerData(retData);

      setShowModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2s"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4s"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <IconContext.Provider value={{ className: "w-8 h-8 text-white" }}>
                <MdStore />
              </IconContext.Provider>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Retailer Dashboard
            </h1>
          </div>
          <p className="text-gray-600 ml-16">
            Track and verify product authenticity and complete supply chain
            journey
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-lg p-8 mb-8 border border-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Search for Product
          </h2>

          <form onSubmit={handleSearchProduct} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product ID
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Enter product ID (e.g., 1)"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  }`}
                >
                  <IconContext.Provider value={{ className: "w-5 h-5" }}>
                    <MdSearch />
                  </IconContext.Provider>
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the unique product ID assigned by the manufacturer
              </p>
            </div>
          </form>
        </div>

        {/* Product Details Modal */}
        {product && (
          <Modal
            isOpen={showModal && !!product}
            title="Product Details & Supply Chain Journey"
            onClose={() => {
              setShowModal(false);
              setProduct(null);
              setHistory([]);
              setProductId("");
            }}
          >
            <div className="space-y-6 max-h-screen overflow-y-auto">
              {/* Product Information Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product Name</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {product.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={product.status} size="lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Batch ID</p>
                    <p className="font-mono text-gray-800">{product.batchId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product ID</p>
                    <p className="font-bold text-gray-800">
                      {Number(product.id)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Created Date</p>
                    <p className="text-gray-800">
                      {formatDate(product.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Owner</p>
                    <p className="font-mono text-sm text-gray-800">
                      {truncateAddress(product.owner)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manufacturer Information */}
              {manufacturerData && (
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏭</span> Manufacturing Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Quantity</p>
                      <p className="font-bold text-gray-800">
                        {Number(manufacturerData.quantity)} units
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Origin</p>
                      <p className="font-bold text-gray-800">
                        {manufacturerData.origin}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Manufacturing Date</p>
                      <p className="font-bold text-gray-800">
                        {formatDate(manufacturerData.manufacturingDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Quality Standard</p>
                      <p className="font-bold text-gray-800">
                        {manufacturerData.qualityStandard}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Manufacturer</p>
                      <p className="font-mono text-sm text-gray-800">
                        {manufacturerData.manufacturer}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Distributor Information */}
              {distributorData && (
                <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
                  <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚚</span> Transportation Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Temperature</p>
                      <p className="font-bold text-gray-800">
                        {Number(distributorData.temperature)}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Humidity</p>
                      <p className="font-bold text-gray-800">
                        {Number(distributorData.humidity)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-bold text-gray-800">
                        {distributorData.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Transportation Mode</p>
                      <p className="font-bold text-gray-800">
                        {distributorData.transportationMode}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Expected Delivery Date</p>
                      <p className="font-bold text-gray-800">
                        {formatDate(distributorData.expectedDeliveryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Retailer Information */}
              {retailerData && (
                <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
                  <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏪</span> Retail Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Storage Condition</p>
                      <p className="font-bold text-gray-800">
                        {retailerData.storageCondition}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price (USD)</p>
                      <p className="font-bold text-gray-800">
                        ${Number(retailerData.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Expiry Date</p>
                      <p className="font-bold text-gray-800">
                        {formatDate(retailerData.expiryDate)}
                      </p>
                    </div>
                    {retailerData.verificationNotes && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Verification Notes</p>
                        <p className="font-bold text-gray-800">
                          {retailerData.verificationNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Supply Chain Journey Timeline */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Supply Chain Journey
                </h3>

                {loading ? (
                  <LoadingSpinner text="Loading history..." />
                ) : history.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-600">No history records found</p>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400"></div>

                    {/* Timeline Events */}
                    <div className="space-y-6 pl-16">
                      {history.map((record, index) => {
                        const isCreated = index === 0;
                        const statusIcon =
                          {
                            0: "📦",
                            1: "🚚",
                            2: "✅",
                          }[record.status] || "•";

                        const statusLabel =
                          {
                            0: "Created",
                            1: "In Transit",
                            2: "Delivered",
                          }[record.status] || "Updated";

                        const statusColor =
                          {
                            0: "text-blue-600",
                            1: "text-yellow-600",
                            2: "text-green-600",
                          }[record.status] || "text-gray-600";

                        return (
                          <div key={index} className="relative">
                            {/* Timeline Dot */}
                            <div
                              className={`absolute -left-16 top-1 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                                isCreated
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-pink-100 text-pink-600"
                              }`}
                            >
                              {statusIcon}
                            </div>

                            {/* Event Card */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p
                                    className={`font-bold text-lg ${statusColor}`}
                                  >
                                    {statusLabel}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatDate(record.timestamp)}
                                  </p>
                                </div>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  Step {index + 1}
                                </span>
                              </div>

                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold text-gray-800">
                                    Actor:
                                  </span>{" "}
                                  <span className="font-mono">
                                    {truncateAddress(record.actor)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Authenticity Badge */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-4 rounded-lg text-center">
                <p className="text-lg font-bold text-green-700">
                  ✓ Product Verified
                </p>
                <p className="text-sm text-green-600 mt-1">
                  This product is verified on the blockchain and its complete
                  supply chain journey is fully transparent and immutable
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setProduct(null);
                  setHistory([]);
                  setProductId("");
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all"
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {/* Empty State */}
        {!product && !loading && (
          <div className="text-center py-16 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl border-2 border-dashed border-purple-200 shadow-lg">
            <div className="mb-4 flex justify-center">
              <IconContext.Provider
                value={{ className: "w-16 h-16 text-purple-600" }}
              >
                <MdSearch />
              </IconContext.Provider>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Search for Products
            </h3>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Enter a product ID above to view its complete supply chain journey
              including manufacturing, distribution, and retail details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Retailer;
