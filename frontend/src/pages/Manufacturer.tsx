import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { MdFactory } from "react-icons/md";
import { MdAddBox } from "react-icons/md";
import { MdLocalShipping } from "react-icons/md";
import { MdSearch, MdFilterList, MdSort, MdRefresh } from "react-icons/md";
import {
  connectWallet,
  createProduct,
  transferToDistributor,
  getManufacturerProducts,
  Product,
} from "../utils/blockchain";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "quantity-high"
  | "quantity-low";
type FilterStatus = "all" | "0" | "1" | "2";

const Manufacturer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

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

  // View Details Modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, searchQuery, filterStatus, sortOption]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error("Wallet connection failed");

      setWalletAddress(wallet.address);

      const manufacturerProducts = await getManufacturerProducts(
        wallet.address,
        wallet.signer,
      );
      setProducts(manufacturerProducts);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.batchId.toLowerCase().includes(query) ||
          p.origin.toLowerCase().includes(query) ||
          p.qualityStandard.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status.toString() === filterStatus);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return Number(b.createdAt) - Number(a.createdAt);
        case "oldest":
          return Number(a.createdAt) - Number(b.createdAt);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "quantity-high":
          return Number(b.quantity) - Number(a.quantity);
        case "quantity-low":
          return Number(a.quantity) - Number(b.quantity);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
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

      // Reload products to show the new one
      await loadProducts();
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

      // Reload products to update status
      await loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to transfer product");
    } finally {
      setIsTransferring(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Address copied to clipboard!");
  };

  const statusColors = {
    0: "bg-blue-100 text-blue-800 border-blue-300",
    1: "bg-yellow-100 text-yellow-800 border-yellow-300",
    2: "bg-green-100 text-green-800 border-green-300",
  };

  const statusLabels = ["Created", "In Transit", "Delivered"];

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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <IconContext.Provider
                  value={{ className: "w-8 h-8 text-white" }}
                >
                  <MdFactory />
                </IconContext.Provider>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Manufacturer Dashboard
                </h1>
                {walletAddress && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Connected:</span>
                    <button
                      onClick={() => copyToClipboard(walletAddress)}
                      className="text-sm font-mono text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {formatAddress(walletAddress)}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={loadProducts}
              disabled={loading}
              className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
              title="Refresh products"
            >
              <IconContext.Provider
                value={{
                  className: `w-5 h-5 text-gray-700 ${loading ? "animate-spin" : ""}`,
                }}
              >
                <MdRefresh />
              </IconContext.Provider>
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

        {/* Search, Filter, Sort Bar */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <IconContext.Provider
                  value={{
                    className:
                      "w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2",
                  }}
                >
                  <MdSearch />
                </IconContext.Provider>
                <input
                  type="text"
                  placeholder="Search by name, batch ID, origin, or quality standard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showFilters || filterStatus !== "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconContext.Provider value={{ className: "w-5 h-5" }}>
                  <MdFilterList />
                </IconContext.Provider>
                Filters
                {filterStatus !== "all" && (
                  <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                    1
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <IconContext.Provider
                  value={{
                    className:
                      "w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2",
                  }}
                >
                  <MdSort />
                </IconContext.Provider>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-gray-700 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="quantity-high">Quantity (High-Low)</option>
                  <option value="quantity-low">Quantity (Low-High)</option>
                </select>
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-700 self-center mr-2">
                    Status:
                  </span>
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      filterStatus === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("0")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      filterStatus === "0"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                    }`}
                  >
                    Created ({products.filter((p) => p.status === 0).length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("1")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      filterStatus === "1"
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                    }`}
                  >
                    In Transit ({products.filter((p) => p.status === 1).length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("2")}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      filterStatus === "2"
                        ? "bg-green-600 text-white"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    Delivered ({products.filter((p) => p.status === 2).length})
                  </button>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
        )}

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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Column Headers - Desktop */}
            <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg text-sm">
              <div>Product Info</div>
              <div>Batch ID</div>
              <div>Quantity</div>
              <div>Origin</div>
              <div>Quality</div>
              <div>Status</div>
              <div>Actions</div>
            </div>

            {/* Products List */}
            {filteredProducts.map((product) => {
              const createdDate = new Date(
                Number(product.createdAt) * 1000,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              const mfgDate = new Date(
                Number(product.manufacturingDate) * 1000,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={Number(product.id)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                >
                  {/* Mobile View */}
                  <div className="md:hidden p-5 space-y-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: #{Number(product.id)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          statusColors[
                            product.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {statusLabels[product.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Batch ID
                        </span>
                        <span className="font-mono text-gray-800 font-semibold">
                          {product.batchId}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Quantity
                        </span>
                        <span className="text-gray-800 font-semibold">
                          {Number(product.quantity).toLocaleString()} units
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Origin
                        </span>
                        <span className="text-gray-800">{product.origin}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Quality
                        </span>
                        <span className="text-gray-800">
                          {product.qualityStandard}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Manufactured
                        </span>
                        <span className="text-gray-800">{mfgDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-xs mb-1">
                          Created
                        </span>
                        <span className="text-gray-800">{createdDate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => {
                          setDetailsProduct(product);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg font-semibold transition-all text-sm border border-blue-200"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowTransferModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2 rounded-lg font-semibold transition-all text-sm"
                      >
                        Transfer
                      </button>
                    </div>
                  </div>

                  {/* Desktop View */}
                  <div className="hidden md:grid grid-cols-7 gap-4 items-center px-6 py-4 hover:bg-blue-50 transition-colors text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ID: #{Number(product.id)} • Created: {createdDate}
                      </p>
                    </div>
                    <div className="font-mono text-gray-700 text-xs bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      {product.batchId}
                    </div>
                    <div className="font-semibold text-gray-800">
                      {Number(product.quantity).toLocaleString()}
                      <span className="text-xs text-gray-500 ml-1">units</span>
                    </div>
                    <div className="text-gray-700">{product.origin}</div>
                    <div className="text-gray-700 text-xs">
                      {product.qualityStandard}
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border inline-block ${
                          statusColors[
                            product.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        {statusLabels[product.status]}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDetailsProduct(product);
                          setShowDetailsModal(true);
                        }}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-semibold transition-all text-xs border border-blue-200"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowTransferModal(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2 px-3 rounded-lg font-semibold transition-all text-xs"
                      >
                        Transfer
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Details Modal */}
        {detailsProduct && (
          <Modal
            isOpen={showDetailsModal}
            title="Product Details"
            onClose={() => {
              setShowDetailsModal(false);
              setDetailsProduct(null);
            }}
          >
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* Product Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {detailsProduct.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      statusColors[
                        detailsProduct.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {statusLabels[detailsProduct.status]}
                  </span>
                  <span className="text-sm text-gray-600">
                    ID: #{Number(detailsProduct.id)}
                  </span>
                </div>
              </div>

              {/* Product Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Batch ID</p>
                  <p className="font-mono font-semibold text-gray-800">
                    {detailsProduct.batchId}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Quantity</p>
                  <p className="font-semibold text-gray-800">
                    {Number(detailsProduct.quantity).toLocaleString()} units
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Origin</p>
                  <p className="font-semibold text-gray-800">
                    {detailsProduct.origin}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Quality Standard</p>
                  <p className="font-semibold text-gray-800">
                    {detailsProduct.qualityStandard}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Manufacturing Date
                  </p>
                  <p className="font-semibold text-gray-800">
                    {new Date(
                      Number(detailsProduct.manufacturingDate) * 1000,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Created On</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(
                      Number(detailsProduct.createdAt) * 1000,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Manufacturer Address */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-2">
                  Manufacturer Address
                </p>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm text-gray-800 break-all">
                    {detailsProduct.manufacturer}
                  </p>
                  <button
                    onClick={() => copyToClipboard(detailsProduct.manufacturer)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailsProduct(null);
                }}
                className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </Modal>
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

        {/* Transfer Product Modal - Selection */}
        <Modal
          isOpen={showTransferModal && !selectedProduct}
          title="Select Product to Transfer"
          onClose={() => setShowTransferModal(false)}
        >
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {products.length === 0 ? (
              <p className="text-center text-gray-600 py-4">
                No products available
              </p>
            ) : (
              products.map((product) => (
                <button
                  key={Number(product.id)}
                  onClick={() => setSelectedProduct(product)}
                  className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                      {product.name}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold border ${
                        statusColors[
                          product.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {statusLabels[product.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Batch: {product.batchId} • Qty:{" "}
                    {Number(product.quantity).toLocaleString()}
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
                  Batch: {selectedProduct.batchId} • Qty:{" "}
                  {Number(selectedProduct.quantity).toLocaleString()}
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
