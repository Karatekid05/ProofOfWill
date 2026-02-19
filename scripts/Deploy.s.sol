// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CommitmentVault.sol";
import "../contracts/CommitmentFactory.sol";
import "../contracts/DualConsensusVault.sol";

// Arc Testnet USDC (ERC-20): https://docs.arc.network/arc/references/contract-addresses
address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

contract DeployScript is Script {
    function run() external returns (CommitmentVault vault, CommitmentFactory factory, DualConsensusVault dualVault) {
        // Use --private-key flag or set PRIVATE_KEY env var (without 0x prefix)
        vm.startBroadcast();

        vault = new CommitmentVault(ARC_USDC);
        console.log("CommitmentVault deployed at", address(vault));

        factory = new CommitmentFactory(address(vault), ARC_USDC);
        console.log("CommitmentFactory deployed at", address(factory));

        dualVault = new DualConsensusVault(ARC_USDC);
        console.log("DualConsensusVault deployed at", address(dualVault));

        vm.stopBroadcast();
    }
}
