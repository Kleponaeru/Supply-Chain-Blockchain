const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
    "function createProduct(string name)",
    "function transferToDistributor(uint256 productId, address distributor)",
    "function transferToRetailer(uint256 productId, address retailer)",
    "function products(uint256) view returns (uint256,string,address,uint8)"
];

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

async function setup() {
    const accounts = await provider.listAccounts();
    window.manufacturer = provider.getSigner(accounts[0]);
    window.distributor = accounts[1];
    window.retailer = accounts[2];

    window.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        manufacturer
    );
}

async function createProduct() {
    const tx = await contract.createProduct("Frontend Product");
    await tx.wait();
    document.getElementById("output").textContent = "Product created";
}

async function toDistributor() {
    const tx = await contract.transferToDistributor(1, distributor);
    await tx.wait();
    document.getElementById("output").textContent = "Sent to distributor";
}

async function toRetailer() {
    const contractAsDistributor = contract.connect(
        provider.getSigner(distributor)
    );
    const tx = await contractAsDistributor.transferToRetailer(1, retailer);
    await tx.wait();
    document.getElementById("output").textContent = "Sent to retailer";
}

setup();
