// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CommitmentVault.sol";
import "../contracts/CommitmentFactory.sol";
import "../contracts/DualConsensusVault.sol";
import "../contracts/DualConsensusVaultV2.sol";

// Arc Testnet USDC (ERC-20): https://docs.arc.network/arc/references/contract-addresses
address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

contract DeployScript is Script {
    function run() external returns (CommitmentVault vault, CommitmentFactory factory, DualConsensusVault dualVault, DualConsensusVaultV2 dualVaultV2) {
        vm.startBroadcast();

        vault = new CommitmentVault(ARC_USDC);
        console.log("CommitmentVault deployed at", address(vault));

        factory = new CommitmentFactory(address(vault), ARC_USDC);
        console.log("CommitmentFactory deployed at", address(factory));

        dualVault = new DualConsensusVault(ARC_USDC);
        console.log("DualConsensusVault deployed at", address(dualVault));

        // V2: same logic + emergency recovery (owner can refund stuck agreements after RECOVERY_DELAY)
        address owner = vm.envOr("OWNER", address(0));
        if (owner != address(0)) {
            dualVaultV2 = new DualConsensusVaultV2(ARC_USDC, owner);
            console.log("DualConsensusVaultV2 deployed at", address(dualVaultV2));
        }

        vm.stopBroadcast();
    }
}
