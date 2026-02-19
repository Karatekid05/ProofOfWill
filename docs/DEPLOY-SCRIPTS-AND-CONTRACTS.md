# Deploy — Scripts and Contracts (DualAgree)

## Contratos que são deployados

| Contrato | Ficheiro | O que faz |
|----------|----------|-----------|
| **CommitmentVault** | `contracts/CommitmentVault.sol` | Legacy: uma parte bloqueia USDC; creator ou verifier resolvem (sucesso → reembolso, falha → penalty). |
| **CommitmentFactory** | `contracts/CommitmentFactory.sol` | Wrapper do vault: create/resolve via factory. |
| **DualConsensusVault** | `contracts/DualConsensusVault.sol` | Acordos a 2: create → party B aceita (ou aceita e bloqueia) → ambos submetem resolução; dinheiro só sai quando coincidem. |

**Nenhum contrato falta.** O único script de deploy usa os três.

## Script de deploy

- **Ficheiro:** `scripts/Deploy.s.sol`
- **Comando (deploy real na Arc Testnet):**
  ```bash
  export PRIVATE_KEY=0x...   # ⚠️ Nunca commitar
  forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast -vvv
  ```
- **Ordem de deploy:** 1) CommitmentVault, 2) CommitmentFactory (com endereço do vault), 3) DualConsensusVault.
- **RPC:** `https://rpc.testnet.arc.network` (Arc Testnet).
- **USDC:** O script usa o endereço de USDC da Arc Testnet (`0x3600...0000`), já definido no script.

## O que precisas de fazer

1. **Correr o script** no teu ambiente (com `PRIVATE_KEY` e rede acessível).
2. **Copiar os 3 endereços** do output para `.env.local`:
   - `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS`
   - `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS`
   - `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS`
3. **Redeploy do site** na Vercel (ou `pnpm build && pnpm start`) depois de atualizar as env vars.

Não há scripts em falta; só falta executar o deploy com uma wallet com USDC/gas na Arc Testnet.
