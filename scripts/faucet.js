const { ethers } = require("hardhat");

async function main() {
    const recipientAddress = "0xa733E8329cc096b232DAC55C9feDD10AeD1E9421";
    const amountEth = "100";

    const [sender] = await ethers.getSigners();

    console.log(`💰 Sending ${amountEth} ETH to ${recipientAddress}`);
    console.log(`   From: ${sender.address}`);

    const tx = await sender.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther(amountEth),
    });

    console.log(`⏳ Transaction sent:`, tx.hash);
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed!`);

    const balance = await ethers.provider.getBalance(recipientAddress);
    console.log(`   New balance: ${ethers.utils.formatEther(balance)} ETH`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exitCode = 1;
    });
