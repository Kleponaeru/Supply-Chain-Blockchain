const CONTRACT_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

async function main() {
    const [manufacturer, distributor, retailer] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = SupplyChain.attach(CONTRACT_ADDRESS);

    // Assign roles
    await (await supplyChain.assignRole(manufacturer.address, 1)).wait();
    await (await supplyChain.assignRole(distributor.address, 2)).wait();
    await (await supplyChain.assignRole(retailer.address, 3)).wait();

    console.log("DONE - Roles assigned");

    // Manufacturer creates product (NOW PASSING BOTH ARGUMENTS)
    await (
        await supplyChain
            .connect(manufacturer)
            .createProduct("Coffee Beans Batch A", "BATCH001")
    ).wait();

    console.log("DONE - Product created");

    // Transfer to distributor
    await (
        await supplyChain
            .connect(manufacturer)
            .transferToDistributor(1, distributor.address)
    ).wait();

    console.log("DONE - Transferred to distributor");

    // Transfer to retailer
    await (
        await supplyChain
            .connect(distributor)
            .transferToRetailer(1, retailer.address)
    ).wait();

    console.log("DONE - Transferred to retailer");

    // Read final state
    const product = await supplyChain.products(1);
    console.log("📦 Final product state:", product);
}

main().catch(console.error);
