// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/store-reg.sol";

contract StoreTest is Test {
    using stdStorage for StdStorage;

    Store private store;

    // helper function
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function setUp() public {
        // Deploy NFT contract
        store = new Store("NFT_tutorial", "TUT", "baseUri");
    }

    function testFailNoMintPricePaid() public {
        store.mintTo(address(1), stringToBytes32("test"));
    }

    function testMintPricePaid() public {
        store.mintTo{value: 0.08 ether}(address(1), stringToBytes32("test"));
    }

    function testFailMintToZeroAddress() public {
        store.mintTo{value: 0.08 ether}(address(0), stringToBytes32("test"));
    }

    function testNewMintOwnerRegistered() public {
        store.mintTo{value: 0.08 ether}(address(1), stringToBytes32("test"));
        uint256 slotOfNewOwner = stdstore
            .target(address(store))
            .sig(store.ownerOf.selector)
            .with_key(1)
            .find();

        uint160 ownerOfTokenIdOne = uint160(
            uint256(
                (vm.load(address(store), bytes32(abi.encode(slotOfNewOwner))))
            )
        );
        assertEq(address(ownerOfTokenIdOne), address(1));
    }

    function testBalanceIncremented() public {
        store.mintTo{value: 0.08 ether}(address(1), stringToBytes32("test"));
        uint256 slotBalance = stdstore
            .target(address(store))
            .sig(store.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceFirstMint = uint256(
            vm.load(address(store), bytes32(slotBalance))
        );
        assertEq(balanceFirstMint, 1);

        store.mintTo{value: 0.08 ether}(address(1), stringToBytes32("test"));
        uint256 balanceSecondMint = uint256(
            vm.load(address(store), bytes32(slotBalance))
        );
        assertEq(balanceSecondMint, 2);
    }

    function testSafeContractReceiver() public {
        Receiver receiver = new Receiver();
        store.mintTo{value: 0.08 ether}(address(receiver), stringToBytes32("test"));
        uint256 slotBalance = stdstore
            .target(address(store))
            .sig(store.balanceOf.selector)
            .with_key(address(receiver))
            .find();

        uint256 balance = uint256(vm.load(address(store), bytes32(slotBalance)));
        assertEq(balance, 1);
    }

    function testFailUnSafeContractReceiver() public {
        vm.etch(address(1), bytes("mock code"));
        store.mintTo{value: 0.08 ether}(address(1), stringToBytes32("test"));
    }

    function testWithdrawalWorksAsOwner() public {
        // Mint an NFT, sending eth to the contract
        Receiver receiver = new Receiver();
        address payable payee = payable(address(0x1337));
        uint256 priorPayeeBalance = payee.balance;
        store.mintTo{value: store.MINT_PRICE()}(address(receiver), stringToBytes32("test"));
        // Check that the balance of the contract is correct
        assertEq(address(store).balance, store.MINT_PRICE());
        uint256 storeBalance = address(store).balance;
        // Withdraw the balance and assert it was transferred
        store.withdrawPayments(payee);
        assertEq(payee.balance, priorPayeeBalance + storeBalance);
    }

    function testWithdrawalFailsAsNotOwner() public {
        // Mint an NFT, sending eth to the contract
        Receiver receiver = new Receiver();
        store.mintTo{value: store.MINT_PRICE()}(address(receiver), stringToBytes32("test"));
        // Check that the balance of the contract is correct
        assertEq(address(store).balance, store.MINT_PRICE());
        // Confirm that a non-owner cannot withdraw
        vm.expectRevert("Ownable: caller is not the owner");
        vm.startPrank(address(0xd3ad));
        store.withdrawPayments(payable(address(0xd3ad)));
        vm.stopPrank();
    }
}

contract Receiver is ERC721TokenReceiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}


