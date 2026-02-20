#!/usr/bin/env node
/**
 * After running: PRIVATE_KEY=0x... OWNER=0x... forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast
 * run: node scripts/update-env-from-deploy.mjs
 * to write the deployed addresses into .env.local
 */
import { readFileSync, writeFileSync, existsSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const broadcastPath = join(root, "broadcast/Deploy.s.sol/5042002/run-latest.json")
const envPath = join(root, ".env.local")

if (!existsSync(broadcastPath)) {
  console.error("No broadcast file found. Run the deploy first:")
  console.error("  PRIVATE_KEY=0x... OWNER=0x... forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast")
  process.exit(1)
}

const data = JSON.parse(readFileSync(broadcastPath, "utf8"))

// Use returns from script (same order as Deploy.s.sol)
const vault = data.returns?.vault?.value ?? data.transactions?.[0]?.contractAddress
const factory = data.returns?.factory?.value ?? data.transactions?.[1]?.contractAddress
const dualVault = data.returns?.dualVault?.value ?? data.transactions?.[2]?.contractAddress
const dualVaultV2 = data.returns?.dualVaultV2?.value ?? data.transactions?.[3]?.contractAddress

if (!vault || !factory || !dualVault) {
  console.error("Could not read deployed addresses from broadcast file.")
  process.exit(1)
}

const zero = "0x0000000000000000000000000000000000000000"
const dualAddress = dualVaultV2 && dualVaultV2.toLowerCase() !== zero.toLowerCase()
  ? dualVaultV2
  : dualVault

const lines = [
  "# Arc Testnet — set after deploy",
  `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS=${vault}`,
  `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS=${factory}`,
  `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS=${dualAddress}`,
  "",
]

writeFileSync(envPath, lines.join("\n"))
console.log("Updated .env.local with:")
console.log("  NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS=" + vault)
console.log("  NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS=" + factory)
console.log("  NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS=" + dualAddress + (dualAddress === dualVaultV2 ? " (V2)" : " (V1)"))
