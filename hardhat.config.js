require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      // Private blockchain configuration with 0 gas fees
      allowUnlimitedContractSize: true,
      mining: {
        auto: true,
        interval: 0,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      // Connection will use default RPC config
      timeout: 40000,
    },
  },
  gasReporter: {
    enabled: false,
  },
};
