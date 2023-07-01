
async function main () {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contract with the account: ${deployer.address}`);

    const balance = await deployer.getBalance();
    console.log(`Account balance: ${balance.toString()}`);

    const ERC20TokenFactory = await ethers.getContractFactory('ERC20TokenFactory');
    const eRC20TokenFactory = await ERC20TokenFactory.deploy();
    console.log(`ERC20TokenFactory address: ${eRC20TokenFactory.address}`);

    const tx = await eRC20TokenFactory.mintNewERC20Token("Test Token", "TST", 18, 1e10);
    const provider = ethers.provider;
    const receipt = await provider.getTransactionReceipt(tx.hash);
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
}

main().then(() => {
    process.exit(0);
}).catch(error => {
    console.log(error);
    process.exit(1);
});
