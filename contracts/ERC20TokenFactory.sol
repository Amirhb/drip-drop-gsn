// contracts/ERC20TokenFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC20Token.sol";
import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract ERC20TokenFactory is ERC2771Recipient {

    event ERC20TokenMinted(
        address indexed ERC20Token,
        address indexed owner,
        string name,
        string symbol,
        uint8 decimals,
        uint256 initialSupply
    );

    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    function mintNewERC20Token(string memory name_, string memory symbol_, uint8 decimals_, uint256 initialSupply_) external returns (address) {
        address ERC20TokenAddress_ = address(new ERC20Token(_msgSender(), name_, symbol_, decimals_, initialSupply_));

        emit ERC20TokenMinted(ERC20TokenAddress_, _msgSender(), name_, symbol_, decimals_, initialSupply_);

        return ERC20TokenAddress_;
    }
}
