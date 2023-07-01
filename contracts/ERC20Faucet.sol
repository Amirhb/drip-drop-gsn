// contracts/ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC20Faucet {

    mapping (address => uint256) private lastTimeRequestTimestamp;
    uint256 private _amount; // amount the faucet generates

    function amount() public view returns (uint256) {
        return _amount;
    }

    function setAmount(uint256 amount_) internal {
        _amount = amount_;
    }

    function setLastTimeRequestTimestamp(address receiver_) internal {
        lastTimeRequestTimestamp[receiver_] = block.timestamp;
    }

    function isReceiverEligible(address receiver_) internal view returns (bool) {
        return block.timestamp - lastTimeRequestTimestamp[receiver_] >= 86400;
    }
}
