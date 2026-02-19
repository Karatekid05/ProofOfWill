# DualAgree

**Money only moves when both agree.** Two-party agreements (freelance, bets, escrow): one deposits or both deposit; the other party must accept; funds release only when both submit the same resolution. Onchain on Arc Testnet.

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
   export PRIVATE_KEY=0x...   # ⚠️ Never commit or share your private key!
   export OWNER=0x...         # Optional: deploy DualConsensusVaultV2 with this address for emergency recovery
   forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast -vvv
   ```
   The script outputs `CommitmentVault`, `CommitmentFactory`, and `DualConsensusVault`; if `OWNER` is set, also `DualConsensusVaultV2`. Set in `.env.local`:
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` (or `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS`)
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — use the V2 address if you deployed it (recommended for recovery).

3. **Get testnet USDC**  
   [Circle Faucet](https://faucet.circle.com) → select **Arc Testnet** and request USDC.

## Env vars

- `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` — Deployed `CommitmentFactory` (preferred for commitments).
- `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS` — Deployed `CommitmentVault` (fallback).
- `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — Deployed `DualConsensusVault` or `DualConsensusVaultV2` (two-party agreements; V2 adds emergency recovery).

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
- `contracts/DualConsensusVaultV2.sol` — same as above plus **emergency recovery** (deadline + 30 days; owner refunds each party their stake only; cannot divert funds; `recoverStuckAgreement(id, justificationHash)` emits the hash for audit) and **protocol fee** (`setFee(feeRecipient, feeBps)`; fee on release only).
- `contracts/CommitmentVault.sol` — legacy: lock USDC, creator or verifier resolves (success → refund, fail → penalty).
- `contracts/CommitmentFactory.sol` — factory for CommitmentVault.

**Title/description:** Agreements support an optional on-chain commitment via `createAgreementWithMeta(..., metaHash)`: the hash (e.g. of title + description or an IPFS doc) is stored for audit; the app can show title/description from its own storage or from the document the hash points to.

**Use cases:** Freelancer escrows, founder milestones, DAO accountability, personal finance discipline. **Sustainability:** Protocol fee is implemented in V2 (owner sets `feeRecipient` and `feeBps`; fee on release only). **Disputes:** If client and freelancer disagree (e.g. “work done” vs “not done”), the contract does not decide who is right—both must submit the same outcome. Recovery is only for *stuck* cases (e.g. one party lost their wallet). Timeouts and arbitration for deadlocks are in the roadmap; legal aspects are for your counsel.

## Deploy to production (Vercel)

Recommended for hosting the frontend:

1. Push your code to GitHub (if not already).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import your repo (e.g. ProofOfWill or DualAgree).
3. **Environment Variables** (in Vercel project settings):
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` — deployed Factory (or `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS`).
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` — deployed DualConsensusVault or V2 (for two-party agreements).
4. Deploy. Every push to `main` will trigger a new deployment.

No server to manage; the app is static + client-side wallet/chain interaction.

**Status:** Two-party agreements (create → share link → accept → both resolve), optional title/description hash, legacy commitments, dashboard. V2: emergency recovery (deadline + 30 days, with justification hash for audit) and protocol fee. Arc Testnet only; see [ROADMAP.md](ROADMAP.md) for disputes/timeouts.
