// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CommitmentVault.sol";

/**
 * @title CommitmentFactory
 * @notice Factory for creating and managing commitments through the vault.
 * @dev Provides a centralized interface for commitment creation and management.
 */
contract CommitmentFactory {
    CommitmentVault public immutable vault;
    address public immutable usdc;

    event FactoryInitialized(address indexed vault, address indexed usdc);

    constructor(address _vault, address _usdc) {
        require(_vault != address(0), "Invalid vault address");
        require(_usdc != address(0), "Invalid USDC address");
        vault = CommitmentVault(_vault);
        usdc = _usdc;
        emit FactoryInitialized(_vault, _usdc);
    }

    /**
     * @notice Create a new commitment through the factory.
     * @param amount Amount of USDC to lock (in 6 decimals for Arc USDC)
     * @param deadline Unix timestamp when commitment can be resolved
     * @param verifier Optional address that can resolve alongside creator (address(0) = self-verify)
     * @param penaltyReceiver Address that receives USDC if commitment fails
     * @return commitmentId The ID of the newly created commitment
     */
    function createCommitment(
        uint256 amount,
        uint256 deadline,
        address verifier,
        address penaltyReceiver
    ) external returns (uint256 commitmentId) {
        // Get current nextId before creation
        commitmentId = vault.nextId();
        
        // Delegate to vault
        vault.createCommitment(amount, deadline, verifier, penaltyReceiver);
        
        return commitmentId;
    }

    /**
     * @notice Resolve a commitment through the factory.
     * @param id The commitment ID to resolve
     * @param success True if commitment succeeded, false if failed
     */
    function resolveCommitment(uint256 id, bool success) external {
        vault.resolveCommitment(id, success);
    }

    /**
     * @notice Get commitment details.
     * @param id The commitment ID
     */
    function getCommitment(uint256 id) external view returns (
        address creator,
        uint256 amount,
        uint256 deadline,
        address verifier,
        address penaltyReceiver,
        bool resolved,
        bool success
    ) {
        return vault.getCommitment(id);
    }

    /**
     * @notice Check if a commitment exists.
     * @param id The commitment ID
     */
    function commitmentExists(uint256 id) external view returns (bool) {
        return vault.commitmentExists(id);
    }

    /**
     * @notice Get the total number of commitments created.
     */
    function totalCommitments() external view returns (uint256) {
        return vault.nextId();
    }
}
