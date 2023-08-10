
async function main () {
    // run yarn gsn-with-ganache prior to this script.
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contract with the account: ${deployer.address}`);

    const forwarderAddress = require('../build/gsn/Forwarder').address;
    console.log(`Forwarder address: ${forwarderAddress}`);

    const WhitelistPaymasterArtifact = require("@opengsn/paymasters/build/contracts/WhitelistPaymaster.json");
    const WhitelistPaymaster = new ethers.ContractFactory(WhitelistPaymasterArtifact.abi, WhitelistPaymasterArtifact.bytecode, deployer);
    const whitelistPaymaster = await WhitelistPaymaster.deploy();
    console.log(`WhitelistPaymaster address: ${whitelistPaymaster.address}`);

    const relayHubAddress = require('../build/gsn/RelayHub.json').address;
    await whitelistPaymaster.setRelayHub(relayHubAddress);
    await whitelistPaymaster.setTrustedForwarder(forwarderAddress);

    const { RelayProvider } = require('@opengsn/provider');
    const config = {
        paymasterAddress: whitelistPaymaster.address,
        auditorsCount: 0,
        loggerConfiguration: {
            logLevel: 'debug'
        }
    };
    const Web3HttpProvider = require('web3-providers-http');
    const hre = require("hardhat");
    const web3provider = new Web3HttpProvider(hre.network.config.url);
    const gsnProvider = await RelayProvider.newProvider({ provider: web3provider, config }).init();

    const etherProvider = new ethers.providers.Web3Provider(gsnProvider);
    let balance = await etherProvider.getBalance(deployer.address);
    console.log(`Account balance: ${balance.toString()}`);

    const ERC20TokenFactory = await ethers.getContractFactory('ERC20TokenFactory');
    let eRC20TokenFactory = await ERC20TokenFactory.deploy(forwarderAddress);
    console.log(`ERC20TokenFactory address: ${eRC20TokenFactory.address}`);

    // only uncomment this if you have already have enough balance in the gsn contracts.
    /* eRC20TokenFactory = eRC20TokenFactory.connect(etherProvider.getSigner(deployer.address));
    const tx = await eRC20TokenFactory.mintNewERC20Token("Test Token", "TST", 18, 1e10);
    balance = await etherProvider.getBalance(deployer.address);
    console.log(`Account balance: ${balance.toString()}`);

    const receipt = await etherProvider.getTransactionReceipt(tx.hash);
    const abi = [
        "event ERC20TokenMinted(address indexed ERC20Token, address indexed owner, string name, string symbol, uint8 decimals, uint256 initialSupply)"
    ];
    let erc20TokenAddress;
    receipt.logs.forEach((log) => {
        try {
            const iface = new ethers.utils.Interface(abi);
            const decodedEventData = iface.parseLog(log);
            erc20TokenAddress = decodedEventData.args[0];
        } catch (e) {}
    });

    const ERC20Token = await ethers.getContractFactory('ERC20Token');
    const eRC20Token = await ERC20Token.attach(erc20TokenAddress);
    const balanceOf = await eRC20Token.balanceOf(deployer.address);
    console.log(`Balance of ${deployer.address} in ${erc20TokenAddress}: ${balanceOf}`);
    */
}

main().then(() => {
    process.exit(0);
}).catch(error => {
    console.log(error);
    process.exit(1);
});
