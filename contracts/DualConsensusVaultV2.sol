// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DualConsensusVault.sol";

/**
 * @title DualConsensusVaultV2
 * @notice Same as DualConsensusVault with: (1) Emergency recovery after deadline + 30 days:
 *         owner can only refund each party their own stake (partyA gets amountA, partyB gets amountB).
 *         Owner cannot send or divert funds to any other address. (2) Optional protocol fee on release.
 *         Status 3 = Recovered.
 */
contract DualConsensusVaultV2 is DualConsensusVault {
    address public owner;
    address public feeRecipient;
    uint256 public feeBps; // e.g. 100 = 1%
    uint256 public constant RECOVERY_DELAY = 30 days;
    uint256 public constant BPS_MAX = 10_000;

    event AgreementRecovered(uint256 indexed id, bytes32 justificationHash);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);
    event FeeUpdated(address indexed feeRecipient, uint256 feeBps);

    constructor(address _usdc, address _owner) DualConsensusVault(_usdc) {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    /// @notice Emergency recovery: refund each party their own stake only. Owner cannot divert funds.
    /// @param justificationHash Hash of the justification document (e.g. IPFS doc or statement) for audit.
    function recoverStuckAgreement(uint256 id, bytes32 justificationHash) external onlyOwner {
        Agreement storage a = agreements[id];
        require(a.partyA != address(0), "No agreement");
        require(a.status == 1, "Not active");
        require(block.timestamp >= a.deadline + RECOVERY_DELAY, "Recovery delay not passed");

        a.status = 3; // Recovered
        require(usdc.transfer(a.partyA, a.amountA), "Transfer A failed");
        if (a.amountB > 0) require(usdc.transfer(a.partyB, a.amountB), "Transfer B failed");
        emit AgreementRecovered(id, justificationHash);
    }

    function setOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        address old = owner;
        owner = newOwner;
        emit OwnerChanged(old, newOwner);
    }

    function setFee(address _feeRecipient, uint256 _feeBps) external onlyOwner {
        require(_feeBps <= BPS_MAX, "Fee too high");
        feeRecipient = _feeRecipient;
        feeBps = _feeBps;
        emit FeeUpdated(_feeRecipient, _feeBps);
    }

    function _resolve(uint256 id, Outcome outcome) internal override {
        Agreement storage a = agreements[id];
        a.status = 2;
        address recipient;
        uint256 total;
        if (outcome == Outcome.Done) {
            total = a.amountA + a.amountB;
            recipient = a.partyB;
        } else if (outcome == Outcome.Cancel) {
            require(usdc.transfer(a.partyA, a.amountA), "Transfer A failed");
            if (a.amountB > 0) require(usdc.transfer(a.partyB, a.amountB), "Transfer B failed");
            emit AgreementResolved(id, outcome);
            return;
        } else {
            require(outcome == Outcome.RefundA && a.mode == Mode.BothDeposit, "Invalid");
            total = a.amountA + a.amountB;
            recipient = a.partyA;
        }
        uint256 fee = (feeRecipient != address(0) && feeBps > 0) ? (total * feeBps) / BPS_MAX : 0;
        uint256 net = total - fee;
        require(usdc.transfer(recipient, net), "Transfer failed");
        if (fee > 0) require(usdc.transfer(feeRecipient, fee), "Fee transfer failed");
        emit AgreementResolved(id, outcome);
    }
}
