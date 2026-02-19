// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IERC20.sol";

contract DualConsensusVault {
    IERC20 public usdc;
    uint256 public nextId;

    enum Mode { OneDeposit, BothDeposit }
    enum Outcome { None, Done, Cancel, RefundA }

    struct Agreement {
        address partyA;
        address partyB;
        uint256 amountA;
        uint256 amountB;
        uint256 deadline;
        Mode mode;
        uint8 status;
        Outcome resolutionA;
        Outcome resolutionB;
    }

    mapping(uint256 => Agreement) public agreements;
    /// @dev Optional: hash of title/description or IPFS doc for audit (0 = not set).
    mapping(uint256 => bytes32) public agreementMetaHash;

    event AgreementCreated(uint256 indexed id, address partyA, address partyB, uint256 amountA, uint256 amountB, uint256 deadline, Mode mode, bytes32 metaHash);
    event AgreementAccepted(uint256 indexed id);
    event ResolutionSubmitted(uint256 indexed id, address party, Outcome outcome);
    event AgreementResolved(uint256 indexed id, Outcome outcome);

    constructor(address _usdc) {
        usdc = IERC20(_usdc);
    }

    function createAgreement(address partyB, uint256 amountA, uint256 amountB, uint256 deadline, Mode mode) external {
        require(partyB != address(0) && partyB != msg.sender, "Invalid partyB");
        require(deadline > block.timestamp, "Invalid deadline");
        require(amountA > 0, "Amount A must be > 0");
        if (mode == Mode.OneDeposit) require(amountB == 0, "OneDeposit amountB must be 0");
        else require(amountB > 0, "BothDeposit amountB must be > 0");
        require(usdc.transferFrom(msg.sender, address(this), amountA), "USDC transfer failed");

        agreements[nextId] = Agreement({
            partyA: msg.sender,
            partyB: partyB,
            amountA: amountA,
            amountB: amountB,
            deadline: deadline,
            mode: mode,
            status: 0,
            resolutionA: Outcome.None,
            resolutionB: Outcome.None
        });
        emit AgreementCreated(nextId, msg.sender, partyB, amountA, amountB, deadline, mode, bytes32(0));
        nextId++;
    }

    /// @notice Create agreement with an on-chain commitment to title/description (e.g. keccak256 of doc or IPFS hash).
    function createAgreementWithMeta(address partyB, uint256 amountA, uint256 amountB, uint256 deadline, Mode mode, bytes32 metaHash) external {
        require(partyB != address(0) && partyB != msg.sender, "Invalid partyB");
        require(deadline > block.timestamp, "Invalid deadline");
        require(amountA > 0, "Amount A must be > 0");
        if (mode == Mode.OneDeposit) require(amountB == 0, "OneDeposit amountB must be 0");
        else require(amountB > 0, "BothDeposit amountB must be > 0");
        require(usdc.transferFrom(msg.sender, address(this), amountA), "USDC transfer failed");

        agreements[nextId] = Agreement({
            partyA: msg.sender,
            partyB: partyB,
            amountA: amountA,
            amountB: amountB,
            deadline: deadline,
            mode: mode,
            status: 0,
            resolutionA: Outcome.None,
            resolutionB: Outcome.None
        });
        agreementMetaHash[nextId] = metaHash;
        emit AgreementCreated(nextId, msg.sender, partyB, amountA, amountB, deadline, mode, metaHash);
        nextId++;
    }

    function accept(uint256 id) external {
        Agreement storage a = agreements[id];
        require(a.partyA != address(0), "No agreement");
        require(a.status == 0, "Already accepted");
        require(msg.sender == a.partyB, "Not partyB");
        if (a.mode == Mode.OneDeposit) {
            a.status = 1;
            emit AgreementAccepted(id);
            return;
        }
        revert("Use acceptAndLock");
    }

    function acceptAndLock(uint256 id) external {
        Agreement storage a = agreements[id];
        require(a.partyA != address(0), "No agreement");
        require(a.status == 0, "Already accepted");
        require(a.mode == Mode.BothDeposit && a.amountB > 0, "Not BothDeposit");
        require(msg.sender == a.partyB, "Not partyB");
        require(usdc.transferFrom(msg.sender, address(this), a.amountB), "USDC transfer failed");
        a.status = 1;
        emit AgreementAccepted(id);
    }

    function submitResolution(uint256 id, Outcome outcome) external {
        Agreement storage a = agreements[id];
        require(a.status == 1, "Not active");
        require(msg.sender == a.partyA || msg.sender == a.partyB, "Not a party");
        if (a.mode == Mode.OneDeposit) require(outcome != Outcome.RefundA, "RefundA only BothDeposit");
        if (msg.sender == a.partyA) {
            a.resolutionA = outcome;
            emit ResolutionSubmitted(id, msg.sender, outcome);
        } else {
            a.resolutionB = outcome;
            emit ResolutionSubmitted(id, msg.sender, outcome);
        }
        if (a.resolutionA != Outcome.None && a.resolutionB != Outcome.None && a.resolutionA == a.resolutionB) {
            _resolve(id, a.resolutionA);
        }
    }

    function _resolve(uint256 id, Outcome outcome) internal virtual {
        Agreement storage a = agreements[id];
        a.status = 2;
        if (outcome == Outcome.Done) {
            require(usdc.transfer(a.partyB, a.amountA + a.amountB), "Transfer failed");
        } else if (outcome == Outcome.Cancel) {
            require(usdc.transfer(a.partyA, a.amountA), "Transfer A failed");
            if (a.amountB > 0) require(usdc.transfer(a.partyB, a.amountB), "Transfer B failed");
        } else {
            require(outcome == Outcome.RefundA && a.mode == Mode.BothDeposit, "Invalid");
            require(usdc.transfer(a.partyA, a.amountA + a.amountB), "Transfer failed");
        }
        emit AgreementResolved(id, outcome);
    }

    function getAgreement(uint256 id) external view returns (
        address partyA,
        address partyB,
        uint256 amountA,
        uint256 amountB,
        uint256 deadline,
        uint8 mode,
        uint8 status,
        uint8 resolutionA,
        uint8 resolutionB
    ) {
        Agreement storage a = agreements[id];
        require(a.partyA != address(0), "No agreement");
        return (
            a.partyA,
            a.partyB,
            a.amountA,
            a.amountB,
            a.deadline,
            uint8(a.mode),
            a.status,
            uint8(a.resolutionA),
            uint8(a.resolutionB)
        );
    }

    function agreementExists(uint256 id) external view returns (bool) {
        return agreements[id].partyA != address(0);
    }

    function totalAgreements() external view returns (uint256) {
        return nextId;
    }
}
