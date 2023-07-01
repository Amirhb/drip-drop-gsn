// contracts/ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ERC20Faucet.sol";

contract ERC20Token is ERC20, Ownable, ERC20Faucet {
    uint8 private _decimals = 18;
    constructor(address owner_, string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(owner_, initialSupply_);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function setFaucetAmount(uint256 amount_) external onlyOwner {
        setAmount(amount_);
    }

    function mintFromFaucet() external {
        require(isReceiverEligible(_msgSender()), "The address has already asked for the amount in less than 24 hours ago.");

        setLastTimeRequestTimestamp(_msgSender());
        _mint(_msgSender(), amount());
    }
}
