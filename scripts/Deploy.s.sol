// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CommitmentVault.sol";
import "../contracts/CommitmentFactory.sol";

// Arc Testnet USDC (ERC-20): https://docs.arc.network/arc/references/contract-addresses
address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

contract DeployScript is Script {
    function run() external returns (CommitmentVault vault, CommitmentFactory factory) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy vault first
        vault = new CommitmentVault(ARC_USDC);
        console.log("CommitmentVault deployed at", address(vault));
        
        // Deploy factory with vault reference
        factory = new CommitmentFactory(address(vault), ARC_USDC);
        console.log("CommitmentFactory deployed at", address(factory));
        
        vm.stopBroadcast();
    }
}
