// contracts/ERC20TokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Token.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract ERC20TokenFactory is Context {

    event ERC20TokenMinted(
        address indexed ERC20Token,
        address indexed owner,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply
    );

    function mintNewERC20Token(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) external returns (address) {
        address ERC20TokenAddress_ = address(new ERC20Token(_msgSender(), name_, symbol_, decimals_, initialSupply_));

        emit ERC20TokenMinted(ERC20TokenAddress_, _msgSender(), name_, symbol_, decimals_, initialSupply_);

        return ERC20TokenAddress_;
    }
}
