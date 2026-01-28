// import React from "react";
// import { Role } from "../utils/blockchain";

// interface RoleSelectorProps {
//   selectedRole: Role | null;
//   onSelectRole: (role: Role) => void;
//   isLoading?: boolean;
// }

// const RoleSelector: React.FC<RoleSelectorProps> = ({
//   selectedRole,
//   onSelectRole,
//   isLoading = false,
// }) => {
//   const roles = [
//     {
//       id: Role.Manufacturer,
//       name: "Manufacturer",
//       icon: "🏭",
//       description: "Create and manage products",
//       color: "from-blue-500 to-blue-600",
//     },
//     {
//       id: Role.Distributor,
//       name: "Distributor",
//       icon: "🚚",
//       description: "Receive and distribute products",
//       color: "from-green-500 to-green-600",
//     },
//     {
//       id: Role.Retailer,
//       name: "Retailer",
//       icon: "🏪",
//       description: "View and track products",
//       color: "from-purple-500 to-purple-600",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {roles.map((role) => (
//         <button
//           key={role.id}
//           onClick={() => onSelectRole(role.id)}
//           disabled={isLoading}
//           className={`relative overflow-hidden rounded-xl p-6 text-white font-semibold transition-all transform hover:scale-105 ${
//             selectedRole === role.id ? "ring-2 ring-white" : ""
//           } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//           style={{
//             background: `linear-gradient(135deg, ${
//               role.color === "from-blue-500 to-blue-600"
//                 ? "rgb(59, 130, 246) to rgb(37, 99, 235)"
//                 : role.color === "from-green-500 to-green-600"
//                   ? "rgb(34, 197, 94) to rgb(22, 163, 74)"
//                   : "rgb(168, 85, 247) to rgb(147, 51, 234)"
//             })`,
//           }}
//         >
//           <div className="text-4xl mb-3">{role.icon}</div>
//           <h3 className="text-xl mb-1">{role.name}</h3>
//           <p className="text-sm opacity-90">{role.description}</p>
//         </button>
//       ))}
//     </div>
//   );
// };

// export default RoleSelector;
