const { expect } = require('chai');

describe('ERC20Token Factory', () => {
    let owner;

    beforeEach(async () => {
        ERC20TokenFactory = await ethers.getContractFactory('ERC20TokenFactory');
        eRC20TokenFactory = await ERC20TokenFactory.deploy();
        owner = await ethers.getSigners();
    });

    describe('Minting ERC20 Token', () => {
        it('Should emit an ERC20TokenMinted event', async () => {
            await expect(eRC20TokenFactory.mintNewERC20Token("Test Token", "TST", 18, 1e10))
                .to.emit(eRC20TokenFactory, 'ERC20TokenMinted')
        });
    });
});