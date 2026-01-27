const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
    async function deployFixture() {
        const [admin, manufacturer, distributor, retailer] =
            await ethers.getSigners();

        const SupplyChain = await ethers.getContractFactory("SupplyChain");
        const supplyChain = await SupplyChain.deploy();

        return {
            supplyChain,
            admin,
            manufacturer,
            distributor,
            retailer,
        };
    }

    it("Admin assigns roles correctly", async function () {
        const { supplyChain, admin, manufacturer } = await deployFixture();

        await supplyChain
            .connect(admin)
            .assignRole(manufacturer.address, 1);

        expect(await supplyChain.roles(manufacturer.address)).to.equal(1);
    });

    it("Manufacturer creates product", async function () {
        const { supplyChain, admin, manufacturer } = await deployFixture();

        await supplyChain.connect(admin).assignRole(manufacturer.address, 1);

        await supplyChain
            .connect(manufacturer)
            .createProduct("Milk", "BATCH-001");

        const product = await supplyChain.products(1);

        expect(product.name).to.equal("Milk");
        expect(product.batchId).to.equal("BATCH-001");
        expect(product.status).to.equal(0); // Created
    });

    it("Full supply chain flow works", async function () {
        const { supplyChain, admin, manufacturer, distributor, retailer } =
            await deployFixture();

        await supplyChain.connect(admin).assignRole(manufacturer.address, 1);
        await supplyChain.connect(admin).assignRole(distributor.address, 2);
        await supplyChain.connect(admin).assignRole(retailer.address, 3);

        await supplyChain
            .connect(manufacturer)
            .createProduct("Rice", "BATCH-XYZ");

        await supplyChain
            .connect(manufacturer)
            .transferToDistributor(1, distributor.address);

        await supplyChain
            .connect(distributor)
            .transferToRetailer(1, retailer.address);

        const product = await supplyChain.products(1);

        expect(product.owner).to.equal(retailer.address);
        expect(product.status).to.equal(2); // Delivered

        const history = await supplyChain.getProductHistory(1);
        expect(history.length).to.equal(3); // Created → InTransit → Delivered
    });
});
