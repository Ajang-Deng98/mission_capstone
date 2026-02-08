// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AidTraceVerification {
    mapping(string => bool) private storedHashes;
    mapping(string => uint256) private hashTimestamps;
    address public owner;
    
    event HashStored(string indexed hash, uint256 timestamp, address indexed sender);
    event HashVerified(string indexed hash, bool exists);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function storeHash(string memory _hash) public {
        require(bytes(_hash).length > 0, "Hash cannot be empty");
        require(!storedHashes[_hash], "Hash already exists");
        
        storedHashes[_hash] = true;
        hashTimestamps[_hash] = block.timestamp;
        
        emit HashStored(_hash, block.timestamp, msg.sender);
    }
    
    function verifyHash(string memory _hash) public view returns (bool) {
        return storedHashes[_hash];
    }
    
    function getHashTimestamp(string memory _hash) public view returns (uint256) {
        require(storedHashes[_hash], "Hash does not exist");
        return hashTimestamps[_hash];
    }
    
    function batchStoreHashes(string[] memory _hashes) public {
        for (uint i = 0; i < _hashes.length; i++) {
            if (bytes(_hashes[i]).length > 0 && !storedHashes[_hashes[i]]) {
                storedHashes[_hashes[i]] = true;
                hashTimestamps[_hashes[i]] = block.timestamp;
                emit HashStored(_hashes[i], block.timestamp, msg.sender);
            }
        }
    }
}