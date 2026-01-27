// src/utils/blockchain.ts
import { ethers, Contract, Signer } from "ethers";
import SupplyChainAbi from "../../../artifacts/contracts/SupplyChain.sol/SupplyChain.json";

const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0xa733E8329cc096b232DAC55C9feDD10AeD1E9421";

export interface WalletConnection {
  provider: ethers.providers.Web3Provider;
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

// Connect to MetaMask
export async function connectWallet(): Promise<WalletConnection | null> {
  if (!window.ethereum) {
    alert("MetaMask is not installed!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

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
