import { BsQuestionCircle, BsBuilding, BsTruck, BsShop } from "react-icons/bs";
import type { IconType } from "react-icons";

// src/config/walletConfig.ts
// Map wallet addresses to roles
// In a real app, this would come from the smart contract
// For development, you can manually add wallet addresses here

// Add your wallet addresses here
// Format: "0x1234567890123456789012345678901234567890": 1 (1 = Manufacturer)
// "0x0987654321098765432109876543210987654321": 2 (2 = Distributor)
// "0x1111111111111111111111111111111111111111": 3 (3 = Retailer)

export const WALLET_ROLES: { [key: string]: number } = {
  "0xa733e8329cc096b232dac55c9fedd10aed1e9421": 1,
  "0xabc1234567890defabc1234567890defabc12345": 2,
  "0xdef4567890abcdef4567890abcdef4567890abcd": 3,
};

// Role names
export const ROLE_NAMES: { [key: number]: string } = {
  0: "None",
  1: "Manufacturer",
  2: "Distributor",
  3: "Retailer",
};

// Role emojis
export const ROLE_ICONS: { [key: number]: IconType } = {
  0: BsQuestionCircle, // None
  1: BsBuilding, // Manufacturer
  2: BsTruck, // Distributor
  3: BsShop, // Retailer
};

/**
 * Get role from wallet address
 * Returns 0 if no role found
 */
export function getRoleFromAddress(address: string): number {
  if (!address) {
    console.warn("getRoleFromAddress: address is empty");
    return 0;
  }

  const normalizedAddress = address.toLowerCase();
  console.log(
    "🔍 Looking up role for address:",
    normalizedAddress,
    "Configured roles:",
    Object.keys(WALLET_ROLES).map((a) => a.toLowerCase()),
  );

  const role = WALLET_ROLES[normalizedAddress] || 0;
  console.log("✅ Detected role:", role);
  return role;
}
