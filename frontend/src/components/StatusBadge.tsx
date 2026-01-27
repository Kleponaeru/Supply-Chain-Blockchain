import React from "react";
import { Status, statusToString } from "../utils/blockchain";

interface StatusBadgeProps {
  status: number;
  size?: "sm" | "md" | "lg";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  const statusColors: { [key: number]: string } = {
    [Status.Created]: "bg-blue-100 text-blue-800 border-blue-300",
    [Status.InTransit]: "bg-yellow-100 text-yellow-800 border-yellow-300",
    [Status.Delivered]: "bg-green-100 text-green-800 border-green-300",
  };

  const statusIcons: { [key: number]: string } = {
    [Status.Created]: "📦",
    [Status.InTransit]: "🚚",
    [Status.Delivered]: "✅",
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${sizeClasses[size]} ${
        statusColors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      <span>{statusIcons[status]}</span>
      {statusToString(status)}
    </span>
  );
};

export default StatusBadge;
