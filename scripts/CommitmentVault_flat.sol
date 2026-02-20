// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// contracts/interfaces/IERC20.sol

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

// contracts/CommitmentVault.sol

/**
 * @title CommitmentVault
 * @notice Lock USDC against a commitment. Resolve: success → refund creator; fail → send to penalty receiver.
 * @dev Only creator or verifier can resolve after deadline. One resolution per commitment.
 */
contract CommitmentVault {

    IERC20 public usdc;
    uint256 public nextId;

    struct Commitment {
        address creator;
        uint256 amount;
        uint256 deadline;
        address verifier;
        address penaltyReceiver;
        bool resolved;
        bool success;
    }

    mapping(uint256 => Commitment) public commitments;

    event CommitmentCreated(uint256 indexed id, address creator, uint256 amount, uint256 deadline, address verifier, address penaltyReceiver);
    event CommitmentResolved(uint256 indexed id, bool success);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function createCommitment(
        uint256 amount,
        uint256 deadline,
        address verifier,
        address penaltyReceiver
    ) external {
        require(deadline > block.timestamp, "Invalid deadline");
        require(amount > 0, "Amount must be > 0");
        require(penaltyReceiver != address(0), "Invalid penalty receiver");
        require(penaltyReceiver != msg.sender, "Penalty receiver cannot be creator");

        require(usdc.transferFrom(msg.sender, address(this), amount), "USDC transfer failed");

        commitments[nextId] = Commitment({
            creator: msg.sender,
            amount: amount,
            deadline: deadline,
            verifier: verifier,
            penaltyReceiver: penaltyReceiver,
            resolved: false,
            success: false
        });

        emit CommitmentCreated(nextId, msg.sender, amount, deadline, verifier, penaltyReceiver);
        nextId++;
    }

    function resolveCommitment(uint256 id, bool success) external {
        Commitment storage c = commitments[id];

        require(block.timestamp >= c.deadline, "Too early");
        require(!c.resolved, "Already resolved");
        require(
            msg.sender == c.creator || msg.sender == c.verifier,
            "Not authorized"
        );

        c.resolved = true;
        c.success = success;

        if (success) {
            require(usdc.transfer(c.creator, c.amount), "Transfer failed");
        } else {
            require(usdc.transfer(c.penaltyReceiver, c.amount), "Transfer failed");
        }

        emit CommitmentResolved(id, success);
    }

    function getCommitment(uint256 id) external view returns (
        address creator,
        uint256 amount,
        uint256 deadline,
        address verifier,
        address penaltyReceiver,
        bool resolved,
        bool success
    ) {
        Commitment storage c = commitments[id];
        require(c.creator != address(0), "Commitment does not exist");
        return (
            c.creator,
            c.amount,
            c.deadline,
            c.verifier,
            c.penaltyReceiver,
            c.resolved,
            c.success
        );
    }

    function commitmentExists(uint256 id) external view returns (bool) {
        return commitments[id].creator != address(0);
    }
}
