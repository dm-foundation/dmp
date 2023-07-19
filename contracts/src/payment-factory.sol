pragma solidity ^0.8.19;
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";

contract NFTItem is ERC721 {
    address owner = msg.sender;
    mapping(uint256 => bytes32) public listings;
    constructor() ERC721("MassItem", "MT") {}
    function mint(address nftOwner, uint256 id, bytes32 listing) public {
        require(owner == msg.sender);
        _mint(nftOwner, id);
        listings[id] = listing;
    }
}

contract SweepEtherPayment {
    constructor (
        address payable merchant,
        uint256 amount,
        address payable proof
    ) payable {
        uint256 balance = address(this).balance;
        // not enough was sent so return what we have
        if (balance < amount) {
            proof.transfer(balance);
        } else {
            if (balance > amount) {
                // to much was sent so send the over payed amount back
                proof.transfer(balance - amount);
            }
            // pay the mechant
            merchant.transfer(amount);
        }
        // need to prevent solidity from returning code
        assembly {
            stop()
        }
    }
}

contract PaymentFactory {
  NFTItem Items = new NFTItem();

  function processPayment(
      address payable merchant,
      address currency,
      uint256 amount,
      bytes32 listing,
      address payable proof,
      bytes32 salt // sender + nonce?
  ) public {
      SweepEtherPayment paymentContract;
      // if we are dealing with ether
      if (currency == address(0)) {
        paymentContract  = new SweepEtherPayment{salt: salt}(merchant, amount, proof);
      } else {
        // if we are dealing with an ERC20
      }
      // Create a reciept
      bytes32 hash = keccak256(abi.encodePacked(block.number, address(paymentContract)));
      Items.mint(proof, uint256(hash), listing);
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
