// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/DualConsensusVaultV2.sol";

address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

contract DeployV2OnlyScript is Script {
    function run() external returns (DualConsensusVaultV2 dualVaultV2) {
        address owner = vm.envOr("OWNER", address(0));
        require(owner != address(0), "Set OWNER env var (e.g. your address or multisig)");

        vm.startBroadcast();
        dualVaultV2 = new DualConsensusVaultV2(ARC_USDC, owner);
        console.log("DualConsensusVaultV2 deployed at", address(dualVaultV2));
        vm.stopBroadcast();
    }
}
