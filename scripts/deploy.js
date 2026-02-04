const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying SupplyChain contract...");

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    // Wait for deployment to complete
    await supplyChain.deployed();

    console.log("✅ SupplyChain deployed successfully!");
    console.log("📍 Contract Address:", supplyChain.address);

    // User's wallet address
    const userWallet = "0xa733E8329cc096b232DAC55C9feDD10AeD1E9421";
    const distributorWallet = "0xBf00C0a3C8a254CEDd80039eF204800DeE14AbA5";
    const retailerWallet = "0x0C906e3b18497963520489d79612F521f92eCF53";

    console.log("\n📋 Assigning roles...");
    console.log("   Your Wallet (Manufacturer):", userWallet);
    console.log("   Distributor:", distributorWallet);
    console.log("   Retailer:", retailerWallet);

    // Assign roles to wallets (enum: 1=Manufacturer, 2=Distributor, 3=Retailer)
    const tx1 = await supplyChain.assignRole(userWallet, 1); // Manufacturer
    await tx1.wait();
    console.log("✅ Assigned Manufacturer role to", userWallet);

    const tx2 = await supplyChain.assignRole(distributorWallet, 2); // Distributor
    await tx2.wait();
    console.log("✅ Assigned Distributor role to", distributorWallet);

    const tx3 = await supplyChain.assignRole(retailerWallet, 3); // Retailer
    await tx3.wait();
    console.log("✅ Assigned Retailer role to", retailerWallet);

    console.log("\n⚠️  IMPORTANT: Update VITE_CONTRACT_ADDRESS in your .env.local");
    console.log("VITE_CONTRACT_ADDRESS=" + supplyChain.address);

    console.log("\n✅ Setup complete! Use your wallet in MetaMask: " + userWallet);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exitCode = 1;
    });
