// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/CommitmentVault.sol";

// Arc Testnet USDC (ERC-20): https://docs.arc.network/arc/references/contract-addresses
address constant ARC_USDC = 0x3600000000000000000000000000000000000000;

contract DeployScript is Script {
    function run() external returns (CommitmentVault vault) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        vault = new CommitmentVault(ARC_USDC);
        console.log("CommitmentVault deployed at", address(vault));
        vm.stopBroadcast();
    }
}
