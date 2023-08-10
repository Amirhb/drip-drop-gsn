/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');
require("@nomiclabs/hardhat-ganache");
// require("@nomicfoundation/hardhat-chai-matchers")

module.exports = {
  solidity: "0.8.18",
  networks: {
    gsn: {
      url: "http://127.0.0.1:8545",
    }
  },
};
