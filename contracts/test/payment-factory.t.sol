// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../src/payment-factory.sol";

contract Payments is Test {
    PaymentFactory private factory;
    address generatedAddress;

    address payable merchant = payable(address(1));
    address currency = address(0);
    uint256 amount   = 5;
    bytes32 recieptHash = 0x5049705e4c047d2cfeb1050cffe847c85a8dbd96e7f129a3a1007920d9c61d9a; 
    address payable proof  = payable(address(3));

    function setUp() public {
        factory = new PaymentFactory();
        generatedAddress = factory.calcuatePaymentAddress(
            merchant,
            currency,
            amount,
            recieptHash,
            proof
        );
        deal(generatedAddress, amount);
    }

    function test_ProcessPayment() public {
        factory.processPayment(
            merchant,
            currency,
            amount,
            recieptHash,
            proof
        );
        console.log(merchant.balance);
        console.log(generatedAddress.balance);
    }
}
