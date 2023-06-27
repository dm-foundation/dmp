// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract SweepEtherPayment {
    constructor (
        address payable merchant,
        uint256 amount,
        address payable proof,
        uint escrowPeriod
    ) payable {
        require(block.number > escrowPeriod);
        uint256 balance = address(this).balance;
        // not enough was sent so return what we have
        if (balance < amount) {
            proof.transfer(balance);
            assembly {
                stop()
            }
            // not enought was sent, return to buyer
        } else if (balance > amount) {
            // to much was sent so send the over payed amount back
            proof.transfer(balance - amount);
        }
        // pay the mechant
        merchant.transfer(amount);
        // need to prevent solidity from returning code
        assembly {
            stop()
        }
    }
}

contract PaymentFactory {
  event Purchase(address indexed customer, bytes32 indexed _listing);
  event Refund(address indexed customer, bytes32 indexed _listing);

  function processPayment(
      address merchant,
      address currency,
      uint256 amount,
      bytes32 listing,
      address proof,
      bytes32 salt // sender + nonce?
  ) public {
    new SweepEtherPayment{salt: salt}(merchant, amount);
  }

  function processRefund(
      address merchant,
      address currency,
      bytes32 listing,
      address proof,
      bytes32 salt // sender + nonce?
  ) public {

  }

  function issueRefund(
      address payout,
      address currency,
      uint256 amount,
      bytes32 listing
  ) external {}

}
