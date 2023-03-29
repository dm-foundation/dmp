// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error MaxSupply();
error NonExistentTokenURI();
error WithdrawTransfer();
error NameAlreadyTaken();

contract Store is ERC721, Ownable {

    using Strings for uint256;
    string public baseURI;
    uint256 public currentTokenId;
    mapping(uint256 => bytes32) internal storeRootHash;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        baseURI = _baseURI;
    }

    function mintTo(address recipient, string calldata name) public returns (uint256) {
       uint256 tokenId = uint256(keccak256(bytes(name)));
        _safeMint(recipient, tokenId);
        return tokenId;
    }

    function updateRootHash(uint256 id, bytes32 hash) public
    {
        address owner = _ownerOf[id];
        require(
            msg.sender == owner ||
            isApprovedForAll[owner][msg.sender] ||
            msg.sender == getApproved[id],
            "NOT_AUTHORIZED"
        );
        storeRootHash[id] = hash;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        if (ownerOf(tokenId) == address(0)) {
            revert NonExistentTokenURI();
        }
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    function withdrawPayments(address payable payee) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = payee.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }
}
