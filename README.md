# Proof of Will (POW)

**Programmable capital commitments.** Lock USDC to a goal. Succeed → refund. Fail → penalty to receiver. Onchain on Arc Testnet.

## MVP status

| Layer | Status |
|-------|--------|
| **Frontend** | Next.js, Create form, Dashboard (Active / Pending / Resolved), Rainbow Kit + Arc Testnet |
| **Contracts** | `CommitmentVault.sol` + `CommitmentFactory.sol` (create, resolve, USDC lock/refund/penalty) |
| **Wallet** | Rainbow Kit + wagmi v2 + viem (injected wallets only, no WalletConnect), Arc Testnet |
| **Backend** | None (onchain-only) |

## Quick start

1. **Install and run**
   ```bash
   pnpm install
   cp .env.example .env
   pnpm dev
   ```

2. **Deploy contracts (once)**  
   With [Foundry](https://book.getfoundry.sh):
   ```bash
   forge install foundry-rs/forge-std
   export PRIVATE_KEY=0x...  # ⚠️ Never commit or share your private key!
   forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast -vvv
   ```
   The script will output both `CommitmentVault` and `CommitmentFactory` addresses. Copy the Factory address to `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` in `.env` (or use vault address for backward compatibility).

3. **Get testnet USDC**  
   [Circle Faucet](https://faucet.circle.com) → select **Arc Testnet** and request USDC.

## Env vars

- `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` — Deployed `CommitmentFactory` on Arc Testnet (preferred). App uses Factory if set, otherwise falls back to vault.
- `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS` — Deployed `CommitmentVault` on Arc Testnet (fallback for backward compatibility). Required if Factory not set.

## Flow

1. **Create** — User sets amount, deadline, optional verifier, penalty receiver. Approves USDC, then creates commitment (two txs).
2. **Resolve** — After deadline, creator or verifier calls resolve(success). Success → refund to creator; fail → USDC to penalty receiver.
3. **Dashboard** — Lists commitments from chain, filter by All / Active / Pending / Resolved.

## Arc Testnet

- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: https://testnet.arcscan.app
- USDC (ERC-20): `0x3600000000000000000000000000000000000000` (6 decimals)

## Contracts

- `contracts/CommitmentVault.sol` — core contract: receive USDC, store commitments, resolve and payout.
- `contracts/CommitmentFactory.sol` — factory contract: manages commitment creation through the vault, provides centralized interface for future extensibility.

## What it does

**Proof of Will** lets you lock USDC onchain tied to a commitment/goal:

- **Create a commitment:** Set amount, deadline, optional verifier, and penalty receiver. Lock USDC into the vault.
- **Track progress:** Dashboard shows all commitments (active, pending resolution, resolved).
- **Resolve:** After deadline, creator or verifier calls resolve(success/fail). Success → refund to creator. Fail → USDC sent to penalty receiver.

**Use cases:** Freelancer escrows, founder milestones, DAO accountability, personal finance discipline.

## Status

✅ **MVP complete** — Frontend, contracts, and wallet integration working on Arc Testnet.  
⚠️ **Testnet only** — Not deployed to mainnet. Use testnet USDC from Circle Faucet.
