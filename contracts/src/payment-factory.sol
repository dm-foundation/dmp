pragma solidity ^0.8.19;
import "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract NFTReceipt is ERC721 {
    address owner = msg.sender;
    mapping(uint256 => bytes32) public listings;
    constructor() ERC721("MassItem", "MT") {}
    function mint(address nftOwner, uint256 id, bytes32 listing) public {
        require(owner == msg.sender);
        _mint(nftOwner, id);
        listings[id] = listing;
    }
    function burn(uint256 id) public {
        require(owner == msg.sender);
        _burn(id);
    }
}


contract SweepPayment {
    constructor (
        address payable merchant,
        uint256 amount,
        address payable proof,
        ERC20 erc20,
        address factory
    ) payable {
        require(msg.sender == factory);
        // if we are transfering ether
        if (address(erc20) == address(0)) {
            uint256 balance = address(this).balance;
            if (balance < amount) {
                proof.transfer(balance);
            } else {
                if (balance > amount) {
                    // to much was sent so send the over payed amount back
                    proof.transfer(balance - amount);
                }
                // pay the mechant
                merchant.transfer(amount);
                PaymentFactory(msg.sender).markSuccussfulTransfer();
            }
        } else {
            uint256 balance = erc20.balanceOf(address(this));
            // not enough was sent so return what we have
            if (balance < amount) {
                erc20.transfer(proof, balance);
            } else {
                if (balance > amount) {
                    // to much was sent so send the over payed amount back
                    erc20.transfer(proof, balance - amount);
                }
                // pay the mechant
                erc20.transfer(merchant, amount);
                PaymentFactory(msg.sender).markSuccussfulTransfer();
            }
        }
        // need to prevent solidity from returning code
        assembly {
            stop()
        }
    }
}

contract PaymentFactory {
    NFTReceipt Receipt = new NFTReceipt();
    address lastPaymentAddress;

    function getBytecode(
        address  merchant,
        address currency,
        uint256 amount,
        address  proof
    ) public view returns (bytes memory) {
        bytes memory bytecode = type(SweepPayment).creationCode;
        return abi.encodePacked(bytecode, abi.encode(merchant, amount, proof, currency, address(this)));
    }

    function calcuatePaymentAddress(
        address merchant,
        address currency,
        uint256 amount,
        bytes32 recieptHash,
        address proof
    ) public view returns (address)  {
        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff),
                             address(this),
                             recieptHash, // salt
                             keccak256(
                                 getBytecode(
                                     merchant, 
                                     currency,
                                     amount,
                                     proof 
                             ))));

                             // NOTE: cast last 20 bytes of hash to address
                             return address(uint160(uint(hash)));
    }

    function processPayment(
        address payable merchant,
        address currency,
        uint256 amount,
        bytes32 recieptHash,
        address payable proof
    ) public {
        address paymentContract;
        // if we are dealing with ether
        paymentContract  = address(new SweepPayment{salt: recieptHash}(merchant, amount, proof, ERC20(currency), address(this)));
        // Create a reciept
        if (lastPaymentAddress == paymentContract) {
            bytes32 hash = keccak256(abi.encodePacked(block.number, paymentContract));
            Receipt.mint(proof, uint256(hash), recieptHash);
        }
    }

    function markSuccussfulTransfer () public {
        lastPaymentAddress = msg.sender;
    }

    function batch(
        address payable[] calldata merchant,
        address[] calldata currency,
        uint256[] calldata amount,
        bytes32[] calldata listing,
        address payable[] calldata proof
    ) public {
        for (uint i=0; i<merchant.length; i++) {
            processPayment(merchant[i], currency[i], amount[i], listing[i], proof[i]);
        }
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
