// src/utils/blockchain.ts
import { ethers } from "ethers";
import SupplyChainAbi from "../../../contracts/SupplyChain.json"; // compiled output

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

// Connect to MetaMask
export async function connectWallet() {
  if ((window as any).ethereum) {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum,
    );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { provider, signer };
  } else {
    alert("MetaMask is not installed!");
    return null;
  }
}

// Get contract instance
export function getContract(signer: ethers.Signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, SupplyChainAbi.abi, signer);
}
