// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/store-reg.sol";

contract StoreTest is Test {
    using stdStorage for StdStorage;

    Store private store;

    function setUp() public {
        // Deploy NFT contract
        store = new Store("NFT_tutorial", "TUT", "baseUri");
    }

    function testMintPricePaid() public {
        store.mintTo(address(1), "test");
    }

    function testFailMintToZeroAddress() public {
        store.mintTo(address(0), "test-2");
    }

    function testNewMintOwnerRegistered() public {
        uint256 id = store.mintTo(address(1), "test-3");
        uint256 slotOfNewOwner = stdstore
            .target(address(store))
            .sig(store.ownerOf.selector)
            .with_key(id)
            .find();

        uint160 ownerOfTokenIdOne = uint160(
            uint256(
                (vm.load(address(store), bytes32(abi.encode(slotOfNewOwner))))
            )
        );
        assertEq(address(ownerOfTokenIdOne), address(1));
    }

    function testBalanceIncremented() public {
        store.mintTo(address(1), "test-4");
        uint256 slotBalance = stdstore
            .target(address(store))
            .sig(store.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceFirstMint = uint256(
            vm.load(address(store), bytes32(slotBalance))
        );
        assertEq(balanceFirstMint, 1);

        store.mintTo(address(1), "test-5");
        uint256 balanceSecondMint = uint256(
            vm.load(address(store), bytes32(slotBalance))
        );
        assertEq(balanceSecondMint, 2);
    }

    function testSafeContractReceiver() public {
        Receiver receiver = new Receiver();
        store.mintTo(address(receiver), "test-6");
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
        store.mintTo(address(1), "test");
    }
}

contract Receiver is IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 id,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}


