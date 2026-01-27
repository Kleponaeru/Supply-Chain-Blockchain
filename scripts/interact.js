const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
    const [manufacturer, distributor, retailer] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = SupplyChain.attach(CONTRACT_ADDRESS);

    // Assign roles
    await supplyChain.assignRole(manufacturer.address, 1); // Manufacturer
    await supplyChain.assignRole(distributor.address, 2);  // Distributor
    await supplyChain.assignRole(retailer.address, 3);     // Retailer

    console.log("Roles assigned");

    // Manufacturer creates product
    const tx1 = await supplyChain
        .connect(manufacturer)
        .createProduct("Coffee Beans Batch A");
    await tx1.wait();

    console.log("Product created");

    // Transfer to distributor
    const tx2 = await supplyChain
        .connect(manufacturer)
        .transferToDistributor(1, distributor.address);
    await tx2.wait();

    console.log("Transferred to distributor");

    // Transfer to retailer
    const tx3 = await supplyChain
        .connect(distributor)
        .transferToRetailer(1, retailer.address);
    await tx3.wait();

    console.log("Transferred to retailer");

    // Read final state
    const product = await supplyChain.products(1);
    console.log("Final product state:", product);
}

main().catch(console.error);
