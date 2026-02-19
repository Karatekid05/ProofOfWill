# Security — DualAgree

## Summary

- **Contracts**: Logic is minimal and access-controlled; no owner key; funds only move to parties or penalty receiver. One fix applied: ERC20 `transfer` return value is now checked in `CommitmentVault`.
- **Frontend**: No secrets in client; only contract addresses (public) in env. Wallets and keys stay in the user's wallet.
- **Operational**: `.env` and `.env.local` are gitignored; no private keys in repo. Testnet only; no formal audit for production use.

---

## Smart contracts

### What’s in place

- **Access control**: Only the relevant roles can act (creator/verifier in CommitmentVault; partyA/partyB in DualConsensusVault). No admin or backdoor.
- **Reentrancy**: State is updated before external `transfer` calls (e.g. `status = 2` then `usdc.transfer`). USDC has no callbacks, but the order is safe.
- **Overflow**: Solidity 0.8+ checks; `amountA + amountB` is safe for realistic USDC amounts.
- **ERC20 return value**: `DualConsensusVault` already uses `require(usdc.transfer(...))`. `CommitmentVault` was updated to use `require(usdc.transfer(...))` so failed transfers revert.

### DualConsensusVaultV2 (optional deploy)

- **Owner**: V2 adds an `owner` (e.g. deployer or multisig) for emergency recovery and fee config only. The owner **only** refunds each party their own stake; they cannot send or divert funds to any other wallet.
- **Recovery**: `recoverStuckAgreement(id, justificationHash)` is `onlyOwner`, allowed only when the agreement is Active and `block.timestamp >= deadline + RECOVERY_DELAY` (30 days). It refunds `amountA` to partyA and `amountB` to partyB, then sets status to Recovered. The `justificationHash` (e.g. hash of an IPFS doc or statement) is emitted in `AgreementRecovered(id, justificationHash)` for audit and proof of reason.
- **No extra powers**: There is no function that sends funds to the owner or to any address other than the two parties (and the optional fee recipient).
- **Protocol fee**: Owner can set `feeRecipient` and `feeBps` via `setFee`. Fee is taken only on release (Done or Refund client), not on Cancel. Fee is capped at 100% (feeBps ≤ 10000).

### Design choices (not bugs)

- **No timeout**: If the two parties never submit the same outcome, funds stay locked. By design; the base vault has no admin. V2 adds a time-gated recovery as a counter-measure.
- **Deadline**: In DualConsensusVault the deadline is stored but resolution is allowed anytime after acceptance. So “resolve by deadline” is not enforced onchain; it’s a social/UX constraint.
- **CommitmentVault**: One resolution per commitment; only creator or verifier can resolve after the deadline.

### Not done (future work)

- No formal audit. Suitable for testnet; for mainnet or large value, an audit is recommended.
- No SafeERC20 wrapper (e.g. OpenZeppelin); current IERC20 + `require(transfer)` is enough for standard USDC.
- No pause or upgrade mechanism; contracts are immutable after deploy.

---

## Frontend and config

- **Secrets**: No API keys or private keys in the app. Wallet and signing stay in the user’s wallet (Rainbow Kit / wagmi).
- **Env**: Only `NEXT_PUBLIC_*` (contract addresses) are used; these are public. `.env`, `.env.local`, `.env.production` are in `.gitignore`.
- **Chain**: App targets Arc Testnet; contract addresses are for testnet. Using the same code with mainnet addresses would require a separate, audited deploy.

---

## Operational

- **Deploy keys**: Private keys used for deploy must not be committed or shared. Use env vars or a secure signer for scripts.
- **Vercel**: Set only `NEXT_PUBLIC_*` in project env; no secrets needed for the current app.

---

## If you find an issue

Report security-sensitive bugs privately (e.g. repo owner / maintainer contact). Do not open public issues for vulnerabilities before a fix or disclosure plan is in place.
