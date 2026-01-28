// src/utils/blockchain.ts
import { ethers, Contract, Signer } from "ethers";
import SupplyChainAbi from "../../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0xa733E8329cc096b232DAC55C9feDD10AeD1E9421";

export interface WalletConnection {
  provider: any;
  signer: Signer;
  address: string;
}

export interface Product {
  id: bigint;
  name: string;
  batchId: string;
  owner: string;
  status: number;
  createdAt: bigint;
}

export interface HistoryRecord {
  actor: string;
  status: number;
  timestamp: bigint;
}

export enum Role {
  None = 0,
  Manufacturer = 1,
  Distributor = 2,
  Retailer = 3,
}

export enum Status {
  Created = 0,
  InTransit = 1,
  Delivered = 2,
}

// ==================== WALLET MANAGEMENT (UPDATED) ====================

/**
 * Disconnect wallet (clears app state)
 */
export const disconnectWallet = () => {
  localStorage.removeItem("walletConnected");
  console.log("🚪 Wallet disconnected from app");
};

/**
 * Check if wallet was previously connected
 */
export const wasWalletConnected = (): boolean => {
  return localStorage.getItem("walletConnected") === "true";
};

/**
 * Get current connected accounts (if any) without triggering MetaMask popup
 * Only returns account if user previously connected through our app
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!window.ethereum) {
    return null;
  }

  // Don't auto-reconnect if user disconnected from our app
  if (!wasWalletConnected()) {
    return null;
  }

  try {
    const ethereum = window.ethereum as any;
    // eth_accounts returns connected accounts without prompting
    const accounts = await ethereum.request?.({
      method: "eth_accounts",
    });
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
};

/**
 * Silent reconnect on page load - does NOT show MetaMask popup
 * Use this in useEffect on component mount
 */
export async function silentReconnect(): Promise<WalletConnection | null> {
  if (!window.ethereum) {
    return null;
  }

  if (!wasWalletConnected()) {
    return null;
  }

  try {
    const ethereum = window.ethereum as any;

    // Use eth_accounts (no popup)
    const accounts = await ethereum.request?.({
      method: "eth_accounts",
    });

    if (!accounts || accounts.length === 0) {
      return null;
    }

    const provider = new ethers.providers.Web3Provider(ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    return { provider, signer, address };
  } catch (error) {
    console.error("Silent reconnect failed:", error);
    return null;
  }
}

/**
 * Connect to MetaMask
 * Shows popup ONLY if not already connected, or if called after disconnect
 */
export async function connectWallet(): Promise<WalletConnection | null> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  try {
    const ethereum = window.ethereum as any;

    // If user disconnected, we need to force a new connection popup
    // Check if we should request permissions first
    const wasConnected = wasWalletConnected();

    if (!wasConnected) {
      // First time connecting or after disconnect - request permissions to show account selector
      await ethereum.request?.({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    }

    // Get accounts
    const accounts = (await ethereum.request?.({
      method: "eth_requestAccounts",
    })) as string[] | undefined;

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    // Create provider
    const provider = new ethers.providers.Web3Provider(ethereum as any);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // Store connection state
    localStorage.setItem("walletConnected", "true");

    return { provider, signer, address };
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("User rejected MetaMask connection");
    }
    if (error.code === -32002) {
      throw new Error(
        "Connection request already pending. Please check MetaMask.",
      );
    }
    throw new Error(error.message || "Failed to connect wallet");
  }
}

// ==================== CONTRACT INTERACTIONS (UNCHANGED) ====================

// Get contract instance
export function getContract(signer: Signer) {
  return new Contract(CONTRACT_ADDRESS, SupplyChainAbi.abi, signer);
}

// Get user role
export async function getUserRole(
  address: string,
  signer: Signer,
): Promise<Role> {
  const contract = getContract(signer);
  const role = await contract.roles(address);
  return Number(role) as Role;
}

// Create product
export async function createProduct(
  name: string,
  batchId: string,
  signer: Signer,
): Promise<string> {
  const contract = getContract(signer);
  const tx = await contract.createProduct(name, batchId);
  const receipt = await tx.wait();
  return receipt.transactionHash;
}

// Get product
export async function getProduct(
  productId: number,
  signer: Signer,
): Promise<Product | null> {
  try {
    const contract = getContract(signer);
    const product = await contract.products(productId);
    return {
      id: product.id,
      name: product.name,
      batchId: product.batchId,
      owner: product.owner,
      status: Number(product.status),
      createdAt: product.createdAt,
    };
  } catch {
    return null;
  }
}

// Get product history
export async function getProductHistory(
  productId: number,
  signer: Signer,
): Promise<HistoryRecord[]> {
  const contract = getContract(signer);
  const history = await contract.productHistory(productId);
  return history.map((record: any) => ({
    actor: record.actor,
    status: Number(record.status),
    timestamp: record.timestamp,
  }));
}

// Transfer product
export async function transferProduct(
  productId: number,
  recipientAddress: string,
  signer: Signer,
): Promise<string> {
  const contract = getContract(signer);
  const tx = await contract.transferToDistributor(productId, recipientAddress); // or transferToRetailer depending on signer role
  const receipt = await tx.wait();
  return receipt.transactionHash;
}

// Helpers
export function statusToString(status: number): string {
  return ["Created", "In Transit", "Delivered"][status] || "Unknown";
}

export function roleToString(role: Role): string {
  return ["None", "Manufacturer", "Distributor", "Retailer"][role] || "Unknown";
}
