const { expect } = require('chai');

describe('ERC20Token', () => {
    let owner;

    beforeEach(async () => {
        [owner] = await ethers.getSigners();

        ERC20Token = await ethers.getContractFactory('ERC20Token');
        eRC20Token = await ERC20Token.deploy(owner.address, "Test Token", "TST", 8, 1e9);
    });

    describe('Minting ERC20 Token', () => {
        it('Should return correct decimal value', async () => {
            expect(await eRC20Token.decimals()).to.equal(8);
        });

        it('Should return correct totalSupply value', async () => {
            expect(await eRC20Token.totalSupply()).to.equal(1e9);
        });

        it('Should return correct owner balance value', async () => {
            expect(await eRC20Token.balanceOf(owner.address)).to.equal(await eRC20Token.totalSupply());
        });
    });

    describe('Faucet', () => {
        it('Should return correct faucet amount', async () => {
            expect(await eRC20Token.amount()).to.equal(0);
            expect(await eRC20Token.setFaucetAmount(1e1));
            expect(await eRC20Token.amount()).to.equal(1e1);
        });
    });
});
