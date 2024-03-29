// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

contract Store is ERC721Enumerable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;
    string public baseURI;
    mapping(uint256 => bytes32) public storeRootHash;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        baseURI = _baseURI;
    }

    function mintTo(address recipient, uint256 id, bytes32 rootHash) public returns (uint256) {
        // safe mint checks id
        _safeMint(recipient, id);
        // update the hash
        storeRootHash[id] = rootHash;
        return id;
    }

    function updateRootHash(uint256 id, bytes32 hash) public
    {
        address owner = _ownerOf(id);
        require(
            msg.sender == owner ||
            isApprovedForAll(owner, msg.sender) ||
            msg.sender == getApproved(id),
            "NOT_AUTHORIZED"
        );
        storeRootHash[id] = hash;
    }
}
