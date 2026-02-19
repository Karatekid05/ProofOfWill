# DualAgree

**Money only moves when both agree.** Two-party agreements (freelance, bets, escrow): one deposits or both deposit; the other party must accept; funds release only when both submit the same resolution. Onchain on Arc Testnet.

## Status

| Layer | Status |
|-------|--------|
| **Frontend** | Next.js, Create agreement (one/both deposit), Dashboard (Agreements + Commitments), Awaiting your action, Share link `/agreements/[id]`, Rainbow Kit + Arc Testnet |
| **Contracts** | `DualConsensusVault.sol` (two-party accept + dual resolution), `CommitmentVault.sol` + `CommitmentFactory.sol` (legacy single verifier) |
| **Wallet** | Rainbow Kit + wagmi v2 + viem (injected wallets only), Arc Testnet |
| **Backend** | None (onchain-only) |

## Quick start

1. **Install and run**
   ```bash
   pnpm install
   cp .env.example .env.local
   pnpm dev
   ```

2. **Deploy contracts (once)**  
   With [Foundry](https://book.getfoundry.sh):
   ```bash
   forge install foundry-rs/forge-std
   export PRIVATE_KEY=0x...  # ⚠️ Never commit or share your private key!
   forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast -vvv
   ```
   The script outputs `CommitmentVault`, `CommitmentFactory`, and `DualConsensusVault` addresses. Set in `.env.local`:
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` (or `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS`)
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — required for two-party agreements.

3. **Get testnet USDC**  
   [Circle Faucet](https://faucet.circle.com) → select **Arc Testnet** and request USDC.

## Env vars

- `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` — Deployed `CommitmentFactory` (preferred for commitments).
- `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS` — Deployed `CommitmentVault` (fallback).
- `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — Deployed `DualConsensusVault` (two-party agreements; set for production).

## Flow

**Two-party agreements (DualConsensusVault)**  
1. **Create** — Party A sets counter-party (Party B), amount(s), deadline, mode (one deposit or both deposit). Locks USDC.  
2. **Accept** — Party B opens the app (or the share link `/agreements/[id]`), connects their wallet, and accepts (or accepts and locks their stake for both-deposit).  
3. **Resolve** — Both parties submit the same outcome (Done / Cancel / Refund client). Funds move only when both match.  

**Legacy commitments (CommitmentVault/Factory)**  
1. **Create** — User sets amount, deadline, verifier, penalty receiver; locks USDC.  
2. **Resolve** — After deadline, creator or verifier calls resolve(success). Success → refund; fail → USDC to penalty receiver.  

**Dashboard** — Agreements (with “Awaiting your action”) and Commitments (All / Active / Pending / Resolved).

## Arc Testnet

- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: https://testnet.arcscan.app
- USDC (ERC-20): `0x3600000000000000000000000000000000000000` (6 decimals)

## Contracts

- `contracts/DualConsensusVault.sol` — two-party agreements: create (partyA locks), accept / acceptAndLock (partyB), submitResolution (both); release only when both outcomes match. Modes: OneDeposit, BothDeposit.
- `contracts/CommitmentVault.sol` — legacy: lock USDC, creator or verifier resolves (success → refund, fail → penalty).
- `contracts/CommitmentFactory.sol` — factory for CommitmentVault.

## What it does

**DualAgree** lets you create two-party agreements onchain:

- **Create a commitment:** Set amount, deadline, optional verifier, and penalty receiver. Lock USDC into the vault.
- **Track progress:** Dashboard shows all commitments (active, pending resolution, resolved).
- **Resolve:** After deadline, creator or verifier calls resolve(success/fail). Success → refund to creator. Fail → USDC sent to penalty receiver.

**Use cases:** Freelancer escrows, founder milestones, DAO accountability, personal finance discipline.

## Deploy to production (Vercel)

Recommended for hosting the frontend:

1. Push your code to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo (e.g. ProofOfWill or DualAgree).
3. **Environment Variables** (in Vercel project settings):
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` — deployed Factory (or `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS`).
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — deployed DualConsensusVault (for two-party agreements).
4. Deploy. Every push to `main` will trigger a new deployment.

No server to manage; the app is static + client-side wallet/chain interaction.

## Status

✅ **Production-ready** — Two-party agreements (create → share link → other party accepts → both resolve), legacy commitments, dashboard with “Awaiting your action”, shareable agreement links.  
⚠️ **Testnet only** — Arc Testnet. Use testnet USDC from Circle Faucet. Build may warn on Google Fonts in some environments; app runs with fallback fonts.
