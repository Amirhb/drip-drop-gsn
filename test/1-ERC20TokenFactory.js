const { expect } = require('chai');
const { RelayProvider } = require('@opengsn/provider');
const Web3HttpProvider = require( 'web3-providers-http');
const { GsnTestEnvironment } = require('@opengsn/dev' );
const ERC20TokenFactoryArtifcat = require('../artifacts/contracts/ERC20TokenFactory.sol/ERC20TokenFactory.json');


// run yarn ganache prior to running tests.
describe('ERC20Token Factory', () => {
    let eRC20TokenFactory;

    beforeEach(async () => {
        let env = await GsnTestEnvironment.startGsn('localhost');
	    const { paymasterAddress, forwarderAddress } = env.contractsDeployment;
        const web3provider = new Web3HttpProvider('http://127.0.0.1:8545');
        const deploymentProvider = new ethers.providers.Web3Provider(web3provider);

        ERC20TokenFactory = new ethers.ContractFactory(ERC20TokenFactoryArtifcat.abi, ERC20TokenFactoryArtifcat.bytecode, deploymentProvider.getSigner());
        eRC20TokenFactory = await ERC20TokenFactory.deploy(forwarderAddress);
        await eRC20TokenFactory.deployed();

        const config = await {
            // loggerConfiguration: { logLevel: 'error'},
            paymasterAddress: paymasterAddress,
            auditorsCount: 0
        };
        let gsnProvider = RelayProvider.newProvider({provider: web3provider, config});
    	await gsnProvider.init();

        const account = new ethers.Wallet('0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d');
        gsnProvider.addAccount(account.privateKey);
    	from = account.address;

        // gsnProvider is now an rpc provider with GSN support. make it an ethers provider:
        const etherProvider = new ethers.providers.Web3Provider(gsnProvider);

        eRC20TokenFactory =  eRC20TokenFactory.connect(etherProvider.getSigner(from));
    });

    describe('Minting ERC20 Token', () => {
        it('Should emit an ERC20TokenMinted event', async () => {
            await expect(eRC20TokenFactory.mintNewERC20Token("Test Token", "TST", 18, 1e10))
                .to.emit(eRC20TokenFactory, 'ERC20TokenMinted')
        });
    });
});
