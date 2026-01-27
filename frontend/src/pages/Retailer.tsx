import React, { useState } from "react";
import {
  connectWallet,
  getProductHistory,
  getProduct,
  Product,
  HistoryRecord,
  statusToString,
} from "../utils/blockchain";
import StatusBadge from "../components/StatusBadge";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Retailer: React.FC = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
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
      const historyData = await getProductHistory(
        parseInt(productId),
        wallet.signer,
      );
      setHistory(historyData);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏪</span>
          <h1 className="text-3xl font-bold text-gray-800">
            Retailer Dashboard
          </h1>
        </div>
        <p className="text-gray-600">
          Track and verify product authenticity and supply chain journey
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError(null)} />
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                }`}
              >
                {loading ? "Searching..." : "🔍 Search"}
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
          <div className="space-y-6">
            {/* Product Information Card */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
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
                  <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-blue-400 to-green-400"></div>

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
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
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
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg text-center">
              <p className="text-lg font-bold text-green-700">
                ✓ Product Verified
              </p>
              <p className="text-sm text-green-600 mt-1">
                This product is verified on the blockchain and its supply chain
                is fully transparent
              </p>
            </div>

            <button
              onClick={() => {
                setShowModal(false);
                setProduct(null);
                setHistory([]);
                setProductId("");
              }}
              className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Empty State */}
      {!product && !loading && (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Search for Products
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Enter a product ID above to view its complete supply chain journey
            and verify authenticity
          </p>
        </div>
      )}
    </div>
  );
};

export default Retailer;
