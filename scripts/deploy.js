const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying SupplyChain contract...");

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    // Wait for deployment to complete
    await supplyChain.deployed();

    console.log("✅ SupplyChain deployed successfully!");
    console.log("📍 Contract Address:", supplyChain.address);
    console.log("\n⚠️  IMPORTANT: Update VITE_CONTRACT_ADDRESS in your .env.local");
    console.log("VITE_CONTRACT_ADDRESS=" + supplyChain.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    });
