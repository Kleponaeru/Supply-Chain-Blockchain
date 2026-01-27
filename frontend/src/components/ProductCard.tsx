import React from "react";
import { Product, statusToString } from "../utils/blockchain";
import StatusBadge from "./StatusBadge";

interface ProductCardProps {
  product: Product;
  onAction?: () => void;
  actionLabel?: string;
  actionColor?: "blue" | "green" | "purple" | "red";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAction,
  actionLabel,
  actionColor = "blue",
}) => {
  const actionColors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-500">ID: {Number(product.id)}</p>
        </div>
        <StatusBadge status={product.status} size="md" />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Batch ID:</span>
          <span className="font-mono text-gray-800">{product.batchId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Owner:</span>
          <span className="font-mono text-gray-800">
            {truncateAddress(product.owner)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Created:</span>
          <span className="text-gray-800">{formatDate(product.createdAt)}</span>
        </div>
      </div>

      {/* Action Button */}
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className={`w-full ${actionColors[actionColor]} text-white py-2 rounded-lg font-semibold transition-colors`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
